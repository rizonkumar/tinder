import dns from "node:dns/promises";
import net from "node:net";
import AppError from "../utils/appError.js";

const FETCH_TIMEOUT_MS = 5000;
const MAX_BYTES = 512 * 1024;
const CACHE_TTL_MS = 30 * 60 * 1000;

const cache = new Map();

function isPrivateIp(ip) {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split(".").map(Number);
    if (a === 0 || a === 10 || a === 127) return true;
    if (a === 169 && b === 254) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    return false;
  }
  if (net.isIPv6(ip)) {
    const lower = ip.toLowerCase();
    if (lower === "::1" || lower === "::") return true;
    if (lower.startsWith("::ffff:")) return isPrivateIp(lower.replace("::ffff:", ""));
    return lower.startsWith("fe80") || lower.startsWith("fc") || lower.startsWith("fd");
  }
  return false;
}

async function assertPublicHost(hostname) {
  const lower = hostname.toLowerCase();
  if (
    lower === "localhost" ||
    lower.endsWith(".local") ||
    lower.endsWith(".internal")
  ) {
    throw new AppError("This URL is not allowed", 400);
  }
  if (net.isIP(hostname) && isPrivateIp(hostname)) {
    throw new AppError("This URL is not allowed", 400);
  }

  let addresses = [];
  try {
    addresses = await dns.lookup(hostname, { all: true });
  } catch {
    throw new AppError("Could not resolve the URL host", 400);
  }
  if (addresses.some((entry) => isPrivateIp(entry.address))) {
    throw new AppError("This URL is not allowed", 400);
  }
}

function decodeEntities(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&#x27;/gi, "'");
}

function extractMeta(html, property) {
  const patterns = [
    new RegExp(
      `<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']*)["']`,
      "i"
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']*)["'][^>]+(?:property|name)=["']${property}["']`,
      "i"
    ),
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return decodeEntities(match[1].trim());
  }
  return null;
}

function extractTitle(html) {
  const match = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  return match ? decodeEntities(match[1].trim()) : null;
}

class LinkPreviewService {
  async getLinkPreview(url) {
    const cached = cache.get(url);
    if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
      return cached.data;
    }

    const parsed = new URL(url);
    await assertPublicHost(parsed.hostname);

    const data = await this._fetchPreview(url, parsed);
    cache.set(url, { at: Date.now(), data });
    return data;
  }

  async _fetchPreview(url, parsed) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        redirect: "follow",
        headers: { "user-agent": "Mozilla/5.0 (compatible; SwipeBot/1.0)" },
      });
      const contentType = response.headers.get("content-type") || "";
      if (!response.ok || !contentType.includes("text/html")) {
        return this._fallback(parsed);
      }
      const html = await this._readCapped(response);
      return {
        url,
        title: extractMeta(html, "og:title") || extractTitle(html) || parsed.hostname,
        description: extractMeta(html, "og:description") || "",
        image: this._absoluteUrl(extractMeta(html, "og:image"), parsed),
        siteName:
          extractMeta(html, "og:site_name") ||
          parsed.hostname.replace(/^www\./, ""),
      };
    } catch {
      return this._fallback(parsed);
    } finally {
      clearTimeout(timeout);
    }
  }

  async _readCapped(response) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let received = 0;
    let html = "";
    let chunk = await reader.read();
    while (!chunk.done) {
      received += chunk.value.length;
      html += decoder.decode(chunk.value, { stream: true });
      if (received >= MAX_BYTES) {
        await reader.cancel();
        break;
      }
      chunk = await reader.read();
    }
    return html;
  }

  _absoluteUrl(maybeUrl, parsed) {
    if (!maybeUrl) return "";
    try {
      return new URL(maybeUrl, parsed.origin).href;
    } catch {
      return "";
    }
  }

  _fallback(parsed) {
    const siteName = parsed.hostname.replace(/^www\./, "");
    return { url: parsed.href, title: siteName, description: "", image: "", siteName };
  }
}

export default new LinkPreviewService();

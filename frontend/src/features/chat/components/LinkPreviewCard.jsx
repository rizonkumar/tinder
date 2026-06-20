import { useState } from "react";
import { Globe, ExternalLink } from "lucide-react";

function getHostname(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default function LinkPreviewCard({ url, isSentByMe }) {
  const [iconFailed, setIconFailed] = useState(false);
  const hostname = getHostname(url);
  const faviconSrc = `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(event) => event.stopPropagation()}
      className={`mt-2 flex items-center gap-2.5 rounded-md border px-3 py-2 transition-colors ${
        isSentByMe
          ? "border-primary-foreground/20 bg-primary-foreground/10 hover:bg-primary-foreground/15"
          : "border-border bg-background hover:bg-surface-hover"
      }`}
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md ${
          isSentByMe ? "bg-primary-foreground/15" : "bg-background-secondary"
        }`}
      >
        {iconFailed ? (
          <Globe size={15} className="opacity-70" />
        ) : (
          <img
            src={faviconSrc}
            alt=""
            width={18}
            height={18}
            loading="lazy"
            onError={() => setIconFailed(true)}
          />
        )}
      </span>
      <span className="min-w-0 flex-grow">
        <span className="block text-[11px] font-bold tracking-tight truncate font-outfit">
          {hostname}
        </span>
        <span
          className={`block text-[10px] truncate ${
            isSentByMe ? "text-primary-foreground/70" : "text-foreground-muted"
          }`}
        >
          {url}
        </span>
      </span>
      <ExternalLink size={13} className="shrink-0 opacity-60" />
    </a>
  );
}

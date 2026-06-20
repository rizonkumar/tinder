import { useState } from "react";
import { Globe, ExternalLink } from "lucide-react";
import { useLinkPreview } from "../hooks/useLinkPreview";
import { metaTextClass } from "../utils/chatBubbleStyles";

function getHostname(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default function LinkPreviewCard({ url, isSentByMe }) {
  const { data, isLoading } = useLinkPreview(url);
  const [iconFailed, setIconFailed] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  const hostname = getHostname(url);
  const containerClass = `mt-2 block overflow-hidden rounded-md border transition-colors ${
    isSentByMe
      ? "border-blue-1000/20 bg-blue-1000/5 hover:bg-blue-1000/10"
      : "border-border bg-background hover:bg-surface-hover"
  }`;
  const mutedClass = metaTextClass(isSentByMe);
  const titleClass = isSentByMe ? "text-blue-1000" : "text-foreground";

  if (isLoading) {
    return (
      <div className={`${containerClass} animate-pulse`}>
        <div className="flex items-center gap-2.5 px-3 py-2">
          <span className="h-8 w-8 shrink-0 rounded-md bg-surface-active" />
          <span className="flex-grow space-y-1.5">
            <span className="block h-2.5 w-1/2 rounded bg-surface-active" />
            <span className="block h-2 w-3/4 rounded bg-surface-active" />
          </span>
        </div>
      </div>
    );
  }

  const hasImage = data?.image && !imageFailed;
  const title = data?.title || hostname;
  const description = data?.description;
  const siteName = data?.siteName || hostname;
  const faviconSrc = `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(event) => event.stopPropagation()}
      className={containerClass}
    >
      {hasImage && (
        <img
          src={data.image}
          alt=""
          className="h-32 w-full object-cover"
          loading="lazy"
          onError={() => setImageFailed(true)}
        />
      )}
      <div className="flex items-center gap-2.5 px-3 py-2">
        {!hasImage && (
          <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md bg-background-secondary">
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
        )}
        <span className="min-w-0 flex-grow">
          <span className={`block text-[11px] font-bold tracking-tight truncate font-outfit ${titleClass}`}>
            {title}
          </span>
          {description && (
            <span className={`block text-[10px] leading-snug line-clamp-2 ${mutedClass}`}>
              {description}
            </span>
          )}
          <span className={`mt-0.5 flex items-center gap-1 text-[10px] truncate ${mutedClass}`}>
            <span className="truncate">{siteName}</span>
            <ExternalLink size={11} className="shrink-0 opacity-70" />
          </span>
        </span>
      </div>
    </a>
  );
}

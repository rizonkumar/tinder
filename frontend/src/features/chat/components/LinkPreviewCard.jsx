import { useState } from "react";
import { Globe, ExternalLink } from "lucide-react";
import { useLinkPreview } from "../hooks/useLinkPreview";
import { Skeleton } from "../../../components/ui/Skeleton";

function getHostname(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

const CONTAINER =
  "mt-2 block overflow-hidden rounded-lg border border-border bg-surface transition-colors hover:border-border-strong focus-ring";

export default function LinkPreviewCard({ url }) {
  const { data, isLoading } = useLinkPreview(url);
  const [iconFailed, setIconFailed] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const hostname = getHostname(url);

  if (isLoading) {
    return (
      <div className={CONTAINER} aria-hidden="true">
        <div className="flex items-center gap-2.5 px-3 py-2.5">
          <Skeleton className="size-8 shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-2.5 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  const hasImage = data?.image && !imageFailed;
  const title = data?.title || hostname;
  const siteName = data?.siteName || hostname;

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" onClick={(event) => event.stopPropagation()} className={CONTAINER}>
      {hasImage && (
        <img src={data.image} alt="" loading="lazy" className="h-32 w-full object-cover" onError={() => setImageFailed(true)} />
      )}
      <div className="flex items-center gap-2.5 px-3 py-2.5">
        {!hasImage && (
          <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-md bg-background-secondary text-foreground-muted">
            {iconFailed ? (
              <Globe size={15} aria-hidden="true" />
            ) : (
              <img
                src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=64`}
                alt=""
                width={18}
                height={18}
                loading="lazy"
                onError={() => setIconFailed(true)}
              />
            )}
          </span>
        )}
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[0.8125rem] font-medium text-foreground">{title}</span>
          {data?.description && (
            <span className="line-clamp-2 text-xs leading-4 text-foreground-secondary">{data.description}</span>
          )}
          <span className="mt-0.5 flex items-center gap-1 truncate text-xs text-foreground-muted">
            <span className="truncate">{siteName}</span>
            <ExternalLink size={11} className="shrink-0" aria-hidden="true" />
          </span>
        </span>
      </div>
    </a>
  );
}

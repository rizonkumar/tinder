import { Lock } from "lucide-react";
import { cn } from "../utils/cn";
import { Badge } from "./ui/Badge";

export function ProfileCard({
  profile,
  badge,
  locked = false,
  lockedLabel = "Hidden",
  onClick,
  footer,
  className,
}) {
  const Wrapper = onClick ? "button" : "div";
  return (
    <article
      className={cn(
        "flex flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-card",
        onClick && "transition-colors hover:border-border-strong",
        className
      )}
    >
      <Wrapper
        type={onClick ? "button" : undefined}
        onClick={onClick}
        className={cn("block w-full text-left focus-ring", onClick && "cursor-pointer")}
        aria-label={onClick ? `Open ${profile.name}'s profile` : undefined}
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-background-secondary">
          <img
            src={profile.image || "/avatar.png"}
            alt={locked ? "" : profile.name}
            className={cn("size-full object-cover", locked && "scale-105 blur-xl")}
          />
          {locked && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-overlay text-white">
              <span className="flex size-10 items-center justify-center rounded-full bg-white/15">
                <Lock size={16} aria-hidden="true" />
              </span>
              <span className="text-xs font-medium">{lockedLabel}</span>
            </div>
          )}
          {badge && !locked && <div className="absolute left-3 top-3">{badge}</div>}
        </div>
        <div className="space-y-2 p-3.5">
          <div className="flex items-baseline justify-between gap-2">
            <p className="heading-16 truncate text-foreground">
              {locked ? "Someone" : profile.name}
              {!locked && profile.age && (
                <span className="ml-1 font-normal text-foreground-secondary">{profile.age}</span>
              )}
            </p>
          </div>
          {!locked && (
            <>
              <p className="copy-13 line-clamp-2 min-h-10 text-foreground-secondary">
                {profile.bio || "No bio yet."}
              </p>
              {profile.interests?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {profile.interests.slice(0, 3).map((interest) => (
                    <Badge key={interest}>{interest}</Badge>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </Wrapper>
      {footer && <div className="border-t border-border px-3.5 py-3">{footer}</div>}
    </article>
  );
}

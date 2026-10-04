import { Heart, X, Star, RotateCcw, ShieldCheck, CalendarDays } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Avatar } from "../../components/ui/Avatar";
import { PREVIEW_PROFILE, PREVIEW_MATCH } from "./landingContent";

function ActionDot({ icon: Icon, className, size = "size-11" }) {
  return (
    <span className={`flex ${size} items-center justify-center rounded-full border border-border bg-surface shadow-card ${className}`}>
      <Icon size={size === "size-11" ? 18 : 16} aria-hidden="true" />
    </span>
  );
}

export function ProductPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[22rem] select-none sm:max-w-[30rem] sm:px-16" aria-hidden="true">
      <Card className="overflow-hidden">
        <div className="relative aspect-[4/5]">
          <img src={PREVIEW_PROFILE.image} alt="" className="size-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 bg-surface px-4 py-3">
            <div className="flex items-baseline justify-between">
              <p className="heading-16 text-foreground">
                {PREVIEW_PROFILE.name}, <span className="font-normal text-foreground-secondary">{PREVIEW_PROFILE.age}</span>
              </p>
              <Badge tone="success" icon={ShieldCheck}>Verified</Badge>
            </div>
            <p className="copy-13 mt-1 line-clamp-2 text-foreground-secondary">{PREVIEW_PROFILE.bio}</p>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {PREVIEW_PROFILE.interests.map((interest) => (
                <Badge key={interest}>{interest}</Badge>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-3 border-t border-border bg-background-secondary py-3">
          <ActionDot icon={X} className="text-danger" />
          <ActionDot icon={RotateCcw} className="text-foreground-secondary" size="size-9" />
          <ActionDot icon={Star} className="text-blue-700" size="size-9" />
          <ActionDot icon={Heart} className="text-success" />
        </div>
      </Card>

      <Card className="absolute left-0 top-14 hidden w-56 p-3 sm:block">
        <div className="flex items-center gap-2.5">
          <Avatar src={PREVIEW_MATCH.image} size="sm" online />
          <div className="min-w-0">
            <p className="label-13 truncate text-foreground">{PREVIEW_MATCH.name}</p>
            <p className="copy-13 truncate text-foreground-secondary">Coffee on Saturday works?</p>
          </div>
        </div>
      </Card>

      <Card className="absolute right-0 top-[13.5rem] hidden w-56 p-3 sm:block">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-md bg-background-secondary text-foreground-secondary">
            <CalendarDays size={15} />
          </span>
          <div>
            <p className="label-13 text-foreground">Date confirmed</p>
            <p className="copy-13 text-foreground-secondary">Sat, 7:30 pm · Blue Tokai</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

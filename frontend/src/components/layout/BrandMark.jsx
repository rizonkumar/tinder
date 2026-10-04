import { Link } from "react-router-dom";
import { Flame } from "lucide-react";
import { cn } from "../../utils/cn";
import { ROUTES } from "../../constants/navigation";

export function BrandMark({ to = ROUTES.landing, showWordmark = true, className }) {
  return (
    <Link to={to} className={cn("flex items-center gap-2.5 rounded-md focus-ring", className)} aria-label="Swipe home">
      <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <Flame size={17} strokeWidth={2.25} aria-hidden="true" />
      </span>
      {showWordmark && (
        <span className="text-[17px] font-semibold tracking-[-0.02em] text-foreground">Swipe</span>
      )}
    </Link>
  );
}

import { Link, useLocation } from "react-router-dom";
import { Crown } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { PRIMARY_NAV, ROUTES } from "../../constants/navigation";
import { cn } from "../../utils/cn";
import { BrandMark } from "./BrandMark";
import { ThemeToggle } from "./ThemeToggle";
import { UserMenu } from "./UserMenu";

export function Header() {
  const { authUser } = useAuthStore();
  const { pathname } = useLocation();
  const isGoldPage = pathname === ROUTES.gold;

  return (
    <header className="z-40 flex h-header shrink-0 items-center border-b border-border bg-surface px-4 sm:px-6">
      <div className="flex w-full items-center justify-between gap-4">
        <BrandMark to={ROUTES.swipe} />

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {PRIMARY_NAV.map(({ label, to, icon: Icon, match }) => {
            const active = match(pathname);
            return (
              <Link
                key={to}
                to={to}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors focus-ring",
                  active
                    ? "bg-surface-active text-foreground"
                    : "text-foreground-secondary hover:bg-surface-hover hover:text-foreground"
                )}
              >
                <Icon size={16} aria-hidden="true" />
                <span className="hidden lg:inline">{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5">
          <Link
            to={ROUTES.gold}
            aria-current={isGoldPage ? "page" : undefined}
            className={cn(
              "hidden h-9 items-center gap-1.5 rounded-md border px-3 text-sm font-medium transition-colors focus-ring sm:flex",
              isGoldPage || authUser?.isGold
                ? "border-gold-ring/40 bg-gold-surface text-gold-strong hover:bg-gold-surface/70"
                : "border-border text-foreground-secondary hover:bg-surface-hover hover:text-foreground"
            )}
          >
            <Crown size={15} aria-hidden="true" />
            {authUser?.isGold ? "Gold" : "Get Gold"}
          </Link>
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}

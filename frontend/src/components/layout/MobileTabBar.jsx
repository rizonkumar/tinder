import { Link, useLocation } from "react-router-dom";
import { MOBILE_TABS } from "../../constants/navigation";
import { cn } from "../../utils/cn";

export function MobileTabBar() {
  const { pathname } = useLocation();
  return (
    <nav
      aria-label="Primary"
      className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface md:hidden"
    >
      <ul className="grid h-tabbar grid-cols-5">
        {MOBILE_TABS.map(({ label, to, icon: Icon, match }) => {
          const active = match(pathname);
          return (
            <li key={to}>
              <Link
                to={to}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-full flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors focus-ring",
                  active ? "text-foreground" : "text-foreground-muted hover:text-foreground-secondary"
                )}
              >
                <span
                  className={cn(
                    "flex h-7 w-12 items-center justify-center rounded-full transition-colors",
                    active && "bg-surface-active"
                  )}
                >
                  <Icon size={20} strokeWidth={active ? 2.25 : 2} aria-hidden="true" />
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

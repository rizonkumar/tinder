import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, LogOut } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import useClickOutside from "../../hooks/useClickOutside";
import { ACCOUNT_MENU } from "../../constants/navigation";
import { Avatar } from "../ui/Avatar";
import { cn } from "../../utils/cn";

export function UserMenu() {
  const { authUser, logout } = useAuthStore();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useClickOutside(ref, () => setOpen(false));

  if (!authUser) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn(
          "flex h-9 items-center gap-2 rounded-md pl-1 pr-2 transition-colors hover:bg-surface-hover focus-ring",
          open && "bg-surface-hover"
        )}
      >
        <Avatar src={authUser.image} alt={authUser.name} size="sm" gold={authUser.isGold} />
        <span className="hidden max-w-[7rem] truncate text-sm font-medium text-foreground sm:inline">
          {authUser.name.split(" ")[0]}
        </span>
        <ChevronDown size={14} className="text-foreground-muted" aria-hidden="true" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 mt-2 w-60 origin-top-right overflow-hidden rounded-lg border border-border bg-surface shadow-popover"
          >
            <div className="border-b border-border px-3.5 py-3">
              <p className="truncate text-sm font-medium text-foreground">{authUser.name}</p>
              <p className="truncate text-xs text-foreground-muted">{authUser.email}</p>
            </div>
            <div className="p-1.5">
              {ACCOUNT_MENU.map(({ label, to, icon: Icon }) => (
                <Link
                  key={label}
                  to={to}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="flex h-9 items-center gap-2.5 rounded-md px-2.5 text-sm text-foreground transition-colors hover:bg-surface-hover focus-ring"
                >
                  <Icon size={16} className="text-foreground-secondary" aria-hidden="true" />
                  {label}
                </Link>
              ))}
            </div>
            <div className="border-t border-border p-1.5">
              <button
                type="button"
                role="menuitem"
                onClick={logout}
                className="flex h-9 w-full items-center gap-2.5 rounded-md px-2.5 text-sm text-danger transition-colors hover:bg-danger-surface focus-ring"
              >
                <LogOut size={16} aria-hidden="true" />
                Log out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

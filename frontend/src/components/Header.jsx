import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link, useLocation } from "react-router-dom";
import {
  Flame,
  User,
  LogOut,
  Menu,
  X,
  Heart,
  Settings,
  Bell,
  MessageCircle,
  Compass,
  ChevronDown,
  Crown,
  Sun,
  Moon,
  CalendarDays,
  PanelLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeStore } from "../store/useThemeStore";
import { useLayoutStore } from "../store/useLayoutStore";

const NAV_LINKS = [
  { icon: Crown, label: "Gold", to: "/gold", match: (p) => p === "/gold" },
  { icon: Compass, label: "Explore", to: "/explore", match: (p) => p === "/explore" },
  { icon: Heart, label: "Matches", to: "/matches", match: (p) => p === "/matches" },
  { icon: CalendarDays, label: "Dates", to: "/dates", match: (p) => p === "/dates" },
  { icon: MessageCircle, label: "Chat", to: "/chat", match: (p) => p.startsWith("/chat") },
];

export const Header = () => {
  const { authUser, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { toggleSidebar } = useLayoutStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = authUser
    ? [
        { icon: <User size={18} />, label: "Profile", to: "/profile" },
        { icon: <Crown size={18} className="text-amber-700" />, label: "Gold Hub", to: "/gold" },
        { icon: <Compass size={18} />, label: "Explore Vibes", to: "/explore" },
        { icon: <CalendarDays size={18} />, label: "My Dates", to: "/dates" },
        { icon: <Heart size={18} />, label: "Matches", to: "/matches" },
        { icon: <MessageCircle size={18} />, label: "Messages", to: "/chat" },
        { icon: <Settings size={18} />, label: "Settings", to: "/profile" },
      ]
    : [];

  return (
    <header className="relative z-40 flex h-16 w-full shrink-0 select-none items-center justify-between border-b border-border bg-background px-4 font-sans sm:px-6">
      <div className="flex items-center gap-2 sm:gap-3">
        {authUser && (
          <button
            onClick={toggleSidebar}
            className="rounded-md p-2 text-foreground-secondary transition-colors hover:bg-surface-hover hover:text-foreground focus-ring"
            aria-label="Toggle sidebar"
          >
            <PanelLeft size={20} />
          </button>
        )}
        <Link to="/" className="flex items-center gap-2">
          <div className="rounded-md bg-primary p-2">
            <Flame className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="hidden text-xl font-bold uppercase tracking-wide text-foreground sm:inline">
            Swipe
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        {authUser && (
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map(({ icon: Icon, label, to, match }) => {
              const active = match(location.pathname);
              return (
                <Link
                  key={to}
                  to={to}
                  title={label}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-accent/10 text-accent"
                      : "text-foreground-secondary hover:bg-surface-hover hover:text-foreground"
                  }`}
                >
                  <Icon size={18} />
                  <span className="hidden lg:inline">{label}</span>
                </Link>
              );
            })}
          </nav>
        )}

        {authUser && (
          <button
            className="relative hidden rounded-md p-2 text-foreground-secondary transition-colors hover:bg-surface-hover hover:text-foreground focus-ring md:inline-flex"
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-accent-foreground ring-2 ring-background">
              3
            </span>
          </button>
        )}

        <button
          onClick={toggleTheme}
          className="rounded-md p-2 text-foreground-secondary transition-colors hover:bg-surface-hover hover:text-foreground focus-ring"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun size={19} className="text-amber-500" />
          ) : (
            <Moon size={19} />
          )}
        </button>

        {authUser ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 rounded-md border border-border bg-background px-2.5 py-1.5 transition-colors hover:bg-surface-hover focus-ring"
            >
              <div className="relative flex items-center justify-center">
                <img
                  src={authUser.image || "/avatar.png"}
                  className={`h-7 w-7 rounded-full object-cover ${
                    authUser.isGold
                      ? "ring-2 ring-amber-500"
                      : "border border-border-strong"
                  }`}
                  alt="Profile"
                />
                <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full border border-background bg-green-700" />
              </div>
              <span className="hidden text-sm font-medium text-foreground sm:inline">
                {authUser.name.split(" ")[0]}
              </span>
              <ChevronDown size={14} className="text-foreground-secondary" />
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-52 rounded-md border border-border bg-background py-2 shadow-popover"
                >
                  {menuItems.map((item, index) => (
                    <Link
                      key={index}
                      to={item.to}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-hover hover:text-accent"
                      onClick={() => setDropdownOpen(false)}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  ))}
                  <hr className="my-1.5 border-border" />
                  <button
                    onClick={logout}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-800 transition-colors hover:bg-red-100"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/auth"
              className="text-sm font-medium text-foreground-secondary transition-colors hover:text-foreground"
            >
              Login
            </Link>
            <Link
              to="/auth"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              Sign Up
            </Link>
          </div>
        )}

        {authUser && (
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-md p-2 text-foreground-secondary transition-colors hover:bg-surface-hover hover:text-foreground focus-ring md:hidden"
            aria-label="Open menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        )}
      </div>

      <AnimatePresence>
        {mobileMenuOpen && authUser && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute left-0 top-16 z-40 w-full overflow-hidden border-b border-border bg-background shadow-popover md:hidden"
          >
            <div className="space-y-1 px-4 py-3">
              <div className="flex items-center gap-3 px-3 py-2">
                <img
                  src={authUser.image || "/avatar.png"}
                  className="h-10 w-10 rounded-full border border-border-strong object-cover"
                  alt="Profile"
                />
                <div>
                  <p className="font-semibold leading-none text-foreground">{authUser.name}</p>
                  <p className="mt-1 text-xs text-foreground-secondary">{authUser.email}</p>
                </div>
              </div>
              <hr className="my-2 border-border" />
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.to}
                  className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-hover hover:text-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
              <hr className="my-2 border-border" />
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-red-800 transition-colors hover:bg-red-100"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

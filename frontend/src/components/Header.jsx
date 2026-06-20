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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeStore } from "../store/useThemeStore";

export const Header = () => {
  const { authUser, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
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
        { icon: <Crown size={18} className="text-amber-700 fill-current" />, label: "Gold Hub", to: "/gold" },
        { icon: <Compass size={18} />, label: "Explore Vibes", to: "/explore" },
        { icon: <CalendarDays size={18} />, label: "My Dates", to: "/dates" },
        { icon: <Heart size={18} />, label: "Matches", to: "/matches" },
        {
          icon: <MessageCircle size={18} />,
          label: "Messages",
          to: "/chat",
        },
        { icon: <Settings size={18} />, label: "Settings", to: "/profile" },
      ]
    : [];

  return (
    <header className="h-[72px] z-50 border-b border-border bg-background shadow-card transition-colors duration-300 flex items-center shrink-0 w-full font-sans select-none">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-full">
          <Link to="/" className="group flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 6 }}
              className="rounded-md bg-primary p-2 shadow-card"
            >
              <Flame className="h-5.5 w-5.5 text-primary-foreground" />
            </motion.div>
            <span className="hidden text-2xl font-black tracking-wider text-foreground sm:inline font-outfit uppercase">
              Swipe
            </span>
          </Link>

          <div className="hidden items-center space-x-5 md:flex">
            {authUser && (
              <div className="flex items-center space-x-5 mr-1">
                <Link
                  to="/gold"
                  className={`relative p-1.5 rounded-full transition-all ${
                    location.pathname === "/gold"
                      ? "text-accent bg-accent/10 border border-border"
                      : "text-foreground-secondary hover:text-foreground hover:scale-105"
                  }`}
                  aria-label="Gold Hub"
                >
                  <Crown size={21} className={location.pathname === "/gold" ? "fill-current animate-pulse" : ""} />
                </Link>
                <Link
                  to="/explore"
                  className={`relative p-1.5 rounded-full transition-all ${
                    location.pathname === "/explore"
                      ? "text-accent bg-accent/10 border border-border"
                      : "text-foreground-secondary hover:text-foreground"
                  }`}
                >
                  <Compass size={21} />
                </Link>
                <Link
                  to="/matches"
                  className={`relative p-1.5 rounded-full transition-all ${
                    location.pathname === "/matches"
                      ? "text-accent bg-accent/10 border border-border"
                      : "text-foreground-secondary hover:text-foreground"
                  }`}
                >
                  <Heart size={21} />
                </Link>
                <Link
                  to="/chat"
                  className={`relative p-1.5 rounded-full transition-all ${
                    location.pathname.startsWith("/chat")
                      ? "text-accent bg-accent/10 border border-border"
                      : "text-foreground-secondary hover:text-foreground"
                  }`}
                >
                  <MessageCircle size={21} />
                </Link>
                <div className="relative p-1.5">
                  <button className="flex items-center justify-center text-foreground-secondary hover:text-foreground transition-colors">
                    <Bell size={21} />
                  </button>
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-black text-accent-foreground shadow-card ring-2 ring-background">
                    3
                  </span>
                </div>
              </div>
            )}

            {/* Theme Toggle Switch */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-md text-foreground-secondary hover:text-foreground bg-background-secondary border border-border transition-colors focus-ring"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? (
                <Sun size={19} className="text-amber-400 fill-current animate-pulse" />
              ) : (
                <Moon size={19} className="text-foreground-secondary" />
              )}
            </motion.button>

            {authUser ? (
              <div className="relative" ref={dropdownRef}>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2.5 rounded-md border border-border bg-background-secondary px-3.5 py-1.5 transition-all hover:bg-surface-hover focus-ring shadow-card"
                >
                  <div className="relative flex items-center justify-center">
                    <img
                      src={authUser.image || "/avatar.png"}
                      className={`h-7 w-7 rounded-full object-cover shadow-card transition-all duration-300 ${
                        authUser.isGold
                          ? "border-2 border-amber-400 ring-2 ring-amber-400/20"
                          : "border-2 border-border-strong"
                      }`}
                      alt="Profile"
                    />
                    <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full border border-background bg-green-700 shadow-card"></span>
                  </div>
                  <span className="text-sm font-bold text-foreground pr-0.5">
                    {authUser.name.split(" ")[0]}
                  </span>
                  <ChevronDown
                    size={14}
                    className="text-foreground-secondary transition-transform duration-200"
                  />
                </motion.button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 mt-2 w-52 rounded-md border border-border bg-background py-2 shadow-popover"
                    >
                      {menuItems.map((item, index) => (
                        <Link
                          key={index}
                          to={item.to}
                          className="flex items-center space-x-3 px-4 py-2.5 text-sm font-bold text-foreground transition-colors hover:bg-surface-hover hover:text-accent"
                          onClick={() => setDropdownOpen(false)}
                        >
                          {item.icon}
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      ))}
                      <hr className="my-1.5 border-border" />
                      <button
                        onClick={logout}
                        className="flex w-full items-center space-x-3 px-4 py-2.5 text-sm font-bold text-red-800 transition-colors hover:bg-red-100"
                      >
                        <LogOut size={18} />
                        <span className="font-medium">Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/auth"
                  className="text-sm font-bold text-foreground-secondary transition-colors hover:text-foreground"
                >
                  Login
                </Link>
                <Link
                  to="/auth"
                  className="rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground hover:bg-primary-hover shadow-card"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3 md:hidden">
            {/* Mobile Theme Toggle Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-1.5 rounded-md text-foreground-secondary hover:text-foreground bg-background-secondary border border-border transition-colors focus-ring"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? (
                <Sun size={18} className="text-amber-400 fill-current animate-pulse" />
              ) : (
                <Moon size={18} className="text-foreground-secondary" />
              )}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-foreground-secondary focus-ring p-1 hover:text-foreground transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-border bg-background md:hidden w-full absolute top-[72px] left-0 z-40 shadow-popover"
          >
            <div className="space-y-1.5 px-4 py-3">
              {authUser ? (
                <>
                  <div className="flex items-center space-x-3 px-4 py-2">
                    <img
                      src={authUser.image || "/avatar.png"}
                      className="h-10 w-10 rounded-full border-2 border-border-strong object-cover"
                      alt="Profile"
                    />
                    <div>
                      <p className="font-bold text-foreground leading-none">{authUser.name}</p>
                      <p className="text-xs text-foreground-secondary mt-1">{authUser.email}</p>
                    </div>
                  </div>
                  <hr className="my-2 border-border" />
                  {menuItems.map((item, index) => (
                    <Link
                      key={index}
                      to={item.to}
                      className="flex items-center space-x-3 rounded-md px-4 py-2.5 text-sm font-bold text-foreground transition-colors hover:bg-surface-hover hover:text-accent"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.icon}
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  ))}
                  <hr className="my-2 border-border" />
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex w-full items-center space-x-3 rounded-md px-4 py-2.5 text-sm font-bold text-red-800 transition-colors hover:bg-red-100"
                  >
                    <LogOut size={18} />
                    <span className="font-medium">Logout</span>
                  </button>
                </>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/auth"
                    className="block w-full rounded-md px-4 py-2.5 text-center text-sm font-bold text-foreground hover:bg-surface-hover"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/auth"
                    className="block w-full rounded-md bg-primary px-4 py-2.5 text-center text-sm font-bold text-primary-foreground hover:bg-primary-hover"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

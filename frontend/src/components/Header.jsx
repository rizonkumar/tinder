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
        { icon: <Crown size={18} className="text-yellow-500 fill-current" />, label: "Gold Hub", to: "/gold" },
        { icon: <Compass size={18} />, label: "Explore Vibes", to: "/explore" },
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
    <header className="h-[72px] z-50 border-b border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm transition-colors duration-300 flex items-center shrink-0 w-full font-sans select-none">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-full">
          <Link to="/" className="group flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 6 }}
              className="rounded-xl bg-gradient-to-r from-red-500 to-pink-500 p-2 shadow-md shadow-pink-500/10"
            >
              <Flame className="h-5.5 w-5.5 text-white" />
            </motion.div>
            <span className="hidden bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-2xl font-black tracking-wider text-transparent sm:inline font-outfit uppercase">
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
                      ? "text-yellow-500 bg-yellow-500/10 shadow-[0_0_15px_rgba(234,179,8,0.15)] border border-yellow-500/20"
                      : "text-slate-500 dark:text-slate-400 hover:text-yellow-500 dark:hover:text-yellow-400 hover:scale-105"
                  }`}
                  aria-label="Gold Hub"
                >
                  <Crown size={21} className={location.pathname === "/gold" ? "fill-current animate-pulse" : ""} />
                </Link>
                <Link
                  to="/explore"
                  className={`relative p-1.5 rounded-full transition-all ${
                    location.pathname === "/explore"
                      ? "text-pink-500 bg-pink-500/10 border border-pink-500/20"
                      : "text-slate-500 dark:text-slate-400 hover:text-pink-500 dark:hover:text-pink-400"
                  }`}
                >
                  <Compass size={21} />
                </Link>
                <Link
                  to="/matches"
                  className={`relative p-1.5 rounded-full transition-all ${
                    location.pathname === "/matches"
                      ? "text-pink-500 bg-pink-500/10 border border-pink-500/20"
                      : "text-slate-500 dark:text-slate-400 hover:text-pink-500 dark:hover:text-pink-400"
                  }`}
                >
                  <Heart size={21} />
                </Link>
                <Link
                  to="/chat"
                  className={`relative p-1.5 rounded-full transition-all ${
                    location.pathname.startsWith("/chat")
                      ? "text-pink-500 bg-pink-500/10 border border-pink-500/20"
                      : "text-slate-500 dark:text-slate-400 hover:text-pink-500 dark:hover:text-pink-400"
                  }`}
                >
                  <MessageCircle size={21} />
                </Link>
                <div className="relative p-1.5">
                  <button className="flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-pink-500 dark:hover:text-pink-400 transition-colors">
                    <Bell size={21} />
                  </button>
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-pink-500 text-[10px] font-black text-white shadow-sm ring-2 ring-white dark:ring-zinc-900">
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
              className="p-2 rounded-xl text-slate-500 hover:text-pink-500 dark:text-slate-400 dark:hover:text-pink-400 bg-slate-50 dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700/60 transition-colors focus:outline-none"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? (
                <Sun size={19} className="text-amber-400 fill-current animate-pulse" />
              ) : (
                <Moon size={19} className="text-slate-600" />
              )}
            </motion.button>

            {authUser ? (
              <div className="relative" ref={dropdownRef}>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2.5 rounded-xl border border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/40 px-3.5 py-1.5 transition-all hover:bg-slate-100 dark:hover:bg-zinc-800/60 focus:outline-none shadow-sm"
                >
                  <div className="relative flex items-center justify-center">
                    <img
                      src={authUser.image || "/avatar.png"}
                      className={`h-7 w-7 rounded-full object-cover shadow-sm transition-all duration-300 ${
                        authUser.isGold
                          ? "border-2 border-yellow-400 ring-2 ring-yellow-400/20"
                          : "border-2 border-pink-400"
                      }`}
                      alt="Profile"
                    />
                    <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full border border-white dark:border-zinc-900 bg-green-400 shadow-sm"></span>
                  </div>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200 pr-0.5">
                    {authUser.name.split(" ")[0]}
                  </span>
                  <ChevronDown
                    size={14}
                    className="text-slate-500 dark:text-slate-400 transition-transform duration-200"
                  />
                </motion.button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 mt-2 w-52 rounded-2xl border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-2 shadow-xl"
                    >
                      {menuItems.map((item, index) => (
                        <Link
                          key={index}
                          to={item.to}
                          className="flex items-center space-x-3 px-4 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-200 transition-colors hover:bg-slate-50 dark:hover:bg-zinc-800/60 hover:text-pink-600 dark:hover:text-pink-400"
                          onClick={() => setDropdownOpen(false)}
                        >
                          {item.icon}
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      ))}
                      <hr className="my-1.5 border-slate-100 dark:border-zinc-800" />
                      <button
                        onClick={logout}
                        className="flex w-full items-center space-x-3 px-4 py-2.5 text-sm font-bold text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-950/20"
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
                  className="text-sm font-bold text-slate-600 dark:text-slate-300 transition-colors hover:text-pink-500 dark:hover:text-pink-400"
                >
                  Login
                </Link>
                <Link
                  to="/auth"
                  className="rounded-full bg-gradient-to-r from-red-500 to-pink-500 px-5 py-2 text-sm font-bold text-white shadow-md shadow-pink-500/10"
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
              className="p-1.5 rounded-lg text-slate-500 hover:text-pink-500 dark:text-slate-400 dark:hover:text-pink-400 bg-slate-50 dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700/60 transition-colors focus:outline-none"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? (
                <Sun size={18} className="text-amber-400 fill-current animate-pulse" />
              ) : (
                <Moon size={18} className="text-slate-600" />
              )}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-500 dark:text-slate-400 focus:outline-none p-1 hover:text-pink-500 dark:hover:text-pink-400 transition-colors"
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
            className="border-t border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 md:hidden w-full absolute top-[72px] left-0 z-40 shadow-lg"
          >
            <div className="space-y-1.5 px-4 py-3">
              {authUser ? (
                <>
                  <div className="flex items-center space-x-3 px-4 py-2">
                    <img
                      src={authUser.image || "/avatar.png"}
                      className="h-10 w-10 rounded-full border-2 border-pink-400 object-cover"
                      alt="Profile"
                    />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-slate-100 leading-none">{authUser.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{authUser.email}</p>
                    </div>
                  </div>
                  <hr className="my-2 border-slate-100 dark:border-zinc-800" />
                  {menuItems.map((item, index) => (
                    <Link
                      key={index}
                      to={item.to}
                      className="flex items-center space-x-3 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-200 transition-colors hover:bg-slate-50 dark:hover:bg-zinc-800/40 hover:text-pink-600 dark:hover:text-pink-400"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.icon}
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  ))}
                  <hr className="my-2 border-slate-100 dark:border-zinc-800" />
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex w-full items-center space-x-3 rounded-xl px-4 py-2.5 text-sm font-bold text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-950/20"
                  >
                    <LogOut size={18} />
                    <span className="font-medium">Logout</span>
                  </button>
                </>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/auth"
                    className="block w-full rounded-xl px-4 py-2.5 text-center text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-zinc-800/40"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/auth"
                    className="block w-full rounded-xl bg-gradient-to-r from-red-500 to-pink-500 px-4 py-2.5 text-center text-sm font-bold text-white"
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

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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Header = () => {
  const { authUser, logout } = useAuthStore();
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
    <header
      className="sticky top-0 z-50 border-b border-pink-100/50 shadow-sm"
      style={{ backgroundColor: "white" }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          <Link to="/" className="group flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.08, rotate: 8 }}
              className="rounded-xl bg-gradient-to-r from-red-500 to-pink-500 p-2 shadow-md shadow-pink-500/20"
            >
              <Flame className="h-5.5 w-5.5 text-white" />
            </motion.div>
            <span className="hidden bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-2xl font-black tracking-wider text-transparent sm:inline">
              Swipe
            </span>
          </Link>

          <div className="hidden items-center space-x-6 md:flex">
            {authUser && (
              <div className="flex items-center space-x-5 mr-1">
                <Link
                  to="/gold"
                  className={`relative p-1.5 rounded-full transition-all ${
                    location.pathname === "/gold"
                      ? "text-yellow-500 bg-yellow-500/10 shadow-[0_0_15px_rgba(234,179,8,0.2)] border border-yellow-500/30"
                      : "text-gray-500 hover:text-yellow-500 hover:scale-105"
                  }`}
                  aria-label="Gold Hub"
                >
                  <Crown size={21} className={location.pathname === "/gold" ? "fill-current animate-pulse" : ""} />
                </Link>
                <Link
                  to="/explore"
                  className={`relative p-1.5 rounded-full transition-colors ${
                    location.pathname === "/explore"
                      ? "text-pink-500 bg-pink-50/50"
                      : "text-gray-500 hover:text-pink-500"
                  }`}
                >
                  <Compass size={21} />
                </Link>
                <Link
                  to="/matches"
                  className={`relative p-1.5 rounded-full transition-colors ${
                    location.pathname === "/matches"
                      ? "text-pink-500 bg-pink-50/50"
                      : "text-gray-500 hover:text-pink-500"
                  }`}
                >
                  <Heart size={21} />
                </Link>
                <Link
                  to="/chat"
                  className={`relative p-1.5 rounded-full transition-colors ${
                    location.pathname.startsWith("/chat")
                      ? "text-pink-500 bg-pink-50/50"
                      : "text-gray-500 hover:text-pink-500"
                  }`}
                >
                  <MessageCircle size={21} />
                </Link>
                <div className="relative p-1.5">
                  <button className="flex items-center justify-center text-gray-500 hover:text-pink-500 transition-colors">
                    <Bell size={21} />
                  </button>
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-pink-500 text-[10px] font-black text-white shadow-sm ring-2 ring-white">
                    3
                  </span>
                </div>
              </div>
            )}

            {authUser ? (
              <div className="relative" ref={dropdownRef}>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2.5 rounded-full border border-pink-100/60 bg-pink-50/20 px-3.5 py-1.5 transition-all hover:bg-pink-50/50 focus:outline-none shadow-sm"
                >
                  <div className="relative flex items-center justify-center">
                    <img
                      src={authUser.image || "/avatar.png"}
                      className={`h-8 w-8 rounded-full object-cover shadow-sm transition-all duration-300 ${
                        authUser.isGold
                          ? "border-2 border-yellow-400 ring-2 ring-yellow-400/40 shadow-[0_0_12px_rgba(234,179,8,0.55)]"
                          : "border-2 border-pink-400"
                      }`}
                      alt="Profile"
                    />
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border border-white bg-green-400 shadow-sm"></span>
                  </div>
                  <span className="text-sm font-bold text-gray-700 pr-0.5">
                    {authUser.name.split(" ")[0]}
                  </span>
                  <ChevronDown
                    size={14}
                    className="text-gray-500 transition-transform duration-200"
                  />
                </motion.button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 mt-2 w-52 rounded-2xl border border-pink-50/50 bg-white py-2 shadow-xl backdrop-blur-md"
                    >
                      {menuItems.map((item, index) => (
                        <Link
                          key={index}
                          to={item.to}
                          className="flex items-center space-x-3 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-pink-50/40 hover:text-pink-600"
                          onClick={() => setDropdownOpen(false)}
                        >
                          {item.icon}
                          <span>{item.label}</span>
                        </Link>
                      ))}
                      <hr className="my-1.5 border-pink-50" />
                      <button
                        onClick={logout}
                        className="flex w-full items-center space-x-3 px-4 py-2.5 text-sm font-semibold text-red-500 transition-colors hover:bg-red-50/50"
                      >
                        <LogOut size={18} />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/auth/login"
                  className="text-sm font-bold text-gray-600 transition-colors hover:text-pink-500"
                >
                  Login
                </Link>
                <Link
                  to="/auth/signup"
                  className="rounded-full bg-gradient-to-r from-red-500 to-pink-500 px-5 py-2 text-sm font-bold text-white transition-all hover:from-red-600 hover:to-pink-600 shadow-md shadow-pink-500/10"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-500 focus:outline-none md:hidden p-1 hover:text-pink-500 transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-pink-50 bg-white md:hidden"
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
                      <p className="font-bold text-gray-900">{authUser.name}</p>
                      <p className="text-xs text-gray-500">{authUser.email}</p>
                    </div>
                  </div>
                  <hr className="my-2 border-pink-50" />
                  {menuItems.map((item, index) => (
                    <Link
                      key={index}
                      to={item.to}
                      className="flex items-center space-x-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-pink-50/30 hover:text-pink-600"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  ))}
                  <hr className="my-2 border-pink-50" />
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex w-full items-center space-x-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-red-500 transition-colors hover:bg-red-50/50"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/auth/login"
                    className="block w-full rounded-xl px-4 py-2.5 text-center text-sm font-bold text-gray-700 hover:bg-pink-50/30"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/auth/signup"
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

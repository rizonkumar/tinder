import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import {
  Flame,
  User,
  LogOut,
  Menu,
  X,
  Heart,
  Mail,
  Settings,
  Bell,
  MessageCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Header = () => {
  const { authUser, logout } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

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
        { icon: <Heart size={18} />, label: "Matches", to: "/matches" },
        {
          icon: <MessageCircle size={18} />,
          label: "Messages",
          to: "/messages",
        },
        { icon: <Settings size={18} />, label: "Settings", to: "/settings" },
      ]
    : [];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="group flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 10 }}
              className="rounded-lg bg-gradient-to-r from-red-500 to-pink-500 p-2"
            >
              <Flame className="h-6 w-6 text-white" />
            </motion.div>
            <span className="hidden bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-2xl font-bold text-transparent sm:inline">
              Swipe
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-6 md:flex">
            {authUser && (
              <>
                <Link
                  to="/matches"
                  className="text-gray-600 transition-colors hover:text-pink-500"
                >
                  <Heart size={20} />
                </Link>
                <Link
                  to="/messages"
                  className="text-gray-600 transition-colors hover:text-pink-500"
                >
                  <Mail size={20} />
                </Link>
                <div className="relative">
                  <button className="text-gray-600 transition-colors hover:text-pink-500">
                    <Bell size={20} />
                  </button>
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-pink-500 text-xs text-white">
                    3
                  </span>
                </div>
              </>
            )}

            {authUser ? (
              <div className="relative" ref={dropdownRef}>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-3 focus:outline-none"
                >
                  <div className="relative">
                    <img
                      src={authUser.image || "/avatar.png"}
                      className="h-10 w-10 rounded-full border-2 border-pink-500 object-cover"
                      alt="Profile"
                    />
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-400"></span>
                  </div>
                  <span className="font-medium text-gray-700">
                    {authUser.name}
                  </span>
                </motion.button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-3 w-56 rounded-xl border border-gray-100 bg-white py-2 shadow-lg"
                    >
                      {menuItems.map((item, index) => (
                        <Link
                          key={index}
                          to={item.to}
                          className="flex items-center space-x-3 px-4 py-3 text-gray-700 transition-colors hover:bg-gray-50"
                          onClick={() => setDropdownOpen(false)}
                        >
                          {item.icon}
                          <span>{item.label}</span>
                        </Link>
                      ))}
                      <hr className="my-2" />
                      <button
                        onClick={logout}
                        className="flex w-full items-center space-x-3 px-4 py-3 text-red-500 transition-colors hover:bg-gray-50"
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
                  className="text-gray-700 transition-colors hover:text-pink-500"
                >
                  Login
                </Link>
                <Link
                  to="/auth/signup"
                  className="rounded-full bg-gradient-to-r from-red-500 to-pink-500 px-6 py-2 font-medium text-white transition-colors hover:from-red-600 hover:to-pink-600"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-700 focus:outline-none md:hidden"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-100 bg-white md:hidden"
          >
            <div className="space-y-1 px-4 py-2">
              {authUser ? (
                <>
                  <div className="flex items-center space-x-3 px-4 py-3">
                    <img
                      src={authUser.image || "/avatar.png"}
                      className="h-10 w-10 rounded-full border-2 border-pink-500 object-cover"
                      alt="Profile"
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        {authUser.name}
                      </p>
                      <p className="text-sm text-gray-500">{authUser.email}</p>
                    </div>
                  </div>
                  <hr className="my-2" />
                  {menuItems.map((item, index) => (
                    <Link
                      key={index}
                      to={item.to}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 transition-colors hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  ))}
                  <hr className="my-2" />
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex w-full items-center space-x-3 px-4 py-3 text-red-500 transition-colors hover:bg-gray-50"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/auth/login"
                    className="block w-full rounded-lg px-4 py-3 text-center text-gray-700 transition-colors hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/auth/signup"
                    className="block w-full rounded-lg bg-gradient-to-r from-red-500 to-pink-500 px-4 py-3 text-center font-medium text-white"
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

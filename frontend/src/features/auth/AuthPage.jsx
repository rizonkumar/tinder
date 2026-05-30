import { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Sun, Moon } from "lucide-react";
import { useThemeStore } from "../../store/useThemeStore";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { theme, toggleTheme } = useThemeStore();

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-zinc-950 p-4 select-none transition-colors duration-300 relative">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-55">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="p-2.5 rounded-xl text-slate-500 hover:text-pink-500 dark:text-slate-400 dark:hover:text-pink-400 bg-white dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800 shadow-sm transition-colors focus:outline-none"
          aria-label="Toggle Theme"
        >
          {theme === "dark" ? (
            <Sun size={19} className="text-amber-400 fill-current animate-pulse" />
          ) : (
            <Moon size={19} className="text-slate-500" />
          )}
        </motion.button>
      </div>

      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="rounded-2xl bg-pink-50 dark:bg-pink-950/40 border border-pink-100/40 dark:border-pink-900/30 p-2.5 shadow-sm mb-3"
          >
            <Flame className="h-7 w-7 text-pink-500" />
          </motion.div>
          <h1 className="text-2xl font-bold tracking-wider text-slate-850 dark:text-zinc-100 uppercase font-outfit">
            SWIPE
          </h1>
        </div>

        <motion.div
          layout
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800 p-6 sm:p-8 shadow-sm"
        >
          <div className="mb-6 text-center">
            <h2 className="text-xl font-extrabold text-slate-805 dark:text-slate-100 font-outfit uppercase">
              {isLogin ? "Welcome Back!" : "Join Swipe Today"}
            </h2>
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium font-sans">
              {isLogin
                ? "We're so excited to see you again!"
                : "Find your perfect match with our intelligent matching system"}
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login" : "signup"}
              initial={{ opacity: 0, x: isLogin ? -10 : 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLogin ? 10 : -10 }}
              transition={{ duration: 0.2 }}
            >
              {isLogin ? <LoginForm /> : <SignupForm />}
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 border-t border-slate-100 dark:border-zinc-800 pt-6 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium font-sans">
              {isLogin ? "New to Swipe?" : "Already have an account?"}
            </p>
            <button
              onClick={() => setIsLogin((prevLogin) => !prevLogin)}
              className="mt-2 font-bold text-sm text-pink-500 dark:text-pink-400 hover:text-pink-600 dark:hover:text-pink-300 transition-colors font-outfit"
            >
              {isLogin ? "Create an account" : "Sign in to your account"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

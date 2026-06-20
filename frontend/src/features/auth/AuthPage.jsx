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
    <div className="relative h-screen w-full overflow-y-auto bg-background select-none transition-colors duration-300">
      <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="p-2.5 rounded-md text-foreground-secondary hover:text-foreground bg-background border border-border shadow-card transition-colors focus-ring"
          aria-label="Toggle Theme"
        >
          {theme === "dark" ? (
            <Sun size={19} className="text-amber-500 fill-current animate-pulse" />
          ) : (
            <Moon size={19} className="text-foreground-secondary" />
          )}
        </motion.button>
      </div>

      <div className="flex min-h-full w-full items-center justify-center p-4 py-10">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="rounded-lg bg-background-secondary border border-border p-2.5 shadow-card mb-3"
          >
            <Flame className="h-7 w-7 text-accent" />
          </motion.div>
          <h1 className="text-2xl font-bold tracking-wider text-foreground uppercase font-outfit">
            SWIPE
          </h1>
        </div>

        <motion.div
          layout
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="overflow-hidden rounded-lg bg-background border border-border p-6 sm:p-8 shadow-card"
        >
          <div className="mb-6 text-center">
            <h2 className="text-xl font-extrabold text-foreground font-outfit uppercase">
              {isLogin ? "Welcome Back!" : "Join Swipe Today"}
            </h2>
            <p className="mt-1.5 text-xs text-foreground-secondary font-medium font-sans">
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

          <div className="mt-6 border-t border-border pt-6 text-center">
            <p className="text-xs text-foreground-secondary font-medium font-sans">
              {isLogin ? "New to Swipe?" : "Already have an account?"}
            </p>
            <button
              onClick={() => setIsLogin((prevLogin) => !prevLogin)}
              className="mt-2 font-bold text-sm text-accent hover:text-accent-hover transition-colors font-outfit"
            >
              {isLogin ? "Create an account" : "Sign in to your account"}
            </button>
          </div>
        </motion.div>
      </div>
      </div>
    </div>
  );
}

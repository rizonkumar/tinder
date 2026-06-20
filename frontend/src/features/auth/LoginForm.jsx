import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn } from "lucide-react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login, loading } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login({ email, password });
    if (success) {
      navigate("/");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-4">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" size={18} />
          <input
            type="email"
            required
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-border bg-background py-3 pl-10 pr-4 text-sm text-foreground placeholder-foreground-muted transition-all focus-ring"
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" size={18} />
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-border bg-background py-3 pl-10 pr-4 text-sm text-foreground placeholder-foreground-muted transition-all focus-ring"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 rounded border-border text-accent focus-ring bg-background"
          />
          <label
            htmlFor="remember-me"
            className="ml-2 text-xs font-bold text-foreground-secondary"
          >
            Remember me
          </label>
        </div>
        <Link
          to="/forgot-password"
          className="text-xs font-bold text-accent hover:text-accent-hover"
        >
          Forgot password?
        </Link>
      </div>

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-card transition-all hover:bg-primary-hover disabled:opacity-70 focus-ring"
      >
        {loading ? (
          "Signing in..."
        ) : (
          <>
            <LogIn size={18} />
            Sign In
          </>
        )}
      </motion.button>

      <p className="mt-4 text-center text-[10px] text-foreground-muted leading-relaxed">
        By signing in, you agree to our{" "}
        <Link to="/terms" className="text-accent hover:underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link to="/privacy" className="text-accent hover:underline">
          Privacy Policy
        </Link>
      </p>
    </form>
  );
}

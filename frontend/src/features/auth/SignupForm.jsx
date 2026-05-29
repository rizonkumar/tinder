import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { motion } from "framer-motion";
import { User, Mail, Lock, Calendar, Heart } from "lucide-react";
import { Link } from "react-router-dom";

export default function SignUpForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    age: "",
    genderPreference: "",
  });

  const { signup, loading } = useAuthStore();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        signup(formData);
      }}
      className="space-y-5"
    >
      <div className="space-y-4">
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
          <input
            type="text"
            name="name"
            required
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 py-3 pl-10 pr-4 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all focus:border-pink-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-pink-500/10"
          />
        </div>

        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
          <input
            type="email"
            name="email"
            required
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 py-3 pl-10 pr-4 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all focus:border-pink-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-pink-500/10"
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
          <input
            type="password"
            name="password"
            required
            placeholder="Create Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 py-3 pl-10 pr-4 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all focus:border-pink-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-pink-500/10"
          />
        </div>

        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
          <input
            type="number"
            name="age"
            required
            placeholder="Age"
            min="18"
            max="120"
            value={formData.age}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 py-3 pl-10 pr-4 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all focus:border-pink-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-pink-500/10"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            I am a
          </label>
          <div className="flex gap-6">
            {["male", "female"].map((gender) => (
              <label key={gender} className="flex items-center cursor-pointer select-none">
                <input
                  type="radio"
                  name="gender"
                  value={gender}
                  checked={formData.gender === gender}
                  onChange={handleChange}
                  className="h-4 w-4 border-slate-300 dark:border-slate-800 text-pink-500 focus:ring-pink-500 dark:bg-slate-950"
                />
                <span className="ml-2 text-sm capitalize text-slate-700 dark:text-slate-300 font-medium">
                  {gender}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Interested in
          </label>
          <div className="flex flex-wrap gap-5">
            {["male", "female", "both"].map((pref) => (
              <label key={pref} className="flex items-center cursor-pointer select-none">
                <input
                  type="radio"
                  name="genderPreference"
                  value={pref}
                  checked={formData.genderPreference === pref}
                  onChange={handleChange}
                  className="h-4 w-4 border-slate-300 dark:border-slate-800 text-pink-500 focus:ring-pink-500 dark:bg-slate-950"
                />
                <span className="ml-2 text-sm capitalize text-slate-700 dark:text-slate-300 font-medium">
                  {pref}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-pink-500/10 transition-all hover:from-red-600 hover:to-pink-600 disabled:opacity-70 focus:outline-none"
      >
        {loading ? (
          "Creating Account..."
        ) : (
          <>
            <Heart size={18} className="fill-current" />
            Start Finding Love
          </>
        )}
      </motion.button>

      <p className="mt-4 text-center text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed">
        By signing up, you agree to our{" "}
        <Link to="/terms" className="text-pink-500 dark:text-pink-400 hover:underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link to="/privacy" className="text-pink-500 dark:text-pink-400 hover:underline">
          Privacy Policy
        </Link>
      </p>
    </form>
  );
}

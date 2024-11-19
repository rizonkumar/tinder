import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiLock, FiCalendar, FiHeart } from "react-icons/fi";
import { Link } from "react-router-dom";

const SignUpForm = () => {
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
    <div className="w-full max-w-md px-4">
      <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="px-8 pt-8">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Join Swipe Today
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Find your perfect match with our intelligent matching system
          </p>
        </div>

        <div className="p-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              signup(formData);
            }}
            className="space-y-6"
          >
            <div className="space-y-4">
              {/* Name Field */}
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-gray-900 placeholder-gray-400 transition-colors focus:border-pink-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-pink-500"
                />
              </div>

              {/* Email Field */}
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-gray-900 placeholder-gray-400 transition-colors focus:border-pink-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-pink-500"
                />
              </div>

              {/* Password Field */}
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="Create Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-gray-900 placeholder-gray-400 transition-colors focus:border-pink-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-pink-500"
                />
              </div>

              {/* Age Field */}
              <div className="relative">
                <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  name="age"
                  required
                  placeholder="Age"
                  min="18"
                  max="120"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-gray-900 placeholder-gray-400 transition-colors focus:border-pink-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-pink-500"
                />
              </div>

              {/* Gender Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  I am a
                </label>
                <div className="flex gap-6">
                  {["male", "female"].map((gender) => (
                    <motion.div
                      key={gender}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center"
                    >
                      <input
                        type="radio"
                        name="gender"
                        value={gender}
                        checked={formData.gender === gender}
                        onChange={handleChange}
                        className="h-4 w-4 text-pink-500 focus:ring-pink-500"
                      />
                      <label className="ml-2 capitalize text-gray-700">
                        {gender}
                      </label>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Gender Preference */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Interested in
                </label>
                <div className="flex flex-wrap gap-6">
                  {["male", "female", "both"].map((pref) => (
                    <motion.div
                      key={pref}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center"
                    >
                      <input
                        type="radio"
                        name="genderPreference"
                        value={pref}
                        checked={formData.genderPreference === pref}
                        onChange={handleChange}
                        className="h-4 w-4 text-pink-500 focus:ring-pink-500"
                      />
                      <label className="ml-2 capitalize text-gray-700">
                        {pref}
                      </label>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 py-3 font-medium text-white shadow-lg transition-all hover:from-red-600 hover:to-pink-600 disabled:opacity-70"
            >
              {loading ? (
                "Creating Account..."
              ) : (
                <>
                  <FiHeart className="text-lg" />
                  Start Finding Love
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-pink-500 hover:text-pink-700"
              >
                Sign in
              </Link>
            </p>
          </div>

          <p className="mt-4 text-center text-xs text-gray-500">
            By signing up, you agree to our{" "}
            <Link to="/terms" className="text-pink-500 hover:text-pink-700">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-pink-500 hover:text-pink-700">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;

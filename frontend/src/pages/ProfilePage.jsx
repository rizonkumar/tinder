import { useEffect, useRef, useState } from "react";
import { Header } from "../components/Header";
import { useAuthStore } from "../store/useAuthStore";
import { useUserStore } from "../store/useUserStore";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  User,
  Camera,
  Calendar,
  Heart,
  Users,
  Edit3,
  Loader,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import { INTEREST_OPTIONS } from "../constants";

export default function ProfilePage() {
  const { authUser } = useAuthStore();
  const [formData, setFormData] = useState({
    name: authUser?.name || "",
    bio: authUser?.bio || "",
    age: authUser?.age || "",
    gender: authUser?.gender || "",
    genderPreference: authUser?.genderPreference || "",
    image: authUser?.image || null,
    interests: authUser?.interests || [],
  });

  const fileInputRef = useRef(null);
  const { loading, updateProfile } = useUserStore();

  useEffect(() => {
    if (authUser) {
      setFormData({
        name: authUser.name || "",
        bio: authUser.bio || "",
        age: authUser.age || "",
        gender: authUser.gender || "",
        genderPreference: authUser.genderPreference || "",
        image: authUser.image || null,
        interests: authUser.interests || [],
      });
    }
  }, [authUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.age || !formData.gender) {
      toast.error("Please fill in all required fields");
      return;
    }
    await updateProfile(formData);
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 transition-colors duration-300">
      <Header />

      <div className="flex-grow overflow-y-auto pb-12">
        <div className="mx-auto max-w-3xl px-4 pt-6 select-none">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-sm font-bold text-slate-400 dark:text-slate-500 hover:text-pink-500 dark:hover:text-pink-400 transition-colors font-outfit"
          >
            <ArrowLeft size={16} />
            <span>Back to Feed</span>
          </Link>
        </div>

        <div className="mx-auto max-w-3xl px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800/80 shadow-sm transition-colors duration-300"
          >
            <div className="relative h-48 sm:h-56 bg-pink-500">
              <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 transform">
                <div className="relative">
                  <motion.img
                    whileHover={{ scale: 1.03 }}
                    src={formData.image || "/avatar.png"}
                    alt="Profile"
                    className="h-32 w-32 sm:h-36 sm:w-36 rounded-full border-4 border-white dark:border-zinc-900 object-cover shadow-sm"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-1 right-1 rounded-full bg-pink-500 hover:bg-pink-600 text-white p-2.5 shadow-sm focus:outline-none"
                    type="button"
                  >
                    <Camera size={18} />
                  </motion.button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
              </div>
            </div>

            <div className="px-4 sm:px-8 pb-8 pt-20">
              <h1 className="mb-8 text-center text-2xl font-bold tracking-wide text-slate-850 dark:text-zinc-100 font-outfit">
                CUSTOMIZE YOUR PROFILE
              </h1>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-outfit">
                      <User size={14} className="text-pink-500" />
                      <span>Full Name</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50/10 dark:bg-zinc-950/20 px-4 py-3 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-550 outline-none transition-all hover:border-pink-200 dark:hover:border-slate-700 focus:border-pink-500 focus:bg-white dark:focus:bg-zinc-950"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-outfit">
                      <Calendar size={14} className="text-pink-500" />
                      <span>Age</span>
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      min="18"
                      max="120"
                      className="w-full rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50/10 dark:bg-zinc-950/20 px-4 py-3 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-550 outline-none transition-all hover:border-pink-200 dark:hover:border-slate-700 focus:border-pink-500 focus:bg-white dark:focus:bg-zinc-950"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center space-x-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-outfit">
                      <Users size={14} className="text-pink-500" />
                      <span>Your Gender</span>
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {["male", "female"].map((option) => (
                        <label
                          key={option}
                          className={`flex cursor-pointer items-center justify-center space-x-2 rounded-2xl border p-3.5 text-xs font-bold transition-all shadow-sm ${
                            formData.gender === option
                              ? "border-pink-500 bg-pink-50 dark:bg-pink-950/30 text-pink-600 dark:text-pink-400 ring-2 ring-pink-500/20"
                              : "border-slate-100/50 dark:border-zinc-800 bg-slate-50/10 dark:bg-zinc-950/20 hover:bg-slate-50/20 dark:hover:bg-zinc-850 text-slate-500 dark:text-slate-400"
                          }`}
                        >
                          <input
                            type="radio"
                            name="gender"
                            value={option}
                            checked={formData.gender === option}
                            onChange={handleChange}
                            className="hidden"
                          />
                          <span className="capitalize">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center space-x-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-outfit">
                      <Heart size={14} className="text-pink-500" />
                      <span>Interested In</span>
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {["male", "female", "both"].map((option) => (
                        <label
                          key={option}
                          className={`flex cursor-pointer items-center justify-center space-x-1 rounded-2xl border py-3.5 text-[11px] font-bold transition-all shadow-sm ${
                            formData.genderPreference === option
                              ? "border-pink-500 bg-pink-50 dark:bg-pink-950/30 text-pink-600 dark:text-pink-400 ring-2 ring-pink-500/20"
                              : "border-slate-100/50 dark:border-zinc-800 bg-slate-50/10 dark:bg-zinc-950/20 hover:bg-slate-50/20 dark:hover:bg-zinc-850 text-slate-500 dark:text-slate-400"
                          }`}
                        >
                          <input
                            type="radio"
                            name="genderPreference"
                            value={option}
                            checked={formData.genderPreference === option}
                            onChange={handleChange}
                            className="hidden"
                          />
                          <span className="capitalize">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center space-x-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-outfit">
                    <Heart
                      size={14}
                      className="text-pink-500 fill-current animate-pulse"
                    />
                    <span>My Interests / Hobbies</span>
                  </label>
                  <div className="flex flex-wrap gap-2 p-4 rounded-3xl border border-slate-200 dark:border-zinc-800 bg-slate-50/20 dark:bg-zinc-950/20">
                    {INTEREST_OPTIONS.map((tag) => {
                      const isSelected = formData.interests.includes(tag);
                      return (
                        <motion.button
                          key={tag}
                          type="button"
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => {
                            setFormData((prev) => {
                              const newInterests = prev.interests.includes(tag)
                                ? prev.interests.filter((t) => t !== tag)
                                : [...prev.interests, tag];
                              return { ...prev, interests: newInterests };
                            });
                          }}
                          className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide border transition-all duration-200 shadow-sm ${
                            isSelected
                              ? "bg-pink-500 text-white border-transparent"
                              : "bg-white dark:bg-zinc-950 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-zinc-800 hover:bg-pink-50/20 dark:hover:bg-slate-900 hover:text-pink-500 dark:hover:text-pink-400"
                          }`}
                        >
                          {tag}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-outfit">
                    <Edit3 size={14} className="text-pink-500" />
                    <span>Bio</span>
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    className="w-full rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50/10 dark:bg-zinc-950/20 px-4 py-3 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-550 outline-none transition-all hover:border-pink-200 dark:hover:border-slate-700 focus:border-pink-500 focus:bg-white dark:focus:bg-zinc-950 leading-relaxed font-sans"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  disabled={loading}
                  type="submit"
                  className="group relative w-full overflow-hidden rounded-2xl bg-pink-500 hover:bg-pink-600 active:bg-pink-700 px-8 py-4 font-bold text-white shadow-sm hover:shadow transition-all focus:outline-none disabled:opacity-70 font-outfit"
                >
                  <div className="relative flex items-center justify-center space-x-2">
                    {loading ? (
                      <>
                        <Loader className="animate-spin" size={18} />
                        <span>Updating Profile...</span>
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </div>
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

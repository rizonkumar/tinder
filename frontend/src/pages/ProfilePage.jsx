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
  Sparkles,
  RefreshCw,
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
  const { loading, updateProfile, enhanceProfile } = useUserStore();
  const [aiTone, setAiTone] = useState("witty");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);

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

  const handleGenerateAiBio = async () => {
    if (formData.interests.length === 0) {
      toast.error(
        "Please select at least one interest to help the AI personalize your bio!",
      );
      return;
    }
    try {
      setIsGeneratingAi(true);
      const suggestions = await enhanceProfile(aiTone);
      setAiSuggestions(suggestions);
      toast.success("AI bio suggestions generated!");
    } catch (err) {
      toast.error("Failed to generate AI bio suggestions. Please try again.");
    } finally {
      setIsGeneratingAi(false);
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
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-background text-foreground transition-colors duration-300">
      <Header />

      <div className="flex-grow overflow-y-auto pb-12">
        <div className="mx-auto max-w-3xl px-4 pt-6 select-none">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-sm font-bold text-foreground-muted hover:text-accent transition-colors font-outfit"
          >
            <ArrowLeft size={16} />
            <span>Back to Feed</span>
          </Link>
        </div>

        <div className="mx-auto max-w-3xl px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-3xl bg-background border border-border shadow-card transition-colors duration-300"
          >
            <div className="relative h-48 sm:h-56 bg-primary">
              <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 transform">
                <div className="relative">
                  <motion.img
                    whileHover={{ scale: 1.03 }}
                    src={formData.image || "/avatar.png"}
                    alt="Profile"
                    className="h-32 w-32 sm:h-36 sm:w-36 rounded-full border-4 border-background object-cover shadow-card"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-1 right-1 rounded-full bg-primary hover:bg-primary-hover text-primary-foreground p-2.5 shadow-card focus-ring"
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
              <h1 className="mb-8 text-center text-2xl font-bold tracking-wide text-foreground font-outfit">
                CUSTOMIZE YOUR PROFILE
              </h1>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-xs font-bold text-foreground-muted uppercase tracking-wider font-outfit">
                      <User size={14} className="text-accent" />
                      <span>Full Name</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-border bg-background-secondary px-4 py-3 text-sm text-foreground placeholder-foreground-muted outline-none transition-all hover:border-border-strong focus:border-accent focus-ring"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-xs font-bold text-foreground-muted uppercase tracking-wider font-outfit">
                      <Calendar size={14} className="text-accent" />
                      <span>Age</span>
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      min="18"
                      max="120"
                      className="w-full rounded-2xl border border-border bg-background-secondary px-4 py-3 text-sm text-foreground placeholder-foreground-muted outline-none transition-all hover:border-border-strong focus:border-accent focus-ring"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center space-x-2 text-xs font-bold text-foreground-muted uppercase tracking-wider font-outfit">
                      <Users size={14} className="text-accent" />
                      <span>Your Gender</span>
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {["male", "female"].map((option) => (
                        <label
                          key={option}
                          className={`flex cursor-pointer items-center justify-center space-x-2 rounded-2xl border p-3.5 text-xs font-bold transition-all shadow-card ${
                            formData.gender === option
                              ? "border-accent bg-background-secondary text-accent ring-2 ring-ring"
                              : "border-border bg-background-secondary hover:bg-surface-hover text-foreground-secondary"
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
                    <label className="flex items-center space-x-2 text-xs font-bold text-foreground-muted uppercase tracking-wider font-outfit">
                      <Heart size={14} className="text-accent" />
                      <span>Interested In</span>
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {["male", "female", "both"].map((option) => (
                        <label
                          key={option}
                          className={`flex cursor-pointer items-center justify-center space-x-1 rounded-2xl border py-3.5 text-[11px] font-bold transition-all shadow-card ${
                            formData.genderPreference === option
                              ? "border-accent bg-background-secondary text-accent ring-2 ring-ring"
                              : "border-border bg-background-secondary hover:bg-surface-hover text-foreground-secondary"
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
                  <label className="flex items-center space-x-2 text-xs font-bold text-foreground-muted uppercase tracking-wider font-outfit">
                    <Heart
                      size={14}
                      className="text-accent fill-current animate-pulse"
                    />
                    <span>My Interests / Hobbies</span>
                  </label>
                  <div className="flex flex-wrap gap-2 p-4 rounded-3xl border border-border bg-background-secondary">
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
                          className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide border transition-all duration-200 shadow-card ${
                            isSelected
                              ? "bg-primary text-primary-foreground border-transparent"
                              : "bg-background text-foreground-secondary border-border hover:bg-surface-hover hover:text-foreground"
                          }`}
                        >
                          {tag}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-xs font-bold text-foreground-muted uppercase tracking-wider font-outfit">
                    <Edit3 size={14} className="text-accent" />
                    <span>Bio</span>
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    className="w-full rounded-2xl border border-border bg-background-secondary px-4 py-3 text-sm text-foreground placeholder-foreground-muted outline-none transition-all hover:border-border-strong focus:border-accent focus-ring leading-relaxed font-sans"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="space-y-4 rounded-3xl border border-border bg-background-secondary p-5 transition-colors duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Sparkles
                        size={16}
                        className="text-accent fill-current animate-pulse"
                      />
                      <span className="text-sm font-bold text-foreground font-outfit tracking-wide">
                        AI BIO WINGMAN
                      </span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                      Gemini
                    </span>
                  </div>

                  <p className="text-xs font-semibold leading-relaxed text-foreground-muted">
                    Stuck on what to write? Choose a tone below and let our AI
                    assistant draft some polished options matching your
                    interests!
                  </p>

                  <div className="flex flex-wrap gap-2.5">
                    {["witty", "deep", "bold"].map((tone) => (
                      <button
                        key={tone}
                        type="button"
                        onClick={() => setAiTone(tone)}
                        className={`px-4 py-2 rounded-2xl text-xs font-bold capitalize transition-all border outline-none shadow-card ${
                          aiTone === tone
                            ? "border-accent bg-background text-accent"
                            : "bg-background text-foreground-secondary border-border hover:bg-surface-hover"
                        }`}
                      >
                        {tone}
                      </button>
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="button"
                    onClick={handleGenerateAiBio}
                    disabled={isGeneratingAi}
                    className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-2xl bg-primary hover:bg-primary-hover font-bold text-primary-foreground text-xs tracking-wider focus-ring shadow-card disabled:opacity-70"
                  >
                    {isGeneratingAi ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        <span>Generating Bio Options...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={14} />
                        <span>Generate 3 Tone Options</span>
                      </>
                    )}
                  </motion.button>

                  {aiSuggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3.5 mt-2"
                    >
                      <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-foreground-muted">
                        Generated Suggestions
                      </h4>
                      <div className="space-y-3">
                        {aiSuggestions.map((suggestion, idx) => (
                          <div
                            key={idx}
                            className="group relative flex flex-col p-4 rounded-2xl border border-border bg-background hover:border-border-strong shadow-card transition-all"
                          >
                            <p className="text-xs font-semibold leading-relaxed text-foreground-secondary pr-4">
                              {suggestion}
                            </p>
                            <button
                              type="button"
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  bio: suggestion,
                                }));
                                toast.success(
                                  `Applied option ${idx + 1}! Don't forget to Save Changes below.`,
                                );
                              }}
                              className="mt-3.5 self-end px-3 py-1.5 rounded-xl border border-border hover:border-transparent bg-background-secondary hover:bg-primary text-foreground-secondary hover:text-primary-foreground text-[10px] font-black uppercase tracking-wider transition-all outline-none"
                            >
                              Apply Bio
                            </button>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  disabled={loading}
                  type="submit"
                  className="group relative w-full overflow-hidden rounded-2xl bg-primary hover:bg-primary-hover px-8 py-4 font-bold text-primary-foreground shadow-card transition-all focus-ring disabled:opacity-70 font-outfit"
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

import { useRef, useState } from "react";
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

const ProfilePage = () => {
  const { authUser } = useAuthStore();
  const [formData, setFormData] = useState({
    name: authUser?.name || "",
    bio: authUser?.bio || "",
    age: authUser?.age || "",
    gender: authUser?.gender || "",
    genderPreference: authUser?.genderPreference || "",
    image: authUser?.image || null,
  });

  const fileInputRef = useRef(null);
  const { loading, updateProfile } = useUserStore();

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
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50">
      <Header />

      {/* Back Navigation */}
      <div className="mx-auto max-w-4xl px-4 pt-6">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-gray-100"
        >
          {/* Profile Header */}
          <div className="relative h-60 bg-gradient-to-r from-red-500 to-pink-500">
            <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 transform">
              <div className="relative">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  src={formData.image || "/default-avatar.png"}
                  alt="Profile"
                  className="h-40 w-40 rounded-full border-4 border-white object-cover shadow-lg"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-2 right-2 rounded-full bg-white p-3 shadow-lg transition-colors hover:bg-gray-50"
                >
                  <Camera size={20} className="text-gray-600" />
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

          <div className="px-8 pb-8 pt-24">
            <h1 className="mb-8 text-center text-2xl font-bold text-gray-900">
              Edit Your Profile
            </h1>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid gap-8 md:grid-cols-2">
                {/* Name Field */}
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <User size={16} />
                    <span>Full Name</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 focus:border-transparent focus:bg-white focus:ring-2 focus:ring-pink-500"
                    placeholder="Your full name"
                  />
                </div>

                {/* Age Field */}
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <Calendar size={16} />
                    <span>Age</span>
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    min="18"
                    max="120"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 focus:border-transparent focus:bg-white focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                {/* Gender Selection */}
                <div className="space-y-4">
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <Users size={16} />
                    <span>Gender</span>
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {["male", "female"].map((option) => (
                      <label
                        key={option}
                        className={`flex cursor-pointer items-center justify-center space-x-2 rounded-lg border p-3 transition-colors ${
                          formData.gender === option
                            ? "border-pink-500 bg-pink-50 text-pink-600"
                            : "border-gray-200 hover:bg-gray-50"
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

                {/* Gender Preference */}
                <div className="space-y-4">
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <Heart size={16} />
                    <span>Interested In</span>
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {["male", "female", "both"].map((option) => (
                      <label
                        key={option}
                        className={`flex cursor-pointer items-center justify-center space-x-2 rounded-lg border p-3 transition-colors ${
                          formData.genderPreference === option
                            ? "border-pink-500 bg-pink-50 text-pink-600"
                            : "border-gray-200 hover:bg-gray-50"
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

              {/* Bio Field */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <Edit3 size={16} />
                  <span>Bio</span>
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 focus:border-transparent focus:bg-white focus:ring-2 focus:ring-pink-500"
                  placeholder="Tell us about yourself..."
                />
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                disabled={loading}
                type="submit"
                className="group relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-red-500 to-pink-500 px-8 py-4 font-medium text-white shadow-lg transition-all hover:from-red-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-70"
              >
                <span className="relative flex items-center justify-center space-x-2">
                  {loading ? (
                    <>
                      <Loader className="animate-spin" size={20} />
                      <span>Updating Profile...</span>
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </span>
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;

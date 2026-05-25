import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useMatchStore } from "../store/useMatchStore";
import { useAuthStore } from "../store/useAuthStore";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import {
  Frown,
  X,
  Heart,
  Sparkles,
  MessageCircle,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";

const HomePage = () => {
  const {
    isLoadingUserProfiles,
    getUserProfiles,
    userProfiles,
    swipeLeft,
    swipeRight,
  } = useMatchStore();

  const { authUser } = useAuthStore();
  const [matchedUser, setMatchedUser] = useState(null);
  const [showMatchModal, setShowMatchModal] = useState(false);

  // Gesture handling motion values
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(
    x,
    [-200, -150, 0, 150, 200],
    [0.6, 1, 1, 1, 0.6],
  );

  // Transform overlays
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);

  useEffect(() => {
    getUserProfiles();
  }, [getUserProfiles]);

  const handleSwipe = async (direction, user) => {
    if (direction === "right") {
      const data = await swipeRight(user);
      if (data && data.isMatch) {
        setMatchedUser(data.matchedUser);
        setShowMatchModal(true);
      }
    } else {
      await swipeLeft(user);
    }
    // Reset motion value
    x.set(0);
  };

  const handleBtnSwipe = async (direction) => {
    if (userProfiles.length === 0) return;
    const user = userProfiles[0];
    await handleSwipe(direction, user);
  };

  const activeProfile = userProfiles[0];
  const nextProfile = userProfiles[1];

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-red-50 lg:flex-row">
      <Sidebar />
      <div className="flex flex-grow flex-col overflow-hidden">
        <Header />

        <main className="relative flex flex-grow flex-col items-center justify-center p-4">
          {isLoadingUserProfiles ? (
            <LoadingUI />
          ) : userProfiles.length === 0 ? (
            <NoMoreProfiles onRefresh={getUserProfiles} />
          ) : (
            <div className="relative flex h-[32rem] w-full max-w-sm flex-col items-center justify-between">
              <div className="relative h-[27rem] w-full">
                <AnimatePresence>
                  {nextProfile && (
                    <div
                      key={nextProfile._id}
                      className="absolute inset-0 z-0 origin-bottom scale-95 transform overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-lg pointer-events-none opacity-80 transition-all duration-300"
                    >
                      <img
                        src={nextProfile.image || "/avatar.png"}
                        alt={nextProfile.name}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6 text-white">
                        <h3 className="text-2xl font-bold">
                          {nextProfile.name},{" "}
                          <span className="font-semibold">
                            {nextProfile.age}
                          </span>
                        </h3>
                      </div>
                    </div>
                  )}

                  {/* Active Card */}
                  {activeProfile && (
                    <motion.div
                      key={activeProfile._id}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      style={{ x, rotate, opacity }}
                      whileDrag={{ scale: 1.02 }}
                      onDragEnd={async (e, info) => {
                        const swipeThreshold = 130;
                        if (info.offset.x > swipeThreshold) {
                          await handleSwipe("right", activeProfile);
                        } else if (info.offset.x < -swipeThreshold) {
                          await handleSwipe("left", activeProfile);
                        }
                      }}
                      className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing overflow-hidden rounded-3xl border border-white bg-white shadow-2xl transition-transform duration-75"
                    >
                      <motion.div
                        style={{ opacity: likeOpacity }}
                        className="absolute left-6 top-8 z-30 -rotate-12 rounded-lg border-4 border-green-500 bg-white/90 px-4 py-1.5 text-3xl font-extrabold tracking-widest text-green-500"
                      >
                        LIKE
                      </motion.div>
                      <motion.div
                        style={{ opacity: nopeOpacity }}
                        className="absolute right-6 top-8 z-30 rotate-12 rounded-lg border-4 border-red-500 bg-white/90 px-4 py-1.5 text-3xl font-extrabold tracking-widest text-red-500"
                      >
                        NOPE
                      </motion.div>

                      {/* Profile Photo */}
                      <img
                        src={activeProfile.image || "/avatar.png"}
                        alt={activeProfile.name}
                        className="h-full w-full object-cover select-none pointer-events-none"
                      />

                      {/* Text & Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent pointer-events-none" />

                      <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col pointer-events-none">
                        <div className="flex items-baseline space-x-2">
                          <h2 className="text-3xl font-extrabold tracking-wide">
                            {activeProfile.name}
                          </h2>
                          <span className="text-2xl font-medium opacity-90">
                            {activeProfile.age}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-gray-200 line-clamp-2 leading-relaxed">
                          {activeProfile.bio || "No bio available."}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Action Buttons */}
              <div className="flex w-full justify-center items-center space-x-6 pb-2 z-20">
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleBtnSwipe("left")}
                  className="flex h-16 w-16 items-center justify-center rounded-full border border-red-200 bg-white text-red-500 shadow-lg transition-colors hover:bg-red-50 focus:outline-none"
                  aria-label="Swipe Left (Dislike)"
                >
                  <X size={28} className="stroke-[3]" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleBtnSwipe("right")}
                  className="flex h-16 w-16 items-center justify-center rounded-full border border-green-200 bg-white text-green-500 shadow-lg transition-colors hover:bg-green-50 focus:outline-none"
                  aria-label="Swipe Right (Like)"
                >
                  <Heart size={28} className="fill-current stroke-[2]" />
                </motion.button>
              </div>
            </div>
          )}
        </main>
      </div>

      <AnimatePresence>
        {showMatchModal && matchedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.7, y: 100, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.7, y: 100, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative flex w-full max-w-md flex-col items-center text-center text-white"
            >
              <div className="absolute top-[-50px] animate-pulse">
                <Sparkles
                  size={80}
                  className="text-yellow-400 opacity-60 fill-current"
                />
              </div>

              <h1 className="bg-gradient-to-r from-red-400 via-pink-500 to-purple-400 bg-clip-text text-5xl font-extrabold tracking-wider text-transparent drop-shadow-lg font-serif">
                It's a Match!
              </h1>
              <p className="mt-3 text-lg font-light tracking-wide text-gray-300">
                You and{" "}
                <span className="font-semibold text-pink-400">
                  {matchedUser.name}
                </span>{" "}
                have liked each other.
              </p>

              <div className="my-10 flex items-center justify-center -space-x-8">
                <motion.div
                  initial={{ rotate: -15, x: -30, opacity: 0 }}
                  animate={{ rotate: -8, x: 0, opacity: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="h-32 w-32 overflow-hidden rounded-2xl border-4 border-white shadow-2xl"
                >
                  <img
                    src={authUser?.image || "/avatar.png"}
                    alt="Your avatar"
                    className="h-full w-full object-cover"
                  />
                </motion.div>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.3, 1] }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="z-10 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg border-2 border-white"
                >
                  <Heart size={24} className="fill-current animate-beat" />
                </motion.div>

                <motion.div
                  initial={{ rotate: 15, x: 30, opacity: 0 }}
                  animate={{ rotate: 8, x: 0, opacity: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="h-32 w-32 overflow-hidden rounded-2xl border-4 border-white shadow-2xl"
                >
                  <img
                    src={matchedUser.image || "/avatar.png"}
                    alt={matchedUser.name}
                    className="h-full w-full object-cover"
                  />
                </motion.div>
              </div>

              <div className="flex w-full flex-col space-y-4 px-6">
                <Link
                  to={`/chat/${matchedUser._id}`}
                  onClick={() => setShowMatchModal(false)}
                  className="flex w-full items-center justify-center space-x-2 rounded-full bg-gradient-to-r from-red-500 to-pink-500 py-3.5 font-bold text-white shadow-lg transition-transform hover:scale-[1.03] active:scale-[0.98]"
                >
                  <MessageCircle size={20} className="fill-current" />
                  <span>Send Message</span>
                </Link>

                <button
                  onClick={() => setShowMatchModal(false)}
                  className="w-full rounded-full border border-gray-500 py-3.5 font-bold text-gray-200 transition-colors hover:bg-white/10 hover:text-white"
                >
                  Keep Swiping
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomePage;

const NoMoreProfiles = ({ onRefresh }) => (
  <div className="flex h-full flex-col items-center justify-center p-8 text-center max-w-md">
    <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-pink-100 text-pink-500 shadow-inner">
      <Frown size={50} />
    </div>
    <h2 className="mb-3 text-3xl font-extrabold text-gray-800 tracking-tight">
      Speedy fingers!
    </h2>
    <p className="mb-8 text-lg text-gray-600 leading-relaxed">
      You've swiped through all available profiles in your preferences. Maybe
      it's time to take a break and touch some grass! 🌿
    </p>
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onRefresh}
      className="flex items-center space-x-2 rounded-full bg-gradient-to-r from-red-500 to-pink-500 px-6 py-3 font-semibold text-white shadow-lg"
    >
      <RefreshCw size={18} />
      <span>Load New Profiles</span>
    </motion.button>
  </div>
);

const LoadingUI = () => (
  <div className="relative h-[28rem] w-full max-w-sm flex items-center justify-center">
    <div className="card h-[27rem] w-full overflow-hidden rounded-3xl border border-gray-100 bg-white p-4 shadow-xl flex flex-col justify-between">
      <div className="h-[70%] w-full rounded-2xl bg-gray-100 animate-pulse" />
      <div className="space-y-3 mt-4">
        <div className="h-6 w-3/4 rounded bg-gray-200 animate-pulse" />
        <div className="h-4 w-1/2 rounded bg-gray-100 animate-pulse" />
      </div>
    </div>
  </div>
);

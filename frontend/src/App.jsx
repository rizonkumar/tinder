import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import ChatPage from "./pages/ChatPage";
import ExplorePage from "./pages/ExplorePage";
import MatchCelebrationOverlay from "./components/MatchCelebrationOverlay";
import CallInterface from "./components/CallInterface";
import { useCallStore } from "./store/useCallStore";

export default function App() {
  const { checkAuth, authUser, checkingAuth } = useAuthStore();
  const socket = useAuthStore((state) => state.socket);
  const setupCallListeners = useCallStore((state) => state.setupCallListeners);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (socket) {
      setupCallListeners(socket);
    }
  }, [socket, setupCallListeners]);

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-500 to-pink-500">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="h-16 w-16 rounded-full border-4 border-white border-t-transparent"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 to-pink-500">
      <AnimatePresence mode="wait">
        <Routes>
          <Route
            path="/"
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {authUser ? <HomePage /> : <Navigate to="/auth" />}
              </motion.div>
            }
          />
          <Route
            path="/auth"
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {!authUser ? <AuthPage /> : <Navigate to="/" />}
              </motion.div>
            }
          />
          <Route
            path="/profile"
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {authUser ? <ProfilePage /> : <Navigate to="/auth" />}
              </motion.div>
            }
          />
          <Route
            path="/chat/:id"
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {authUser ? <ChatPage /> : <Navigate to="/auth" />}
              </motion.div>
            }
          />
          <Route
            path="/explore"
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {authUser ? <ExplorePage /> : <Navigate to="/auth" />}
              </motion.div>
            }
          />
          <Route path="/matches" element={<Navigate to="/" />} />
          <Route path="/messages" element={<Navigate to="/" />} />
          <Route path="/settings" element={<Navigate to="/profile" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AnimatePresence>
      <MatchCelebrationOverlay />
      <CallInterface />
      <Toaster position="bottom-right" />
    </div>
  );
}

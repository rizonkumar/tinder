import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AuthPage from "./features/auth/AuthPage";
import HomePage from "./features/swipe/HomePage";
import ProfilePage from "./pages/ProfilePage";
import ChatPage from "./features/chat/ChatPage";
import ExplorePage from "./features/explore/ExplorePage";
import MatchesPage from "./features/matches/MatchesPage";
import GoldHubPage from "./features/gold/GoldHubPage";
import NotFoundPage from "./features/error/NotFoundPage";
import MatchCelebrationOverlay from "./features/matches/MatchCelebrationOverlay";
import CallInterface from "./features/chat/CallInterface";
import { useCallStore } from "./store/useCallStore";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { useThemeStore } from "./store/useThemeStore";

export default function App() {
  const { checkAuth, authUser, checkingAuth } = useAuthStore();
  const socket = useAuthStore((state) => state.socket);
  const setupCallListeners = useCallStore((state) => state.setupCallListeners);
  const initTheme = useThemeStore((state) => state.initTheme);

  useEffect(() => {
    initTheme();
  }, [initTheme]);

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
    <ErrorBoundary>
      <div className="h-screen w-screen overflow-hidden bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-200 transition-colors duration-300 font-sans flex flex-col">
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
              path="/chat"
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
            <Route
              path="/matches"
              element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {authUser ? <MatchesPage /> : <Navigate to="/auth" />}
                </motion.div>
              }
            />
            <Route
              path="/gold"
              element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {authUser ? <GoldHubPage /> : <Navigate to="/auth" />}
                </motion.div>
              }
            />
            <Route path="/messages" element={<Navigate to="/chat" />} />
            <Route path="/settings" element={<Navigate to="/profile" />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AnimatePresence>
        <MatchCelebrationOverlay />
        <CallInterface />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "rgba(255, 255, 255, 0.88)",
              backdropFilter: "blur(12px)",
              color: "#1f2937",
              borderRadius: "24px",
              border: "1px solid rgba(244, 63, 94, 0.12)",
              padding: "14px 22px",
              fontWeight: "800",
              fontSize: "13px",
              letterSpacing: "0.025em",
              boxShadow: "0 20px 25px -5px rgba(244, 63, 94, 0.08), 0 10px 10px -5px rgba(244, 63, 94, 0.04)",
              fontFamily: "Outfit, Inter, sans-serif",
            },
            success: {
              iconTheme: {
                primary: "#ec4899",
                secondary: "#ffffff",
              },
              style: {
                border: "1px solid rgba(236, 72, 153, 0.22)",
                color: "#db2777",
              },
            },
            error: {
              iconTheme: {
                primary: "#f43f5e",
                secondary: "#ffffff",
              },
              style: {
                border: "1px solid rgba(244, 63, 94, 0.22)",
                color: "#e11d48",
              },
            },
          }}
        />
      </div>
    </ErrorBoundary>
  );
}

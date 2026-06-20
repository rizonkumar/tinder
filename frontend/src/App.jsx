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
import DateDashboard from "./features/explore/DateDashboard";
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
      <div className="flex min-h-screen items-center justify-center bg-background">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="h-10 w-10 rounded-full border-2 border-border-strong border-t-foreground"
        />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="h-screen w-screen overflow-hidden bg-background text-foreground font-sans flex flex-col">
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
            <Route
              path="/dates"
              element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {authUser ? <DateDashboard /> : <Navigate to="/auth" />}
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
              background: "var(--background)",
              color: "var(--foreground)",
              borderRadius: "12px",
              border: "1px solid var(--border-strong)",
              padding: "12px 16px",
              fontWeight: "500",
              fontSize: "14px",
              boxShadow:
                "0 1px 1px rgba(0,0,0,0.02), 0 8px 16px -4px rgba(0,0,0,0.04), 0 24px 32px -8px rgba(0,0,0,0.06)",
              fontFamily: "Geist, Inter, sans-serif",
            },
            success: {
              iconTheme: {
                primary: "var(--green-700)",
                secondary: "var(--background)",
              },
            },
            error: {
              iconTheme: {
                primary: "var(--red-800)",
                secondary: "var(--background)",
              },
            },
          }}
        />
      </div>
    </ErrorBoundary>
  );
}

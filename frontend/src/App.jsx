import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuthStore } from "./store/useAuthStore";
import { useCallStore } from "./store/useCallStore";
import { useThemeStore } from "./store/useThemeStore";
import { ROUTES } from "./constants/navigation";
import { ProtectedRoute, GuestRoute } from "./components/layout/ProtectedRoute";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { Spinner } from "./components/ui/Skeleton";
import LandingPage from "./features/landing/LandingPage";
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

const PROTECTED_ROUTES = [
  { path: ROUTES.swipe, element: <HomePage /> },
  { path: ROUTES.profile, element: <ProfilePage /> },
  { path: ROUTES.chat, element: <ChatPage /> },
  { path: `${ROUTES.chat}/:id`, element: <ChatPage /> },
  { path: ROUTES.explore, element: <ExplorePage /> },
  { path: ROUTES.matches, element: <MatchesPage /> },
  { path: ROUTES.gold, element: <GoldHubPage /> },
  { path: ROUTES.dates, element: <DateDashboard /> },
];

function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="h-full"
    >
      {children}
    </motion.div>
  );
}

function AppRoutes() {
  const location = useLocation();
  const authUser = useAuthStore((state) => state.authUser);
  const transitionKey = location.pathname.startsWith(ROUTES.chat) ? ROUTES.chat : location.pathname;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={transitionKey}>
        <Route
          path={ROUTES.landing}
          element={authUser ? <Navigate to={ROUTES.swipe} replace /> : <PageTransition><LandingPage /></PageTransition>}
        />
        <Route
          path={ROUTES.auth}
          element={
            <GuestRoute>
              <PageTransition><AuthPage /></PageTransition>
            </GuestRoute>
          }
        />
        {PROTECTED_ROUTES.map(({ path, element }) => (
          <Route
            key={path}
            path={path}
            element={
              <ProtectedRoute>
                <PageTransition>{element}</PageTransition>
              </ProtectedRoute>
            }
          />
        ))}
        <Route path="/messages" element={<Navigate to={ROUTES.chat} replace />} />
        <Route path="/settings" element={<Navigate to={ROUTES.profile} replace />} />
        <Route path="/home" element={<Navigate to={ROUTES.swipe} replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const { checkAuth, checkingAuth } = useAuthStore();
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
      <div className="flex h-dvh items-center justify-center bg-background">
        <Spinner size={24} label="Loading Swipe" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="flex h-dvh w-full flex-col overflow-hidden bg-background font-sans text-foreground">
        <AppRoutes />
        <MatchCelebrationOverlay />
        <CallInterface />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "var(--surface)",
              color: "var(--foreground)",
              borderRadius: "10px",
              border: "1px solid var(--border-strong)",
              padding: "10px 14px",
              fontWeight: "500",
              fontSize: "14px",
              boxShadow: "var(--shadow-popover)",
              fontFamily: "Geist, Inter, sans-serif",
            },
            success: { iconTheme: { primary: "var(--success)", secondary: "var(--surface)" } },
            error: { iconTheme: { primary: "var(--danger)", secondary: "var(--surface)" } },
          }}
        />
      </div>
    </ErrorBoundary>
  );
}

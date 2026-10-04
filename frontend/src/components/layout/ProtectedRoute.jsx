import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { ROUTES } from "../../constants/navigation";

export function ProtectedRoute({ children }) {
  const authUser = useAuthStore((state) => state.authUser);
  const location = useLocation();
  if (!authUser) {
    return <Navigate to={ROUTES.auth} replace state={{ from: location.pathname }} />;
  }
  return children;
}

export function GuestRoute({ children }) {
  const authUser = useAuthStore((state) => state.authUser);
  if (authUser) {
    return <Navigate to={ROUTES.swipe} replace />;
  }
  return children;
}

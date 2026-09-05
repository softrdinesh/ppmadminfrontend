import { useEffect, useRef } from "react";
import { Navigate, useNavigate, Outlet } from "react-router";
import { getToken, isAuthenticated, getTokenExpiryMs, logout } from "../../utils/auth";

export default function ProtectedRoute() {
  const navigate = useNavigate();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const expiryMs = getTokenExpiryMs(token);
    if (!expiryMs) return;

    const remaining = expiryMs - Date.now();
    if (remaining <= 0) {
      logout(navigate, "Your session has expired. Please sign in again.");
      return;
    }

    timerRef.current = setTimeout(() => {
      logout(navigate, "Your session has expired. Please sign in again.");
    }, remaining);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [navigate]);

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
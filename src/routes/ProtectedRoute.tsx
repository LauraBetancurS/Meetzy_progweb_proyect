import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";

export default function ProtectedRoute() {
  const { session, isLoading } = useAppSelector((s) => s.auth);

  if (isLoading) return null; // o un loader bonito

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

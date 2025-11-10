import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";

type Props = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const { user, isLoading } = useAppSelector((s) => s.auth);
  const location = useLocation();

  // Wait until we know if user is logged in
  if (isLoading) return <div>Loading...</div>;

  // If not logged in → redirect to /login
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // If authenticated → render child routes
  return <>{children}</>;
}

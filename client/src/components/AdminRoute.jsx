import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function AdminRoute() {
  const { user, loading } = useAuth();

  // AuthContext এখনো load হচ্ছে
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#08090b] text-white">
        <p className="text-zinc-400">
          লোড হচ্ছে...
        </p>
      </div>
    );
  }

  // Login না করলে
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // Admin না হলে
  if (user.role !== "admin") {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return <Outlet />;
}

export default AdminRoute;
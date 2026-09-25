import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);

  // ========================================
  // LOGOUT
  // ========================================

  const handleLogout = () => {
    logout();

    setMenuOpen(false);

    navigate("/login", {
      replace: true,
    });
  };

  // ========================================
  // CLOSE MOBILE MENU
  // ========================================

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="fixed left-0 top-0 z-50 w-full border-b border-zinc-800/70 bg-[#08090b]/90 backdrop-blur-xl">

      {/* ================================== */}
      {/* NAV CONTAINER */}
      {/* ================================== */}

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 md:px-10">

        {/* ================================== */}
        {/* LOGO */}
        {/* ================================== */}

        <Link
          to="/"
          onClick={closeMenu}
          className="text-2xl font-bold tracking-tight text-white"
        >
          oniyom<span className="text-[#B7FF00]">.</span>
        </Link>

        {/* ================================== */}
        {/* DESKTOP NAV */}
        {/* ================================== */}

        <div className="hidden items-center gap-8 md:flex">

          <Link
            to="/"
            className="text-sm text-zinc-400 transition hover:text-white"
          >
            Home
          </Link>

          <Link
            to="/explore"
            className="text-sm text-zinc-400 transition hover:text-white"
          >
            Explore
          </Link>

          <Link
            to="/report"
            className="text-sm text-zinc-400 transition hover:text-white"
          >
            Report
          </Link>

          {/* Logged-in user */}

          {user && (
            <Link
              to="/my-reports"
              className="text-sm text-zinc-400 transition hover:text-white"
            >
              My Reports
            </Link>
          )}

          {user && (
            <Link
              to="/profile"
              className="text-sm text-zinc-400 transition hover:text-white"
            >
              Profile
            </Link>
          )}

          {/* Admin */}

          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="text-sm font-medium text-[#B7FF00] transition hover:opacity-80"
            >
              Admin
            </Link>
          )}

        </div>

        {/* ================================== */}
        {/* DESKTOP AUTH */}
        {/* ================================== */}

        <div className="hidden items-center gap-3 md:flex">

          {!user ? (
            <>
              <Link
                to="/login"
                className="rounded-lg border border-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:border-zinc-600 hover:text-white"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-lg bg-[#B7FF00] px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <span className="max-w-[140px] truncate text-sm text-zinc-500">
                {user.name}
              </span>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-red-500/20 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
              >
                Logout
              </button>
            </>
          )}

        </div>

        {/* ================================== */}
        {/* MOBILE MENU BUTTON */}
        {/* ================================== */}

        <button
          type="button"
          onClick={() =>
            setMenuOpen(!menuOpen)
          }
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 text-zinc-300 transition hover:border-zinc-600 hover:text-white md:hidden"
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <span className="text-2xl">
              ×
            </span>
          ) : (
            <span className="text-xl">
              ☰
            </span>
          )}
        </button>

      </div>

      {/* ================================== */}
      {/* MOBILE MENU */}
      {/* ================================== */}

      {menuOpen && (
        <div className="border-t border-zinc-800 bg-[#08090b] px-6 py-6 md:hidden">

          <div className="flex flex-col gap-2">

            <Link
              to="/"
              onClick={closeMenu}
              className="rounded-lg px-4 py-3 text-sm text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
            >
              Home
            </Link>

            <Link
              to="/explore"
              onClick={closeMenu}
              className="rounded-lg px-4 py-3 text-sm text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
            >
              Explore
            </Link>

            <Link
              to="/report"
              onClick={closeMenu}
              className="rounded-lg px-4 py-3 text-sm text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
            >
              Report
            </Link>

            {user && (
              <Link
                to="/my-reports"
                onClick={closeMenu}
                className="rounded-lg px-4 py-3 text-sm text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
              >
                My Reports
              </Link>
            )}

            {user && (
              <Link
                to="/profile"
                onClick={closeMenu}
                className="rounded-lg px-4 py-3 text-sm text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
              >
                Profile
              </Link>
            )}

            {user?.role === "admin" && (
              <Link
                to="/admin"
                onClick={closeMenu}
                className="rounded-lg px-4 py-3 font-medium text-[#B7FF00] transition hover:bg-zinc-900"
              >
                Admin Dashboard
              </Link>
            )}

            <div className="my-3 h-px bg-zinc-800" />

            {!user ? (
              <div className="grid grid-cols-2 gap-3">

                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="rounded-lg border border-zinc-800 px-4 py-3 text-center text-sm font-medium text-zinc-300"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="rounded-lg bg-[#B7FF00] px-4 py-3 text-center text-sm font-semibold text-black"
                >
                  Register
                </Link>

              </div>
            ) : (
              <div>

                <div className="mb-3 px-4">

                  <p className="text-xs text-zinc-600">
                    Logged in as
                  </p>

                  <p className="mt-1 truncate text-sm text-zinc-300">
                    {user.name}
                  </p>

                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full rounded-lg border border-red-500/20 px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
                >
                  Logout
                </button>

              </div>
            )}

          </div>

        </div>
      )}

    </nav>
  );
}

export default Navbar;
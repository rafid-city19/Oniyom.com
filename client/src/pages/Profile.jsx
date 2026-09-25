import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("User data error:", error);
      }
    }

    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", {
      replace: true,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08090b] px-6 py-20 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-zinc-400">
            Profile loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08090b] px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl">

        {/* BACK */}

        <Link
          to="/"
          className="text-sm text-zinc-500 transition hover:text-[#B7FF00]"
        >
          ← Home
        </Link>

        {/* HEADER */}

        <div className="mt-10">
          <p className="text-sm font-medium tracking-[0.2em] text-[#B7FF00]">
            ACCOUNT
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            My Profile
          </h1>

          <p className="mt-3 text-zinc-500">
            আপনার account information এখানে দেখতে পারবেন।
          </p>
        </div>

        {/* PROFILE CARD */}

        <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-950 p-6">

          {/* AVATAR */}

          <div className="flex items-center gap-5 border-b border-zinc-800 pb-6">

            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#B7FF00] text-2xl font-bold text-black">
              {user?.name
                ? user.name.charAt(0).toUpperCase()
                : "U"}
            </div>

            <div>
              <h2 className="text-xl font-semibold">
                {user?.name || "User"}
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Oniyom User
              </p>
            </div>

          </div>

          {/* INFORMATION */}

          <div className="mt-6 space-y-5">

            {/* NAME */}

            <div>
              <p className="text-xs uppercase tracking-wider text-zinc-600">
                Name
              </p>

              <p className="mt-1 text-zinc-200">
                {user?.name || "Not available"}
              </p>
            </div>

            {/* EMAIL */}

            <div>
              <p className="text-xs uppercase tracking-wider text-zinc-600">
                Email
              </p>

              <p className="mt-1 text-zinc-200">
                {user?.email || "Not available"}
              </p>
            </div>

          </div>

        </div>

        {/* ACTIONS */}

        <div className="mt-6 grid gap-3 sm:grid-cols-2">

          <Link
            to="/my-reports"
            className="rounded-xl border border-zinc-800 px-5 py-3 text-center text-sm font-medium text-zinc-300 transition hover:border-zinc-600 hover:text-white"
          >
            My Reports
          </Link>

          <Link
            to="/report"
            className="rounded-xl bg-[#B7FF00] px-5 py-3 text-center text-sm font-semibold text-black transition hover:opacity-90"
          >
            + Create Report
          </Link>

        </div>

        {/* LOGOUT */}

        <button
          type="button"
          onClick={handleLogout}
          className="mt-4 w-full rounded-xl border border-red-500/20 px-5 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
        >
          Logout
        </button>

      </div>
    </div>
  );
}

export default Profile;
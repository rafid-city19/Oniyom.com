import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            phone,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Login failed"
        );
      }

      // Save authentication data
      login(data);

      // Redirect
      if (data.user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);

      setError(
        error.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#08090b] px-6 text-white">

      <div className="w-full max-w-md">

        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold">
            Welcome Back
          </h1>

          <p className="mt-2 text-zinc-500">
            Login to your Oniyom account
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6"
        >

          {error && (
            <div className="mb-5 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* PHONE */}

          <div className="mb-5">
            <label className="mb-2 block text-sm text-zinc-400">
              Phone Number
            </label>

            <input
              type="tel"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              placeholder="01XXXXXXXXX"
              required
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-lime-400"
            />
          </div>

          {/* PASSWORD */}

          <div className="mb-3">
            <label className="mb-2 block text-sm text-zinc-400">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Enter your password"
              required
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-lime-400"
            />
          </div>

          {/* FORGOT PASSWORD */}

          <div className="mb-6 text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-lime-400 transition hover:text-lime-300"
            >
              Forgot password?
            </Link>
          </div>

          {/* LOGIN */}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-lime-400 py-3 font-semibold text-black transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

          {/* REGISTER */}

          <p className="mt-6 text-center text-sm text-zinc-500">
            Don't have an account?{" "}

            <Link
              to="/register"
              className="text-lime-400 hover:text-lime-300"
            >
              Register
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
}

export default Login;
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Check API URL
    const API_URL = import.meta.env.VITE_API_URL;

    if (!API_URL) {
      setError("API URL is not configured.");
      console.error("VITE_API_URL is missing.");
      return;
    }

    // Check passwords
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Basic password validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/auth/register`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name,
            phone,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Registration failed"
        );
      }

      // Automatically login after registration
      login(data);

      navigate("/");
    } catch (error) {
      console.error("Register error:", error);

      setError(
        error.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#08090b] px-6 py-12 text-white">

      <div className="w-full max-w-md">

        <div className="mb-8 text-center">

          <h1 className="text-4xl font-bold">
            Create Account
          </h1>

          <p className="mt-2 text-zinc-500">
            Join Oniyom today
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

          {/* NAME */}
          <div className="mb-5">

            <label className="mb-2 block text-sm text-zinc-400">
              Full Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-lime-400"
            />

          </div>

          {/* PHONE */}
          <div className="mb-5">

            <label className="mb-2 block text-sm text-zinc-400">
              Phone Number
            </label>

            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="01XXXXXXXXX"
              required
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-lime-400"
            />

          </div>

          {/* PASSWORD */}
          <div className="mb-5">

            <label className="mb-2 block text-sm text-zinc-400">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              required
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-lime-400"
            />

          </div>

          {/* CONFIRM PASSWORD */}
          <div className="mb-6">

            <label className="mb-2 block text-sm text-zinc-400">
              Confirm Password
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              placeholder="Confirm your password"
              required
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-lime-400"
            />

          </div>

          {/* REGISTER */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-lime-400 py-3 font-semibold text-black transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Creating account..."
              : "Create Account"}
          </button>

          {/* LOGIN */}
          <p className="mt-6 text-center text-sm text-zinc-500">

            Already have an account?{" "}

            <Link
              to="/login"
              className="text-lime-400 hover:text-lime-300"
            >
              Login
            </Link>

          </p>

        </form>
      </div>
    </div>
  );
}

export default Register;
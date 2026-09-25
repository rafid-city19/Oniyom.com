import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();

  const { user, login } = useAuth();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user) {
      navigate("/my-reports", {
        replace: true,
      });
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        "http://import.meta.env.VITE_API_URL/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            phone: phone.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      console.log(
        "Login response:",
        data
      );

      if (!response.ok) {
        setError(
          data.message ||
            "লগইন করা যায়নি"
        );

        return;
      }

      if (!data.token) {
        setError(
          "Login সফল হয়েছে, কিন্তু token পাওয়া যায়নি"
        );

        console.error(
          "No token received:",
          data
        );

        return;
      }

      if (!data.user) {
        setError(
          "Login সফল হয়েছে, কিন্তু user তথ্য পাওয়া যায়নি"
        );

        console.error(
          "No user received:",
          data
        );

        return;
      }

      login(
        data.token,
        data.user
      );

      setSuccess(
        "লগইন সফল হয়েছে"
      );

      console.log(
        "Logged in user:",
        data.user
      );

      setTimeout(() => {
        navigate("/my-reports", {
          replace: true,
        });
      }, 500);
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      setError(
        "সার্ভারের সাথে সংযোগ করা যাচ্ছে না"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#08090b] px-6 pt-20 text-white">

      <div className="w-full max-w-md">

        {/* Header */}

        <div className="mb-8 text-center">

          <h1 className="text-4xl font-bold">
            আবার স্বাগতম
          </h1>

          <p className="mt-3 text-zinc-400">
            আপনার Oniyom অ্যাকাউন্টে লগইন করুন
          </p>

        </div>


        {/* Form */}

        <form
          onSubmit={handleLogin}
          className="space-y-5 rounded-2xl border border-zinc-800 bg-zinc-950 p-6"
        >

          {/* Error */}

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}


          {/* Success */}

          {success && (
            <div className="rounded-lg border border-[#B7FF00]/30 bg-[#B7FF00]/10 px-4 py-3 text-sm text-[#B7FF00]">
              {success}
            </div>
          )}


          {/* Phone */}

          <div>

            <label className="mb-2 block text-sm text-zinc-300">
              ফোন নম্বর
            </label>

            <input
              type="tel"
              placeholder="01XXXXXXXXX"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              required
              autoComplete="tel"
              inputMode="tel"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-[#B7FF00] focus:ring-1 focus:ring-[#B7FF00]"
            />

          </div>


          {/* Password */}

          <div>

            <label className="mb-2 block text-sm text-zinc-300">
              পাসওয়ার্ড
            </label>

            <input
              type="password"
              placeholder="আপনার পাসওয়ার্ড"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-[#B7FF00] focus:ring-1 focus:ring-[#B7FF00]"
            />

          </div>


          {/* Forgot Password */}

          <div className="text-right">

            <Link
              to="/forgot-password"
              className="text-sm text-zinc-400 transition hover:text-[#B7FF00]"
            >
              পাসওয়ার্ড ভুলে গেছেন?
            </Link>

          </div>


          {/* Login Button */}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#B7FF00] px-4 py-3 font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "লগইন হচ্ছে..."
              : "লগইন"}
          </button>


          {/* Register */}

          <p className="text-center text-sm text-zinc-400">

            অ্যাকাউন্ট নেই?{" "}

            <Link
              to="/register"
              className="text-[#B7FF00] hover:underline"
            >
              রেজিস্টার করুন
            </Link>

          </p>

        </form>

      </div>

    </div>
  );
}

export default Login;
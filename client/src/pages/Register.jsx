import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();

  const { user, login } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      navigate("/my-reports", {
        replace: true,
      });
    }
  }, [user, navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");

    if (name.trim().length < 2) {
      setError("সঠিক নাম দিন");
      return;
    }

    if (!phone.trim()) {
      setError("ফোন নম্বর দিন");
      return;
    }

    if (password.length < 6) {
      setError(
        "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে"
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        "দুইটি পাসওয়ার্ড একই নয়"
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: name.trim(),
            phone: phone.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      console.log(
        "Register response:",
        data
      );

      if (!response.ok) {
        setError(
          data.message ||
            "রেজিস্টার করা যায়নি"
        );

        return;
      }

      if (!data.token) {
        setError(
          "অ্যাকাউন্ট তৈরি হয়েছে, কিন্তু token পাওয়া যায়নি"
        );

        console.error(
          "No token received:",
          data
        );

        return;
      }

      if (!data.user) {
        setError(
          "অ্যাকাউন্ট তৈরি হয়েছে, কিন্তু user তথ্য পাওয়া যায়নি"
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

      navigate("/my-reports", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Register error:",
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
    <div className="flex min-h-screen items-center justify-center bg-[#08090b] px-6 py-24 text-white">

      <div className="w-full max-w-md">

        {/* Header */}

        <div className="mb-8 text-center">

          <h1 className="text-4xl font-bold">
            অ্যাকাউন্ট তৈরি করুন
          </h1>

          <p className="mt-3 text-zinc-400">
            Oniyom-এর সাথে যুক্ত হোন
          </p>

        </div>


        {/* Form */}

        <form
          onSubmit={handleRegister}
          className="space-y-5 rounded-2xl border border-zinc-800 bg-zinc-950 p-6"
        >

          {/* Error */}

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}


          {/* Name */}

          <div>

            <label className="mb-2 block text-sm text-zinc-300">
              নাম
            </label>

            <input
              type="text"
              placeholder="আপনার নাম"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              required
              autoComplete="name"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-[#B7FF00] focus:ring-1 focus:ring-[#B7FF00]"
            />

          </div>


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

            <p className="mt-2 text-xs text-zinc-600">
              আপনার সক্রিয় ফোন নম্বর ব্যবহার করুন
            </p>

          </div>


          {/* Password */}

          <div>

            <label className="mb-2 block text-sm text-zinc-300">
              পাসওয়ার্ড
            </label>

            <input
              type="password"
              placeholder="কমপক্ষে ৬ অক্ষর"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
              minLength={6}
              autoComplete="new-password"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-[#B7FF00] focus:ring-1 focus:ring-[#B7FF00]"
            />

          </div>


          {/* Confirm Password */}

          <div>

            <label className="mb-2 block text-sm text-zinc-300">
              পাসওয়ার্ড আবার দিন
            </label>

            <input
              type="password"
              placeholder="পাসওয়ার্ড আবার লিখুন"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              required
              minLength={6}
              autoComplete="new-password"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-[#B7FF00] focus:ring-1 focus:ring-[#B7FF00]"
            />

          </div>


          {/* Submit */}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#B7FF00] px-4 py-3 font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "অ্যাকাউন্ট তৈরি হচ্ছে..."
              : "রেজিস্টার"}
          </button>


          {/* Login link */}

          <p className="text-center text-sm text-zinc-400">

            আগে থেকেই অ্যাকাউন্ট আছে?{" "}

            <Link
              to="/login"
              className="text-[#B7FF00] hover:underline"
            >
              লগইন করুন
            </Link>

          </p>

        </form>

      </div>

    </div>
  );
}

export default Register;
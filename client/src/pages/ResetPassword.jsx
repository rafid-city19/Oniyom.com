import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function ResetPassword() {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const savedPhone =
      sessionStorage.getItem("resetPhone");

    if (!savedPhone) {
      navigate("/forgot-password", {
        replace: true,
      });

      return;
    }

    setPhone(savedPhone);
  }, [navigate]);

  const handleReset = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (otp.length !== 6) {
      setError("৬ সংখ্যার OTP দিন");
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
        "http://localhost:5000/api/auth/reset-password",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            phone: phone.trim(),
            otp: otp.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      console.log(
        "Reset password response:",
        data
      );

      if (!response.ok) {
        setError(
          data.message ||
            "পাসওয়ার্ড পরিবর্তন করা যায়নি"
        );

        return;
      }

      setSuccess(
        "পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে"
      );

      sessionStorage.removeItem(
        "resetPhone"
      );

      setTimeout(() => {
        navigate("/login", {
          replace: true,
        });
      }, 1500);
    } catch (error) {
      console.error(
        "Reset password error:",
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
            নতুন পাসওয়ার্ড
          </h1>

          <p className="mt-3 text-zinc-400">
            OTP দিয়ে আপনার পাসওয়ার্ড পরিবর্তন করুন
          </p>

        </div>


        {/* Form */}

        <form
          onSubmit={handleReset}
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
              value={phone}
              readOnly
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-zinc-400 outline-none"
            />

          </div>


          {/* OTP */}

          <div>

            <label className="mb-2 block text-sm text-zinc-300">
              OTP
            </label>

            <input
              type="text"
              placeholder="৬ সংখ্যার OTP"
              value={otp}
              onChange={(e) => {
                const value =
                  e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 6);

                setOtp(value);
              }}
              required
              inputMode="numeric"
              maxLength={6}
              autoComplete="one-time-code"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-center text-xl tracking-[0.4em] text-white outline-none transition placeholder:text-zinc-600 placeholder:tracking-normal focus:border-[#B7FF00] focus:ring-1 focus:ring-[#B7FF00]"
            />

            <p className="mt-2 text-xs text-zinc-600">
              Development mode-এ OTP backend terminal-এ দেখাবে
            </p>

          </div>


          {/* New Password */}

          <div>

            <label className="mb-2 block text-sm text-zinc-300">
              নতুন পাসওয়ার্ড
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
              ? "পাসওয়ার্ড পরিবর্তন হচ্ছে..."
              : "পাসওয়ার্ড পরিবর্তন করুন"}
          </button>


          {/* Back */}

          <p className="text-center text-sm text-zinc-400">

            লগইনে ফিরে যেতে চান?{" "}

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

export default ResetPassword;
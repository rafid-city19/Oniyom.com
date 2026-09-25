import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function ForgotPassword() {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/forgot-password",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            phone: phone.trim(),
          }),
        }
      );

      const data = await response.json();

      console.log(
        "Forgot password response:",
        data
      );

      if (!response.ok) {
        setError(
          data.message ||
            "OTP পাঠানো যায়নি"
        );

        return;
      }

      setSuccess(
        "যদি এই নম্বরে অ্যাকাউন্ট থাকে, তাহলে OTP পাঠানো হয়েছে"
      );

      // Save phone temporarily so the next page
      // knows which account is being reset.
      sessionStorage.setItem(
        "resetPhone",
        phone.trim()
      );

      setTimeout(() => {
        navigate("/reset-password");
      }, 1000);
    } catch (error) {
      console.error(
        "Forgot password error:",
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
            পাসওয়ার্ড ভুলে গেছেন?
          </h1>

          <p className="mt-3 text-zinc-400">
            আপনার ফোন নম্বর দিন
          </p>

        </div>


        {/* Form */}

        <form
          onSubmit={handleSubmit}
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


          {/* Submit */}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#B7FF00] px-4 py-3 font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "OTP পাঠানো হচ্ছে..."
              : "OTP পাঠান"}
          </button>


          {/* Back to Login */}

          <p className="text-center text-sm text-zinc-400">

            পাসওয়ার্ড মনে আছে?{" "}

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

export default ForgotPassword;
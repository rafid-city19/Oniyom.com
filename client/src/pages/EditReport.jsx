import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import LocationPicker from "../components/LocationPicker";

function EditReport() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    address: "",
    latitude: null,
    longitude: null,
  });

  const [currentImage, setCurrentImage] =
    useState("");

  const [newImage, setNewImage] =
    useState(null);

  const categories = [
    "রাস্তা",
    "পানি",
    "বিদ্যুৎ",
    "ড্রেনেজ",
    "ময়লা",
    "নিরাপত্তা",
    "অন্যান্য",
  ];

  // ========================================
  // FETCH REPORT
  // ========================================

  useEffect(() => {
    const fetchReport = async () => {
      const token =
        localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          `http://import.meta.env.VITE_API_URL/api/reports/${id}`
        );

        const data =
          await response.json();

        if (!response.ok) {
          setError(
            data.message ||
              "রিপোর্ট পাওয়া যায়নি"
          );
          return;
        }

        const report = data.report;

        setFormData({
          title: report.title || "",
          description:
            report.description || "",
          category: report.category || "",
          address:
            report.location?.address || "",
          latitude:
            report.location?.latitude ??
            null,
          longitude:
            report.location?.longitude ??
            null,
        });

        setCurrentImage(
          report.image || ""
        );
      } catch (error) {
        console.error(
          "Fetch report error:",
          error
        );

        setError(
          "সার্ভারের সাথে সংযোগ করা যাচ্ছে না"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id, navigate]);

  // ========================================
  // HANDLE INPUT
  // ========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ========================================
  // HANDLE MAP LOCATION
  // ========================================

  const handleLocationChange = ({
    latitude,
    longitude,
  }) => {
    setFormData((previous) => ({
      ...previous,
      latitude,
      longitude,
    }));
  };

  // ========================================
  // HANDLE IMAGE
  // ========================================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    setNewImage(file);
  };

  // ========================================
  // UPDATE REPORT
  // ========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token =
      localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const body = new FormData();

      body.append(
        "title",
        formData.title
      );

      body.append(
        "description",
        formData.description
      );

      body.append(
        "category",
        formData.category
      );

      body.append(
        "location",
        JSON.stringify({
          address: formData.address,
          latitude:
            formData.latitude,
          longitude:
            formData.longitude,
        })
      );

      if (newImage) {
        body.append(
          "image",
          newImage
        );
      }

      const response = await fetch(
        `http://import.meta.env.VITE_API_URL/api/reports/my-reports/${id}`,
        {
          method: "PUT",

          headers: {
            Authorization: `Bearer ${token}`,
          },

          body,
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "রিপোর্ট আপডেট করা যায়নি"
        );
        return;
      }

      setSuccess(
        "রিপোর্ট সফলভাবে আপডেট হয়েছে"
      );

      if (data.report?.image) {
        setCurrentImage(
          data.report.image
        );
      }

      setNewImage(null);

      setTimeout(() => {
        navigate("/my-reports");
      }, 1000);
    } catch (error) {
      console.error(
        "Update report error:",
        error
      );

      setError(
        "সার্ভারের সাথে সংযোগ করা যাচ্ছে না"
      );
    } finally {
      setSaving(false);
    }
  };

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#08090b] text-white">
        <p className="text-zinc-400">
          রিপোর্ট লোড হচ্ছে...
        </p>
      </div>
    );
  }

  // ========================================
  // PAGE
  // ========================================

  return (
    <div className="min-h-screen bg-[#08090b] px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl">

        {/* BACK */}

        <Link
          to="/my-reports"
          className="text-sm text-zinc-500 transition hover:text-[#B7FF00]"
        >
          ← আমার রিপোর্ট
        </Link>

        {/* HEADER */}

        <div className="mt-10">
          <p className="text-sm font-medium tracking-[0.2em] text-[#B7FF00]">
            EDIT REPORT
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            রিপোর্ট এডিট করুন
          </h1>

          <p className="mt-3 text-zinc-500">
            আপনার রিপোর্টের তথ্য পরিবর্তন
            করুন।
          </p>
        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-6"
        >

          {/* ERROR */}

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* SUCCESS */}

          {success && (
            <div className="rounded-lg border border-[#B7FF00]/30 bg-[#B7FF00]/10 px-4 py-3 text-sm text-[#B7FF00]">
              {success}
            </div>
          )}

          {/* TITLE */}

          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              সমস্যার শিরোনাম
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="যেমন: রাস্তার বড় গর্ত"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-[#B7FF00] focus:ring-1 focus:ring-[#B7FF00]"
            />
          </div>

          {/* CATEGORY */}

          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              সমস্যার ধরন
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-[#B7FF00] focus:ring-1 focus:ring-[#B7FF00]"
            >
              <option value="">
                সমস্যা নির্বাচন করুন
              </option>

              {categories.map(
                (category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                )
              )}
            </select>
          </div>

          {/* DESCRIPTION */}

          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              বিস্তারিত
            </label>

            <textarea
              name="description"
              value={
                formData.description
              }
              onChange={handleChange}
              required
              rows={6}
              placeholder="সমস্যাটি বিস্তারিত লিখুন..."
              className="w-full resize-none rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-[#B7FF00] focus:ring-1 focus:ring-[#B7FF00]"
            />
          </div>

          {/* ADDRESS */}

          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              ঠিকানা
            </label>

            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="যেমন: মোহাম্মদপুর, ঢাকা"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-[#B7FF00] focus:ring-1 focus:ring-[#B7FF00]"
            />
          </div>

          {/* LOCATION MAP */}

          <div>
            <label className="mb-3 block text-sm text-zinc-300">
              সমস্যার অবস্থান
            </label>

            <LocationPicker
              latitude={
                formData.latitude
              }
              longitude={
                formData.longitude
              }
              onLocationChange={
                handleLocationChange
              }
            />
          </div>

          {/* CURRENT IMAGE */}

          {currentImage && (
            <div>
              <label className="mb-3 block text-sm text-zinc-300">
                বর্তমান ছবি
              </label>

              <div className="overflow-hidden rounded-xl border border-zinc-800">
                <img
                  src={`http://import.meta.env.VITE_API_URL${currentImage}`}
                  alt="Current report"
                  className="max-h-80 w-full object-cover"
                />
              </div>
            </div>
          )}

          {/* NEW IMAGE */}

          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              নতুন ছবি
            </label>

            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={
                handleImageChange
              }
              className="block w-full cursor-pointer rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-400 file:mr-4 file:rounded-md file:border-0 file:bg-[#B7FF00] file:px-4 file:py-2 file:font-semibold file:text-black hover:file:opacity-90"
            />

            <p className="mt-2 text-xs text-zinc-600">
              JPG, JPEG, PNG অথবা WEBP •
              সর্বোচ্চ 5MB
            </p>

            {newImage && (
              <p className="mt-2 text-sm text-[#B7FF00]">
                Selected:{" "}
                {newImage.name}
              </p>
            )}
          </div>

          {/* BUTTONS */}

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">

            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-lg bg-[#B7FF00] px-5 py-3 font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "আপডেট হচ্ছে..."
                : "পরিবর্তন সংরক্ষণ করুন"}
            </button>

            <Link
              to="/my-reports"
              className="flex-1 rounded-lg border border-zinc-800 px-5 py-3 text-center font-medium text-zinc-300 transition hover:border-zinc-600 hover:text-white"
            >
              বাতিল
            </Link>

          </div>

        </form>
      </div>
    </div>
  );
}

export default EditReport;
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import LocationPicker from "../components/LocationPicker";

function Report() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [address, setAddress] = useState("");

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // LOCATION
  // ==========================================

  const handleLocationChange = ({
    latitude,
    longitude,
  }) => {
    setLatitude(latitude);
    setLongitude(longitude);
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("title", title);
      formData.append(
        "description",
        description
      );
      formData.append("category", category);

      formData.append(
        "location[address]",
        address
      );

      if (latitude !== "") {
        formData.append(
          "location[latitude]",
          latitude
        );
      }

      if (longitude !== "") {
        formData.append(
          "location[longitude]",
          longitude
        );
      }

      if (image) {
        formData.append("image", image);
      }

      const response = await fetch(
        "http://localhost:5000/api/reports",
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
          },

          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "রিপোর্ট জমা দেওয়া যায়নি"
        );
        return;
      }

      setSuccess(
        "রিপোর্ট সফলভাবে জমা হয়েছে"
      );

      setTitle("");
      setDescription("");
      setCategory("");
      setAddress("");
      setLatitude("");
      setLongitude("");
      setImage(null);

      setTimeout(() => {
        navigate("/my-reports");
      }, 1000);

    } catch (error) {
      console.error(
        "Report submit error:",
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
    <div className="min-h-screen bg-[#08090b] px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl">

        {/* Back */}

        <Link
          to="/"
          className="text-sm text-zinc-400 transition hover:text-[#B7FF00]"
        >
          ← হোমে ফিরে যান
        </Link>

        {/* Header */}

        <div className="mt-8">
          <p className="text-sm font-medium tracking-wider text-[#B7FF00]">
            ONIYOM.
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            সমস্যা রিপোর্ট করুন
          </h1>

          <p className="mt-3 text-zinc-400">
            আপনার এলাকার সমস্যাটি বিস্তারিতভাবে জানান।
          </p>
        </div>

        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-6"
        >

          {/* Title */}

          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              সমস্যার শিরোনাম
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="যেমন: রাস্তার বড় গর্ত"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-[#B7FF00]"
              required
            />
          </div>

          {/* Category */}

          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              ক্যাটাগরি
            </label>

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-[#B7FF00]"
              required
            >
              <option value="">
                ক্যাটাগরি নির্বাচন করুন
              </option>

              <option value="রাস্তা">
                রাস্তা
              </option>

              <option value="পানি">
                পানি
              </option>

              <option value="বিদ্যুৎ">
                বিদ্যুৎ
              </option>

              <option value="ড্রেনেজ">
                ড্রেনেজ
              </option>

              <option value="ময়লা">
                ময়লা
              </option>

              <option value="নিরাপত্তা">
                নিরাপত্তা
              </option>

              <option value="অন্যান্য">
                অন্যান্য
              </option>
            </select>
          </div>

          {/* Description */}

          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              সমস্যার বিস্তারিত বিবরণ
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              placeholder="সমস্যাটি কোথায় এবং কী ধরনের সমস্যা তা লিখুন..."
              rows={6}
              className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-[#B7FF00]"
              required
            />
          </div>

          {/* Image */}

          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              সমস্যার ছবি
              <span className="ml-2 text-zinc-600">
                (ঐচ্ছিক)
              </span>
            </label>

            <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-950 p-5">

              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={(e) =>
                  setImage(
                    e.target.files?.[0] ||
                      null
                  )
                }
                className="block w-full text-sm text-zinc-400 file:mr-4 file:rounded-lg file:border-0 file:bg-[#B7FF00] file:px-4 file:py-2 file:font-semibold file:text-black"
              />

              <p className="mt-3 text-xs text-zinc-600">
                JPG, PNG অথবা WEBP — সর্বোচ্চ 5MB
              </p>

              {image && (
                <p className="mt-2 text-sm text-[#B7FF00]">
                  নির্বাচিত: {image.name}
                </p>
              )}

            </div>
          </div>

          {/* Address */}

          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              অবস্থান / ঠিকানা
            </label>

            <input
              type="text"
              value={address}
              onChange={(e) =>
                setAddress(e.target.value)
              }
              placeholder="যেমন: মিরপুর ১০, ঢাকা"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-[#B7FF00]"
            />
          </div>

          {/* MAP */}

          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              সমস্যার অবস্থান
            </label>

            <LocationPicker
              latitude={latitude}
              longitude={longitude}
              onLocationChange={
                handleLocationChange
              }
            />
          </div>

          {/* Error */}

          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Success */}

          {success && (
            <div className="rounded-xl border border-[#B7FF00]/20 bg-[#B7FF00]/10 p-4 text-sm text-[#B7FF00]">
              {success}
            </div>
          )}

          {/* Submit */}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#B7FF00] px-6 py-4 font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "রিপোর্ট জমা হচ্ছে..."
              : "রিপোর্ট জমা দিন"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default Report;
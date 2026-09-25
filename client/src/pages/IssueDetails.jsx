import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  MapContainer,
  Marker,
  TileLayer,
} from "react-leaflet";

function IssueDetails() {
  const { id } = useParams();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(
          `http://import.meta.env.VITE_API_URL/api/reports/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          setError(
            data.message ||
              "রিপোর্ট পাওয়া যায়নি"
          );

          return;
        }

        setReport(data.report);
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
  }, [id]);

  // ========================================
  // STATUS
  // ========================================

  const getStatusText = (status) => {
    if (status === "resolved") {
      return "সমাধান হয়েছে";
    }

    if (status === "reviewing") {
      return "পর্যালোচনা চলছে";
    }

    return "অপেক্ষমাণ";
  };

  const getStatusClass = (status) => {
    if (status === "resolved") {
      return "border-[#B7FF00]/30 bg-[#B7FF00]/10 text-[#B7FF00]";
    }

    if (status === "reviewing") {
      return "border-yellow-500/30 bg-yellow-500/10 text-yellow-400";
    }

    return "border-zinc-700 bg-zinc-900 text-zinc-400";
  };

  // ========================================
  // DATE
  // ========================================

  const formatDate = (date) => {
    if (!date) {
      return "তারিখ পাওয়া যায়নি";
    }

    return new Date(date).toLocaleDateString(
      "bn-BD",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
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
  // ERROR
  // ========================================

  if (error || !report) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#08090b] px-6 text-white">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">
            রিপোর্ট পাওয়া যায়নি
          </h1>

          <p className="mt-3 text-zinc-500">
            {error ||
              "এই রিপোর্টটি আর পাওয়া যাচ্ছে না।"}
          </p>

          <Link
            to="/my-reports"
            className="mt-6 inline-block rounded-lg bg-[#B7FF00] px-5 py-3 font-semibold text-black"
          >
            আমার রিপোর্টে ফিরে যান
          </Link>
        </div>
      </div>
    );
  }

  const latitude =
    report.location?.latitude;

  const longitude =
    report.location?.longitude;

  const hasLocation =
    latitude !== null &&
    latitude !== undefined &&
    longitude !== null &&
    longitude !== undefined;

  return (
    <div className="min-h-screen bg-[#08090b] px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">

        {/* BACK */}

        <Link
          to="/my-reports"
          className="text-sm text-zinc-500 transition hover:text-[#B7FF00]"
        >
          ← আমার রিপোর্ট
        </Link>

        {/* HEADER */}

        <div className="mt-10">
          <div className="flex flex-wrap items-center gap-3">

            <span className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs text-zinc-400">
              {report.category}
            </span>

            <span
              className={`rounded-full border px-3 py-1 text-xs ${getStatusClass(
                report.status
              )}`}
            >
              {getStatusText(
                report.status
              )}
            </span>

          </div>

          <h1 className="mt-5 text-3xl font-bold md:text-5xl">
            {report.title}
          </h1>

          <p className="mt-3 text-sm text-zinc-500">
            রিপোর্ট করা হয়েছে{" "}
            {formatDate(
              report.createdAt
            )}
          </p>
        </div>

        {/* IMAGE */}

        {report.image && (
          <div className="mt-10 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
            <img
              src={`http://import.meta.env.VITE_API_URL${report.image}`}
              alt={report.title}
              className="max-h-[550px] w-full object-cover"
            />
          </div>
        )}

        {/* DESCRIPTION */}

        <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950 p-6 md:p-8">

          <p className="text-xs font-medium tracking-[0.2em] text-[#B7FF00]">
            DESCRIPTION
          </p>

          <p className="mt-4 whitespace-pre-wrap leading-8 text-zinc-300">
            {report.description}
          </p>

        </div>

        {/* LOCATION */}

        <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950 p-6 md:p-8">

          <div>
            <p className="text-xs font-medium tracking-[0.2em] text-[#B7FF00]">
              LOCATION
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              সমস্যার অবস্থান
            </h2>
          </div>

          {report.location?.address && (
            <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <p className="text-xs text-zinc-600">
                ঠিকানা
              </p>

              <p className="mt-1 text-zinc-300">
                {report.location.address}
              </p>
            </div>
          )}

          {hasLocation ? (
            <>
              <div className="mt-5 overflow-hidden rounded-xl border border-zinc-800">
                <MapContainer
                  center={[
                    Number(latitude),
                    Number(longitude),
                  ]}
                  zoom={15}
                  scrollWheelZoom={false}
                  className="h-[400px] w-full"
                >
                  <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  <Marker
                    position={[
                      Number(latitude),
                      Number(longitude),
                    ]}
                  />
                </MapContainer>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-zinc-600">
                    Latitude
                  </p>

                  <p className="mt-1 text-sm text-zinc-400">
                    {Number(latitude).toFixed(
                      6
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-zinc-600">
                    Longitude
                  </p>

                  <p className="mt-1 text-sm text-zinc-400">
                    {Number(longitude).toFixed(
                      6
                    )}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-900 p-6 text-center">
              <p className="text-zinc-500">
                এই রিপোর্টের জন্য কোনো map
                location দেওয়া হয়নি।
              </p>
            </div>
          )}
        </div>

        {/* REPORTER */}

        <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950 p-6 md:p-8">

          <p className="text-xs font-medium tracking-[0.2em] text-[#B7FF00]">
            REPORTED BY
          </p>

          <div className="mt-5 flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#B7FF00] font-bold text-black">
              {report.user?.name
                ? report.user.name
                    .charAt(0)
                    .toUpperCase()
                : "U"}
            </div>

            <div>
              <p className="font-medium text-white">
                {report.user?.name ||
                  "Unknown User"}
              </p>

              {report.user?.email && (
                <p className="mt-1 text-sm text-zinc-500">
                  {report.user.email}
                </p>
              )}
            </div>

          </div>
        </div>

        {/* ACTIONS */}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">

          <Link
            to="/my-reports"
            className="flex-1 rounded-xl border border-zinc-800 px-5 py-3 text-center text-sm font-medium text-zinc-300 transition hover:border-zinc-600 hover:text-white"
          >
            ← আমার রিপোর্ট
          </Link>

          <Link
            to={`/edit-report/${report._id}`}
            className="flex-1 rounded-xl bg-[#B7FF00] px-5 py-3 text-center text-sm font-semibold text-black transition hover:opacity-90"
          >
            রিপোর্ট এডিট করুন
          </Link>

        </div>

      </div>
    </div>
  );
}

export default IssueDetails;
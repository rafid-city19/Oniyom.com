import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  CircleMarker,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";

import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});


// ========================================
// Map Controller
// ========================================

function MapController({ position }) {
  const map = useMap();

  useEffect(() => {
    if (!position) return;

    map.setView(
      [position.lat, position.lng],
      14,
      {
        animate: true,
      }
    );
  }, [position, map]);

  return null;
}


// ========================================
// Calculate distance
// ========================================

function calculateDistance(
  lat1,
  lon1,
  lat2,
  lon2
) {
  const earthRadius = 6371;

  const dLat =
    ((lat2 - lat1) * Math.PI) / 180;

  const dLon =
    ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) *
      Math.sin(dLat / 2) +
    Math.cos(
      (lat1 * Math.PI) / 180
    ) *
      Math.cos(
        (lat2 * Math.PI) / 180
      ) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return earthRadius * c;
}


// ========================================
// Explore
// ========================================

function Explore() {
  const [reports, setReports] = useState([]);

  const [search, setSearch] = useState("");

  const [category, setCategory] =
    useState("সব");

  const [status, setStatus] =
    useState("সব");

  const [view, setView] =
    useState("list");

  const [userLocation, setUserLocation] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [locationLoading, setLocationLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [locationError, setLocationError] =
    useState("");

  // ========================================
  // Fetch reports
  // ========================================

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          "http://import.meta.env.VITE_API_URL/api/reports"
        );

        const data =
          await response.json();

        if (!response.ok) {
          setError(
            data.message ||
              "রিপোর্টগুলো পাওয়া যায়নি"
          );

          return;
        }

        setReports(
          data.reports || []
        );
      } catch (error) {
        console.error(
          "Explore error:",
          error
        );

        setError(
          "সার্ভারের সাথে সংযোগ করা যাচ্ছে না"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);


  // ========================================
  // Get current location
  // ========================================

  const getCurrentLocation = () => {
    setLocationError("");
    setLocationLoading(true);

    if (!navigator.geolocation) {
      setLocationError(
        "আপনার ব্রাউজারে Location সুবিধা নেই"
      );

      setLocationLoading(false);

      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          lat:
            position.coords.latitude,

          lng:
            position.coords.longitude,
        };

        setUserLocation(
          newLocation
        );

        setLocationLoading(false);
      },

      (error) => {
        console.error(
          "Location error:",
          error
        );

        if (error.code === 1) {
          setLocationError(
            "Location permission দেওয়া হয়নি"
          );
        } else if (error.code === 2) {
          setLocationError(
            "আপনার অবস্থান খুঁজে পাওয়া যাচ্ছে না"
          );
        } else if (error.code === 3) {
          setLocationError(
            "Location খুঁজতে বেশি সময় লাগছে"
          );
        } else {
          setLocationError(
            "বর্তমান অবস্থান পাওয়া যায়নি"
          );
        }

        setLocationLoading(false);
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };


  // ========================================
  // Filter reports
  // ========================================

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const searchText =
        search
          .toLowerCase()
          .trim();

      const matchesSearch =
        !searchText ||
        report.title
          ?.toLowerCase()
          .includes(searchText) ||
        report.description
          ?.toLowerCase()
          .includes(searchText) ||
        report.location?.address
          ?.toLowerCase()
          .includes(searchText);

      const matchesCategory =
        category === "সব" ||
        report.category === category;

      const matchesStatus =
        status === "সব" ||
        report.status === status;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
    });
  }, [
    reports,
    search,
    category,
    status,
  ]);


  // ========================================
  // Reports with distance
  // ========================================

  const reportsWithDistance = useMemo(() => {
    if (!userLocation) {
      return filteredReports;
    }

    return filteredReports
      .map((report) => {
        const lat =
          report.location?.latitude;

        const lng =
          report.location?.longitude;

        if (
          lat === null ||
          lng === null ||
          lat === undefined ||
          lng === undefined
        ) {
          return {
            ...report,
            distance: null,
          };
        }

        const distance =
          calculateDistance(
            userLocation.lat,
            userLocation.lng,
            Number(lat),
            Number(lng)
          );

        return {
          ...report,
          distance,
        };
      })
      .sort((a, b) => {
        if (a.distance === null) {
          return 1;
        }

        if (b.distance === null) {
          return -1;
        }

        return (
          a.distance - b.distance
        );
      });
  }, [
    filteredReports,
    userLocation,
  ]);


  // ========================================
  // Nearby reports
  // ========================================

  const nearbyReports =
    useMemo(() => {
      if (!userLocation) {
        return [];
      }

      return reportsWithDistance
        .filter(
          (report) =>
            report.distance !== null &&
            report.distance <= 5
        )
        .slice(0, 5);
    }, [
      reportsWithDistance,
      userLocation,
    ]);


  // ========================================
  // Status text
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


  // ========================================
  // Status style
  // ========================================

  const getStatusStyle = (status) => {
    if (status === "resolved") {
      return "bg-green-500/10 text-green-400 border-green-500/20";
    }

    if (status === "reviewing") {
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    }

    return "bg-zinc-800 text-zinc-400 border-zinc-700";
  };


  // ========================================
  // Clear filters
  // ========================================

  const clearFilters = () => {
    setSearch("");
    setCategory("সব");
    setStatus("সব");
  };


  // ========================================
  // Format distance
  // ========================================

  const formatDistance = (distance) => {
    if (distance === null) {
      return null;
    }

    if (distance < 1) {
      return `${Math.round(
        distance * 1000
      )} মিটার`;
    }

    return `${distance.toFixed(1)} কিমি`;
  };


  return (
    <div className="min-h-screen bg-[#08090b] px-6 py-12 text-white">

      <div className="mx-auto max-w-7xl">

        {/* ================================= */}
        {/* Header */}
        {/* ================================= */}

        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

          <div>

            <Link
              to="/"
              className="text-sm text-zinc-400 transition hover:text-[#B7FF00]"
            >
              ← হোমে ফিরে যান
            </Link>

            <p className="mt-8 text-sm font-medium tracking-wider text-[#B7FF00]">
              ONIYOM.
            </p>

            <h1 className="mt-3 text-4xl font-bold md:text-5xl">
              এলাকার সমস্যাগুলো
            </h1>

            <p className="mt-3 max-w-2xl text-zinc-400">
              আপনার এলাকার রিপোর্ট করা সমস্যাগুলো দেখুন
              এবং বিস্তারিত জানুন।
            </p>

          </div>


          <Link
            to="/report"
            className="rounded-xl bg-[#B7FF00] px-6 py-3 text-center text-sm font-semibold text-black transition hover:opacity-90"
          >
            + সমস্যা রিপোর্ট করুন
          </Link>

        </div>


        {/* ================================= */}
        {/* Filters */}
        {/* ================================= */}

        <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-950 p-5">

          <div className="grid gap-4 md:grid-cols-3">

            {/* Search */}

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="সমস্যা খুঁজুন..."
              className="w-full rounded-xl border border-zinc-800 bg-[#08090b] px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-[#B7FF00]"
            />


            {/* Category */}

            <select
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value
                )
              }
              className="w-full rounded-xl border border-zinc-800 bg-[#08090b] px-4 py-3 text-white outline-none focus:border-[#B7FF00]"
            >

              <option value="সব">
                সব ক্যাটাগরি
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


            {/* Status */}

            <select
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target.value
                )
              }
              className="w-full rounded-xl border border-zinc-800 bg-[#08090b] px-4 py-3 text-white outline-none focus:border-[#B7FF00]"
            >

              <option value="সব">
                সব স্ট্যাটাস
              </option>

              <option value="pending">
                অপেক্ষমাণ
              </option>

              <option value="reviewing">
                পর্যালোচনা চলছে
              </option>

              <option value="resolved">
                সমাধান হয়েছে
              </option>

            </select>

          </div>


          {/* Filter bottom */}

          <div className="mt-5 flex flex-col gap-4 border-t border-zinc-800 pt-5 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-sm text-zinc-500">
              মোট {filteredReports.length}টি রিপোর্ট
            </p>


            {(search ||
              category !== "সব" ||
              status !== "সব") && (

              <button
                type="button"
                onClick={clearFilters}
                className="text-sm text-[#B7FF00] transition hover:opacity-80"
              >
                ফিল্টার পরিষ্কার করুন
              </button>

            )}

          </div>

        </div>


        {/* ================================= */}
        {/* View switcher */}
        {/* ================================= */}

        <div className="mt-6 flex w-fit rounded-xl border border-zinc-800 bg-zinc-950 p-1">

          <button
            type="button"
            onClick={() =>
              setView("list")
            }
            className={`rounded-lg px-5 py-2 text-sm transition ${
              view === "list"
                ? "bg-[#B7FF00] font-semibold text-black"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            📋 তালিকা
          </button>


          <button
            type="button"
            onClick={() =>
              setView("map")
            }
            className={`rounded-lg px-5 py-2 text-sm transition ${
              view === "map"
                ? "bg-[#B7FF00] font-semibold text-black"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            🗺️ ম্যাপ
          </button>

        </div>


        {/* ================================= */}
        {/* Location button */}
        {/* ================================= */}

        <div className="mt-6">

          <button
            type="button"
            onClick={getCurrentLocation}
            disabled={locationLoading}
            className="rounded-xl border border-zinc-800 bg-zinc-950 px-5 py-3 text-sm font-medium text-zinc-300 transition hover:border-[#B7FF00] hover:text-[#B7FF00] disabled:cursor-not-allowed disabled:opacity-50"
          >

            {locationLoading
              ? "📍 অবস্থান খোঁজা হচ্ছে..."
              : userLocation
              ? "📍 আমার অবস্থান আপডেট করুন"
              : "📍 আমার অবস্থান ব্যবহার করুন"}

          </button>


          {locationError && (
            <p className="mt-3 text-sm text-red-400">
              {locationError}
            </p>
          )}


          {userLocation && (
            <p className="mt-3 text-xs text-zinc-600">
              আপনার অবস্থান ব্যবহার করে কাছাকাছি
              রিপোর্টগুলো দেখানো হচ্ছে।
            </p>
          )}

        </div>


        {/* ================================= */}
        {/* Nearby Reports */}
        {/* ================================= */}

        {userLocation &&
          nearbyReports.length > 0 && (

          <div className="mt-8 rounded-2xl border border-[#B7FF00]/20 bg-[#B7FF00]/5 p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-medium uppercase tracking-wider text-[#B7FF00]">
                  NEARBY REPORTS
                </p>

                <h2 className="mt-1 text-xl font-semibold">
                  আপনার কাছাকাছি সমস্যা
                </h2>

              </div>

              <span className="text-sm text-zinc-500">
                ৫ কিমির মধ্যে
              </span>

            </div>


            <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-3">

              {nearbyReports.map(
                (report) => (

                <Link
                  key={report._id}
                  to={`/issues/${report._id}`}
                  className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 transition hover:border-[#B7FF00]/40"
                >

                  <div className="flex items-start justify-between gap-3">

                    <div>

                      <p className="text-xs text-zinc-600">
                        {report.category}
                      </p>

                      <h3 className="mt-1 line-clamp-2 text-sm font-semibold">
                        {report.title}
                      </h3>

                    </div>


                    <span className="shrink-0 text-xs text-[#B7FF00]">
                      {formatDistance(
                        report.distance
                      )}
                    </span>

                  </div>


                  {report.location?.address && (
                    <p className="mt-3 line-clamp-1 text-xs text-zinc-600">
                      📍 {report.location.address}
                    </p>
                  )}

                </Link>

              ))}

            </div>

          </div>

        )}


        {/* ================================= */}
        {/* Loading */}
        {/* ================================= */}

        {loading && (
          <div className="py-20 text-center">

            <p className="text-zinc-400">
              রিপোর্ট লোড হচ্ছে...
            </p>

          </div>
        )}


        {/* ================================= */}
        {/* Error */}
        {/* ================================= */}

        {!loading &&
          error && (

          <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center">

            <p className="text-red-400">
              {error}
            </p>

          </div>

        )}


        {/* ================================= */}
        {/* LIST VIEW */}
        {/* ================================= */}

        {!loading &&
          !error &&
          view === "list" && (

          <>

            {filteredReports.length === 0 ? (

              <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950 p-12 text-center">

                <h2 className="text-xl font-semibold">
                  কোনো রিপোর্ট পাওয়া যায়নি
                </h2>

                <p className="mt-2 text-sm text-zinc-500">
                  অন্য কোনো keyword বা filter দিয়ে চেষ্টা করুন।
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-6 rounded-xl bg-[#B7FF00] px-5 py-3 text-sm font-semibold text-black"
                >
                  ফিল্টার পরিষ্কার করুন
                </button>

              </div>

            ) : (

              <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                {reportsWithDistance.map(
                  (report) => (

                  <Link
                    key={report._id}
                    to={`/issues/${report._id}`}
                    className="group overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 transition hover:-translate-y-1 hover:border-zinc-600"
                  >

                    {/* Image */}

                    {report.image ? (

                      <div className="h-52 overflow-hidden bg-zinc-900">

                        <img
                          src={`http://import.meta.env.VITE_API_URL${report.image}`}
                          alt={report.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />

                      </div>

                    ) : (

                      <div className="flex h-52 items-center justify-center bg-zinc-900">

                        <span className="text-4xl">
                          📍
                        </span>

                      </div>

                    )}


                    {/* Content */}

                    <div className="p-5">

                      <div className="flex flex-wrap items-center gap-2">

                        <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs text-zinc-400">
                          {report.category}
                        </span>

                        <span
                          className={`rounded-full border px-3 py-1 text-xs ${getStatusStyle(
                            report.status
                          )}`}
                        >
                          {getStatusText(
                            report.status
                          )}
                        </span>

                      </div>


                      <h2 className="mt-4 line-clamp-2 text-xl font-semibold">
                        {report.title}
                      </h2>


                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-zinc-500">
                        {report.description}
                      </p>


                      {report.location?.address && (
                        <p className="mt-4 line-clamp-1 text-xs text-zinc-600">
                          📍 {report.location.address}
                        </p>
                      )}


                      {report.distance !==
                        null &&
                        report.distance !==
                          undefined && (
                          <p className="mt-2 text-xs text-[#B7FF00]">
                            📏{" "}
                            {formatDistance(
                              report.distance
                            )}{" "}
                            দূরে
                          </p>
                        )}


                      <div className="mt-5 flex items-center justify-between border-t border-zinc-800 pt-4">

                        <span className="text-xs text-zinc-600">
                          {report.user?.name ||
                            "অজানা"}
                        </span>

                        <span className="text-sm text-[#B7FF00] transition group-hover:translate-x-1">
                          বিস্তারিত →
                        </span>

                      </div>

                    </div>

                  </Link>

                ))}

              </div>

            )}

          </>

        )}


        {/* ================================= */}
        {/* MAP VIEW */}
        {/* ================================= */}

        {!loading &&
          !error &&
          view === "map" && (

          <div className="mt-8">

            <div className="overflow-hidden rounded-3xl border border-zinc-800">

              <MapContainer
                center={
                  userLocation
                    ? [
                        userLocation.lat,
                        userLocation.lng,
                      ]
                    : [
                        23.8103,
                        90.4125,
                      ]
                }
                zoom={
                  userLocation
                    ? 14
                    : 12
                }
                scrollWheelZoom={true}
                className="h-[650px] w-full"
              >

                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />


                {/* Move map to user */}

                {userLocation && (
                  <>
                    <MapController
                      position={
                        userLocation
                      }
                    />

                    <CircleMarker
                      center={[
                        userLocation.lat,
                        userLocation.lng,
                      ]}
                      radius={10}
                      pathOptions={{
                        color: "#B7FF00",
                        fillColor: "#B7FF00",
                        fillOpacity: 0.8,
                      }}
                    >

                      <Popup>
                        <strong>
                          📍 আপনার বর্তমান অবস্থান
                        </strong>
                      </Popup>

                    </CircleMarker>

                  </>
                )}


                {/* Report markers */}

                {reportsWithDistance.map(
                  (report) => {

                    const latitude =
                      report.location
                        ?.latitude;

                    const longitude =
                      report.location
                        ?.longitude;


                    if (
                      latitude === null ||
                      longitude === null ||
                      latitude ===
                        undefined ||
                      longitude ===
                        undefined
                    ) {
                      return null;
                    }


                    return (
                      <Marker
                        key={report._id}
                        position={[
                          Number(
                            latitude
                          ),
                          Number(
                            longitude
                          ),
                        ]}
                      >

                        <Popup>

                          <div className="min-w-[220px]">

                            {report.image && (
                              <img
                                src={`http://import.meta.env.VITE_API_URL${report.image}`}
                                alt={report.title}
                                className="mb-3 h-28 w-full rounded-lg object-cover"
                              />
                            )}


                            <p className="text-xs text-gray-500">
                              {report.category}
                            </p>


                            <h3 className="mt-1 text-base font-semibold text-gray-900">
                              {report.title}
                            </h3>


                            <p className="mt-2 line-clamp-3 text-xs text-gray-600">
                              {report.description}
                            </p>


                            {report.location?.address && (
                              <p className="mt-2 text-xs text-gray-600">
                                📍{" "}
                                {
                                  report
                                    .location
                                    .address
                                }
                              </p>
                            )}


                            {report.distance !==
                              null &&
                              report.distance !==
                                undefined && (
                                <p className="mt-2 text-xs font-medium text-gray-700">
                                  📏{" "}
                                  {formatDistance(
                                    report.distance
                                  )}{" "}
                                  দূরে
                                </p>
                              )}


                            <Link
                              to={`/issues/${report._id}`}
                              className="mt-3 inline-block rounded-lg bg-black px-3 py-2 text-xs font-semibold text-white"
                            >
                              বিস্তারিত দেখুন →
                            </Link>

                          </div>

                        </Popup>

                      </Marker>
                    );
                  }
                )}

              </MapContainer>


              {/* Map footer */}

              <div className="border-t border-zinc-800 bg-zinc-950 p-4">

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                  <p className="text-sm text-zinc-500">

                    📍{" "}
                    {reportsWithDistance.filter(
                      (report) =>
                        report.location
                          ?.latitude !==
                          null &&
                        report.location
                          ?.longitude !==
                          null &&
                        report.location
                          ?.latitude !==
                          undefined &&
                        report.location
                          ?.longitude !==
                          undefined
                    ).length}{" "}
                   টি রিপোর্টের অবস্থান দেখানো হচ্ছে।

                  </p>


                  {userLocation && (
                    <p className="text-xs text-[#B7FF00]">
                      সবুজ marker = আপনার অবস্থান
                    </p>
                  )}

                </div>

              </div>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}

export default Explore;
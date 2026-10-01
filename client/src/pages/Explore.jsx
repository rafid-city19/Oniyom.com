import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = (
  import.meta.env.VITE_API_URL || ""
).replace(/\/$/, "");

function Explore() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");

  // ========================================
  // GET ALL PUBLIC REPORTS
  // ========================================

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/reports`,
        {
          method: "GET",
        }
      );

      const data = await response.json();

      console.log(
        "Public reports response:",
        data
      );

      if (!response.ok) {
        setError(
          data.message ||
            "Reports load করা যায়নি"
        );

        return;
      }

      if (Array.isArray(data)) {
        setReports(data);
      } else if (
        Array.isArray(data.reports)
      ) {
        setReports(data.reports);
      } else {
        setReports([]);
      }
    } catch (error) {
      console.error(
        "Fetch public reports error:",
        error
      );

      setError(
        "সার্ভারের সাথে সংযোগ করা যাচ্ছে না"
      );
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // LOAD REPORTS
  // ========================================

  useEffect(() => {
    fetchReports();
  }, []);

  // ========================================
  // STATUS STYLE
  // ========================================

  const getStatusClass = (reportStatus) => {
    switch (reportStatus) {
      case "pending":
        return "border-yellow-500/20 bg-yellow-500/10 text-yellow-400";

      case "reviewing":
        return "border-blue-500/20 bg-blue-500/10 text-blue-400";

      case "resolved":
        return "border-green-500/20 bg-green-500/10 text-green-400";

      case "rejected":
        return "border-red-500/20 bg-red-500/10 text-red-400";

      default:
        return "border-zinc-700 bg-zinc-900 text-zinc-400";
    }
  };

  // ========================================
  // STATUS LABEL
  // ========================================

  const getStatusLabel = (reportStatus) => {
    switch (reportStatus) {
      case "pending":
        return "Pending";

      case "reviewing":
        return "Reviewing";

      case "resolved":
        return "Resolved";

      case "rejected":
        return "Rejected";

      default:
        return "Unknown";
    }
  };

  // ========================================
  // FORMAT DATE
  // ========================================

  const formatDate = (date) => {
    if (!date) {
      return "Unknown date";
    }

    const formattedDate =
      new Date(date).toLocaleDateString(
        "en-BD",
        {
          year: "numeric",
          month: "short",
          day: "numeric",
        }
      );

    return formattedDate;
  };

  // ========================================
  // FILTER REPORTS
  // ========================================

  const filteredReports =
    reports.filter((report) => {
      const searchText =
        search.toLowerCase().trim();

      const title =
        report.title ||
        report.name ||
        "";

      const description =
        report.description || "";

      const reportCategory =
        report.category || "";

      const matchesSearch =
        !searchText ||
        title
          .toLowerCase()
          .includes(searchText) ||
        description
          .toLowerCase()
          .includes(searchText) ||
        reportCategory
          .toLowerCase()
          .includes(searchText);

      const matchesCategory =
        category === "all" ||
        report.category === category;

      const matchesStatus =
        status === "all" ||
        report.status === status;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
    });

  // ========================================
  // CATEGORIES
  // ========================================

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
  // UI
  // ========================================

  return (
    <div className="min-h-screen bg-[#08090b] px-6 pb-20 pt-28 text-white">

      <div className="mx-auto max-w-7xl">

        {/* ================================== */}
        {/* HEADER */}
        {/* ================================== */}

        <div className="mb-10">

          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-[#B7FF00]">
            Oniyom
          </p>

          <h1 className="text-4xl font-bold md:text-5xl">
            Explore Problems
          </h1>

          <p className="mt-3 max-w-2xl text-zinc-500">
            আপনার এলাকার এবং দেশের মানুষের
            রিপোর্ট করা সমস্যাগুলো দেখুন।
            কোনো সমস্যা চোখে পড়লে রিপোর্ট
            করুন।
          </p>

        </div>

        {/* ================================== */}
        {/* SEARCH + FILTERS */}
        {/* ================================== */}

        <div className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-950 p-5">

          <div className="grid gap-4 md:grid-cols-3">

            {/* SEARCH */}

            <div className="md:col-span-1">

              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-500">
                Search
              </label>

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="সমস্যা খুঁজুন..."
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-[#B7FF00]"
              />

            </div>

            {/* CATEGORY */}

            <div>

              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-500">
                Category
              </label>

              <select
                value={category}
                onChange={(event) =>
                  setCategory(
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition focus:border-[#B7FF00]"
              >

                <option value="all">
                  সব ক্যাটাগরি
                </option>

                {categories.map(
                  (item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  )
                )}

              </select>

            </div>

            {/* STATUS */}

            <div>

              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-500">
                Status
              </label>

              <select
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition focus:border-[#B7FF00]"
              >

                <option value="all">
                  সব Status
                </option>

                <option value="pending">
                  Pending
                </option>

                <option value="reviewing">
                  Reviewing
                </option>

                <option value="resolved">
                  Resolved
                </option>

                <option value="rejected">
                  Rejected
                </option>

              </select>

            </div>

          </div>

        </div>

        {/* ================================== */}
        {/* RESULT COUNT */}
        {/* ================================== */}

        {!loading && !error && (
          <div className="mb-5 flex items-center justify-between">

            <p className="text-sm text-zinc-500">
              {filteredReports.length}{" "}
              {filteredReports.length === 1
                ? "report"
                : "reports"}{" "}
              পাওয়া গেছে
            </p>

            {(search ||
              category !== "all" ||
              status !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCategory("all");
                  setStatus("all");
                }}
                className="text-sm text-[#B7FF00] transition hover:underline"
              >
                Clear filters
              </button>
            )}

          </div>
        )}

        {/* ================================== */}
        {/* ERROR */}
        {/* ================================== */}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4">

            <p className="text-sm text-red-400">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchReports}
              className="mt-3 text-sm text-white underline"
            >
              আবার চেষ্টা করুন
            </button>

          </div>
        )}

        {/* ================================== */}
        {/* LOADING */}
        {/* ================================== */}

        {loading && (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-16 text-center">

            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-[#B7FF00]" />

            <p className="text-sm text-zinc-500">
              Reports load হচ্ছে...
            </p>

          </div>
        )}

        {/* ================================== */}
        {/* EMPTY */}
        {/* ================================== */}

        {!loading &&
          !error &&
          filteredReports.length === 0 && (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-16 text-center">

              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-2xl">
                🔎
              </div>

              <h2 className="text-xl font-semibold">
                কোনো report পাওয়া যায়নি
              </h2>

              <p className="mt-2 text-sm text-zinc-500">
                অন্য keyword বা filter দিয়ে
                চেষ্টা করুন।
              </p>

            </div>
          )}

        {/* ================================== */}
        {/* REPORT GRID */}
        {/* ================================== */}

        {!loading &&
          !error &&
          filteredReports.length > 0 && (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

              {filteredReports.map(
                (report) => {

                  const title =
                    report.title ||
                    report.name ||
                    "Untitled Report";

                  return (
                    <Link
                      key={report._id}
                      to={`/report/${report._id}`}
                      className="group flex h-full flex-col rounded-2xl border border-zinc-800 bg-zinc-950 p-5 transition duration-300 hover:-translate-y-1 hover:border-zinc-600 hover:bg-zinc-900"
                    >

                      {/* IMAGE */}

                      {report.image ? (
                        <div className="mb-5 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">

                          <img
                            src={report.image}
                            alt={title}
                            className="h-48 w-full object-cover transition duration-500 group-hover:scale-105"
                          />

                        </div>
                      ) : (
                        <div className="mb-5 flex h-48 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900">

                          <span className="text-4xl opacity-30">
                            📍
                          </span>

                        </div>
                      )}

                      {/* TOP ROW */}

                      <div className="mb-3 flex items-center justify-between gap-3">

                        <span className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs text-zinc-400">
                          {report.category ||
                            "অন্যান্য"}
                        </span>

                        <span
                          className={`rounded-lg border px-3 py-1 text-xs font-medium ${getStatusClass(
                            report.status
                          )}`}
                        >
                          {getStatusLabel(
                            report.status
                          )}
                        </span>

                      </div>

                      {/* TITLE */}

                      <h2 className="line-clamp-2 text-lg font-semibold text-white transition group-hover:text-[#B7FF00]">
                        {title}
                      </h2>

                      {/* DESCRIPTION */}

                      {report.description && (
                        <p className="mt-2 line-clamp-3 text-sm leading-6 text-zinc-500">
                          {
                            report.description
                          }
                        </p>
                      )}

                      {/* LOCATION */}

                      {report.location && (
                        <div className="mt-4 flex items-start gap-2 text-sm text-zinc-500">

                          <span>
                            📍
                          </span>

                          <span className="line-clamp-2">
                            {typeof report.location ===
                            "string"
                              ? report.location
                              : report.location
                                  .address ||
                                report.location
                                  .name ||
                                "Location available"}
                          </span>

                        </div>
                      )}

                      {/* FOOTER */}

                      <div className="mt-auto flex items-center justify-between border-t border-zinc-800 pt-4">

                        <span className="text-xs text-zinc-600">
                          {formatDate(
                            report.createdAt
                          )}
                        </span>

                        <span className="text-xs font-medium text-zinc-500 transition group-hover:text-[#B7FF00]">
                          View report →
                        </span>

                      </div>

                    </Link>
                  );
                }
              )}

            </div>
          )}

        {/* ================================== */}
        {/* REPORT PROBLEM CTA */}
        {/* ================================== */}

        {!loading && (
          <div className="mt-12 rounded-2xl border border-zinc-800 bg-zinc-950 p-8 text-center md:p-10">

            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#B7FF00]">
              See something wrong?
            </p>

            <h2 className="mt-3 text-2xl font-bold md:text-3xl">
              আপনার এলাকার সমস্যা রিপোর্ট করুন
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-500">
              রাস্তা, পানি, বিদ্যুৎ, ড্রেনেজ,
              ময়লা বা অন্য কোনো জনসাধারণের
              সমস্যা দেখলে Oniyom-এ রিপোর্ট করুন।
            </p>

            <Link
              to="/report"
              className="mt-6 inline-flex rounded-xl bg-[#B7FF00] px-5 py-3 text-sm font-semibold text-black transition hover:scale-[1.02]"
            >
              Report a Problem
            </Link>

          </div>
        )}

      </div>

    </div>
  );
}

export default Explore;
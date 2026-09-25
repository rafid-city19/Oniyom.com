import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function MyReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // ========================================
  // FETCH MY REPORTS
  // ========================================

  const fetchMyReports = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("আগে লগইন করুন");
        return;
      }

      const response = await fetch(
        "http://import.meta.env.VITE_API_URL/api/reports/my-reports",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "রিপোর্ট পাওয়া যায়নি"
        );
      }

      setReports(data.reports || []);
    } catch (error) {
      console.error(
        "My reports error:",
        error
      );

      setError(
        error.message ||
          "রিপোর্ট লোড করতে সমস্যা হয়েছে"
      );
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // LOAD REPORTS
  // ========================================

  useEffect(() => {
    fetchMyReports();
  }, []);

  // ========================================
  // LOGOUT
  // ========================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  // ========================================
  // DELETE REPORT
  // ========================================

  const handleDelete = async (reportId) => {
    const confirmed = window.confirm(
      "আপনি কি সত্যিই এই রিপোর্টটি মুছে ফেলতে চান?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(reportId);

      const token = localStorage.getItem("token");

      if (!token) {
        alert("আগে লগইন করুন");
        return;
      }

      const response = await fetch(
        `http://import.meta.env.VITE_API_URL/api/reports/my-reports/${reportId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "রিপোর্ট delete করা যায়নি"
        );
      }

      setReports((previousReports) =>
        previousReports.filter(
          (report) =>
            report._id !== reportId
        )
      );

      alert(
        "রিপোর্ট সফলভাবে মুছে ফেলা হয়েছে"
      );
    } catch (error) {
      console.error(
        "Delete report error:",
        error
      );

      alert(
        error.message ||
          "রিপোর্ট delete করতে সমস্যা হয়েছে"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ========================================
  // STATUS TEXT
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
  // STATUS STYLE
  // ========================================

  const getStatusStyle = (status) => {
    if (status === "resolved") {
      return "border-green-500/20 bg-green-500/10 text-green-400";
    }

    if (status === "reviewing") {
      return "border-yellow-500/20 bg-yellow-500/10 text-yellow-400";
    }

    return "border-zinc-700 bg-zinc-900 text-zinc-400";
  };

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08090b] px-6 py-20 text-white">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-zinc-400">
            আপনার রিপোর্টগুলো লোড হচ্ছে...
          </p>
        </div>
      </div>
    );
  }

  // ========================================
  // MAIN
  // ========================================

  return (
    <div className="min-h-screen bg-[#08090b] px-6 py-12 text-white">
      <div className="mx-auto max-w-7xl">

        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

          <div>
            <Link
              to="/"
              className="text-sm text-zinc-500 transition hover:text-[#B7FF00]"
            >
              ← হোমে ফিরে যান
            </Link>

            <p className="mt-8 text-sm font-medium tracking-widest text-[#B7FF00]">
              MY REPORTS
            </p>

            <h1 className="mt-3 text-4xl font-bold md:text-5xl">
              আমার রিপোর্ট
            </h1>

            <p className="mt-3 max-w-xl text-zinc-500">
              আপনি যে সমস্যাগুলো রিপোর্ট করেছেন
              সেগুলোর status এবং বিস্তারিত এখানে দেখুন।
            </p>
          </div>


          {/* HEADER BUTTONS */}

          <div className="flex flex-col gap-3 sm:flex-row">

            {/* NEW REPORT */}

            <Link
              to="/report"
              className="rounded-xl bg-[#B7FF00] px-6 py-3 text-center text-sm font-semibold text-black transition hover:opacity-90"
            >
              + নতুন রিপোর্ট
            </Link>


            {/* LOGOUT */}

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl border border-red-500/20 px-6 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
            >
              Logout
            </button>

          </div>

        </div>


        {/* ================================= */}
        {/* ERROR */}
        {/* ================================= */}

        {error && (
          <div className="mt-10 rounded-2xl border border-red-500/20 bg-red-500/10 p-6">

            <p className="text-red-400">
              {error}
            </p>

            <Link
              to="/login"
              className="mt-4 inline-block text-sm font-medium text-[#B7FF00]"
            >
              Login করুন →
            </Link>

          </div>
        )}


        {!error && (
          <>

            {/* ================================= */}
            {/* STATS */}
            {/* ================================= */}

            <div className="mt-10 grid gap-4 sm:grid-cols-3">

              {/* TOTAL */}

              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">

                <p className="text-sm text-zinc-500">
                  মোট রিপোর্ট
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {reports.length}
                </p>

              </div>


              {/* PENDING */}

              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">

                <p className="text-sm text-zinc-500">
                  Pending
                </p>

                <p className="mt-2 text-3xl font-bold text-yellow-400">
                  {
                    reports.filter(
                      (report) =>
                        report.status ===
                        "pending"
                    ).length
                  }
                </p>

              </div>


              {/* RESOLVED */}

              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">

                <p className="text-sm text-zinc-500">
                  Resolved
                </p>

                <p className="mt-2 text-3xl font-bold text-green-400">
                  {
                    reports.filter(
                      (report) =>
                        report.status ===
                        "resolved"
                    ).length
                  }
                </p>

              </div>

            </div>


            {/* ================================= */}
            {/* NO REPORTS */}
            {/* ================================= */}

            {reports.length === 0 && (
              <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950 p-12 text-center">

                <div className="text-5xl">
                  📍
                </div>

                <h2 className="mt-5 text-xl font-semibold">
                  এখনো কোনো রিপোর্ট নেই
                </h2>

                <p className="mt-2 text-sm text-zinc-500">
                  আপনার এলাকার কোনো সমস্যা দেখলে
                  সেটি রিপোর্ট করুন।
                </p>

                <Link
                  to="/report"
                  className="mt-6 inline-block rounded-xl bg-[#B7FF00] px-6 py-3 text-sm font-semibold text-black"
                >
                  প্রথম রিপোর্ট করুন
                </Link>

              </div>
            )}


            {/* ================================= */}
            {/* REPORT CARDS */}
            {/* ================================= */}

            {reports.length > 0 && (
              <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                {reports.map((report) => (
                  <div
                    key={report._id}
                    className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950"
                  >

                    {/* IMAGE */}

                    {report.image ? (
                      <div className="h-52 overflow-hidden bg-zinc-900">

                        <img
                          src={`http://import.meta.env.VITE_API_URL${report.image}`}
                          alt={report.title}
                          className="h-full w-full object-cover"
                        />

                      </div>
                    ) : (
                      <div className="flex h-52 items-center justify-center bg-zinc-900">
                        <span className="text-4xl">
                          📍
                        </span>
                      </div>
                    )}


                    {/* CONTENT */}

                    <div className="p-5">

                      {/* CATEGORY + STATUS */}

                      <div className="flex flex-wrap gap-2">

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


                      {/* TITLE */}

                      <h2 className="mt-4 line-clamp-2 text-xl font-semibold">
                        {report.title}
                      </h2>


                      {/* DESCRIPTION */}

                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-zinc-500">
                        {report.description}
                      </p>


                      {/* LOCATION */}

                      {report.location?.address && (
                        <p className="mt-4 line-clamp-1 text-xs text-zinc-600">
                          📍{" "}
                          {report.location.address}
                        </p>
                      )}


                      {/* DATE */}

                      <p className="mt-4 text-xs text-zinc-600">
                        {new Date(
                          report.createdAt
                        ).toLocaleDateString(
                          "bn-BD"
                        )}
                      </p>


                      {/* ACTIONS */}

                      <div className="mt-5 flex gap-2 border-t border-zinc-800 pt-4">

                        {/* VIEW */}

                        <Link
                          to={`/issues/${report._id}`}
                          className="flex-1 rounded-lg border border-zinc-800 px-3 py-2 text-center text-sm text-zinc-300 transition hover:border-zinc-600 hover:text-white"
                        >
                          View
                        </Link>


                        {/* EDIT */}

                        <Link
                          to={`/edit-report/${report._id}`}
                          className="flex-1 rounded-lg bg-[#B7FF00] px-3 py-2 text-center text-sm font-semibold text-black transition hover:opacity-90"
                        >
                          Edit
                        </Link>


                        {/* DELETE */}

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              report._id
                            )
                          }
                          disabled={
                            deletingId ===
                            report._id
                          }
                          className="rounded-lg border border-red-500/20 px-3 py-2 text-sm text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingId ===
                          report._id
                            ? "..."
                            : "Delete"}
                        </button>

                      </div>

                    </div>

                  </div>
                ))}

              </div>
            )}

          </>
        )}

      </div>
    </div>
  );
}

export default MyReports;
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function AdminDashboard() {
  const { user } = useAuth();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [actionLoading, setActionLoading] =
    useState(null);

  // ========================================
  // GET ALL REPORTS
  // ========================================

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("token");

      if (!token) {
        setError("আপনি লগইন করেননি");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/admin/reports",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      console.log(
        "Admin reports response:",
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
        "Fetch admin reports error:",
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
  // UPDATE REPORT STATUS
  // ========================================

  const updateStatus = async (
    reportId,
    newStatus
  ) => {
    try {
      setActionLoading(reportId);
      setError("");

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/admin/reports/${reportId}/status`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data =
        await response.json();

      console.log(
        "Update status response:",
        data
      );

      if (!response.ok) {
        setError(
          data.message ||
            "Status update করা যায়নি"
        );

        return;
      }

      // Update report locally
      setReports((previousReports) =>
        previousReports.map(
          (report) =>
            report._id === reportId
              ? {
                  ...report,
                  status:
                    data.report?.status ||
                    newStatus,
                }
              : report
        )
      );
    } catch (error) {
      console.error(
        "Update status error:",
        error
      );

      setError(
        "Status update করার সময় সমস্যা হয়েছে"
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ========================================
  // DELETE REPORT
  // ========================================

  const deleteReport = async (
    reportId
  ) => {
    const confirmed =
      window.confirm(
        "আপনি কি এই report টি delete করতে চান?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(reportId);
      setError("");

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/admin/reports/${reportId}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      console.log(
        "Delete report response:",
        data
      );

      if (!response.ok) {
        setError(
          data.message ||
            "Report delete করা যায়নি"
        );

        return;
      }

      // Remove deleted report
      setReports((previousReports) =>
        previousReports.filter(
          (report) =>
            report._id !== reportId
        )
      );
    } catch (error) {
      console.error(
        "Delete report error:",
        error
      );

      setError(
        "Report delete করার সময় সমস্যা হয়েছে"
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ========================================
  // STATUS STYLE
  // ========================================

  const getStatusClass = (status) => {
    switch (status) {
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
  // FORMAT DATE
  // ========================================

  const formatDate = (date) => {
    if (!date) {
      return "Unknown";
    }

    return new Date(date).toLocaleDateString(
      "en-BD",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  };

  // ========================================
  // COUNTS
  // ========================================

  const pendingCount =
    reports.filter(
      (report) =>
        report.status === "pending"
    ).length;

  const reviewingCount =
    reports.filter(
      (report) =>
        report.status === "reviewing"
    ).length;

  const resolvedCount =
    reports.filter(
      (report) =>
        report.status === "resolved"
    ).length;

  return (
    <div className="min-h-screen bg-[#08090b] px-6 pb-20 pt-28 text-white">

      <div className="mx-auto max-w-7xl">

        {/* ================================== */}
        {/* HEADER */}
        {/* ================================== */}

        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">

          <div>

            <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-[#B7FF00]">
              Admin Panel
            </p>

            <h1 className="text-4xl font-bold md:text-5xl">
              Dashboard
            </h1>

            <p className="mt-3 text-zinc-500">
              Welcome,{" "}
              {user?.name || "Admin"}
            </p>

          </div>

          <Link
            to="/"
            className="w-fit rounded-lg border border-zinc-800 px-4 py-2 text-sm text-zinc-400 transition hover:border-zinc-600 hover:text-white"
          >
            ← Back to website
          </Link>

        </div>

        {/* ================================== */}
        {/* ERROR */}
        {/* ================================== */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* ================================== */}
        {/* STATS */}
        {/* ================================== */}

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* TOTAL */}

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">

            <p className="text-sm text-zinc-500">
              Total Reports
            </p>

            <p className="mt-2 text-3xl font-bold">
              {reports.length}
            </p>

          </div>

          {/* PENDING */}

          <div className="rounded-2xl border border-yellow-500/20 bg-zinc-950 p-6">

            <p className="text-sm text-zinc-500">
              Pending
            </p>

            <p className="mt-2 text-3xl font-bold text-yellow-400">
              {pendingCount}
            </p>

          </div>

          {/* REVIEWING */}

          <div className="rounded-2xl border border-blue-500/20 bg-zinc-950 p-6">

            <p className="text-sm text-zinc-500">
              Reviewing
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-400">
              {reviewingCount}
            </p>

          </div>

          {/* RESOLVED */}

          <div className="rounded-2xl border border-green-500/20 bg-zinc-950 p-6">

            <p className="text-sm text-zinc-500">
              Resolved
            </p>

            <p className="mt-2 text-3xl font-bold text-green-400">
              {resolvedCount}
            </p>

          </div>

        </div>

        {/* ================================== */}
        {/* LOADING */}
        {/* ================================== */}

        {loading && (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-12 text-center">

            <p className="text-zinc-500">
              Reports load হচ্ছে...
            </p>

          </div>
        )}

        {/* ================================== */}
        {/* EMPTY */}
        {/* ================================== */}

        {!loading &&
          !error &&
          reports.length === 0 && (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-12 text-center">

              <h2 className="text-xl font-semibold">
                No reports found
              </h2>

              <p className="mt-2 text-sm text-zinc-500">
                এখনো কোনো report পাওয়া যায়নি।
              </p>

            </div>
          )}

        {/* ================================== */}
        {/* REPORT TABLE */}
        {/* ================================== */}

        {!loading &&
          reports.length > 0 && (
            <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">

              <div className="overflow-x-auto">

                <table className="w-full min-w-[1100px]">

                  {/* TABLE HEADER */}

                  <thead className="border-b border-zinc-800 bg-zinc-900/50">

                    <tr>

                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                        Report
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                        Category
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                        Status
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                        Date
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                        Actions
                      </th>

                    </tr>

                  </thead>

                  {/* TABLE BODY */}

                  <tbody className="divide-y divide-zinc-800">

                    {reports.map(
                      (report) => {

                        const isLoading =
                          actionLoading ===
                          report._id;

                        return (
                          <tr
                            key={report._id}
                            className="transition hover:bg-zinc-900/40"
                          >

                            {/* REPORT */}

                            <td className="px-6 py-5">

                              <div className="max-w-[300px]">

                                <p className="truncate font-medium text-white">
                                  {report.title ||
                                    report.name ||
                                    "Untitled Report"}
                                </p>

                                <p className="mt-1 truncate text-xs text-zinc-600">
                                  ID:{" "}
                                  {report._id}
                                </p>

                              </div>

                            </td>

                            {/* CATEGORY */}

                            <td className="px-6 py-5">

                              <span className="text-sm text-zinc-400">
                                {report.category ||
                                  "N/A"}
                              </span>

                            </td>

                            {/* STATUS */}

                            <td className="px-6 py-5">

                              <select
                                value={
                                  report.status ||
                                  "pending"
                                }
                                disabled={
                                  isLoading
                                }
                                onChange={(
                                  event
                                ) =>
                                  updateStatus(
                                    report._id,
                                    event.target
                                      .value
                                  )
                                }
                                className={`rounded-lg border px-3 py-2 text-xs font-medium outline-none ${getStatusClass(
                                  report.status
                                )}`}
                              >

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

                            </td>

                            {/* DATE */}

                            <td className="px-6 py-5">

                              <span className="text-sm text-zinc-500">
                                {formatDate(
                                  report.createdAt
                                )}
                              </span>

                            </td>

                            {/* ACTIONS */}

                            <td className="px-6 py-5">

                              <div className="flex items-center gap-3">

                                <Link
                                  to={`/report/${report._id}`}
                                  className="rounded-lg border border-zinc-800 px-3 py-2 text-xs text-zinc-400 transition hover:border-zinc-600 hover:text-white"
                                >
                                  View
                                </Link>

                                <button
                                  type="button"
                                  disabled={
                                    isLoading
                                  }
                                  onClick={() =>
                                    deleteReport(
                                      report._id
                                    )
                                  }
                                  className="rounded-lg border border-red-500/20 px-3 py-2 text-xs text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  {isLoading
                                    ? "..."
                                    : "Delete"}
                                </button>

                              </div>

                            </td>

                          </tr>
                        );
                      }
                    )}

                  </tbody>

                </table>

              </div>

            </div>
          )}

        {/* ================================== */}
        {/* REFRESH BUTTON */}
        {/* ================================== */}

        <div className="mt-6 flex justify-end">

          <button
            type="button"
            onClick={fetchReports}
            disabled={loading}
            className="rounded-lg border border-zinc-800 px-4 py-2 text-sm text-zinc-400 transition hover:border-zinc-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Loading..."
              : "↻ Refresh Reports"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;
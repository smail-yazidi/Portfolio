"use client";

import React, { useEffect, useState } from "react";
import { Trash2, ArrowLeft, ArrowUp, ArrowDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Loading from "@/components/LoadingAdmin";

type HistoryEntry = {
  ip: string;
  country: string;
  device: string;
  language: string;
  userAgent: string;
  time: string;
};

type Visitor = {
  _id: string;
  fingerprint: string;
  history: HistoryEntry[];
};

const PAGE_SIZE = 10;

export default function VisitorsPage() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [filteredVisitors, setFilteredVisitors] = useState<Visitor[]>([]);
  const [search, setSearch] = useState("");
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchVisitors = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/track-visit", {
        headers: {
          "x-api-key": process.env.NEXT_PUBLIC_API_SECRET || "",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch visitors");

      const data = await res.json();

      // Sort by last history entry
      const sorted =
        sortOrder === "newest"
          ? data.visitors.sort(
              (a: Visitor, b: Visitor) =>
                new Date(
                  b.history[b.history.length - 1]?.time || 0
                ).getTime() -
                new Date(
                  a.history[a.history.length - 1]?.time || 0
                ).getTime()
            )
          : data.visitors.sort(
              (a: Visitor, b: Visitor) =>
                new Date(
                  a.history[a.history.length - 1]?.time || 0
                ).getTime() -
                new Date(
                  b.history[b.history.length - 1]?.time || 0
                ).getTime()
            );

      setVisitors(sorted);
      setFilteredVisitors(sorted);
      setTotalVisitors(data.totalVisitors);
    } catch (err) {
      console.error("Failed to fetch visitors:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, [sortOrder]);

  useEffect(() => {
    const filtered = visitors.filter((v) => {
      const latest = v.history[v.history.length - 1];
      return (
        latest.ip?.toLowerCase().includes(search.toLowerCase()) ||
        latest.country?.toLowerCase().includes(search.toLowerCase()) ||
        latest.device?.toLowerCase().includes(search.toLowerCase()) ||
        latest.language?.toLowerCase().includes(search.toLowerCase())
      );
    });
    setFilteredVisitors(filtered);
    setCurrentPage(1);
  }, [search, visitors]);

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this visitor?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/track-visit/${id}`, {
        method: "DELETE",
        headers: {
          "x-api-key": process.env.NEXT_PUBLIC_API_SECRET || "",
        },
      });

      if (!res.ok) throw new Error("Failed to delete visitor");

      setVisitors((prev) => prev.filter((v) => v._id !== id));
      setFilteredVisitors((prev) => prev.filter((v) => v._id !== id));
      setTotalVisitors((prev) => prev - 1);

      toast({
        title: "Success",
        description: "Visitor deleted successfully!",
        className: "bg-green-500 text-white border-none",
      });
    } catch (err: any) {
      console.error("Error deleting visitor:", err);
      toast({
        title: "Error",
        description:
          err?.message || "Failed to delete visitor. Please try again.",
        className: "bg-red-500 text-white border-none",
      });
    }
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "newest" ? "oldest" : "newest"));
  };

  const totalPages = Math.ceil(filteredVisitors.length / PAGE_SIZE);
  const paginatedVisitors = filteredVisitors.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  if (loading) return <Loading />;

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-md">
      {!selectedVisitor ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">
              Visitors ({totalVisitors})
            </h1>
            <button
              onClick={toggleSortOrder}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-md transition-colors"
              title={
                sortOrder === "newest"
                  ? "Show oldest first"
                  : "Show newest first"
              }
            >
              {sortOrder === "newest" ? (
                <ArrowUp className="w-4 h-4" />
              ) : (
                <ArrowDown className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Search */}
          <div className="flex items-center mb-4 gap-2">
            <input
              type="text"
              placeholder="Search by IP, country, device, or language"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border p-2 rounded flex-1"
            />
          </div>

          {/* Visitors Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2 text-left">Fingerprint</th>
                  <th className="border p-2 text-left">IP</th>
                  <th className="border p-2 text-left">Country</th>
                  <th className="border p-2 text-left">Device</th>
                  <th className="border p-2 text-left">Language</th>
                  <th className="border p-2 text-left">Date</th>
                  <th className="border p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedVisitors.map((v) => {
                  const latest = v.history[v.history.length - 1];
                  return (
                    <tr
                      key={v._id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedVisitor(v)}
                    >
                      <td className="border p-2">{v.fingerprint}</td>
                      <td className="border p-2">{latest?.ip || "-"}</td>
                      <td className="border p-2">{latest?.country || "-"}</td>
                      <td className="border p-2">{latest?.device || "-"}</td>
                      <td className="border p-2">{latest?.language || "-"}</td>
                      <td className="border p-2">
                        {latest?.time
                          ? new Date(latest.time).toLocaleString()
                          : "-"}
                      </td>
                      <td className="border p-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(v._id);
                          }}
                          className="text-red-500 hover:text-red-700 flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 gap-2 flex-wrap">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === i + 1 ? "bg-blue-500 text-white" : ""
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div>
          <button
            onClick={() => setSelectedVisitor(null)}
            className="mb-4 text-blue-500 hover:text-blue-700 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> all visitors
          </button>

          <div className="border p-4 rounded shadow max-w-full space-y-4">
            <h2 className="text-lg font-bold">
              Fingerprint: {selectedVisitor.fingerprint}
            </h2>

            {/* Full history */}
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2">IP</th>
                  <th className="border p-2">Country</th>
                  <th className="border p-2">Device</th>
                  <th className="border p-2">Language</th>
                  <th className="border p-2">Date</th>
                  <th className="border p-2">User Agent</th>
                </tr>
              </thead>
              <tbody>
                {selectedVisitor.history.map((entry, idx) => (
                  <tr key={idx}>
                    <td className="border p-2">{entry.ip || "-"}</td>
                    <td className="border p-2">{entry.country || "-"}</td>
                    <td className="border p-2">{entry.device || "-"}</td>
                    <td className="border p-2">{entry.language || "-"}</td>
                    <td className="border p-2">
                      {new Date(entry.time).toLocaleString()}
                    </td>
                    <td className="border p-2 break-words">{entry.userAgent}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              onClick={() => handleDelete(selectedVisitor._id)}
              className="mt-4 text-red-500 hover:text-red-700 flex items-center gap-1"
            >
              <Trash2 className="w-4 h-4" /> Delete Visitor
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

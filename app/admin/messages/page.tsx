"use client";

import React, { useEffect, useState } from "react";
import { Trash2, ArrowLeft, ArrowUp, ArrowDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast"
import Loading from '@/components/LoadingAdmin';


type Message = {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
};

const PAGE_SIZE = 10;

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [search, setSearch] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const { toast } = useToast()
   const [loading, setLoading] = useState(true); 
const fetchMessages = async () => {
    setLoading(true); // 🔹 start loading
  try {
    const res = await fetch("/api/messages", {
      headers: {
        "x-api-key": process.env.NEXT_PUBLIC_API_SECRET || ""
      }
    });

    if (!res.ok) throw new Error("Failed to fetch messages");

    const data = await res.json();
    const sorted = sortOrder === "newest" 
      ? data.sort(
          (a: Message, b: Message) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      : data.sort(
          (a: Message, b: Message) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

    setMessages(sorted);
    setFilteredMessages(sorted);
      setLoading(false); // 🔹 start loading
  } catch (err) {
    console.error("Failed to fetch messages:", err);
  }
};


  useEffect(() => {
    fetchMessages();
  }, [sortOrder]);

  useEffect(() => {
    const filtered = messages.filter(
      (m) =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.email.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredMessages(filtered);
    setCurrentPage(1);
  }, [search, messages]);

const handleDelete = async (id: string) => {
  
  const confirmDelete = confirm("Are you sure you want to delete this message?");
  if (!confirmDelete) return;

  try {
    const res = await fetch(`/api/messages/${id}`, {
      method: "DELETE",
      headers: {
        "x-api-key": process.env.NEXT_PUBLIC_API_SECRET || "" // 🔹 أضف المفتاح هنا
      }
    });

    if (!res.ok) {
      throw new Error("Failed to delete message");
    }

    // Remove the deleted message from state immediately
    setMessages(prev => prev.filter(msg => msg._id !== id));
    setFilteredMessages(prev => prev.filter(msg => msg._id !== id));

    // Show success toast
    toast({
      title: "Success",
      description: "Message deleted successfully!",
      className: "bg-green-500 text-white border-none",
    });

  } catch (err: any) {
    console.error("Error deleting message:", err);
    toast({
      title: "Error",
      description: err?.message || "Failed to delete the message. Please try again.",
      className: "bg-red-500 text-white border-none",
    });
  }
};

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === "newest" ? "oldest" : "newest");
  };


  const totalPages = Math.ceil(filteredMessages.length / PAGE_SIZE);
  const paginatedMessages = filteredMessages.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

    if (loading) return <Loading />;

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-md">
      {!selectedMessage ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Messages</h1>
            
            {/* Sort Control */}
            <button
              onClick={toggleSortOrder}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-md transition-colors"
              title={sortOrder === "newest" ? "Show oldest first" : "Show newest first"}
            >
              {sortOrder === "newest" ? (
                <>
                  <ArrowUp className="w-4 h-4" />
            
                </>
              ) : (
                <>
                  <ArrowDown className="w-4 h-4" />
         
                </>
              )}
            </button>
          </div>

          {/* Search */}
          <div className="flex items-center mb-4 gap-2">

            <input
              type="text"
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border p-2 rounded flex-1"
            />
          </div>

          {/* Messages Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2 text-left">Name</th>
                  <th className="border p-2 text-left hidden sm:table-cell">Email</th>
                  <th className="border p-2 text-left">Date</th>
                  <th className="border p-2 text-left">Actions</th>
                </tr>
              </thead>
           <tbody>
  {paginatedMessages.map((msg) => {
    const name = msg.name;
    const email = msg.email;

    // Function to truncate text based on screen
    const truncate = (text: string, length: number) =>
      text.length > length ? text.slice(0, length) + "..." : text;

    return (
      <tr key={msg._id} className="hover:bg-gray-50 cursor-pointer">
        <td
          className="border p-2"
          onClick={() => setSelectedMessage(msg)}
        >
          {/* Name */}
          <span className="block sm:hidden">
            {truncate(name, 8)}
          </span>
          <span className="hidden sm:block lg:hidden">
            {truncate(name,20)}
          </span>
          <span className="hidden lg:block">
            {truncate(name, 40)}
          </span>
        </td>
        <td
          className="border p-2 hidden sm:table-cell"
          onClick={() => setSelectedMessage(msg)}
        >
          {/* Email */}
          <span className="block sm:hidden">
            {truncate(email, 8)}
          </span>
          <span className="hidden sm:block lg:hidden">
            {truncate(email, 20)}
          </span>
          <span className="hidden lg:block">
            {truncate(email, 40)}
          </span>
        </td>
        <td
          className="border p-2"
          onClick={() => setSelectedMessage(msg)}
        >
          {new Date(msg.createdAt).toLocaleDateString()}
        </td>
        <td className="border p-2">
          <button
            onClick={() => handleDelete(msg._id)}
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
    onClick={() => setSelectedMessage(null)}
    className="mb-4 text-blue-500 hover:text-blue-700 flex items-center gap-2"
  >
    <ArrowLeft className="w-4 h-4" /> all messages
  </button>

  <div className="border p-4 rounded shadow max-w-full">
    <p className="break-words">
      <strong>Name:</strong> {selectedMessage.name}
    </p>
    <p className="sm:block hidden break-words">
      <strong>Email:</strong> {selectedMessage.email}
    </p>
    <p>
      <strong>Date:</strong>{" "}
      {new Date(selectedMessage.createdAt).toLocaleString()}
    </p>
    <div className="mt-2">
      <strong>Message:</strong>
      <div className="mt-1 border p-2 rounded max-h-80 overflow-y-auto break-words whitespace-pre-wrap">
        {selectedMessage.message}
      </div>
    </div>

    <button
      onClick={() => handleDelete(selectedMessage._id)}
      className="mt-4 text-red-500 hover:text-red-700 flex items-center gap-1"
    >
      <Trash2 className="w-4 h-4" /> Delete Message
    </button>
  </div>
</div>

      )}
    </div>
  );
}
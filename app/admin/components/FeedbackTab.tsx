"use client";

import { useState, useEffect } from "react";
import { Star, MessageSquare, Trash2, Search, Filter, RefreshCw, Mail, Calendar } from "lucide-react";
import { FeedbackItem } from "@/app/api/feedback/route";

export default function FeedbackTab() {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRating, setFilterRating] = useState<number | "all">("all");

  const loadFeedbacks = async () => {
    setLoading(true);
    let items: FeedbackItem[] = [];

    try {
      const res = await fetch("/api/feedback");
      const data = await res.json();
      if (data.success && Array.isArray(data.feedbacks)) {
        items = data.feedbacks;
      }
    } catch (e) {
      console.warn("Failed to fetch feedbacks from API:", e);
    }

    // Merge with local storage backup if available
    try {
      const local = JSON.parse(localStorage.getItem("daxomart_feedbacks") || "[]");
      if (Array.isArray(local) && local.length > 0) {
        items = [...items, ...local];
      }
    } catch (e) {
      console.warn("Failed to read local feedbacks:", e);
    }

    // Deduplicate by ID & Content Signature
    const seenIds = new Set<string>();
    const seenKeys = new Set<string>();
    const uniqueItems: FeedbackItem[] = [];

    for (const item of items) {
      if (!item || !item.id) continue;
      const key = `${(item.feedback || "").trim().toLowerCase()}|${(item.email || "").trim().toLowerCase()}|${item.rating}`;
      if (!seenIds.has(item.id) && !seenKeys.has(key)) {
        seenIds.add(item.id);
        seenKeys.add(key);
        uniqueItems.push(item);
      }
    }

    setFeedbacks(uniqueItems);
    setLoading(false);
  };

  useEffect(() => {
    loadFeedbacks();
    const interval = setInterval(loadFeedbacks, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this feedback?")) return;

    setFeedbacks((prev) => prev.filter((item) => item.id !== id));

    // Update local storage backup
    try {
      const local = JSON.parse(localStorage.getItem("daxomart_feedbacks") || "[]");
      const updated = local.filter((item: any) => item.id !== id);
      localStorage.setItem("daxomart_feedbacks", JSON.stringify(updated));
    } catch (e) {
      console.warn("Failed to update local storage:", e);
    }

    // Delete via API
    try {
      await fetch(`/api/feedback?id=${id}`, { method: "DELETE" });
    } catch (e) {
      console.warn("Failed to delete via API:", e);
    }
  };

  // Metrics
  const totalCount = feedbacks.length;
  const avgRating = totalCount > 0
    ? (feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / totalCount).toFixed(1)
    : "0.0";
  const fiveStarCount = feedbacks.filter((f) => f.rating === 5).length;
  const fiveStarPct = totalCount > 0 ? Math.round((fiveStarCount / totalCount) * 100) : 0;

  // Filtered Feedbacks
  const filteredFeedbacks = feedbacks.filter((item) => {
    const matchesSearch =
      item.feedback.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.email && item.email.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRating = filterRating === "all" || item.rating === filterRating;

    return matchesSearch && matchesRating;
  });

  return (
    <div className="space-y-6 text-white font-sans">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">Customer Feedbacks</h2>
          <p className="text-gray-400 text-[13px] mt-0.5">
            Review and manage direct feedback submitted from the About page.
          </p>
        </div>
        <button
          onClick={loadFeedbacks}
          className="inline-flex items-center gap-2 bg-[#17171A] hover:bg-[#222226] border border-[#26262A] text-gray-300 text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer font-medium self-start sm:self-auto"
        >
          <RefreshCw size={14} className={loading ? "animate-spin text-[#C5A059]" : ""} />
          Refresh List
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#121214] border border-[#222226] rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/20 flex items-center justify-center text-[#C5A059]">
            <MessageSquare size={22} />
          </div>
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Total Feedbacks
            </span>
            <span className="text-2xl font-bold text-white">{totalCount}</span>
          </div>
        </div>

        <div className="bg-[#121214] border border-[#222226] rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Star size={22} className="fill-amber-400" />
          </div>
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Average Rating
            </span>
            <span className="text-2xl font-bold text-white">{avgRating} / 5.0</span>
          </div>
        </div>

        <div className="bg-[#121214] border border-[#222226] rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <span className="font-extrabold text-sm">5★</span>
          </div>
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              5-Star Satisfaction
            </span>
            <span className="text-2xl font-bold text-white">{fiveStarPct}%</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#121214] border border-[#222226] rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 bg-[#18181A] border border-[#2A2A2E] rounded-xl px-3.5 py-2 text-gray-300 text-[13px] w-full sm:w-80">
          <Search size={16} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search feedback text or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-white text-[13px] w-full placeholder:text-gray-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Filter size={14} className="text-gray-400 shrink-0 mr-1" />
          {(["all", 5, 4, 3, 2, 1] as const).map((star) => (
            <button
              key={star}
              onClick={() => setFilterRating(star)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                filterRating === star
                  ? "bg-[#C5A059] text-black font-bold shadow-sm"
                  : "bg-[#18181A] border border-[#2A2A2E] text-gray-300 hover:text-white"
              }`}
            >
              {star === "all" ? "All Ratings" : `${star} Star${star > 1 ? "s" : ""}`}
            </button>
          ))}
        </div>
      </div>

      {/* Feedback Items Grid/List */}
      {filteredFeedbacks.length === 0 ? (
        <div className="bg-[#121214] border border-[#222226] rounded-2xl p-12 text-center text-gray-400">
          <MessageSquare size={36} className="mx-auto mb-3 text-gray-600" />
          <p className="text-base font-semibold text-gray-300">No feedbacks found</p>
          <p className="text-xs text-gray-500 mt-1">
            {searchQuery || filterRating !== "all"
              ? "Try adjusting your search or rating filter."
              : "Feedbacks submitted by users on the About page will appear here."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFeedbacks.map((item) => (
            <div
              key={item.id}
              className="bg-[#121214] border border-[#222226] hover:border-[#C5A059]/40 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 shadow-sm"
            >
              <div>
                {/* Top bar: Stars + Date */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={16}
                        className={
                          s <= item.rating
                            ? "text-amber-400 fill-amber-400"
                            : "text-gray-700"
                        }
                      />
                    ))}
                    <span className="text-xs font-semibold text-[#C5A059] ml-1.5">
                      {item.rating === 5
                        ? "Excellent"
                        : item.rating === 4
                        ? "Good"
                        : item.rating === 3
                        ? "Average"
                        : item.rating === 2
                        ? "Fair"
                        : "Needs Work"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-gray-500">
                    <Calendar size={12} />
                    <span>
                      {new Date(item.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {/* Feedback Body */}
                <p className="text-gray-200 text-sm leading-relaxed mb-4 whitespace-pre-wrap">
                  "{item.feedback}"
                </p>
              </div>

              {/* Bottom Footer: Email + Delete */}
              <div className="flex items-center justify-between pt-3 border-t border-[#1C1C20] text-xs">
                <div className="flex items-center gap-1.5 text-gray-400 truncate">
                  <Mail size={13} className="text-[#C5A059] shrink-0" />
                  <span className="truncate">{item.email || "Anonymous Visitor"}</span>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all border-none cursor-pointer"
                  title="Delete feedback"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

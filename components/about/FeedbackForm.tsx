"use client";

import { useState } from "react";
import { MessageSquare, Star, Send, CheckCircle2 } from "lucide-react";

export default function FeedbackForm() {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [feedback, setFeedback] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setSubmitting(true);

    const payload = {
      rating: rating || 5,
      feedback: feedback.trim(),
      email: email.trim() || undefined,
      created_at: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      const savedItem = data?.feedback || { ...payload, id: `fb-${Date.now()}` };

      // Local storage backup with exact ID
      const existing = JSON.parse(localStorage.getItem("daxomart_feedbacks") || "[]");
      if (!existing.some((item: any) => item.id === savedItem.id)) {
        existing.unshift(savedItem);
        localStorage.setItem("daxomart_feedbacks", JSON.stringify(existing));
      }
    } catch (e) {
      console.warn("Feedback submission API warning:", e);
    } finally {
      setSubmitting(false);
      setSubmitted(true);
    }
  };

  return (
    <div className="bg-dark2 border border-border rounded-xl p-6 sm:p-8 mb-8 relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-36 h-36 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
          <MessageSquare className="w-5 h-5" />
        </div>
        <h3 className="text-xl font-bold text-cream">Share Your Feedback</h3>
      </div>
      <p className="text-muted text-sm leading-relaxed mb-6">
        We value your thoughts! Help us improve Daxo Mart by sharing your experience or suggestions.
      </p>

      {submitted ? (
        <div className="bg-dark3/70 border border-accent/30 rounded-lg p-6 text-center animate-fadeIn">
          <CheckCircle2 className="w-10 h-10 text-accent mx-auto mb-3" />
          <h4 className="text-lg font-bold text-cream mb-1">Thank You!</h4>
          <p className="text-muted text-sm">
            Your feedback has been received. We appreciate your time and support.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setFeedback("");
              setRating(0);
              setEmail("");
            }}
            className="mt-4 text-xs text-accent hover:underline bg-transparent border-none cursor-pointer font-pally"
          >
            Send another response
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Star Rating */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">
              How would you rate your experience?
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 rounded hover:scale-110 transition-transform bg-transparent border-none cursor-pointer"
                  aria-label={`Rate ${star} stars`}
                >
                  <Star
                    className={`w-6 h-6 transition-colors duration-150 ${
                      star <= (hoverRating || rating)
                        ? "text-star fill-star"
                        : "text-dim hover:text-muted"
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="text-xs text-accent font-medium ml-2">
                  {rating === 5
                    ? "Excellent"
                    : rating === 4
                    ? "Good"
                    : rating === 3
                    ? "Average"
                    : rating === 2
                    ? "Fair"
                    : "Needs Work"}
                </span>
              )}
            </div>
          </div>

          {/* Feedback Text */}
          <div>
            <label htmlFor="feedback-text" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">
              Your Feedback
            </label>
            <textarea
              id="feedback-text"
              required
              rows={3}
              placeholder="Tell us what you like or how we can improve..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full bg-dark3 border border-border rounded-lg p-3 text-sm text-cream placeholder:text-dim focus:border-accent outline-none font-pally resize-none transition-colors duration-150"
            />
          </div>

          {/* Email Input & Submit */}
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Your email (optional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-dark3 border border-border rounded-lg p-3 text-sm text-cream placeholder:text-dim focus:border-accent outline-none font-pally transition-colors duration-150"
            />
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-lt text-dark font-bold px-6 py-3 rounded-lg text-xs uppercase tracking-wider transition-colors duration-150 cursor-pointer border-none shrink-0 font-pally disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {submitting ? "Sending..." : "Submit Feedback"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export interface FeedbackItem {
  id: string;
  rating: number;
  feedback: string;
  email?: string;
  created_at: string;
}

const INITIAL_FEEDBACKS: FeedbackItem[] = [];

// In-memory fallback array for runtime persistence across API calls
let memoryFeedbacks: FeedbackItem[] = [];

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("feedbacks")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      return NextResponse.json({ success: true, feedbacks: data });
    }
  } catch (e) {
    console.warn("Supabase feedbacks query fallback to memory:", e);
  }

  // Deduplicate memoryFeedbacks before returning
  const seenKeys = new Set<string>();
  const uniqueMemory = memoryFeedbacks.filter((item) => {
    const key = `${item.id}|${(item.feedback || "").trim().toLowerCase()}`;
    if (seenKeys.has(key)) return false;
    seenKeys.add(key);
    return true;
  });

  return NextResponse.json({ success: true, feedbacks: uniqueMemory });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { rating, feedback, email } = body;

    if (!feedback || typeof rating !== "number") {
      return NextResponse.json(
        { success: false, error: "Rating and feedback text are required." },
        { status: 400 }
      );
    }

    const newItem: FeedbackItem = {
      id: `fb-${Date.now()}`,
      rating,
      feedback: feedback.trim(),
      email: email ? email.trim() : undefined,
      created_at: new Date().toISOString(),
    };

    // Try inserting into Supabase
    try {
      await supabase.from("feedbacks").insert([
        {
          rating: newItem.rating,
          feedback: newItem.feedback,
          email: newItem.email || null,
          created_at: newItem.created_at,
        },
      ]);
    } catch (dbErr) {
      console.warn("Supabase insert feedback skipped/failed:", dbErr);
    }

    // Add to memory state as well
    memoryFeedbacks.unshift(newItem);

    return NextResponse.json({ success: true, feedback: newItem });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to submit feedback." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
    }

    memoryFeedbacks = memoryFeedbacks.filter((item) => item.id !== id);

    try {
      await supabase.from("feedbacks").delete().eq("id", id);
    } catch (e) {
      console.warn("Supabase feedback delete failed:", e);
    }

    return NextResponse.json({ success: true, id });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

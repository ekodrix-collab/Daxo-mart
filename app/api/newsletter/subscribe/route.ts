import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // Try saving subscriber to Supabase if table exists
    try {
      await supabase.from("subscribers").insert([{ email, subscribed_at: new Date().toISOString() }]);
    } catch {
      // Ignore if table doesn't exist
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for subscribing! You will receive exclusive deals & new arrival alerts.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to subscribe" },
      { status: 500 }
    );
  }
}

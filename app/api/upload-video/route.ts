import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No video file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const fileName = `video_${Date.now()}_${Math.random().toString(36).substring(7)}.mp4`;
    const bucketName = "product-videos";

    // Attempt upload to Supabase Storage bucket 'product-videos'
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, buffer, {
        contentType: file.type || "video/mp4",
        upsert: true,
      });

    if (uploadError) {
      console.warn("Supabase Storage video upload warning:", uploadError.message);
      // Fallback response if bucket isn't public or credential missing
      return NextResponse.json({
        success: true,
        url: null,
        note: "Bucket 'product-videos' upload encountered a configuration warning: " + uploadError.message,
        error: uploadError.message
      }, { status: 400 });
    }

    // Retrieve public URL for the uploaded video
    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    return NextResponse.json({
      success: true,
      url: publicUrlData.publicUrl,
      fileName: fileName,
    });
  } catch (error: any) {
    console.error("Video upload endpoint error:", error);
    return NextResponse.json({ error: error.message || "Failed to upload video" }, { status: 500 });
  }
}

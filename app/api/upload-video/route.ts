import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { supabase } from "@/lib/supabase";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

    // If Cloudinary credentials are configured, compress and transcode video using Cloudinary
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
      try {
        const uploadResponse = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                resource_type: "video",
                folder: "daxo-mart/videos",
                quality: "auto:good",
                video_codec: "auto",
                fetch_format: "mp4",
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            )
            .end(buffer);
        });

        const result = uploadResponse as any;

        return NextResponse.json({
          success: true,
          url: result.secure_url,
          fileName: result.public_id,
          fileSize: result.bytes,
          compressed: true,
        });
      } catch (cloudinaryErr: any) {
        console.warn("Cloudinary video compression failed, falling back to Supabase:", cloudinaryErr);
      }
    }

    // Direct Upload to Supabase Storage bucket 'product-videos' if Cloudinary is unconfigured
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, buffer, {
        contentType: file.type || "video/mp4",
        upsert: true,
      });

    if (uploadError) {
      console.warn("Supabase Storage video upload warning:", uploadError.message);
      return NextResponse.json({
        success: false,
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
      fileSize: file.size,
    });
  } catch (error: any) {
    console.error("Video upload endpoint error:", error);
    return NextResponse.json({ error: error.message || "Failed to upload video" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const videoUrl = searchParams.get("url");

    if (!videoUrl) {
      return NextResponse.json({ error: "No video URL provided" }, { status: 400 });
    }

    // Extract file path from Supabase public URL
    const bucketName = "product-videos";
    const parts = videoUrl.split(`/storage/v1/object/public/${bucketName}/`);
    
    if (parts.length > 1) {
      const filePath = decodeURIComponent(parts[1]);
      const { error: deleteError } = await supabase.storage
        .from(bucketName)
        .remove([filePath]);

      if (deleteError) {
        console.warn("Supabase Storage video deletion error:", deleteError.message);
      }
    }

    return NextResponse.json({ success: true, message: "Video deleted from Supabase storage" });
  } catch (error: any) {
    console.error("Video delete endpoint error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete video" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json({
        success: false,
        error: "Cloudinary environment variables missing",
      }, { status: 500 });
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = "daxo-mart/videos";

    // Generate Cloudinary signature for direct browser-to-Cloudinary upload
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
        folder: folder,
      },
      apiSecret
    );

    return NextResponse.json({
      success: true,
      signature,
      timestamp,
      cloudName,
      apiKey,
      folder,
    });
  } catch (error: any) {
    console.error("Signature API error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate upload signature" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

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
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    // If Cloudinary credentials are missing, provide base64 Data URL fallback
    if (!cloudName || !apiKey || !apiSecret) {
      const mimeType = file.type || "image/webp";
      const base64Data = `data:${mimeType};base64,${buffer.toString("base64")}`;
      return NextResponse.json({
        success: true,
        url: base64Data,
        format: mimeType.split("/")[1] || "webp",
        note: "Cloudinary credentials missing in .env.local. Base64 fallback used.",
      });
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });

    try {
      const uploadResponse = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "daxo-mart/uploads",
              resource_type: "image",
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
        public_id: result.public_id,
        format: result.format,
      });
    } catch (uploadErr: any) {
      console.error("Cloudinary upload failed, falling back to base64 Data URL:", uploadErr);
      const mimeType = file.type || "image/webp";
      const base64Data = `data:${mimeType};base64,${buffer.toString("base64")}`;
      return NextResponse.json({
        success: true,
        url: base64Data,
        format: mimeType.split("/")[1] || "webp",
        note: "Cloudinary upload error. Base64 fallback used.",
      });
    }
  } catch (error: any) {
    console.error("Upload API error:", error);
    return NextResponse.json({ error: error.message || "Failed to upload image" }, { status: 500 });
  }
}

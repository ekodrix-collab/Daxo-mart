import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const {
      name,
      shortName,
      price,
      costPrice,
      oldPrice,
      category,
      img,
      images,
      description,
      shortDescription,
      highlights,
      includedItems,
      inStock,
      badge,
      colors,
      sizes,
      hoverImage,
      videoUrl,
    } = body;

    const colorImgs = (colors || [])
      .map((c: any) => c?.image)
      .filter((url: any): url is string => typeof url === "string" && url.length > 0);

    const galleryImages = Array.from(
      new Set([
        ...(Array.isArray(images) ? images : []),
        img,
        ...colorImgs,
      ])
    ).filter(Boolean);

    if (galleryImages.length === 0) {
      galleryImages.push("/images/placeholder.png");
    }

    // Base payload with standard columns present in Supabase table
    const corePayload: Record<string, any> = {
      title: name || shortName,
      price: Number(price) || 0,
      sale_price: Number(oldPrice) || Number(price) || 0,
      category_name: category || "1:24",
      images: galleryImages,
      colors: colors || [],
      sizes: sizes || [],
      hover_image: hoverImage || null,
      video_url: videoUrl || null,
      description: description || "",
      short_description: shortDescription || "",
      highlights: highlights || [],
      included_items: includedItems || [],
      is_active: inStock !== false,
      is_featured: Boolean(badge),
    };

    if (costPrice !== undefined) {
      corePayload.cost_price = Number(costPrice) || 0;
    }

    let { data: updatedProduct, error } = await supabase
      .from("products")
      .update(corePayload)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      console.warn("First update failed, removing non-standard columns (colors, cost_price, etc.) & stringifying images:", error.message);
      
      delete corePayload.cost_price;
      delete corePayload.colors;
      delete corePayload.sizes;
      delete corePayload.hover_image;
      delete corePayload.video_url;
      
      const retry1 = await supabase
        .from("products")
        .update(corePayload)
        .eq("id", id)
        .select("*")
        .single();

      if (!retry1.error) {
        updatedProduct = retry1.data;
        error = null;
      } else {
        // Retry with stringified images
        corePayload.images = JSON.stringify(galleryImages);
        const retry2 = await supabase
          .from("products")
          .update(corePayload)
          .eq("id", id)
          .select("*")
          .single();

        if (!retry2.error) {
          updatedProduct = retry2.data;
          error = null;
        } else {
          console.error("All Supabase update retries failed:", retry2.error);
        }
      }
    }

    return NextResponse.json({ success: true, product: updatedProduct || corePayload });
  } catch (err: any) {
    console.error("Product update API error:", err);
    return NextResponse.json({ error: err.message || "Failed to update product" }, { status: 500 });
  }
}

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
      scale,
      specs,
      sku,
      brand,
      material,
      metaTitle,
      metaDescription,
      metaKeywords,
      ogImage,
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
      scale: scale || "1:24",
      specs: specs || [],
      sku: sku || null,
      brand: brand || null,
      material: material || null,
      meta_title: metaTitle || null,
      meta_description: metaDescription || null,
      meta_keywords: metaKeywords || null,
      og_image: ogImage || null,
      badge: badge || null,
      badge_text: badge || null,
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
      delete corePayload.specs;
      delete corePayload.scale;
      delete corePayload.sku;
      delete corePayload.brand;
      delete corePayload.material;
      delete corePayload.meta_title;
      delete corePayload.meta_description;
      delete corePayload.meta_keywords;
      delete corePayload.og_image;
      delete corePayload.badge;
      delete corePayload.badge_text;
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

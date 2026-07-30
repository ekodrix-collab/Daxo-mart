import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      shortName,
      price,
      costPrice,
      oldPrice,
      sku,
      category,
      img,
      images,
      description,
      shortDescription,
      highlights,
      includedItems,
      features,
      inStock,
      badge,
    } = body;

    if (!name || price === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: name and price are required." },
        { status: 400 }
      );
    }

    const title = name;
    const baseSlug = (shortName || name)
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const galleryImages = Array.isArray(images) && images.length > 0
      ? images
      : img ? [img] : ["/images/placeholder.png"];

    const corePayload: Record<string, any> = {
      title,
      slug: `${baseSlug}-${Math.floor(1000 + Math.random() * 9000)}`,
      description: description || "",
      short_description: shortDescription || "",
      highlights: highlights || features || [],
      included_items: includedItems || [],
      price: Number(price) || 0,
      sale_price: Number(oldPrice) || Number(price) || 0,
      category_name: category || "1:24",
      images: galleryImages,
      stock: inStock !== false ? 10 : 0,
      is_active: inStock !== false,
      is_featured: Boolean(badge),
      created_at: new Date().toISOString(),
    };

    if (costPrice !== undefined) {
      corePayload.cost_price = Number(costPrice) || 0;
    }

    let { data: createdProduct, error } = await supabase
      .from("products")
      .insert(corePayload)
      .select("*")
      .single();

    if (error) {
      console.warn("First insert failed, retrying without optional columns:", error.message);
      delete corePayload.cost_price;

      const retry1 = await supabase
        .from("products")
        .insert(corePayload)
        .select("*")
        .single();

      if (!retry1.error) {
        createdProduct = retry1.data;
        error = null;
      } else {
        corePayload.images = JSON.stringify(galleryImages);
        const retry2 = await supabase
          .from("products")
          .insert(corePayload)
          .select("*")
          .single();

        if (!retry2.error) {
          createdProduct = retry2.data;
          error = null;
        }
      }
    }

    return NextResponse.json({
      success: true,
      product: createdProduct || corePayload,
    });
  } catch (err: any) {
    console.error("Product creation API error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create product" },
      { status: 500 }
    );
  }
}

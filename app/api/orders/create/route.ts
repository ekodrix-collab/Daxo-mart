import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      customer_name,
      customer_phone,
      customer_email,
      full_address,
      city,
      state,
      pincode,
      product_id,
      product_name,
      product_image,
      quantity,
      unit_price,
      subtotal,
      notes,
    } = body;

    // Validation
    if (!customer_name || !customer_phone || !full_address || !city || !state || !pincode) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const cleanPhone = customer_phone.trim();
    let customerId: string | null = null;
    let addressId: string | null = null;

    // Generate Order Number
    const randomSeq = Math.floor(100000 + Math.random() * 900000);
    const fallbackOrderNumber = `DXM-${randomSeq}`;

    let finalOrderNumber = fallbackOrderNumber;
    let createdOrderId: string | null = null;

    // Direct insert into Supabase orders table
    const { data: orderData, error: orderErr } = await supabase
      .from("orders")
      .insert({
        order_number: fallbackOrderNumber,
        customer_name,
        customer_phone: cleanPhone,
        customer_email: customer_email || `${cleanPhone}@daxomart.customer`,
        shipping_address: `${full_address}, ${city}, ${state} - ${pincode}`,
        city: city || null,
        postal_code: pincode || null,
        total_amount: Number(subtotal) || 0,
        subtotal: Number(subtotal) || 0,
        status: "New",
        payment_method: "WhatsApp / COD",
      })
      .select("id, order_number")
      .single();

    if (orderErr) {
      console.error("Supabase Order Insert Error:", orderErr);
    }

    if (orderData) {
      createdOrderId = orderData.id;
      finalOrderNumber = orderData.order_number || fallbackOrderNumber;

      // Insert Order Items if table exists
      const { error: itemErr } = await supabase.from("order_items").insert({
        order_id: createdOrderId,
        product_id: product_id || null,
        product_name,
        product_image: product_image || null,
        quantity: Number(quantity) || 1,
        unit_price: Number(unit_price) || 0,
        subtotal: Number(subtotal) || 0,
      });

      if (itemErr) {
        console.warn("Supabase Order Item Insert Error:", itemErr);
      }
    }

    return NextResponse.json({
      success: true,
      order_number: finalOrderNumber,
      order_id: createdOrderId,
    });
  } catch (err: any) {
    console.error("Order Creation Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to process order" },
      { status: 500 }
    );
  }
}

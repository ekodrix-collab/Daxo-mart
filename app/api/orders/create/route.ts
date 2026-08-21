import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendOrderNotificationEmail } from "@/lib/brevo";

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

    // Trigger Brevo Order Notification Email to Admin & Customer
    try {
      const emailItems =
        body.items && Array.isArray(body.items) && body.items.length > 0
          ? body.items.map((it: any) => ({
              productName: it.product_name || it.name || "Diecast Model Car",
              productImage: it.product_image || it.img,
              selectedColor: it.selectedColor || it.color || body.selectedColor || body.color,
              selectedSize: it.selectedSize || it.size || body.selectedSize || body.size,
              quantity: Number(it.quantity) || 1,
              unitPrice: Number(it.unit_price || it.price) || 0,
              subtotal: Number(it.subtotal || (Number(it.price || 0) * Number(it.quantity || 1))) || 0,
            }))
          : [
              {
                productName: product_name || "Diecast Model Car",
                productImage: product_image,
                selectedColor: body.selectedColor || body.color || body.selected_color,
                selectedSize: body.selectedSize || body.size || body.selected_size,
                quantity: Number(quantity) || 1,
                unitPrice: Number(unit_price) || Number(subtotal) || 0,
                subtotal: Number(subtotal) || 0,
              },
            ];

      await sendOrderNotificationEmail({
        orderNumber: finalOrderNumber,
        customerName: customer_name,
        customerPhone: cleanPhone,
        customerEmail: customer_email,
        shippingAddress: `${full_address}, ${city}, ${state} - ${pincode}`,
        city: city,
        state: state,
        pincode: pincode,
        totalAmount: Number(subtotal) || 0,
        paymentMethod: "COD / WhatsApp Order",
        items: emailItems,
      });
    } catch (emailErr) {
      console.error("Brevo email send exception:", emailErr);
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

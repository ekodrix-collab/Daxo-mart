import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendOrderNotificationEmail } from "@/lib/brevo";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const nameVal =
      body.customer_name ||
      body.customerName ||
      body.name ||
      (body.firstName ? `${body.firstName} ${body.lastName || ""}`.trim() : "") ||
      "Customer";

    const phoneVal = (
      body.customer_phone ||
      body.customerPhone ||
      body.phone ||
      body.emailOrPhone ||
      ""
    )
      .toString()
      .trim();

    const emailVal =
      body.customer_email ||
      body.customerEmail ||
      body.email ||
      (body.emailOrPhone && body.emailOrPhone.includes("@") ? body.emailOrPhone.trim() : "");

    const addressVal =
      body.full_address || body.shipping_address || body.shippingAddress || body.address || "";
    const cityVal = body.city || "";
    const stateVal = body.state || "";
    const pincodeVal = body.pincode || body.postal_code || body.zip || "";

    const prodId = body.product_id || body.productId || body.id || null;
    const prodName = body.product_name || body.productName || body.name || "Diecast Model Car";
    const prodImg = body.product_image || body.productImage || body.img || "";
    const qty = Number(body.quantity || body.qty || 1);
    const unitPrice = Number(body.unit_price || body.price || 0);
    const subtotalVal = Number(body.subtotal || body.totalAmount || body.total_amount || unitPrice * qty || 0);

    // Validation
    if (!phoneVal && !addressVal) {
      return NextResponse.json({ error: "Missing phone or address fields" }, { status: 400 });
    }

    const cleanPhone = phoneVal || "N/A";

    // Generate Order Number
    const randomSeq = Math.floor(100000 + Math.random() * 900000);
    const fallbackOrderNumber = `DXM-${randomSeq}`;

    let finalOrderNumber = fallbackOrderNumber;
    let createdOrderId: string | null = null;

    const fullShippingAddr = `${addressVal}${cityVal ? `, ${cityVal}` : ""}${stateVal ? `, ${stateVal}` : ""}${pincodeVal ? ` - ${pincodeVal}` : ""}`;

    // 1. Insert into Supabase orders table
    const { data: orderData, error: orderErr } = await supabase
      .from("orders")
      .insert({
        order_number: fallbackOrderNumber,
        customer_name: nameVal,
        customer_phone: cleanPhone,
        customer_email: emailVal || `${cleanPhone}@daxomart.customer`,
        shipping_address: fullShippingAddr,
        city: cityVal || null,
        postal_code: pincodeVal || null,
        total_amount: subtotalVal,
        subtotal: subtotalVal,
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

      // 2. Insert Order Items into Supabase
      const { error: itemErr } = await supabase.from("order_items").insert({
        order_id: createdOrderId,
        product_id: prodId,
        product_name: prodName,
        product_image: prodImg || null,
        quantity: qty,
        unit_price: unitPrice,
        subtotal: subtotalVal,
      });

      if (itemErr) {
        console.warn("Supabase Order Item Insert Error:", itemErr);
      }
    }

    // 3. Trigger Brevo Order Notification Email to Admin
    try {
      const emailItems =
        body.items && Array.isArray(body.items) && body.items.length > 0
          ? body.items.map((it: any) => ({
              productName: it.product_name || it.productName || it.name || "Diecast Model Car",
              productImage: it.product_image || it.productImage || it.img,
              selectedColor: it.selectedColor || it.color || body.selectedColor || body.color,
              selectedSize: it.selectedSize || it.size || body.selectedSize || body.size,
              quantity: Number(it.quantity || it.qty || 1),
              unitPrice: Number(it.unit_price || it.price || 0),
              subtotal: Number(it.subtotal || (Number(it.price || 0) * Number(it.quantity || 1))) || 0,
            }))
          : [
              {
                productName: prodName,
                productImage: prodImg,
                selectedColor: body.selectedColor || body.color || body.selected_color,
                selectedSize: body.selectedSize || body.size || body.selected_size,
                quantity: qty,
                unitPrice: unitPrice,
                subtotal: subtotalVal,
              },
            ];

      await sendOrderNotificationEmail({
        orderNumber: finalOrderNumber,
        customerName: nameVal,
        customerPhone: cleanPhone,
        customerEmail: emailVal,
        shippingAddress: fullShippingAddr,
        city: cityVal,
        state: stateVal,
        pincode: pincodeVal,
        totalAmount: subtotalVal,
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

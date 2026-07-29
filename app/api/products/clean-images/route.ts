import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data: products } = await supabase.from('products').select('id');
    if (products && products.length > 0) {
      for (const p of products) {
        await supabase.from('products').update({ images: ['/images/placeholder.png'] }).eq('id', p.id);
      }
    }
    return NextResponse.json({ success: true, message: "Database product images updated to placeholder.png" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

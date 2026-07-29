import PRODUCTS, { type Product } from "@/lib/products";
import { supabase } from "@/lib/supabase";

export async function fetchProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (error || !data || data.length === 0) {
      return [];
    }
    
    return data.map((item: any) => ({
      id: item.id,
      slug: item.slug || `prod-${item.id}`,
      name: item.title,
      shortName: item.title,
      price: Number(item.price),
      oldPrice: item.sale_price ? Number(item.sale_price) : Number(item.price) * 1.2,
      priceStr: `₹${Number(item.price).toLocaleString('en-IN')}`,
      oldPriceStr: item.sale_price ? `₹${Number(item.sale_price).toLocaleString('en-IN')}` : '',
      scale: item.category_name || "1:24",
      category: item.category_name || "1:24",
      img: item.images && item.images.length > 0 ? item.images[0] : '/images/placeholder.png',
      images: item.images && item.images.length > 0 ? item.images : ['/images/placeholder.png'],
      badge: item.is_featured ? "Featured" : null,
      description: item.description || "",
      features: ["Quality Diecast Metal", "Detailed Interior", "Rubber Tyres"],
      inStock: item.stock > 0,
      sku: `DXM-${item.id.slice(0, 5)}`
    }));
  } catch {
    return [];
  }
}

export async function fetchBanners() {
  try {
    const { data, error } = await supabase.from('banners').select('*').eq('is_active', true).order('sort_order', { ascending: true });
    if (error || !data || data.length === 0) return null;
    return data;
  } catch {
    return null;
  }
}

export async function fetchCategories() {
  try {
    const { data, error } = await supabase.from('categories').select('*').order('created_at', { ascending: true });
    if (error || !data || data.length === 0) return [];
    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      img: item.image_url || '/images/placeholder.png',
      filterValue: item.slug === 'frames' ? 'Frame' : item.slug === 'rc-toys' ? 'RC' : item.name.replace(' Diecast', ''),
    }));
  } catch {
    return [];
  }
}

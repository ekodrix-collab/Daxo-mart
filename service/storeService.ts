import PRODUCTS, { type Product } from "@/lib/products";
import { supabase } from "@/lib/supabase";
import { getStoredCategories, type CategoryItem } from "@/lib/categories";
import type { Order } from "@/app/admin/components/OrdersTab";

export async function fetchProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (error || !data || data.length === 0) {
      return [];
    }
    
    return data.map((item: any) => {
      let parsedImages: string[] = [];
      if (Array.isArray(item.images)) {
        parsedImages = item.images;
      } else if (typeof item.images === "string") {
        try {
          const json = JSON.parse(item.images);
          if (Array.isArray(json)) parsedImages = json;
          else if (typeof json === "string") parsedImages = [json];
        } catch {
          if (item.images.startsWith("http") || item.images.startsWith("/")) {
            parsedImages = [item.images];
          }
        }
      }

      if (parsedImages.length === 0 && item.image_url) {
        parsedImages = [item.image_url];
      }

      const parsedColors = Array.isArray(item.colors)
        ? item.colors
        : (typeof item.colors === "string" ? (() => { try { return JSON.parse(item.colors); } catch { return []; } })() : []);

      // Gather variant images from color options
      const colorImages = parsedColors
        .map((c: any) => c?.image)
        .filter((url: any): url is string => typeof url === "string" && url.length > 0);

      const allImages = Array.from(new Set([...parsedImages, ...colorImages])).filter(Boolean);
      if (allImages.length === 0) allImages.push("/images/placeholder.png");

      const primaryImg = allImages[0];

      return {
        id: item.id,
        slug: item.slug || `prod-${item.id}`,
        name: item.title,
        shortName: item.title,
        price: Number(item.price),
        costPrice: item.cost_price ? Number(item.cost_price) : (item.costPrice ? Number(item.costPrice) : undefined),
        oldPrice: item.sale_price ? Number(item.sale_price) : Number(item.price) * 1.2,
        priceStr: `₹${Number(item.price).toLocaleString('en-IN')}`,
        oldPriceStr: item.sale_price ? `₹${Number(item.sale_price).toLocaleString('en-IN')}` : '',
        scale: item.category_name || "1:24",
        category: item.category_name || "1:24",
        img: primaryImg,
        images: allImages,
        badge: item.is_featured ? "Featured" : null,
        description: item.description || "",
        features: ["Quality Diecast Metal", "Detailed Interior", "Rubber Tyres"],
        inStock: (item.stock ?? 10) > 0,
        stock: typeof item.stock === "number" ? item.stock : 10,
        isActive: item.is_active ?? item.isActive ?? true,
        sku: item.sku || `DXM-${item.id.slice(0, 5)}`,
        colors: parsedColors,
      };
    });
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

export async function fetchCategories(): Promise<CategoryItem[]> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });
    if (error || !data || data.length === 0) return getStoredCategories();
    return data.map((item: any) => {
      const slug = item.slug || item.name.toLowerCase().replace(/\s+/g, '-');
      let filterValue = item.filter_value;
      if (!filterValue) {
        if (slug === 'frames' || slug === '3d-frames') filterValue = 'Frame';
        else if (slug === 'rc-toys' || slug.includes('rc')) filterValue = 'RC';
        else filterValue = item.name.replace(' Diecast', '');
      }
      return {
        id: item.id,
        name: item.name,
        slug: slug,
        img: item.image_url || '/images/placeholder.png',
        filterValue: filterValue,
        sortOrder: item.sort_order || 0,
      };
    });
  } catch {
    return getStoredCategories();
  }
}

export async function createCategory(cat: { name: string; slug: string; image_url: string; sort_order?: number }) {
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert([{ name: cat.name, slug: cat.slug, image_url: cat.image_url, sort_order: cat.sort_order || 0 }])
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error creating category in Supabase:', err);
    return null;
  }
}

export async function updateCategory(id: string, cat: { name: string; slug: string; image_url: string; sort_order?: number }) {
  try {
    const { data, error } = await supabase
      .from('categories')
      .update({ name: cat.name, slug: cat.slug, image_url: cat.image_url, sort_order: cat.sort_order })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error updating category in Supabase:', err);
    return null;
  }
}

export async function updateCategoryOrder(orderedCategories: { id: string; sortOrder: number }[]) {
  try {
    const promises = orderedCategories.map((c) =>
      supabase.from('categories').update({ sort_order: c.sortOrder }).eq('id', c.id)
    );
    await Promise.all(promises);
    return true;
  } catch (err) {
    console.error('Error updating category orders in Supabase:', err);
    return false;
  }
}

export async function deleteCategory(id: string) {
  try {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error deleting category in Supabase:', err);
    return false;
  }
}

export async function fetchAdminOrders(): Promise<Order[]> {
  try {
    let dbOrders = null;
    let error = null;

    const res1 = await supabase
      .from("orders")
      .select(`*, order_items (*)`)
      .order("created_at", { ascending: false });

    if (res1.error) {
      const res2 = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      dbOrders = res2.data;
      error = res2.error;
    } else {
      dbOrders = res1.data;
    }

    if (dbOrders && dbOrders.length > 0 && !error) {
      return dbOrders.map((o: any) => {
        const item = o.order_items?.[0];
        return {
          id: o.id,
          order_number: o.order_number || `DXM-${o.id.slice(0, 6)}`,
          productName: item?.product_name || o.product_name || "Custom Order Item",
          productImage: item?.product_image || o.product_image,
          price: item?.unit_price || o.total_amount || o.subtotal || o.total || 0,
          qty: item?.quantity || 1,
          total: o.total_amount || o.subtotal || o.total || 0,
          customer: o.customer_name || "Customer",
          phone: o.customer_phone || "",
          email: o.customer_email,
          address: o.shipping_address || "",
          city: o.city || "",
          state: o.state || "",
          pincode: o.pincode || o.postal_code || "",
          notes: o.notes,
          status: o.status || "New",
          createdAt: o.created_at || new Date().toISOString(),
        };
      });
    }
  } catch (e) {
    console.warn("Failed to fetch live orders from Supabase:", e);
  }
  return [];
}

export async function syncOrderStockOnStatusChange(
  queryClient: any,
  order: { productId?: number | string; productName: string; qty: number },
  oldStatus: string,
  newStatus: string
) {
  const isDeductingStatus = (status: string) =>
    ["Confirmed", "Processing", "Packed", "Shipped", "Delivered"].includes(status);
  const isInitialStatus = (status: string) => ["New", "Contacted", "Pending"].includes(status);

  let stockDelta = 0;

  if (isInitialStatus(oldStatus) && isDeductingStatus(newStatus)) {
    // Transitioning from unconfirmed to confirmed/shipped: deduct stock
    stockDelta = -Math.abs(order.qty || 1);
  } else if (isDeductingStatus(oldStatus) && newStatus === "Cancelled") {
    // Transitioning from confirmed/shipped to cancelled: restore stock
    stockDelta = Math.abs(order.qty || 1);
  }

  if (stockDelta === 0) return;

  // Update Query Client cache for products
  queryClient.setQueryData(["products"], (old: Product[] = []) => {
    return old.map((p) => {
      const isMatch =
        (order.productId && String(p.id) === String(order.productId)) ||
        p.name.toLowerCase().trim() === order.productName.toLowerCase().trim();

      if (!isMatch) return p;

      const currentStock = typeof p.stock === "number" ? p.stock : 10;
      const updatedStock = Math.max(0, currentStock + stockDelta);
      return {
        ...p,
        stock: updatedStock,
        inStock: updatedStock > 0,
      };
    });
  });

  // Async sync to Supabase DB if possible
  try {
    const { data: dbProducts } = await supabase.from("products").select("*");
    if (dbProducts && dbProducts.length > 0) {
      const match = dbProducts.find(
        (p: any) =>
          (order.productId && String(p.id) === String(order.productId)) ||
          p.title?.toLowerCase().trim() === order.productName?.toLowerCase().trim()
      );
      if (match) {
        const curStock = typeof match.stock === "number" ? match.stock : 10;
        const newStock = Math.max(0, curStock + stockDelta);
        await supabase.from("products").update({ stock: newStock }).eq("id", match.id);
      }
    }
  } catch (e) {
    console.warn("Error syncing order stock change to DB:", e);
  }
}



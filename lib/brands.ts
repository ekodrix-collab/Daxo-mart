import { supabase } from "./supabase";

export interface BrandItem {
  id: string;
  name: string;
  logoUrl: string;
  is_active?: boolean;
  sort_order?: number;
}

/**
 * Fetch all brands directly from Supabase DB
 */
export async function getStoredBrands(): Promise<BrandItem[]> {
  try {
    const { data, error } = await supabase
      .from("brands")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error || !data) {
      return [];
    }

    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      logoUrl: item.logo_url,
      is_active: item.is_active ?? true,
      sort_order: item.sort_order ?? 0,
    }));
  } catch {
    return [];
  }
}

/**
 * Save or Edit/Update a brand in Supabase DB
 */
export async function saveBrandToSupabase(brand: {
  id?: string;
  name: string;
  logoUrl: string;
  is_active?: boolean;
}): Promise<BrandItem | null> {
  try {
    const payload = {
      name: brand.name.trim().toUpperCase(),
      logo_url: brand.logoUrl,
      is_active: brand.is_active ?? true,
      updated_at: new Date().toISOString(),
    };

    if (brand.id) {
      const { data, error } = await supabase
        .from("brands")
        .update(payload)
        .eq("id", brand.id)
        .select()
        .single();

      if (error) return null;
      return {
        id: data.id,
        name: data.name,
        logoUrl: data.logo_url,
        is_active: data.is_active,
      };
    } else {
      const { data, error } = await supabase
        .from("brands")
        .insert([payload])
        .select()
        .single();

      if (error) return null;
      return {
        id: data.id,
        name: data.name,
        logoUrl: data.logo_url,
        is_active: data.is_active,
      };
    }
  } catch {
    return null;
  }
}

/**
 * Delete a brand from Supabase DB
 */
export async function deleteBrandFromSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("brands").delete().eq("id", id);
    return !error;
  } catch {
    return false;
  }
}

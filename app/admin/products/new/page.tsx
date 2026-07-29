"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { fetchCategories, saveProductToSupabase } from "@/service/storeService";
import ProductFormEditor from "../../components/ProductFormEditor";
import { type Product } from "@/lib/products";
import { type CategoryItem } from "@/lib/categories";
import { useToast } from "@/components/ToastProvider";

export default function NewProductPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const toast = useToast();

  const { data: categories = [] } = useQuery<CategoryItem[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const handleSave = async (formData: any) => {
    // 1. Save directly to Supabase DB
    try {
      await saveProductToSupabase(formData);
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product Created Successfully", `"${formData.name}" has been published.`);
    } catch (err: any) {
      console.error("Product creation Supabase error:", err);
      toast.error("Product Creation Failed", err?.message || "Failed to create product in database.");
    }

    // 2. SPA navigation back to products list
    router.push("/admin/products");
  };

  return <ProductFormEditor categories={categories} isEditing={false} onSave={handleSave} />;
}

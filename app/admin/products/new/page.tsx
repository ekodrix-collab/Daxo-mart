"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchProducts, fetchCategories, saveProductToSupabase } from "@/service/storeService";
import ProductFormEditor from "../../components/ProductFormEditor";
import { type Product } from "@/lib/products";
import { type CategoryItem } from "@/lib/categories";
import { useToast } from "@/components/ToastProvider";
import { Suspense } from "react";

function NewProductContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const duplicateId = searchParams.get("duplicateId");
  const queryClient = useQueryClient();
  const toast = useToast();

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const { data: categories = [] } = useQuery<CategoryItem[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const sourceProduct = duplicateId ? products.find((p) => String(p.id) === String(duplicateId)) : null;

  const initialData = sourceProduct
    ? {
        ...sourceProduct,
        id: undefined,
        name: `${sourceProduct.name} (Copy)`,
        shortName: sourceProduct.shortName ? `${sourceProduct.shortName} (Copy)` : `${sourceProduct.name} (Copy)`,
        sku: `DXM-${Math.floor(1000 + Math.random() * 9000)}`,
        slug: `${sourceProduct.slug || "product"}-copy-${Math.floor(100 + Math.random() * 900)}`,
      }
    : undefined;

  const handleSave = async (formData: any) => {
    try {
      await saveProductToSupabase(formData);
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(
        duplicateId ? "Duplicated Product Published" : "Product Created Successfully",
        `"${formData.name}" has been published.`
      );
    } catch (err: any) {
      console.error("Product creation Supabase error:", err);
      toast.error("Product Creation Failed", err?.message || "Failed to create product in database.");
    }
    router.push("/admin/products");
  };

  return <ProductFormEditor categories={categories} isEditing={false} initialData={initialData} onSave={handleSave} />;
}

export default function NewProductPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-gray-400">Loading form...</div>}>
      <NewProductContent />
    </Suspense>
  );
}

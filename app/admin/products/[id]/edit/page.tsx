"use client";

import { use } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { fetchProducts, fetchCategories } from "@/service/storeService";
import ProductFormEditor from "../../../components/ProductFormEditor";
import { type Product } from "@/lib/products";
import { type CategoryItem } from "@/lib/categories";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const productIdStr = resolvedParams.id;
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: products = [], isLoading: loadingProducts } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const { data: categories = [] } = useQuery<CategoryItem[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const product = products.find(
    (p) => String(p.id) === productIdStr || p.slug === productIdStr
  );

  const handleSave = async (formData: any) => {
    const updatedProd: Product = {
      ...product,
      ...formData,
      id: product?.id || productIdStr,
      priceStr: `₹${Number(formData.price).toLocaleString("en-IN")}`,
      oldPriceStr: formData.oldPrice ? `₹${Number(formData.oldPrice).toLocaleString("en-IN")}` : "",
    };

    // 1. Direct cache update for instant SPA list response
    queryClient.setQueryData<Product[]>(["products"], (old = []) =>
      old.map((p) => (String(p.id) === productIdStr || p.slug === productIdStr ? updatedProd : p))
    );

    // 2. Await backend sync to ensure Supabase updates DB before navigating
    try {
      const res = await fetch(`/api/products/${productIdStr}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      console.log("Product edit API result:", result);
    } catch (e) {
      console.error("Product edit API error:", e);
    }

    // 3. Invalidate React Query cache so storefront & admin re-fetch fresh data from DB
    await queryClient.invalidateQueries({ queryKey: ["products"] });

    // 4. Navigation back
    router.push("/admin/products");
  };

  if (loadingProducts) {
    return (
      <div className="py-20 text-center text-gray-400">
        <div className="w-8 h-8 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Loading Product Editor...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-[#141416] border border-[#222226] rounded-[20px] p-12 text-center text-gray-400">
        Product not found.
      </div>
    );
  }

  return (
    <ProductFormEditor
      initialData={product}
      categories={categories}
      isEditing={true}
      onSave={handleSave}
    />
  );
}

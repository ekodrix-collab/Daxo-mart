"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { fetchCategories } from "@/service/storeService";
import ProductFormEditor from "../../components/ProductFormEditor";
import { type Product } from "@/lib/products";
import { type CategoryItem } from "@/lib/categories";

export default function NewProductPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: categories = [] } = useQuery<CategoryItem[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const handleSave = async (formData: any) => {
    // 1. Direct optimistic cache update to 'products' query
    const newId = Math.floor(100 + Math.random() * 900);
    const newProd: Product = {
      id: newId,
      slug: formData.slug || `prod-${newId}`,
      name: formData.name,
      shortName: formData.shortName || formData.name,
      price: formData.price,
      oldPrice: formData.oldPrice,
      priceStr: `₹${Number(formData.price).toLocaleString("en-IN")}`,
      oldPriceStr: formData.oldPrice ? `₹${Number(formData.oldPrice).toLocaleString("en-IN")}` : "",
      scale: formData.scale || formData.category || "1:24",
      category: formData.category || "1:24",
      img: formData.img || "/images/placeholder.png",
      images: formData.images || [formData.img || "/images/placeholder.png"],
      badge: formData.badge,
      description: formData.description,
      features: formData.features || [],
      inStock: formData.inStock ?? true,
      sku: formData.sku || `DXM-${newId}`,
    };

    queryClient.setQueryData<Product[]>(["products"], (old = []) => [newProd, ...old]);

    // 2. Call backend product creation API asynchronously
    try {
      fetch("/api/products/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }).catch((err) => console.error("Product create API error:", err));
    } catch (e) {
      console.warn("Product create API dispatch error:", e);
    }

    // 3. Instant SPA navigation back to products list
    router.push("/admin/products");
  };

  return <ProductFormEditor categories={categories} isEditing={false} onSave={handleSave} />;
}

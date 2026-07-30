"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { fetchProducts, fetchCategories } from "@/service/storeService";
import { type Product } from "@/lib/products";
import { type CategoryItem } from "@/lib/categories";
import { Search, Plus, Edit2, Trash2, CheckCircle, XCircle, LayoutGrid, List } from "lucide-react";

export default function ProductsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  const { data: products = [], isLoading: loadingProducts } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const { data: categoriesList = [] } = useQuery<CategoryItem[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number | string) => {
      // In production calls DB delete API if configured
      return id;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["products"] });
      const previous = queryClient.getQueryData<Product[]>(["products"]) || [];
      queryClient.setQueryData<Product[]>(["products"], (old = []) =>
        old.filter((p) => p.id !== id)
      );
      return { previous };
    },
  });

  const toggleStockMutation = useMutation({
    mutationFn: async (id: number | string) => {
      return id;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["products"] });
      const previous = queryClient.getQueryData<Product[]>(["products"]) || [];
      queryClient.setQueryData<Product[]>(["products"], (old = []) =>
        old.map((p) => (p.id === id ? { ...p, inStock: !p.inStock } : p))
      );
      return { previous };
    },
  });

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === "All" || p.category === selectedCategory;
    const matchesSearch =
      !searchTerm ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#141416] border border-[#222226] p-6 rounded-[20px] shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[22px] font-bold text-white tracking-tight font-pally">
            Diecast Product Catalog
          </h2>
          <p className="text-[13px] text-gray-400 mt-1 font-normal">
            Manage product listings, pricing, scale categories & stock availability.
          </p>
        </div>
        <button
          onClick={() => router.push("/admin/products/new")}
          className="bg-[#C5A059] hover:bg-[#b08b46] active:scale-[0.98] text-black font-bold text-[12px] tracking-wider uppercase px-5 py-3 rounded-2xl transition-all shadow-md flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus size={16} /> Add New Product
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`px-4 py-2 rounded-xl text-[12px] font-semibold tracking-wide transition-all flex items-center gap-2 shrink-0 border cursor-pointer ${
              selectedCategory === "All"
                ? "bg-[#C5A059] text-black border-[#C5A059] shadow-sm font-bold"
                : "bg-[#141416] text-gray-300 border-[#222226] hover:bg-[#1A1A1D]"
            }`}
          >
            <span>All Scale</span>
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full ${
                selectedCategory === "All" ? "bg-black text-[#C5A059] font-bold" : "bg-[#202024] text-gray-400"
              }`}
            >
              {products.length}
            </span>
          </button>

          {categoriesList.map((cat) => {
            const count = products.filter(
              (p) => p.category === cat.filterValue || p.category === cat.name
            ).length;
            const active = selectedCategory === cat.filterValue || selectedCategory === cat.name;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.filterValue)}
                className={`px-4 py-2 rounded-xl text-[12px] font-semibold tracking-wide transition-all flex items-center gap-2 shrink-0 border cursor-pointer ${
                  active
                    ? "bg-[#C5A059] text-black border-[#C5A059] shadow-sm font-bold"
                    : "bg-[#141416] text-gray-300 border-[#222226] hover:bg-[#1A1A1D]"
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full ${
                    active ? "bg-black text-[#C5A059] font-bold" : "bg-[#202024] text-gray-400"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & View Toggle */}
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by model name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#141416] border border-[#222226] text-white text-[13px] pl-10 pr-4 py-2 rounded-xl outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 transition-all placeholder:text-gray-500"
            />
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center bg-[#141416] border border-[#222226] p-1 rounded-xl shrink-0">
            <button
              onClick={() => setViewMode("cards")}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === "cards" ? "bg-[#C5A059] text-black" : "text-gray-400 hover:text-white"
              }`}
              title="Card Grid View"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === "table" ? "bg-[#C5A059] text-black" : "text-gray-400 hover:text-white"
              }`}
              title="Table View"
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {loadingProducts ? (
        <div className="py-20 text-center text-gray-400">
          <div className="w-8 h-8 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading Product Catalog...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-[#141416] border border-[#222226] rounded-[20px] p-12 text-center text-gray-400">
          No products found matching &quot;{searchTerm}&quot; in {selectedCategory}.
        </div>
      ) : viewMode === "cards" ? (
        /* CARDS GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="bg-[#141416] border border-[#222226] rounded-[20px] overflow-hidden hover:border-[#C5A059]/60 hover:-translate-y-0.5 transition-all duration-200 shadow-md group flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-4/3 bg-[#0D0D0F] border-b border-[#222226] overflow-hidden">
                  <Image
                    src={p.img}
                    alt={p.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                    <span className="px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-white/10 text-white font-mono text-[11px] font-bold">
                      {p.category}
                    </span>
                    {p.badge && (
                      <span className="px-2.5 py-1 rounded-lg bg-[#C5A059] text-black font-extrabold text-[10px] uppercase tracking-wider shadow-sm">
                        {p.badge}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <span className="text-[11px] font-mono text-gray-500 uppercase tracking-wider block">
                    {p.sku}
                  </span>
                  <h3 className="text-[15px] font-bold text-white line-clamp-2 leading-snug font-pally">
                    {p.name}
                  </h3>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-[#222226] mt-3 flex items-center justify-between">
                <div>
                  <span className="text-[16px] font-extrabold text-[#C5A059] font-pally">
                    {p.priceStr}
                  </span>
                  {p.oldPriceStr && (
                    <span className="text-[12px] text-gray-500 line-through ml-2">
                      {p.oldPriceStr}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => router.push(`/admin/products/${p.id}/edit`)}
                    className="p-2 rounded-xl bg-[#202024] hover:bg-[#C5A059] text-gray-300 hover:text-black border border-gray-800 transition-colors cursor-pointer"
                    title="Edit Product"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Delete product?")) deleteMutation.mutate(p.id);
                    }}
                    className="p-2 rounded-xl bg-[#202024] hover:bg-red-500/20 text-gray-400 hover:text-red-400 border border-gray-800 transition-colors cursor-pointer"
                    title="Delete Product"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-[#141416] border border-[#222226] rounded-[20px] overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#222226] bg-[#1A1A1D] text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Image</th>
                  <th className="py-3.5 px-4">Product Name & SKU</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Stock Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222226] text-[13px]">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-[#1C1C20] transition-colors">
                    <td className="py-3 px-4">
                      <div className="w-12 h-12 rounded-xl bg-[#0D0D0F] border border-[#26262A] overflow-hidden relative">
                        <Image src={p.img} alt={p.name} fill className="object-cover" />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-white">{p.name}</p>
                      <p className="text-[11px] text-gray-500 font-mono">{p.sku}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-lg bg-[#202024] text-gray-300 text-[11px] font-mono border border-gray-800">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-extrabold text-[#C5A059] font-pally">{p.priceStr}</span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleStockMutation.mutate(p.id)}
                        className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase transition-colors cursor-pointer border ${
                          p.inStock
                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                            : "bg-red-500/20 text-red-400 border-red-500/30"
                        }`}
                      >
                        {p.inStock ? "In Stock" : "Out of Stock"}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => router.push(`/admin/products/${p.id}/edit`)}
                          className="p-2 rounded-xl bg-[#202024] hover:bg-[#C5A059] text-gray-300 hover:text-black border border-gray-800 transition-colors cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm("Delete product?")) deleteMutation.mutate(p.id);
                          }}
                          className="p-2 rounded-xl bg-[#202024] hover:bg-red-500/20 text-gray-400 hover:text-red-400 border border-gray-800 transition-colors cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

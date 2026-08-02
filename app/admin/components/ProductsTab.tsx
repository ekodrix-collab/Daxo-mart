"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { type Product } from "@/lib/products";
import { fetchProducts, fetchCategories, saveProductToSupabase } from "@/service/storeService";
import { type CategoryItem } from "@/lib/categories";
import { compressImage } from "@/lib/imageCompressor";
import { Search, Plus, Edit2, Trash2, Copy, CheckCircle, XCircle, Tag, Package, Upload, LayoutGrid, List } from "lucide-react";

export default function ProductsTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categoriesList, setCategoriesList] = useState<CategoryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchProducts().then((res) => setProducts(res));
    fetchCategories().then((res) => setCategoriesList(res));
  }, []);

  // Form State for Add / Edit
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    shortName: "",
    category: "1:24",
    price: 1299,
    oldPrice: 1799,
    priceStr: "₹1,299",
    oldPriceStr: "₹1,799",
    inStock: true,
    sku: "",
    img: "",
    badge: null,
    description: "",
  });

  const [isUploading, setIsUploading] = useState(false);

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === "All" || p.category === selectedCategory;
    const matchesSearch =
      !searchTerm ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      // 1. Client-side lossless compression to WebP
      const compressedBlob = await compressImage(file, 1200, 1200, 0.85);
      const compressedFile = new File([compressedBlob], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
        type: "image/webp",
      });

      // 2. Upload compressed file
      const data = new FormData();
      data.append("file", compressedFile);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });
      const result = await res.json();
      if (result.url) {
        setFormData((prev) => ({ ...prev, img: result.url }));
      }
    } catch (err) {
      console.error("Product image upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.shortName || !formData.name) return;

    if (editingProduct) {
      const updatedData = {
        ...editingProduct,
        ...formData,
        priceStr: `₹${Number(formData.price).toLocaleString("en-IN")}`,
        oldPriceStr: formData.oldPrice ? `₹${Number(formData.oldPrice).toLocaleString("en-IN")}` : "",
        images: (formData.images && formData.images.length > 0) ? formData.images : [formData.img || "/images/placeholder.png"],
      } as Product;

      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? updatedData : p))
      );

      try {
        fetch(`/api/products/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        }).catch((err) => console.error("Async product update API error:", err));
      } catch (err) {
        console.error("API call error:", err);
      }
    } else {
      const newId = Date.now();
      const gallery = (formData.images && formData.images.length > 0)
        ? formData.images
        : [formData.img || "/images/placeholder.png"];

      const newProd: Product = {
        id: newId,
        slug: formData.slug || `prod-${newId}`,
        name: formData.name || "",
        shortName: formData.shortName || "",
        price: Number(formData.price) || 0,
        costPrice: Number(formData.costPrice) || 0,
        oldPrice: Number(formData.oldPrice) || 0,
        priceStr: `₹${Number(formData.price || 0).toLocaleString("en-IN")}`,
        oldPriceStr: `₹${Number(formData.oldPrice || 0).toLocaleString("en-IN")}`,
        scale: formData.category || "1:24",
        category: (formData.category as Product["category"]) || "1:24",
        img: gallery[0],
        images: gallery,
        badge: formData.badge || null,
        description: formData.description || "",
        features: ["Die-cast premium quality", "Detailed replica"],
        inStock: formData.inStock ?? true,
        sku: formData.sku || `DXM-${newId}`,
      };
      setProducts([newProd, ...products]);

      // Call Product Creation API
      try {
        fetch("/api/products/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, images: gallery }),
        }).catch((err) => console.error("Async product create API error:", err));
      } catch (err) {
        console.error("API call error:", err);
      }
    }

    setIsAdding(false);
    setEditingProduct(null);
  };

  const openEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData(p);
    setIsAdding(true);
  };

  const openDuplicate = (p: Product) => {
    setEditingProduct(null);
    const newSku = `DXM-${Math.floor(1000 + Math.random() * 9000)}`;
    setFormData({
      ...p,
      id: undefined,
      name: `${p.name} (Copy)`,
      shortName: p.shortName ? `${p.shortName} (Copy)` : `${p.name} (Copy)`,
      sku: newSku,
      slug: `${p.slug || "product"}-copy-${Math.floor(100 + Math.random() * 900)}`,
    });
    setIsAdding(true);
  };

  const openAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      shortName: "",
      category: "1:24",
      price: 1299,
      oldPrice: 1799,
      inStock: true,
      sku: `DXM-${Math.floor(100 + Math.random() * 900)}`,
      img: "",
      badge: null,
      description: "",
    });
    setIsAdding(true);
  };

  const handleDelete = (id: number | string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts((prev) => prev.filter((p) => String(p.id) !== String(id)));
    }
  };

  const toggleStock = (id: number | string) => {
    setProducts((prev) =>
      prev.map((p) => (String(p.id) === String(id) ? { ...p, inStock: !p.inStock } : p))
    );
  };

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
          onClick={openAdd}
          className="bg-[#C5A059] hover:bg-[#b08b46] active:scale-[0.98] text-black font-bold text-[12px] tracking-wider uppercase px-5 py-3 rounded-2xl transition-all shadow-md flex items-center gap-2 shrink-0"
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
              title="Card Grid View"
              className={`p-2 rounded-lg text-[12px] transition-all flex items-center gap-1.5 font-semibold cursor-pointer ${
                viewMode === "cards"
                  ? "bg-[#C5A059] text-black font-bold shadow-sm"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <LayoutGrid size={16} />
              <span className="hidden sm:inline">Cards</span>
            </button>
            <button
              onClick={() => setViewMode("table")}
              title="Table View"
              className={`p-2 rounded-lg text-[12px] transition-all flex items-center gap-1.5 font-semibold cursor-pointer ${
                viewMode === "table"
                  ? "bg-[#C5A059] text-black font-bold shadow-sm"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <List size={16} />
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* Render Product List: Table or Cards */}
      {filteredProducts.length === 0 ? (
        <div className="bg-[#141416] border border-[#222226] rounded-[20px] p-12 text-center text-gray-400 text-[14px]">
          No products found matching criteria.
        </div>
      ) : viewMode === "table" ? (
        /* Products Table View */
        <div className="bg-[#141416] border border-[#222226] rounded-[20px] overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#222226] bg-[#1A1A1D] text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-4">SKU</th>
                  <th className="py-3.5 px-4">Category / Scale</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Stock Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222226] text-[13px]">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-[#1C1C20] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#1C1C20] border border-[#28282D] rounded-xl shrink-0 p-1 flex items-center justify-center overflow-hidden">
                          <Image src={p.img} alt={p.shortName} width={40} height={40} unoptimized className="object-contain max-h-full" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-white truncate max-w-xs">{p.name}</p>
                          <p className="text-[11px] text-gray-400 truncate">{p.shortName}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[12px] text-gray-300">
                      {p.sku}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="bg-[#1C1C20] text-gray-300 border border-[#2B2B30] text-[11px] font-bold px-2.5 py-1 rounded-md">
                        {p.scale || p.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-extrabold text-[#C5A059] font-pally">{p.priceStr}</span>
                      {p.oldPriceStr && (
                        <span className="text-[11px] text-gray-500 line-through ml-2">{p.oldPriceStr}</span>
                      )}
                      {p.costPrice ? (
                        <p className="text-[10.5px] font-bold text-amber-400 font-mono mt-0.5">
                          Cost: ₹{p.costPrice.toLocaleString("en-IN")}
                        </p>
                      ) : null}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleStock(p.id)}
                        className={`text-[11px] font-bold px-3 py-1 rounded-full border transition-all cursor-pointer ${
                          p.inStock
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                            : "bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20"
                        }`}
                      >
                        {p.inStock ? "✓ In Stock" : "✕ Out of Stock"}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(p)}
                          className="p-2 bg-[#202024] hover:bg-[#2A2A30] text-white rounded-lg border border-gray-800 transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => openDuplicate(p)}
                          className="p-2 bg-[#C5A059]/15 hover:bg-[#C5A059]/30 text-[#C5A059] rounded-lg border border-[#C5A059]/30 transition-colors"
                          title="Duplicate Product (Copy to another scale/category)"
                        >
                          <Copy size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg border border-red-500/20 transition-colors"
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
      ) : (
        /* Product Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredProducts.map((p) => (
          <div
            key={p.id}
            className="bg-[#141416] border border-[#222226] rounded-[20px] p-5 flex flex-col justify-between hover:border-[#C5A059]/60 hover:-translate-y-0.5 transition-all duration-200 shadow-md hover:shadow-lg group"
          >
            <div>
              <div className="flex gap-4 items-start">
                <div className="bg-[#1C1C20] rounded-2xl shrink-0 overflow-hidden border border-[#28282D] p-2 w-20 h-20 flex items-center justify-center relative">
                  <Image
                    src={p.img}
                    alt={p.shortName}
                    width={72}
                    height={72}
                    unoptimized
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[#202024] text-[#C5A059] border border-[#2D2D32]">
                      {p.category === "Frame" ? "3D Frame" : p.category}
                    </span>
                  </div>

                  <h3 className="text-[14.5px] font-bold text-white mt-2 leading-snug truncate group-hover:text-[#C5A059] transition-colors font-pally">
                    {p.name}
                  </h3>
                  <p className="text-[11px] text-gray-400 mt-0.5 font-mono">SKU: {p.sku}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#222226]">
                <div>
                  <span className="text-[17px] font-bold text-[#C5A059] font-pally">
                    {p.priceStr}
                  </span>
                  <span className="text-[13px] text-gray-500 line-through ml-2 font-pally">
                    {p.oldPriceStr}
                  </span>
                  {p.costPrice ? (
                    <p className="text-[11px] font-bold text-amber-400 font-mono mt-0.5">
                      Dealer Cost: ₹{p.costPrice.toLocaleString("en-IN")}
                    </p>
                  ) : null}
                </div>
                {p.badge && (
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[#C5A059]/15 text-[#C5A059] border border-[#C5A059]/30">
                    {p.badge}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#222226]">
              <button
                onClick={() => openEdit(p)}
                className="flex-1 bg-[#202024] hover:bg-[#2A2A30] text-white text-[12px] font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 border border-gray-800 cursor-pointer"
              >
                <Edit2 size={13} /> Edit
              </button>
              <button
                onClick={() => openDuplicate(p)}
                className="flex-1 bg-[#C5A059]/15 hover:bg-[#C5A059]/25 text-[#C5A059] text-[12px] font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 border border-[#C5A059]/30 cursor-pointer"
                title="Duplicate Product (Copy to another scale/category)"
              >
                <Copy size={13} /> Duplicate
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                className="px-3.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-[12px] font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                title="Delete product"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Add / Edit Product Modal - Dark Theme */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#121214] border border-[#222226] rounded-[24px] p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl my-auto text-white">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#222226]">
              <div>
                <h3 className="text-[18px] font-bold text-white font-pally">
                  {editingProduct ? "Edit Product Listing" : "Add New Diecast Product"}
                </h3>
                <p className="text-[12px] text-gray-400 mt-0.5">
                  Update item details, scale category, pricing and images.
                </p>
              </div>
              <button
                onClick={() => setIsAdding(false)}
                className="w-8 h-8 rounded-full bg-[#202024] hover:bg-[#2C2C32] text-gray-400 flex items-center justify-center transition-colors text-[18px] border border-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-[12px] font-semibold text-gray-300 block mb-1.5">
                  Full Product Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. 1:24 Land Rover Range Rover – Pearl White"
                  className="w-full bg-[#18181A] border border-[#2A2A2E] text-white text-[13px] px-4 py-3 rounded-2xl outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 transition-all placeholder:text-gray-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[12px] font-semibold text-gray-300 block mb-1.5">
                    Display Short Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.shortName || ""}
                    onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                    placeholder="Range Rover White"
                    className="w-full bg-[#18181A] border border-[#2A2A2E] text-white text-[13px] px-4 py-3 rounded-2xl outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 transition-all placeholder:text-gray-500"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-semibold text-gray-300 block mb-1.5">
                    Scale Category
                  </label>
                  <select
                    value={formData.category || "1:24"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as Product["category"],
                      })
                    }
                    className="w-full bg-[#18181A] border border-[#2A2A2E] text-white text-[13px] px-4 py-3 rounded-2xl outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 transition-all cursor-pointer"
                  >
                    {categoriesList.map((c) => (
                      <option key={c.id} value={c.filterValue} className="bg-[#141416]">
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[12px] font-semibold text-gray-300 block mb-1.5">
                    Selling Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, price: Number(e.target.value) })
                    }
                    className="w-full bg-[#18181A] border border-[#2A2A2E] text-white text-[13px] px-4 py-3 rounded-2xl outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-semibold text-gray-300 block mb-1.5">
                    Original MRP (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.oldPrice || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, oldPrice: Number(e.target.value) })
                    }
                    className="w-full bg-[#18181A] border border-[#2A2A2E] text-white text-[13px] px-4 py-3 rounded-2xl outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[12px] font-semibold text-gray-300 block mb-1.5">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    value={formData.sku || ""}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full bg-[#18181A] border border-[#2A2A2E] text-white text-[13px] px-4 py-3 rounded-2xl outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 transition-all font-mono"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-semibold text-gray-300 block mb-1.5">
                    Image Path / Asset URL
                  </label>
                  <input
                    type="text"
                    value={formData.img || ""}
                    onChange={(e) => setFormData({ ...formData, img: e.target.value })}
                    placeholder="/images/car-suv.png"
                    className="w-full bg-[#18181A] border border-[#2A2A2E] text-white text-[13px] px-4 py-3 rounded-2xl outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 transition-all placeholder:text-gray-500"
                  />
                </div>
              </div>

              {/* Upload Dropzone Preview Component */}
              <label className="border-2 border-dashed border-[#28282D] rounded-2xl p-4 text-center bg-[#18181A] hover:border-[#C5A059] transition-colors cursor-pointer block relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Upload size={20} className="mx-auto text-[#C5A059] mb-1" />
                <p className="text-[12px] font-medium text-gray-300">
                  {isUploading ? "Compressing to WebP & Uploading..." : "Click to select or drag & drop diecast photos"}
                </p>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  Auto-compressed to WebP without quality loss • Uploaded to Cloudinary
                </p>
              </label>

              <div className="flex gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-[13px] text-gray-300 font-medium">
                  <input
                    type="checkbox"
                    checked={formData.inStock ?? true}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                    className="accent-[#C5A059] w-4 h-4 rounded"
                  />
                  Mark as Available In Stock
                </label>
              </div>

              <div className="flex gap-3 mt-6 pt-4 border-t border-[#222226]">
                <button
                  type="submit"
                  className="flex-1 bg-[#C5A059] hover:bg-[#b08b46] text-black font-bold text-[13px] uppercase py-3.5 rounded-2xl transition-all shadow-md"
                >
                  Save Product Listing
                </button>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-6 bg-[#202024] hover:bg-[#2A2A30] text-gray-300 text-[13px] font-bold uppercase py-3.5 rounded-2xl transition-colors border border-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

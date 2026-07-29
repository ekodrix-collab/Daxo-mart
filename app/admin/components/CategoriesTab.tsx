"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import PRODUCTS from "@/lib/products";
import { getStoredCategories, saveStoredCategories, type CategoryItem } from "@/lib/categories";
import { Plus, Search, Edit2, Trash2, Tag, Layers, Loader2, Upload, ArrowUp, ArrowDown } from "lucide-react";
import { fetchCategories, createCategory, updateCategory, updateCategoryOrder, deleteCategory } from "@/service/storeService";
import { compressImage } from "@/lib/imageCompressor";

export default function CategoriesTab() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleMoveOrder = async (index: number, direction: "up" | "down") => {
    const newCategories = [...categories];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newCategories.length) return;

    // Swap elements
    const temp = newCategories[index];
    newCategories[index] = newCategories[targetIndex];
    newCategories[targetIndex] = temp;

    // Update sortOrder property
    const updatedWithSort = newCategories.map((c, i) => ({
      ...c,
      sortOrder: i + 1,
    }));

    setCategories(updatedWithSort);
    saveStoredCategories(updatedWithSort);

    await updateCategoryOrder(
      updatedWithSort.map((c) => ({ id: c.id, sortOrder: c.sortOrder || 0 }))
    );
  };

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    img: "/images/placeholder.png",
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      // 1. Client-side lossless compression to WebP (max 1200px, 85% visual quality)
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
      } else {
        alert(result.error || "Failed to upload category image");
      }
    } catch (err: any) {
      console.error("Category image upload error:", err);
      alert(err.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const loadCategories = async () => {
    setLoading(true);
    const data = await fetchCategories();
    setCategories(data);
    saveStoredCategories(data);
    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      slug: "",
      img: "/images/placeholder.png",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      img: cat.img,
    });
    setIsModalOpen(true);
  };

  const handleNameChange = (nameVal: string) => {
    const autoSlug = nameVal.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");
    setFormData((prev) => ({
      ...prev,
      name: nameVal,
      slug: autoSlug,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setSaving(true);
    const slug = formData.slug.trim() || formData.name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");

    if (editingCategory) {
      await updateCategory(editingCategory.id, {
        name: formData.name.trim(),
        slug,
        image_url: formData.img,
      });

      const updated = categories.map((c) =>
        c.id === editingCategory.id
          ? {
              ...c,
              name: formData.name.trim(),
              slug,
              img: formData.img,
              filterValue: c.filterValue || formData.name,
            }
          : c
      );
      setCategories(updated);
      saveStoredCategories(updated);
    } else {
      const created = await createCategory({
        name: formData.name.trim(),
        slug,
        image_url: formData.img || "/images/placeholder.png",
      });

      const newCat: CategoryItem = {
        id: created ? created.id : `cat-${Date.now()}`,
        name: formData.name.trim(),
        slug,
        img: formData.img || "/images/placeholder.png",
        filterValue: formData.name.trim(),
      };

      const updated = [...categories, newCat];
      setCategories(updated);
      saveStoredCategories(updated);
    }

    setSaving(false);
    setIsModalOpen(false);
    loadCategories();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      await deleteCategory(id);
      const filtered = categories.filter((c) => c.id !== id);
      setCategories(filtered);
      saveStoredCategories(filtered);
      loadCategories();
    }
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#141416] border border-[#222226] p-6 rounded-[20px] shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[22px] font-bold text-white tracking-tight font-pally">
            Categories & Collections
          </h2>
          <p className="text-[13px] text-gray-400 mt-1 font-normal">
            Organize diecast scales and collections. Category images appear on the Storefront "Shop By Category" carousel.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-[#C5A059] hover:bg-[#b08b46] active:scale-[0.98] text-black font-bold text-[12px] tracking-wider uppercase px-5 py-3 rounded-2xl transition-all shadow-md flex items-center gap-2 shrink-0"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative w-full lg:w-72">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#141416] border border-[#222226] text-white text-[13px] pl-10 pr-4 py-2.5 rounded-2xl outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 transition-all placeholder:text-gray-500"
        />
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCategories.map((cat, idx) => {
          const productCount = PRODUCTS.filter(
            (p) => p.category === cat.filterValue || p.category === cat.name
          ).length;

          return (
            <div
              key={cat.id}
              className="bg-[#141416] border border-[#222226] rounded-[20px] p-5 flex items-center gap-4 hover:border-[#C5A059]/60 hover:-translate-y-0.5 transition-all duration-200 shadow-md group"
            >
              {/* Category Round Image Preview */}
              <div className="w-16 h-16 rounded-full bg-[#1C1C20] border-2 border-[#C5A059]/40 p-1 shrink-0 overflow-hidden relative flex items-center justify-center">
                <Image
                  src={cat.img}
                  alt={cat.name}
                  width={64}
                  height={64}
                  unoptimized
                  className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <h3 className="text-[15px] font-bold text-white group-hover:text-[#C5A059] transition-colors font-pally truncate">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-gray-400 font-mono mt-0.5 truncate">
                  Slug: /{cat.slug}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#C5A059]/15 text-[#C5A059] border border-[#C5A059]/30">
                    {productCount} Items
                  </span>
                </div>
              </div>

              {/* Move Order & Edit / Delete Buttons */}
              <div className="flex flex-col gap-1.5 shrink-0">
                <div className="flex gap-1">
                  <button
                    disabled={idx === 0}
                    onClick={() => handleMoveOrder(idx, "up")}
                    className="p-1.5 bg-[#202024] hover:bg-[#2A2A30] disabled:opacity-30 disabled:hover:bg-[#202024] text-gray-300 rounded-lg transition-colors border border-gray-800 cursor-pointer"
                    title="Move Left / Up in Storefront"
                  >
                    <ArrowUp size={13} />
                  </button>
                  <button
                    disabled={idx === filteredCategories.length - 1}
                    onClick={() => handleMoveOrder(idx, "down")}
                    className="p-1.5 bg-[#202024] hover:bg-[#2A2A30] disabled:opacity-30 disabled:hover:bg-[#202024] text-gray-300 rounded-lg transition-colors border border-gray-800 cursor-pointer"
                    title="Move Right / Down in Storefront"
                  >
                    <ArrowDown size={13} />
                  </button>
                </div>

                <div className="flex gap-1">
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-1.5 bg-[#202024] hover:bg-[#2A2A30] text-white rounded-lg transition-colors border border-gray-800 cursor-pointer flex-1 flex items-center justify-center"
                    title="Edit category"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors border border-red-500/20 cursor-pointer flex-1 flex items-center justify-center"
                    title="Delete category"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCategories.length === 0 && (
        <div className="bg-[#141416] border border-[#222226] rounded-[20px] p-12 text-center">
          <p className="text-gray-400 text-[14px]">No categories found.</p>
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#121214] border border-[#222226] rounded-[24px] p-6 w-full max-w-md shadow-2xl my-auto text-white">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#222226]">
              <div>
                <h3 className="text-[18px] font-bold text-white font-pally">
                  {editingCategory ? "Edit Category" : "Add New Category"}
                </h3>
                <p className="text-[12px] text-gray-400">Configure collection details and image URL.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#202024] hover:bg-[#2C2C32] text-gray-400 flex items-center justify-center transition-colors text-[18px] border border-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-[12px] font-semibold text-gray-300 block mb-1.5">
                  Category Display Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Diecast 1:18, Vintage, Supercars"
                  className="w-full bg-[#18181A] border border-[#2A2A2E] text-white text-[13px] px-4 py-3 rounded-2xl outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 transition-all placeholder:text-gray-500"
                />
              </div>

              <div>
                <label className="text-[12px] font-semibold text-gray-300 block mb-1.5">
                  Category URL Slug
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g. 1-18 or supercars"
                  className="w-full bg-[#18181A] border border-[#2A2A2E] text-white text-[13px] px-4 py-3 rounded-2xl outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 transition-all font-mono placeholder:text-gray-500"
                />
              </div>

              <div>
                <label className="text-[12px] font-semibold text-gray-300 block mb-1.5">
                  Category Image
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    required
                    value={formData.img}
                    onChange={(e) => setFormData({ ...formData, img: e.target.value })}
                    placeholder="/images/placeholder.png or Cloudinary URL"
                    className="flex-1 bg-[#18181A] border border-[#2A2A2E] text-white text-[13px] px-4 py-3 rounded-2xl outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 transition-all placeholder:text-gray-500 min-w-0"
                  />
                  <label className="bg-[#202024] hover:bg-[#2C2C32] border border-[#2A2A2E] text-gray-200 text-[12px] font-bold px-4 py-3 rounded-2xl cursor-pointer transition-all shrink-0 flex items-center gap-2">
                    {isUploading ? (
                      <Loader2 size={16} className="animate-spin text-[#C5A059]" />
                    ) : (
                      <Upload size={16} className="text-[#C5A059]" />
                    )}
                    <span>{isUploading ? "Uploading..." : "Upload"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="flex items-center gap-3 mt-2.5 p-2 bg-[#18181A] rounded-xl border border-[#2A2A2E]">
                  <span className="text-[11px] text-gray-400 font-medium">Image Preview:</span>
                  <div className="w-9 h-9 rounded-full bg-[#141416] border border-[#C5A059] overflow-hidden shrink-0">
                    <img
                      src={formData.img || "/images/placeholder.png"}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-4 border-t border-[#222226]">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-[#C5A059] hover:bg-[#b08b46] disabled:opacity-50 text-black font-bold text-[13px] uppercase py-3.5 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Saving...
                    </>
                  ) : (
                    "Save Category"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
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

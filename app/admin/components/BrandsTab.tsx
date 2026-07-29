"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getStoredBrands, saveStoredBrands, type BrandItem } from "@/lib/brands";
import { Plus, Search, Edit2, Trash2, Award, Upload, CheckCircle, Eye, EyeOff } from "lucide-react";

export default function BrandsTab() {
  const [brands, setBrands] = useState<BrandItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<BrandItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    logoUrl: "",
    is_active: true,
  });

  useEffect(() => {
    setBrands(getStoredBrands());
  }, []);

  const updateAndSave = (newList: BrandItem[]) => {
    setBrands(newList);
    saveStoredBrands(newList);
  };

  const handleOpenAdd = () => {
    setEditingBrand(null);
    setFormData({
      name: "",
      logoUrl: "",
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (brand: BrandItem) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      logoUrl: brand.logoUrl,
      is_active: brand.is_active ?? true,
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    // Convert to Data URL immediately so the image is previewable and saved right away
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setFormData((prev) => ({ ...prev, logoUrl: event.target!.result as string }));
      }
    };
    reader.readAsDataURL(file);

    const data = new FormData();
    data.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });
      const result = await res.json();
      if (result.url) {
        setFormData((prev) => ({ ...prev, logoUrl: result.url }));
      }
    } catch (err) {
      console.error("Image upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const formattedName = formData.name.trim().toUpperCase();

    if (editingBrand) {
      const updated = brands.map((b) =>
        b.id === editingBrand.id
          ? {
              ...b,
              name: formattedName,
              logoUrl: formData.logoUrl || b.logoUrl,
              is_active: formData.is_active,
            }
          : b
      );
      updateAndSave(updated);
    } else {
      const newBrand: BrandItem = {
        id: `brand-${Date.now()}`,
        name: formattedName,
        logoUrl: formData.logoUrl || "/images/placeholder.png",
        is_active: formData.is_active,
      };
      updateAndSave([...brands, newBrand]);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this brand?")) {
      const filtered = brands.filter((b) => b.id !== id);
      updateAndSave(filtered);
    }
  };

  const handleToggleActive = (id: string) => {
    const updated = brands.map((b) =>
      b.id === id ? { ...b, is_active: !(b.is_active ?? true) } : b
    );
    updateAndSave(updated);
  };

  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-[#141416] border border-[#222226] p-6 rounded-[20px] shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#C5A059] font-bold text-[12px] tracking-wider uppercase mb-1 font-pally">
            <Award size={16} /> Brand Marquee Management
          </div>
          <h2 className="text-[22px] font-bold text-white tracking-tight font-pally">
            Brand Logos & Names
          </h2>
          <p className="text-[13px] text-gray-400 mt-1 font-normal">
            Upload real logo images and manage the brand names displayed in the homepage status bar.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-[#C5A059] hover:bg-[#b08b46] active:scale-[0.98] text-black font-bold text-[13px] tracking-wider uppercase px-5 py-3 rounded-2xl transition-all shadow-md flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus size={18} /> Add New Brand
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center gap-4 bg-[#141416] border border-[#222226] rounded-2xl p-4 shadow-sm">
        <div className="flex-1 flex items-center gap-2 bg-[#18181A] border border-[#2A2A2E] rounded-xl px-4 py-2.5 text-white text-[13.5px]">
          <Search size={18} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search brands by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none text-white w-full placeholder:text-gray-500 font-pally"
          />
        </div>
        <div className="text-[12px] font-semibold text-gray-400 px-2 shrink-0">
          Total: <span className="text-[#C5A059]">{filteredBrands.length}</span> Brands
        </div>
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredBrands.map((brand) => (
          <div
            key={brand.id}
            className="bg-[#141416] border border-[#222226] hover:border-[#C5A059]/40 transition-all rounded-[20px] p-5 shadow-md flex flex-col justify-between group"
          >
            <div>
              {/* Logo Preview Container */}
              <div className="w-full h-28 bg-[#1B1B1E] border border-[#2A2A2E] rounded-xl p-4 flex items-center justify-center relative overflow-hidden mb-4 group-hover:bg-[#202024] transition-colors">
                {brand.logoUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={brand.logoUrl}
                    alt={brand.name}
                    className="max-h-16 max-w-full object-contain filter drop-shadow-md"
                  />
                ) : (
                  <div className="text-gray-500 text-xs">No Logo Uploaded</div>
                )}
                {/* Active Indicator */}
                <button
                  onClick={() => handleToggleActive(brand.id)}
                  title={brand.is_active !== false ? "Active (Click to hide)" : "Hidden (Click to show)"}
                  className={`absolute top-2.5 right-2.5 p-1.5 rounded-lg border text-[11px] font-medium transition-all ${
                    brand.is_active !== false
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : "bg-gray-800 border-gray-700 text-gray-500"
                  }`}
                >
                  {brand.is_active !== false ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
              </div>

              {/* Brand Name */}
              <h3 className="text-[15px] font-bold text-white tracking-widest font-pally uppercase truncate">
                {brand.name}
              </h3>
              <p className="text-[12px] text-gray-400 mt-1 font-mono">
                {brand.is_active !== false ? "Visible on Marquee" : "Hidden from Marquee"}
              </p>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center gap-2 pt-4 mt-4 border-t border-[#222226]">
              <button
                onClick={() => handleOpenEdit(brand)}
                className="flex-1 bg-[#1F1F23] hover:bg-[#2A2A30] text-gray-200 text-[12.5px] font-semibold py-2 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 border border-[#2E2E34] cursor-pointer"
              >
                <Edit2 size={14} className="text-[#C5A059]" /> Edit
              </button>
              <button
                onClick={() => handleDelete(brand.id)}
                className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors border border-red-500/20 cursor-pointer"
                title="Delete Brand"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredBrands.length === 0 && (
        <div className="bg-[#141416] border border-[#222226] rounded-[20px] p-12 text-center">
          <p className="text-gray-400 text-sm">No brands found matching "{searchTerm}".</p>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141416] border border-[#2B2B30] w-full max-w-lg rounded-[24px] shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#222226]">
              <h3 className="text-[18px] font-bold text-white font-pally">
                {editingBrand ? "Edit Brand" : "Add New Brand"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white text-lg font-bold px-2 py-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Brand Name Input */}
              <div>
                <label className="text-[12px] font-semibold text-gray-300 block mb-1.5">
                  Brand Name <span className="text-[#C5A059]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PORSCHE, JAGUAR, DUCATI"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#18181A] border border-[#2A2A2E] text-white text-[13.5px] px-4 py-3 rounded-2xl outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 transition-all font-pally placeholder:text-gray-500 uppercase tracking-wider"
                />
              </div>

              {/* Brand Logo Upload & Preview */}
              <div>
                <label className="text-[12px] font-semibold text-gray-300 block mb-1.5">
                  Brand Logo Real Image <span className="text-[#C5A059]">*</span>
                </label>

                {formData.logoUrl && (
                  <div className="mb-3 w-full h-24 bg-[#1C1C20] border border-[#2A2A2E] rounded-xl flex items-center justify-center p-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={formData.logoUrl}
                      alt="Brand Logo Preview"
                      className="max-h-16 max-w-full object-contain filter drop-shadow-md"
                    />
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <label className="flex-1 bg-[#18181A] hover:bg-[#202024] border border-[#2A2A2E] hover:border-[#C5A059] text-gray-300 text-[13px] px-4 py-3 rounded-2xl cursor-pointer transition-all flex items-center justify-center gap-2">
                    <Upload size={16} className="text-[#C5A059]" />
                    <span>{isUploading ? "Uploading Image..." : "Upload Logo Image File"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="mt-2.5">
                  <span className="text-[11px] text-gray-400 block mb-1">Or paste Image URL directly:</span>
                  <input
                    type="text"
                    placeholder="https://example.com/logo.png or data:image/..."
                    value={formData.logoUrl}
                    onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                    className="w-full bg-[#18181A] border border-[#2A2A2E] text-white text-[12.5px] px-3.5 py-2.5 rounded-xl outline-none focus:border-[#C5A059] font-mono placeholder:text-gray-600"
                  />
                </div>
              </div>

              {/* Status Toggle */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="brand_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 rounded accent-[#C5A059] cursor-pointer"
                />
                <label htmlFor="brand_active" className="text-[13px] text-gray-300 font-medium cursor-pointer">
                  Display brand logo and name on homepage BrandsBar
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#222226]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3 rounded-2xl bg-[#1A1A1E] text-gray-300 hover:text-white text-[13px] font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-6 py-3 rounded-2xl bg-[#C5A059] hover:bg-[#b08b46] text-black font-bold text-[13px] tracking-wider uppercase transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {editingBrand ? "Save Changes" : "Create Brand"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

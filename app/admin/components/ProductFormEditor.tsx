"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { type Product } from "@/lib/products";
import { type CategoryItem } from "@/lib/categories";
import { compressImage } from "@/lib/imageCompressor";
import {
  ArrowLeft,
  Upload,
  Plus,
  Trash2,
  Save,
  Tag,
  DollarSign,
  Package,
  FileText,
  Sliders,
  Search,
  ImageIcon,
  Star,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Palette,
  Film,
} from "lucide-react";

export type ProductFormTab =
  | "general"
  | "images"
  | "colors"
  | "pricing"
  | "inventory"
  | "description"
  | "specifications"
  | "seo";

interface ProductFormEditorProps {
  initialData?: Partial<Product> & Record<string, any>;
  categories: CategoryItem[];
  isEditing?: boolean;
  onSave: (data: any) => Promise<void>;
}

export default function ProductFormEditor({
  initialData,
  categories,
  isEditing = false,
  onSave,
}: ProductFormEditorProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ProductFormTab>("general");
  const [saving, setSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Form State
  const [name, setName] = useState(initialData?.name || "");
  const [shortName, setShortName] = useState(initialData?.shortName || "");
  const [category, setCategory] = useState(initialData?.category || "1:24");
  const [sku, setSku] = useState(
    initialData?.sku || `DXM-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [isActive, setIsActive] = useState<boolean>(initialData?.isActive ?? true);
  const [inStock, setInStock] = useState<boolean>(initialData?.inStock ?? true);
  const [badge, setBadge] = useState<string | null>(initialData?.badge || null);

  // Images & Video
  const [img, setImg] = useState(initialData?.img || "/images/placeholder.png");
  const [galleryImages, setGalleryImages] = useState<string[]>(
    initialData?.images && initialData.images.length > 0
      ? initialData.images
      : [initialData?.img || "/images/placeholder.png"]
  );
  const [videoUrl, setVideoUrl] = useState(initialData?.videoUrl || "");
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [videoUploadStatus, setVideoUploadStatus] = useState("");

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingVideo(true);
    setVideoUploadStatus(`Uploading ${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB)...`);

    try {
      const data = new FormData();
      data.append("file", file);

      const res = await fetch("/api/upload-video", {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      if (result.url) {
        setVideoUrl(result.url);
        setVideoUploadStatus("Video uploaded successfully!");
      } else if (result.note) {
        setVideoUploadStatus("Upload notice: " + result.note);
      } else {
        alert(result.error || "Failed to upload video");
        setVideoUploadStatus("");
      }
    } catch (err: any) {
      console.error("Video upload error:", err);
      alert("Video upload failed: " + err.message);
      setVideoUploadStatus("");
    } finally {
      setIsUploadingVideo(false);
    }
  };

  // Pricing
  const [price, setPrice] = useState<number>(initialData?.price || 1299);
  const [oldPrice, setOldPrice] = useState<number>(initialData?.oldPrice || 1799);
  const [taxRate, setTaxRate] = useState<number>(initialData?.taxRate || 18);

  // Inventory
  const [stock, setStock] = useState<number>(initialData?.stock ?? 15);
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(
    initialData?.lowStockThreshold ?? 5
  );

  // Description & Features
  const [description, setDescription] = useState(initialData?.description || "");
  const [shortDescription, setShortDescription] = useState(
    initialData?.shortDescription || ""
  );
  const [features, setFeatures] = useState<string[]>(
    initialData?.features || [
      "Quality Diecast Metal Body",
      "Opening Doors & Hood",
      "Detailed Interior Replica",
    ]
  );
  const [newFeature, setNewFeature] = useState("");

  // Specifications (Extensible Key-Value pairs)
  const [scale, setScale] = useState(initialData?.scale || "1:24");
  const [material, setMaterial] = useState(initialData?.material || "Diecast Metal & ABS");
  const [brand, setBrand] = useState(initialData?.brand || "Premium Replica");
  const [specs, setSpecs] = useState<Array<{ key: string; value: string }>>(
    initialData?.specs || [
      { key: "Material", value: "Diecast Metal Body with Plastic Parts" },
      { key: "Doors", value: "All Doors & Trunk Openable" },
      { key: "Wheels", value: "Rubber Tires with Steering Mechanism" },
    ]
  );

  // Color Options (Name + Image/Hex)
  const [colors, setColors] = useState<Array<{ name: string; colorHex?: string; image?: string }>>(
    initialData?.colors || []
  );
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("#3B82F6");
  const [newColorImg, setNewColorImg] = useState("");
  const [isUploadingColorImg, setIsUploadingColorImg] = useState(false);

  const handleColorImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingColorImg(true);
    try {
      const compressedBlob = await compressImage(file, 1200, 1200, 0.85);
      const compressedFile = new File(
        [compressedBlob],
        file.name.replace(/\.[^/.]+$/, "") + ".webp",
        { type: "image/webp" }
      );
      const data = new FormData();
      data.append("file", compressedFile);
      const res = await fetch("/api/upload", { method: "POST", body: data });
      const result = await res.json();
      if (result.url) {
        setNewColorImg(result.url);
      }
    } catch (err) {
      console.error("Color image upload error:", err);
    } finally {
      setIsUploadingColorImg(false);
    }
  };

  const addColorOption = () => {
    if (!newColorName.trim()) {
      alert("Please enter a color name (e.g., Yellow Car, White Car).");
      return;
    }
    setColors([...colors, { name: newColorName.trim(), colorHex: newColorHex, image: newColorImg || undefined }]);
    setNewColorName("");
    setNewColorImg("");
  };

  const removeColorOption = (idx: number) => {
    setColors(colors.filter((_, i) => i !== idx));
  };

  // SEO
  const [slug, setSlug] = useState(
    initialData?.slug ||
      (name || shortName || "product").toLowerCase().replace(/[^a-z0-9]+/g, "-")
  );
  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(
    initialData?.metaDescription || ""
  );
  const [metaKeywords, setMetaKeywords] = useState(initialData?.metaKeywords || "");
  const [ogImage, setOgImage] = useState(initialData?.ogImage || "");

  // Auto update slug when name changes if slug not manually set
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing && !initialData?.slug) {
      setSlug(val.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-"));
    }
  };

  // Multiple Image File Upload Handler
  const handleMultipleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const compressedBlob = await compressImage(file, 1200, 1200, 0.85);
        const compressedFile = new File(
          [compressedBlob],
          file.name.replace(/\.[^/.]+$/, "") + ".webp",
          { type: "image/webp" }
        );

        const data = new FormData();
        data.append("file", compressedFile);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: data,
        });
        const result = await res.json();
        if (result.url) {
          newUrls.push(result.url);
        }
      }

      if (newUrls.length > 0) {
        setGalleryImages((prev) => [...prev, ...newUrls]);
        if (!img || img === "/images/placeholder.png") {
          setImg(newUrls[0]);
        }
      }
    } catch (err) {
      console.error("Multiple image upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSetMainImage = (targetUrl: string) => {
    setImg(targetUrl);
    setGalleryImages((prev) => {
      const filtered = prev.filter((u) => u !== targetUrl);
      return [targetUrl, ...filtered];
    });
  };

  const addFeature = () => {
    if (!newFeature.trim()) return;
    setFeatures([...features, newFeature.trim()]);
    setNewFeature("");
  };

  const removeFeature = (idx: number) => {
    setFeatures(features.filter((_, i) => i !== idx));
  };

  const addSpec = () => {
    setSpecs([...specs, { key: "Attribute", value: "Value" }]);
  };

  const updateSpec = (idx: number, key: string, value: string) => {
    const updated = [...specs];
    updated[idx] = { key, value };
    setSpecs(updated);
  };

  const removeSpec = (idx: number) => {
    setSpecs(specs.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setActiveTab("general");
      alert("Product name is required.");
      return;
    }

    setSaving(true);

    const payload = {
      id: initialData?.id,
      name,
      shortName: shortName || name,
      category,
      sku,
      isActive,
      inStock: Number(stock) > 0,
      badge,
      img: img || galleryImages[0] || "/images/placeholder.png",
      images: galleryImages.length > 0 ? galleryImages : [img],
      price: Number(price),
      oldPrice: Number(oldPrice),
      taxRate: Number(taxRate),
      stock: Number(stock),
      lowStockThreshold: Number(lowStockThreshold),
      shortDescription,
      description,
      features,
      scale,
      material,
      brand,
      specs,
      colors,
      videoUrl: videoUrl || null,
      slug: slug || name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-"),
      metaTitle: metaTitle || `${name} | DAXO-MART Premium Diecast`,
      metaDescription: metaDescription || description.slice(0, 160),
      metaKeywords,
      ogImage: ogImage || img,
    };

    try {
      await onSave(payload);
    } finally {
      setSaving(false);
    }
  };

  const tabs: Array<{ id: ProductFormTab; label: string; icon: React.ElementType }> = [
    { id: "general", label: "General", icon: Tag },
    { id: "images", label: "Images", icon: ImageIcon },
    { id: "colors", label: "Color Options", icon: Palette },
    { id: "pricing", label: "Pricing", icon: DollarSign },
    { id: "inventory", label: "Inventory", icon: Package },
    { id: "description", label: "Description", icon: FileText },
    { id: "specifications", label: "Specifications", icon: Sliders },
    { id: "seo", label: "SEO", icon: Search },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#141416] border border-[#222226] p-6 rounded-[20px] shadow-md">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.push("/admin/products")}
            className="p-2.5 rounded-xl bg-[#1C1C20] hover:bg-[#25252A] text-gray-300 hover:text-white border border-[#2A2A2F] transition-all cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-[22px] font-bold text-white tracking-tight font-pally">
              {isEditing ? `Edit Product: ${initialData?.name || ""}` : "Create New Product"}
            </h2>
            <p className="text-[13px] text-gray-400 mt-0.5">
              Fill in product attributes, pricing, multi-image gallery & storefront visibility.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/admin/products")}
            className="px-5 py-2.5 rounded-xl bg-[#1C1C20] hover:bg-[#25252A] text-gray-300 font-semibold text-[13px] border border-[#2A2A2F] transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="bg-[#C5A059] hover:bg-[#b08b46] active:scale-[0.98] text-black font-bold text-[13px] tracking-wider uppercase px-6 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? "Saving..." : isEditing ? "Update Product" : "Publish Product"}
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-[#222226] pb-2 overflow-x-auto scrollbar-none">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActiveTab = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2.5 rounded-xl text-[13px] font-semibold tracking-wide transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                isActiveTab
                  ? "bg-[#C5A059] text-black font-bold shadow-md"
                  : "bg-[#141416] text-gray-400 hover:bg-[#1A1A1D] hover:text-white border border-[#222226]"
              }`}
            >
              <Icon size={16} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="bg-[#141416] border border-[#222226] rounded-[20px] p-6 lg:p-8 shadow-xl">
        {/* GENERAL TAB */}
        {activeTab === "general" && (
          <div className="space-y-6 max-w-3xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[13px] font-semibold text-gray-300 block mb-2">
                  Product Full Name <span className="text-[#C5A059]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Range Rover Pearl White 1:24 Special Edition"
                  className="w-full bg-[#18181A] border border-[#2A2A2E] text-white text-[14px] px-4 py-3 rounded-xl outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 transition-all"
                />
              </div>

              <div>
                <label className="text-[13px] font-semibold text-gray-300 block mb-2">
                  Short Display Name
                </label>
                <input
                  type="text"
                  value={shortName}
                  onChange={(e) => setShortName(e.target.value)}
                  placeholder="e.g. Range Rover Pearl White"
                  className="w-full bg-[#18181A] border border-[#2A2A2E] text-white text-[14px] px-4 py-3 rounded-xl outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-[13px] font-semibold text-gray-300 block mb-2">
                  Category / Scale
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-[#18181A] border border-[#2A2A2E] text-white text-[14px] px-4 py-3 rounded-xl outline-none focus:border-[#C5A059] transition-all cursor-pointer"
                >
                  <option value="1:24">1:24 Scale</option>
                  <option value="1:18">1:18 Scale</option>
                  <option value="1:32">1:32 Scale</option>
                  <option value="1:64">1:64 Scale</option>
                  <option value="RC">RC Toys</option>
                  <option value="Frame">3D Frames</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.filterValue}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[13px] font-semibold text-gray-300 block mb-2">
                  SKU (Stock Keeping Unit)
                </label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full bg-[#18181A] border border-[#2A2A2E] text-white text-[14px] px-4 py-3 rounded-xl outline-none focus:border-[#C5A059] transition-all font-mono"
                />
              </div>

              <div>
                <label className="text-[13px] font-semibold text-gray-300 block mb-2">
                  Highlight Badge
                </label>
                <select
                  value={badge || ""}
                  onChange={(e) => setBadge(e.target.value || null)}
                  className="w-full bg-[#18181A] border border-[#2A2A2E] text-white text-[14px] px-4 py-3 rounded-xl outline-none focus:border-[#C5A059] transition-all cursor-pointer"
                >
                  <option value="">None</option>
                  <option value="Featured">Featured</option>
                  <option value="Best Seller">Best Seller</option>
                  <option value="New Arrival">New Arrival</option>
                  <option value="Limited Edition">Limited Edition</option>
                </select>
              </div>
            </div>

            {/* Storefront Active Checkbox */}
            <div className="p-4 bg-[#1C1C20] rounded-2xl border border-[#26262B] space-y-3">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-5 h-5 accent-[#C5A059] rounded cursor-pointer"
                />
                <div>
                  <p className="text-[14px] font-bold text-white flex items-center gap-2">
                    {isActive ? <Eye size={16} className="text-emerald-400" /> : <EyeOff size={16} className="text-gray-400" />}
                    Active on Storefront (Show Product to Customers)
                  </p>
                  <p className="text-[12px] text-gray-400 mt-0.5">
                    If unchecked, this product will be completely hidden from the storefront (even if in stock). Default is checked (Active).
                  </p>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* IMAGES TAB - Multiple Upload & Main Image Selection */}
        {activeTab === "images" && (
          <div className="space-y-6 max-w-4xl">
            {/* Main Featured Image Header */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-[16px] font-bold text-white">Product Gallery & Main Image</h3>
                  <p className="text-[12px] text-gray-400">
                    Upload multiple images at once. Click &quot;Set Main&quot; on any thumbnail to assign it as the primary cover image.
                  </p>
                </div>
                <label className="bg-[#C5A059] hover:bg-[#b08b46] text-black font-bold text-[12px] tracking-wider uppercase px-4 py-2.5 rounded-xl cursor-pointer transition-all flex items-center gap-2 shadow-md shrink-0">
                  <Upload size={16} />
                  {isUploading ? "Compressing & Uploading..." : "Upload Multiple Images"}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleMultipleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Main Image Display Card */}
              <div className="p-4 bg-[#1C1C20] rounded-2xl border border-[#26262B] flex flex-col sm:flex-row items-center gap-6">
                <div className="w-40 h-40 rounded-2xl bg-[#141416] border border-[#2A2A2E] relative overflow-hidden shrink-0 flex items-center justify-center shadow-lg">
                  {img ? (
                    <Image src={img} alt="Main product cover" fill unoptimized className="object-cover" />
                  ) : (
                    <ImageIcon className="text-gray-600" size={40} />
                  )}
                  <span className="absolute bottom-2 left-2 bg-[#C5A059] text-black font-extrabold text-[10px] uppercase px-2 py-0.5 rounded shadow">
                    ★ Main Cover
                  </span>
                </div>

                <div className="space-y-3 flex-1 w-full">
                  <div>
                    <h4 className="text-[14px] font-bold text-white">Current Primary Image</h4>
                    <p className="text-[12px] text-gray-400 font-mono truncate">{img}</p>
                  </div>
                  <input
                    type="text"
                    value={img}
                    onChange={(e) => setImg(e.target.value)}
                    placeholder="Enter main image URL manually..."
                    className="w-full bg-[#18181A] border border-[#2A2A2E] text-white text-[13px] px-3.5 py-2 rounded-xl outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Gallery Image Grid */}
            <div>
              <h4 className="text-[14px] font-bold text-white mb-3">All Uploaded Image Thumbnails ({galleryImages.length})</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
                {galleryImages.map((gUrl, idx) => {
                  const isMain = gUrl === img;
                  return (
                    <div
                      key={idx}
                      className={`group relative h-36 rounded-2xl bg-[#1C1C20] border overflow-hidden transition-all ${
                        isMain ? "border-[#C5A059] ring-2 ring-[#C5A059]/30" : "border-[#26262B]"
                      }`}
                    >
                      <Image src={gUrl} alt={`Thumbnail ${idx}`} fill unoptimized className="object-cover" />

                      {isMain && (
                        <div className="absolute top-2 left-2 bg-[#C5A059] text-black font-extrabold text-[9px] uppercase px-1.5 py-0.5 rounded flex items-center gap-1 shadow">
                          <Star size={10} fill="currentColor" /> Main
                        </div>
                      )}

                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                        {!isMain && (
                          <button
                            type="button"
                            onClick={() => handleSetMainImage(gUrl)}
                            className="w-full py-1 bg-[#C5A059] hover:bg-[#b08b46] text-black font-bold text-[10px] uppercase rounded-lg shadow cursor-pointer transition-colors"
                          >
                            Set Main
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            const newGallery = galleryImages.filter((_, i) => i !== idx);
                            setGalleryImages(newGallery);
                            if (isMain && newGallery.length > 0) {
                              setImg(newGallery[0]);
                            }
                          }}
                          className="p-1 bg-red-500/80 hover:bg-red-500 text-white rounded-lg cursor-pointer"
                          title="Delete image"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Showcase Video Reel Section */}
            <div className="pt-6 border-t border-[#222226] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-[15px] font-bold text-white flex items-center gap-2">
                    <Film className="text-[#C5A059]" size={18} />
                    Product Showcase Video Reel (1 Video per Product)
                  </h4>
                  <p className="text-[12px] text-gray-400 mt-0.5">
                    Upload a 10–30s portrait video (.mp4 / .webm) to display as a floating bubble at bottom-right corner of the product page.
                  </p>
                </div>
                <label className="bg-[#1C1C20] hover:bg-[#25252A] text-white border border-[#2A2A2F] font-bold text-[12px] tracking-wider uppercase px-4 py-2.5 rounded-xl cursor-pointer transition-all flex items-center gap-2 shadow-md shrink-0 self-start sm:self-auto">
                  <Upload size={15} />
                  {isUploadingVideo ? "Uploading Video..." : "Upload MP4 Video"}
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime"
                    onChange={handleVideoUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {videoUploadStatus && (
                <p className="text-xs font-semibold text-[#C5A059] bg-[#C5A059]/10 p-2.5 rounded-xl border border-[#C5A059]/20">
                  {videoUploadStatus}
                </p>
              )}

              <div className="p-4 bg-[#1C1C20] rounded-2xl border border-[#26262B] flex flex-col sm:flex-row items-center gap-6">
                <div className="w-32 h-44 rounded-2xl bg-[#141416] border border-[#2A2A2E] relative overflow-hidden shrink-0 flex items-center justify-center shadow-xl">
                  {videoUrl ? (
                    <video
                      src={videoUrl}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 p-3 text-center">
                      <Film className="text-gray-600" size={32} />
                      <span className="text-[10px] text-gray-500 font-medium">No Video Uploaded</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3 flex-1 w-full">
                  <div>
                    <h5 className="text-[13px] font-bold text-white">Video Source URL</h5>
                    <p className="text-[11px] text-gray-400 font-mono truncate">{videoUrl || "None"}</p>
                  </div>
                  <input
                    type="text"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="Paste direct MP4 video link or upload above..."
                    className="w-full bg-[#18181A] border border-[#2A2A2E] text-white text-[13px] px-3.5 py-2 rounded-xl outline-none"
                  />
                  {videoUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setVideoUrl("");
                        setVideoUploadStatus("");
                      }}
                      className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs font-semibold rounded-lg border border-red-500/30 transition-colors flex items-center gap-1.5"
                    >
                      <Trash2 size={13} />
                      Remove Video
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* COLOR OPTIONS TAB */}
        {activeTab === "colors" && (
          <div className="space-y-6 max-w-3xl">
            <div className="bg-[#1C1C20] border border-[#26262B] p-6 rounded-2xl space-y-5">
              <div>
                <h3 className="text-[16px] font-bold text-white font-pally mb-1">
                  Add Color Variant Option
                </h3>
                <p className="text-[12px] text-gray-400">
                  Define vehicle color variants (e.g., "Yellow Car", "White Car", "Shark Blue") with associated swatch color & uploaded variant image.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[12px] font-semibold text-gray-300 block mb-1.5">
                    Color Variant Name <span className="text-[#C5A059]">*</span>
                  </label>
                  <input
                    type="text"
                    value={newColorName}
                    onChange={(e) => setNewColorName(e.target.value)}
                    placeholder="e.g. Yellow Car, White Car, Shark Blue"
                    className="w-full bg-[#18181A] border border-[#2A2A2E] text-white text-[13px] px-4 py-2.5 rounded-xl outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="text-[12px] font-semibold text-gray-300 block mb-1.5">
                    Swatch Color Hex / Color Picker
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={newColorHex}
                      onChange={(e) => setNewColorHex(e.target.value)}
                      className="w-10 h-10 rounded-xl border-none cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={newColorHex}
                      onChange={(e) => setNewColorHex(e.target.value)}
                      className="flex-1 bg-[#18181A] border border-[#2A2A2E] text-white text-[13px] px-3 py-2 rounded-xl outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[12px] font-semibold text-gray-300 block mb-1.5">
                  Color Variant Image Upload (Optional Image e.g. Yellow Car photo)
                </label>
                <div className="flex items-center gap-4">
                  <label className="bg-[#202024] hover:bg-[#2A2A30] text-white font-semibold text-[12px] px-4 py-2.5 rounded-xl border border-[#303036] flex items-center gap-2 cursor-pointer transition-all">
                    <Upload size={14} />
                    <span>{isUploadingColorImg ? "Uploading..." : "Upload Variant Image"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleColorImageUpload}
                      disabled={isUploadingColorImg}
                      className="hidden"
                    />
                  </label>

                  {newColorImg && (
                    <div className="flex items-center gap-2 bg-[#141416] p-1.5 pr-3 rounded-xl border border-[#26262B]">
                      <div className="w-8 h-8 rounded-lg overflow-hidden relative border border-gray-600">
                        <Image src={newColorImg} alt="Preview" fill className="object-contain p-0.5" />
                      </div>
                      <span className="text-[11px] text-emerald-400 font-semibold">Image Uploaded</span>
                      <button
                        type="button"
                        onClick={() => setNewColorImg("")}
                        className="text-gray-400 hover:text-red-400 text-xs ml-1"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={addColorOption}
                className="bg-[#C5A059] hover:bg-[#b08b46] text-black font-bold text-[13px] px-5 py-2.5 rounded-xl transition-all shadow flex items-center gap-2 cursor-pointer"
              >
                <Plus size={16} /> Add Color Variant
              </button>
            </div>

            {/* List of active color options */}
            <div>
              <h4 className="text-[14px] font-bold text-white mb-3">
                Configured Color Options ({colors.length})
              </h4>
              {colors.length === 0 ? (
                <p className="text-[13px] text-gray-500 italic bg-[#141416] p-4 rounded-xl border border-[#222226]">
                  No color variants added yet. Add variants like Yellow Car or White Car above.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {colors.map((col, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-[#1C1C20] rounded-xl border border-[#26262B]"
                    >
                      <div className="flex items-center gap-3">
                        {col.image ? (
                          <div className="w-10 h-10 bg-white rounded-lg p-0.5 overflow-hidden relative border border-gray-300 shrink-0">
                            <Image src={col.image} alt={col.name} fill className="object-contain p-0.5" />
                          </div>
                        ) : (
                          <div
                            className="w-8 h-8 rounded-full border border-gray-400 shadow-sm shrink-0"
                            style={{ backgroundColor: col.colorHex || "#ccc" }}
                          />
                        )}
                        <div>
                          <p className="text-[13px] font-bold text-white">{col.name}</p>
                          <p className="text-[11px] text-gray-400">
                            {col.image ? "With Variant Image" : `Hex: ${col.colorHex || "N/A"}`}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeColorOption(idx)}
                        className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-500/10 cursor-pointer"
                        title="Remove color option"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* PRICING TAB */}
        {activeTab === "pricing" && (
          <div className="space-y-6 max-w-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-[13px] font-semibold text-gray-300 block mb-2">
                  Selling Price (INR ₹) <span className="text-[#C5A059]">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full bg-[#18181A] border border-[#2A2A2E] text-white text-[16px] font-bold px-4 py-3 rounded-xl outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="text-[13px] font-semibold text-gray-300 block mb-2">
                  Original Price / MRP (INR ₹)
                </label>
                <input
                  type="number"
                  value={oldPrice}
                  onChange={(e) => setOldPrice(Number(e.target.value))}
                  className="w-full bg-[#18181A] border border-[#2A2A2E] text-white text-[16px] font-bold px-4 py-3 rounded-xl outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-4 bg-[#1C1C20] rounded-2xl border border-[#26262B]">
                <p className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Calculated Discount
                </p>
                <p className="text-[20px] font-extrabold text-emerald-400 font-pally">
                  {oldPrice > price
                    ? `${Math.round(((oldPrice - price) / oldPrice) * 100)}% OFF`
                    : "No Discount"}
                </p>
              </div>

              <div>
                <label className="text-[13px] font-semibold text-gray-300 block mb-2">
                  GST Tax Rate (%) (Future-Ready)
                </label>
                <input
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  className="w-full bg-[#18181A] border border-[#2A2A2E] text-white text-[14px] px-4 py-3 rounded-xl outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* INVENTORY TAB */}
        {activeTab === "inventory" && (
          <div className="space-y-6 max-w-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-[13px] font-semibold text-gray-300 block mb-2">
                  Total Inventory Stock Units
                </label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => {
                    const newStk = Number(e.target.value);
                    setStock(newStk);
                    setInStock(newStk > 0);
                  }}
                  className="w-full bg-[#18181A] border border-[#2A2A2E] text-white text-[16px] font-bold px-4 py-3 rounded-xl outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="text-[13px] font-semibold text-gray-300 block mb-2">
                  Low Stock Threshold Alert
                </label>
                <input
                  type="number"
                  value={lowStockThreshold}
                  onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                  className="w-full bg-[#18181A] border border-[#2A2A2E] text-white text-[14px] px-4 py-3 rounded-xl outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>

            <div className="p-4 bg-[#1C1C20] rounded-2xl border border-[#26262B]">
              <p className="text-[13px] font-bold text-white mb-1">
                Stock Status: {stock > 0 ? "IN STOCK" : "OUT OF STOCK"}
              </p>
              <p className="text-[12px] text-gray-400">
                When stock reaches 0, the product automatically displays &quot;Out of Stock&quot; on the storefront card with checkout disabled.
              </p>
            </div>
          </div>
        )}

        {/* DESCRIPTION TAB */}
        {activeTab === "description" && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <label className="text-[13px] font-semibold text-gray-300 block mb-2">
                Short Teaser Description
              </label>
              <input
                type="text"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Brief 1-sentence product summary..."
                className="w-full bg-[#18181A] border border-[#2A2A2E] text-white text-[14px] px-4 py-3 rounded-xl outline-none focus:border-[#C5A059]"
              />
            </div>

            <div>
              <label className="text-[13px] font-semibold text-gray-300 block mb-2">
                Detailed Product Overview & Story
              </label>
              <textarea
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter complete product description, craftsmanship highlights, scale details..."
                className="w-full bg-[#18181A] border border-[#2A2A2E] text-white text-[14px] p-4 rounded-xl outline-none focus:border-[#C5A059] leading-relaxed resize-y"
              />
            </div>

            {/* Feature Bullets */}
            <div>
              <label className="text-[13px] font-semibold text-gray-300 block mb-2">
                Key Features Highlight Bullets
              </label>
              <div className="space-y-2 mb-3">
                {features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-[#1C1C20] rounded-xl border border-[#26262B]"
                  >
                    <span className="text-[13px] text-gray-200">{feat}</span>
                    <button
                      type="button"
                      onClick={() => removeFeature(idx)}
                      className="text-red-400 hover:text-red-300 p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="e.g. Working steering wheel & suspension"
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                  className="flex-1 bg-[#18181A] border border-[#2A2A2E] text-white text-[13px] px-4 py-2.5 rounded-xl outline-none"
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="bg-[#202024] hover:bg-[#2A2A30] text-white font-semibold text-[13px] px-4 py-2.5 rounded-xl border border-[#303036] flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={15} /> Add Bullet
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SPECIFICATIONS TAB */}
        {activeTab === "specifications" && (
          <div className="space-y-6 max-w-3xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-[13px] font-semibold text-gray-300 block mb-2">Scale</label>
                <input
                  type="text"
                  value={scale}
                  onChange={(e) => setScale(e.target.value)}
                  className="w-full bg-[#18181A] border border-[#2A2A2E] text-white text-[14px] px-4 py-3 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="text-[13px] font-semibold text-gray-300 block mb-2">
                  Material
                </label>
                <input
                  type="text"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  className="w-full bg-[#18181A] border border-[#2A2A2E] text-white text-[14px] px-4 py-3 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="text-[13px] font-semibold text-gray-300 block mb-2">Brand</label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full bg-[#18181A] border border-[#2A2A2E] text-white text-[14px] px-4 py-3 rounded-xl outline-none"
                />
              </div>
            </div>

            {/* Extensible Custom Attributes */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-[14px] font-bold text-white">Custom Specification Attributes</h4>
                <button
                  type="button"
                  onClick={addSpec}
                  className="bg-[#202024] hover:bg-[#2A2A30] text-white text-[12px] font-semibold px-3 py-1.5 rounded-xl border border-[#303036] flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={14} /> Add Specification
                </button>
              </div>

              <div className="space-y-3">
                {specs.map((sp, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <input
                      type="text"
                      value={sp.key}
                      onChange={(e) => updateSpec(idx, e.target.value, sp.value)}
                      placeholder="Attribute Name (e.g. Doors)"
                      className="w-1/3 bg-[#18181A] border border-[#2A2A2E] text-white text-[13px] px-3.5 py-2.5 rounded-xl outline-none font-medium"
                    />
                    <input
                      type="text"
                      value={sp.value}
                      onChange={(e) => updateSpec(idx, sp.key, e.target.value)}
                      placeholder="Value (e.g. 4 Doors + Hood Open)"
                      className="flex-1 bg-[#18181A] border border-[#2A2A2E] text-white text-[13px] px-3.5 py-2.5 rounded-xl outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => removeSpec(idx)}
                      className="text-red-400 hover:text-red-300 p-2"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SEO TAB */}
        {activeTab === "seo" && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <label className="text-[13px] font-semibold text-gray-300 block mb-2">
                URL Slug / Permalinks
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full bg-[#18181A] border border-[#2A2A2E] text-white text-[14px] px-4 py-3 rounded-xl outline-none font-mono"
              />
            </div>

            <div>
              <label className="text-[13px] font-semibold text-gray-300 block mb-2">
                Meta Title
              </label>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="Range Rover Pearl White 1:24 Diecast | DAXO-MART"
                className="w-full bg-[#18181A] border border-[#2A2A2E] text-white text-[14px] px-4 py-3 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="text-[13px] font-semibold text-gray-300 block mb-2">
                Meta Description
              </label>
              <textarea
                rows={3}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="Buy authentic Range Rover Pearl White 1:24 scale diecast model..."
                className="w-full bg-[#18181A] border border-[#2A2A2E] text-white text-[13.5px] p-4 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="text-[13px] font-semibold text-gray-300 block mb-2">
                Meta Keywords
              </label>
              <input
                type="text"
                value={metaKeywords}
                onChange={(e) => setMetaKeywords(e.target.value)}
                placeholder="range rover diecast, 1:24 scale car, luxury toy car"
                className="w-full bg-[#18181A] border border-[#2A2A2E] text-white text-[14px] px-4 py-3 rounded-xl outline-none"
              />
            </div>
          </div>
        )}
      </div>
    </form>
  );
}

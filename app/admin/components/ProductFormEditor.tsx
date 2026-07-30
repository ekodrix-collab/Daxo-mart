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
  Eye,
  EyeOff,
  Palette,
  Film,
  ArrowRight,
  Sparkles,
  RefreshCw,
  ChevronUp,
  ChevronDown,
  Check,
} from "lucide-react";

export type ProductFormTab = "essentials" | "variants" | "seo_specs";

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
  const [activeTab, setActiveTab] = useState<ProductFormTab>("essentials");
  const [saving, setSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Helper to generate clean SKU based on title or random string
  const generateAutoSku = (productName?: string) => {
    if (productName && productName.trim().length >= 3) {
      const prefix = productName
        .trim()
        .replace(/[^a-zA-Z0-9]/g, "")
        .slice(0, 4)
        .toUpperCase();
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      return `DXM-${prefix}-${randomNum}`;
    }
    return `DXM-${Math.floor(100000 + Math.random() * 900000)}`;
  };

  // Helper to generate clean URL slug
  const generateAutoSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  // Form State
  const [name, setName] = useState(initialData?.name || "");
  const [shortName, setShortName] = useState(initialData?.shortName || "");
  const [category, setCategory] = useState(initialData?.category || "1:24");
  const [sku, setSku] = useState(initialData?.sku || generateAutoSku(initialData?.name));
  const [slug, setSlug] = useState(
    initialData?.slug || generateAutoSlug(initialData?.name || "product")
  );
  const [isCustomSlug, setIsCustomSlug] = useState(Boolean(initialData?.slug));
  const [isCustomSku, setIsCustomSku] = useState(Boolean(initialData?.sku));

  const [isActive, setIsActive] = useState<boolean>(initialData?.isActive ?? true);
  const [inStock, setInStock] = useState<boolean>(initialData?.inStock ?? true);
  const [badge, setBadge] = useState<string | null>(initialData?.badge || null);

  // Images & Video
  const [img, setImg] = useState(initialData?.img || "/images/placeholder.png");
  const [hoverImage, setHoverImage] = useState<string | null>(initialData?.hoverImage || null);
  const [galleryImages, setGalleryImages] = useState<string[]>(
    initialData?.images && initialData.images.length > 0
      ? initialData.images
      : [initialData?.img || "/images/placeholder.png"]
  );
  const [videoUrl, setVideoUrl] = useState(initialData?.videoUrl || "");
  const [videoSizeBytes, setVideoSizeBytes] = useState<number | null>(null);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [videoUploadStatus, setVideoUploadStatus] = useState("");
  const [showVideoDeleteModal, setShowVideoDeleteModal] = useState(false);
  const [isDeletingVideo, setIsDeletingVideo] = useState(false);

  // Pricing & Stock
  const [price, setPrice] = useState<number>(initialData?.price || 1299);
  const [costPrice, setCostPrice] = useState<number>(initialData?.costPrice || 0);
  const [oldPrice, setOldPrice] = useState<number>(initialData?.oldPrice || 1799);
  const [taxRate, setTaxRate] = useState<number>(initialData?.taxRate || 18);
  const [stock, setStock] = useState<number>(initialData?.stock ?? 15);
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(
    initialData?.lowStockThreshold ?? 5
  );

  // Description, Highlights & Included Items
  const [description, setDescription] = useState(initialData?.description || "");
  const [shortDescription, setShortDescription] = useState(
    initialData?.shortDescription || ""
  );

  // Section A: Product Highlights
  const [highlights, setHighlights] = useState<string[]>(() => {
    if (initialData?.highlights && Array.isArray(initialData.highlights)) {
      return initialData.highlights;
    }
    if (initialData?.features && Array.isArray(initialData.features)) {
      return initialData.features;
    }
    return [];
  });
  const [newHighlight, setNewHighlight] = useState("");

  const addHighlight = () => {
    if (!newHighlight.trim()) return;
    setHighlights([...highlights, newHighlight.trim()]);
    setNewHighlight("");
  };

  const removeHighlight = (idx: number) => {
    setHighlights(highlights.filter((_, i) => i !== idx));
  };

  const moveHighlight = (idx: number, direction: "up" | "down") => {
    if (direction === "up" && idx === 0) return;
    if (direction === "down" && idx === highlights.length - 1) return;
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    const updated = [...highlights];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setHighlights(updated);
  };

  const updateHighlight = (idx: number, val: string) => {
    const updated = [...highlights];
    updated[idx] = val;
    setHighlights(updated);
  };

  // Section C: What's Included
  const [includedItems, setIncludedItems] = useState<string[]>(() => {
    if (initialData?.includedItems && Array.isArray(initialData.includedItems)) {
      return initialData.includedItems;
    }
    return [];
  });
  const [newIncludedItem, setNewIncludedItem] = useState("");

  const addIncludedItem = () => {
    if (!newIncludedItem.trim()) return;
    setIncludedItems([...includedItems, newIncludedItem.trim()]);
    setNewIncludedItem("");
  };

  const removeIncludedItem = (idx: number) => {
    setIncludedItems(includedItems.filter((_, i) => i !== idx));
  };

  const moveIncludedItem = (idx: number, direction: "up" | "down") => {
    if (direction === "up" && idx === 0) return;
    if (direction === "down" && idx === includedItems.length - 1) return;
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    const updated = [...includedItems];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setIncludedItems(updated);
  };

  const updateIncludedItem = (idx: number, val: string) => {
    const updated = [...includedItems];
    updated[idx] = val;
    setIncludedItems(updated);
  };

  // Specifications
  const [scale, setScale] = useState(initialData?.scale || "");
  const [material, setMaterial] = useState(initialData?.material || "");
  const [brand, setBrand] = useState(initialData?.brand || "");
  const [specs, setSpecs] = useState<Array<{ key: string; value: string }>>(
    initialData?.specs || []
  );

  // Color Options
  const [colors, setColors] = useState<Array<{ name: string; colorHex?: string; image?: string }>>(
    initialData?.colors || []
  );
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("#3B82F6");
  const [newColorImg, setNewColorImg] = useState("");
  const [isUploadingColorImg, setIsUploadingColorImg] = useState(false);

  // SEO
  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(
    initialData?.metaDescription || ""
  );
  const [metaKeywords, setMetaKeywords] = useState(initialData?.metaKeywords || "");
  const [ogImage, setOgImage] = useState(initialData?.ogImage || "");

  // Auto update slug and SKU on title change if not manually customized
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing && !isCustomSlug) {
      setSlug(generateAutoSlug(val));
    }
    if (!isEditing && !isCustomSku) {
      setSku(generateAutoSku(val));
    }
  };

  // Fetch actual file size for existing videoUrl via HEAD request
  React.useEffect(() => {
    if (videoUrl && !videoSizeBytes) {
      fetch(videoUrl, { method: "HEAD" })
        .then((res) => {
          const contentLength = res.headers.get("content-length");
          if (contentLength) {
            setVideoSizeBytes(parseInt(contentLength, 10));
          }
        })
        .catch(() => {});
    }
  }, [videoUrl, videoSizeBytes]);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingVideo(true);
    setVideoSizeBytes(file.size);
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
    setVideoUploadStatus(`Uploading ${file.name} (${sizeInMB} MB)...`);

    try {
      // 1. Direct Browser-to-Cloudinary Upload via Signed API (Bypasses Vercel 4.5 MB limit)
      const sigRes = await fetch("/api/upload-video/signature");
      if (sigRes.ok) {
        const sigData = await sigRes.json();
        if (sigData.success && sigData.signature) {
          const directData = new FormData();
          directData.append("file", file);
          directData.append("api_key", sigData.apiKey);
          directData.append("timestamp", sigData.timestamp.toString());
          directData.append("signature", sigData.signature);
          directData.append("folder", sigData.folder);

          const cRes = await fetch(
            `https://api.cloudinary.com/v1_1/${sigData.cloudName}/video/upload`,
            {
              method: "POST",
              body: directData,
            }
          );

          if (cRes.ok) {
            const cResult = await cRes.json();
            if (cResult.secure_url) {
              setVideoUrl(cResult.secure_url);
              setVideoSizeBytes(cResult.bytes || file.size);
              setVideoUploadStatus("Video uploaded successfully!");
              setIsUploadingVideo(false);
              return;
            }
          }
        }
      }

      // 2. Fallback to API route if signature isn't available
      const data = new FormData();
      data.append("file", file);

      const res = await fetch("/api/upload-video", {
        method: "POST",
        body: data,
      });

      if (!res.ok) {
        const textErr = await res.text();
        if (res.status === 413) {
          throw new Error("Video file exceeds server size limit. Please upload directly.");
        }
        throw new Error(`Upload failed (${res.status}): ${textErr.slice(0, 100)}`);
      }

      const result = await res.json();
      if (result.url) {
        setVideoUrl(result.url);
        if (result.fileSize) setVideoSizeBytes(result.fileSize);
        setVideoUploadStatus("Video uploaded successfully!");
      } else {
        alert(result.error || "Failed to upload video");
        setVideoUploadStatus("");
      }
    } catch (err: any) {
      console.error("Video upload error:", err);
      alert("Video upload error: " + (err.message || "Upload failed"));
      setVideoUploadStatus("");
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const handleConfirmDeleteVideo = async () => {
    if (!videoUrl) return;
    setIsDeletingVideo(true);

    try {
      await fetch(`/api/upload-video?url=${encodeURIComponent(videoUrl)}`, {
        method: "DELETE",
      });

      setVideoUrl("");
      setVideoSizeBytes(null);
      setVideoUploadStatus("");
    } catch (err) {
      console.error("Video deletion error:", err);
    } finally {
      setIsDeletingVideo(false);
      setShowVideoDeleteModal(false);
    }
  };


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

  const handleSetHoverImage = (targetUrl: string) => {
    setHoverImage(targetUrl);
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
      setActiveTab("essentials");
      alert("Product name is required.");
      return;
    }

    setSaving(true);

    const finalSlug = slug.trim() || generateAutoSlug(name);
    const finalSku = sku.trim() || generateAutoSku(name);

    const payload = {
      id: initialData?.id,
      name,
      shortName: shortName || name,
      category,
      sku: finalSku,
      isActive,
      inStock: Number(stock) > 0,
      badge,
      img: img || galleryImages[0] || "/images/placeholder.png",
      images: galleryImages.length > 0 ? galleryImages : [img],
      price: Number(price),
      costPrice: Number(costPrice) || 0,
      oldPrice: Number(oldPrice),
      taxRate: Number(taxRate),
      stock: Number(stock),
      lowStockThreshold: Number(lowStockThreshold),
      shortDescription,
      description,
      highlights,
      includedItems,
      features: highlights,
      scale,
      material,
      brand,
      specs,
      colors,
      videoUrl: videoUrl || null,
      hoverImage: hoverImage || null,
      slug: finalSlug,
      metaTitle: metaTitle || `${name} | DAXO-MART Premium Diecast`,
      metaDescription: metaDescription || (description ? description.slice(0, 160) : `${name} premium replica`),
      metaKeywords,
      ogImage: ogImage || img,
    };

    try {
      await onSave(payload);
    } finally {
      setSaving(false);
    }
  };

  const tabs: Array<{ id: ProductFormTab; label: string; icon: React.ElementType; sub: string }> = [
    { id: "essentials", label: "1. Product Essentials", icon: Tag, sub: "Title, Price, Stock, Images & Video" },
    { id: "variants", label: "2. Colors & Description", icon: Palette, sub: "Color Swatches, Detailed Story & Features" },
    { id: "seo_specs", label: "3. Specs & SEO", icon: Sliders, sub: "Scale, Custom Attributes & Search Engine Meta" },
  ];

  // Snapshot of initial values to compare against current state
  const initialSnapshotRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (!initialSnapshotRef.current) {
      initialSnapshotRef.current = JSON.stringify({
        name: initialData?.name || "",
        shortName: initialData?.shortName || "",
        category: initialData?.category || "1:24",
        sku,
        isActive: initialData?.isActive ?? true,
        inStock: initialData?.inStock ?? true,
        badge: initialData?.badge || null,
        img: initialData?.img || "/images/placeholder.png",
        galleryImages:
          initialData?.images && initialData.images.length > 0
            ? initialData.images
            : [initialData?.img || "/images/placeholder.png"],
        price: Number(initialData?.price || 1299),
        oldPrice: Number(initialData?.oldPrice || 1799),
        taxRate: Number(initialData?.taxRate || 18),
        stock: Number(initialData?.stock ?? 15),
        lowStockThreshold: Number(initialData?.lowStockThreshold ?? 5),
        description: initialData?.description || "",
        shortDescription: initialData?.shortDescription || "",
        highlights:
          initialData?.highlights && Array.isArray(initialData.highlights)
            ? initialData.highlights
            : (initialData?.features && Array.isArray(initialData.features) ? initialData.features : []),
        includedItems:
          initialData?.includedItems && Array.isArray(initialData.includedItems)
            ? initialData.includedItems
            : [],
        scale: initialData?.scale || "",
        material: initialData?.material || "",
        brand: initialData?.brand || "",
        specs: initialData?.specs || [],
        colors: initialData?.colors || [],
        videoUrl: initialData?.videoUrl || "",
        hoverImage: initialData?.hoverImage || null,
        slug,
        metaTitle: initialData?.metaTitle || "",
        metaDescription: initialData?.metaDescription || "",
        metaKeywords: initialData?.metaKeywords || "",
        ogImage: initialData?.ogImage || "",
      });
    }
  }, [initialData, sku, slug]);

  const [isDirty, setIsDirty] = useState(false);

  // Compute exact diff against snapshot
  React.useEffect(() => {
    if (!initialSnapshotRef.current) return;

    const currentSnapshot = JSON.stringify({
      name, shortName, category, sku, isActive, inStock, badge,
      img, galleryImages, price, oldPrice, taxRate, stock, lowStockThreshold,
      description, shortDescription, highlights, includedItems, scale, material, brand, specs,
      colors, videoUrl, hoverImage, slug, metaTitle, metaDescription, metaKeywords, ogImage
    });

    setIsDirty(currentSnapshot !== initialSnapshotRef.current);
  }, [
    name, shortName, category, sku, isActive, inStock, badge,
    img, galleryImages, price, oldPrice, taxRate, stock, lowStockThreshold,
    description, shortDescription, highlights, includedItems, scale, material, brand, specs,
    colors, videoUrl, hoverImage, slug, metaTitle, metaDescription, metaKeywords, ogImage
  ]);

  // Handle discard back to initial snapshot
  const handleDiscardChanges = () => {
    if (!initialSnapshotRef.current) return;
    try {
      const snap = JSON.parse(initialSnapshotRef.current);
      setName(snap.name);
      setShortName(snap.shortName);
      setCategory(snap.category);
      setSku(snap.sku);
      setIsActive(snap.isActive);
      setInStock(snap.inStock);
      setBadge(snap.badge);
      setImg(snap.img);
      setGalleryImages(snap.galleryImages);
      setPrice(snap.price);
      setOldPrice(snap.oldPrice);
      setTaxRate(snap.taxRate);
      setStock(snap.stock);
      setLowStockThreshold(snap.lowStockThreshold);
      setDescription(snap.description);
      setShortDescription(snap.shortDescription);
      if (Array.isArray(snap.highlights)) setHighlights(snap.highlights);
      if (Array.isArray(snap.includedItems)) setIncludedItems(snap.includedItems);
      setScale(snap.scale);
      setMaterial(snap.material);
      setBrand(snap.brand);
      setSpecs(snap.specs);
      setColors(snap.colors);
      setVideoUrl(snap.videoUrl);
      if (snap.hoverImage !== undefined) setHoverImage(snap.hoverImage);
      setSlug(snap.slug);
      setMetaTitle(snap.metaTitle);
      setMetaDescription(snap.metaDescription);
      setMetaKeywords(snap.metaKeywords);
      setOgImage(snap.ogImage);
      setIsDirty(false);
    } catch {}
  };

  // Reset dirty right after successful save
  const handleSubmitWithDirtyReset = async (e: React.FormEvent) => {
    await handleSubmit(e);
    initialSnapshotRef.current = JSON.stringify({
      name, shortName, category, sku, isActive, inStock, badge,
      img, galleryImages, price, oldPrice, taxRate, stock, lowStockThreshold,
      description, shortDescription, highlights, includedItems, scale, material, brand, specs,
      colors, videoUrl, hoverImage, slug, metaTitle, metaDescription, metaKeywords, ogImage
    });
    setIsDirty(false);
  };

  return (
    <form onSubmit={handleSubmitWithDirtyReset} className="space-y-6 relative pb-28">
      {/* FLOATING SAVE BAR */}
      {isDirty && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#1C1C20]/95 backdrop-blur-md border border-[#C5A059]/40 shadow-[0_10px_30px_rgba(0,0,0,0.8)] px-6 py-3 rounded-2xl flex items-center gap-6 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C5A059] animate-pulse" />
            <span className="text-[13.5px] font-semibold text-white font-pally">
              Unsaved changes
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleDiscardChanges}
              className="px-3 py-1.5 rounded-xl text-gray-400 hover:text-white text-[12.5px] font-medium transition-colors cursor-pointer"
            >
              Discard
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-[#C5A059] hover:bg-[#b08b46] text-black font-bold text-[12.5px] tracking-wider uppercase px-4 py-1.5 rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Save size={14} />
              {saving ? "Saving..." : isEditing ? "Save Changes" : "Publish"}
            </button>
          </div>
        </div>
      )}

      {/* Header Bar */}
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
              3-Step simplified workflow: Essentials, Variants & Specs.
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

      {/* Simplified 3 Tabs Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActiveTab = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3.5 ${
                isActiveTab
                  ? "bg-[#C5A059]/10 border-[#C5A059] text-white shadow-lg ring-1 ring-[#C5A059]/30"
                  : "bg-[#141416] border-[#222226] text-gray-400 hover:bg-[#1A1A1D] hover:text-white"
              }`}
            >
              <div
                className={`p-2.5 rounded-xl ${
                  isActiveTab ? "bg-[#C5A059] text-black" : "bg-[#1C1C20] text-gray-400 border border-[#2A2A2F]"
                }`}
              >
                <Icon size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`text-[14px] font-bold ${isActiveTab ? "text-[#C5A059]" : "text-white"}`}>
                  {t.label}
                </h3>
                <p className="text-[11.5px] text-gray-400 truncate mt-0.5">{t.sub}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Tab Panels Container */}
      <div className="bg-[#141416] border border-[#222226] rounded-[20px] p-6 lg:p-8 shadow-xl min-h-[500px]">
        {/* TAB 1: ESSENTIAL PRODUCT INFO */}
        {activeTab === "essentials" && (
          <div className="space-y-8">
            {/* Basic Info & Auto SKU/Slug */}
            <div className="space-y-6 max-w-4xl">
              <h3 className="text-[16px] font-bold text-[#C5A059] tracking-wide uppercase border-b border-[#222226] pb-2 flex items-center gap-2">
                <Tag size={18} /> Basic Details & Store Visibility
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[13px] font-semibold text-gray-300 block mb-2">
                    Product Title <span className="text-[#C5A059]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Range Rover Pearl White 1:24 Special Edition"
                    className="w-full bg-[#18181A] border border-[#2A2A2E] text-white text-[14px] px-4 py-3 rounded-xl outline-none focus:border-[#C5A059] transition-all"
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
                    className="w-full bg-[#18181A] border border-[#2A2A2E] text-white text-[14px] px-4 py-3 rounded-xl outline-none focus:border-[#C5A059] transition-all"
                  />
                </div>
              </div>

              {/* Auto Generated SKU & URL Slug */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#1C1C20] p-5 rounded-2xl border border-[#26262B]">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[12.5px] font-bold text-gray-300 flex items-center gap-1.5">
                      SKU (Stock Keeping Unit)
                      <span className="text-[10px] font-semibold bg-[#C5A059]/20 text-[#C5A059] px-2 py-0.5 rounded-md">
                        Auto Generated
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const newSku = generateAutoSku(name);
                        setSku(newSku);
                        setIsCustomSku(false);
                      }}
                      className="text-[11px] text-[#C5A059] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw size={12} /> Regenerate SKU
                    </button>
                  </div>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => {
                      setSku(e.target.value);
                      setIsCustomSku(true);
                    }}
                    placeholder="e.g. DXM-RANG-4821"
                    className="w-full bg-[#141416] border border-[#2A2A2E] text-white text-[13.5px] px-4 py-2.5 rounded-xl outline-none font-mono focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[12.5px] font-bold text-gray-300 flex items-center gap-1.5">
                      URL Slug / Permalink
                      <span className="text-[10px] font-semibold bg-[#C5A059]/20 text-[#C5A059] px-2 py-0.5 rounded-md">
                        Auto Generated
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const newSlug = generateAutoSlug(name);
                        setSlug(newSlug);
                        setIsCustomSlug(false);
                      }}
                      className="text-[11px] text-[#C5A059] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw size={12} /> Sync from Title
                    </button>
                  </div>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => {
                      setSlug(e.target.value);
                      setIsCustomSlug(true);
                    }}
                    placeholder="range-rover-pearl-white-1-24"
                    className="w-full bg-[#141416] border border-[#2A2A2E] text-white text-[13.5px] px-4 py-2.5 rounded-xl outline-none font-mono focus:border-[#C5A059]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[13px] font-semibold text-gray-300 block mb-2">
                    Category / Scale
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-[#18181A] border border-[#2A2A2E] text-white text-[14px] px-4 py-3 rounded-xl outline-none focus:border-[#C5A059] cursor-pointer"
                  >
                    <option value="1:18">1:18</option>
                    <option value="1:24">1:24</option>
                    <option value="1:32">1:32</option>
                    <option value="1:64">1:64</option>
                    <option value="RC Toys">RC Toys</option>
                    <option value="3D Frames">3D Frames</option>
                  </select>
                </div>

                <div>
                  <label className="text-[13px] font-semibold text-gray-300 block mb-2">
                    Highlight Badge
                  </label>
                  <select
                    value={badge || ""}
                    onChange={(e) => setBadge(e.target.value || null)}
                    className="w-full bg-[#18181A] border border-[#2A2A2E] text-white text-[14px] px-4 py-3 rounded-xl outline-none focus:border-[#C5A059] cursor-pointer"
                  >
                    <option value="">None</option>
                    <option value="Featured">Featured</option>
                    <option value="Best Seller">Best Seller</option>
                    <option value="New Arrival">New Arrival</option>
                    <option value="Limited Edition">Limited Edition</option>
                  </select>
                </div>
              </div>

              {/* Active Toggle */}
              <div className="p-4 bg-[#1C1C20] rounded-2xl border border-[#26262B]">
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
                      Active on Storefront (Visible to Customers)
                    </p>
                    <p className="text-[12px] text-gray-400 mt-0.5">
                      Uncheck to hide this product from customer storefront catalog.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Price & Stock Section */}
            <div className="space-y-6 max-w-4xl pt-4 border-t border-[#222226]">
              <h3 className="text-[16px] font-bold text-[#C5A059] tracking-wide uppercase border-b border-[#222226] pb-2 flex items-center gap-2">
                <DollarSign size={18} /> Price & Inventory Stock Count
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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

                <div>
                  <label className="text-[13px] font-semibold text-gray-300 block mb-2">
                    Inventory Stock (Count Only) <span className="text-[#C5A059]">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => {
                      const newStk = Number(e.target.value);
                      setStock(newStk);
                      setInStock(newStk > 0);
                    }}
                    className="w-full bg-[#18181A] border border-[#2A2A2E] text-white text-[16px] font-bold px-4 py-3 rounded-xl outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>
            </div>

            {/* Images & Video Reel Section */}
            <div className="space-y-6 max-w-4xl pt-4 border-t border-[#222226]">
              <div className="flex items-center justify-between">
                <h3 className="text-[16px] font-bold text-[#C5A059] tracking-wide uppercase flex items-center gap-2">
                  <ImageIcon size={18} /> Product Images & Showcase Video Reel
                </h3>
                <label className="bg-[#C5A059] hover:bg-[#b08b46] text-black font-bold text-[12px] tracking-wider uppercase px-4 py-2.5 rounded-xl cursor-pointer transition-all flex items-center gap-2 shadow-md shrink-0">
                  <Upload size={16} />
                  {isUploading ? "Uploading..." : "Upload Images"}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleMultipleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Primary & Hover Cover Previews */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Primary Display Cover */}
                <div className="p-4 bg-[#1C1C20] rounded-2xl border border-[#26262B] flex items-center gap-4">
                  <div className="w-28 h-28 rounded-2xl bg-[#141416] border border-[#2A2A2E] relative overflow-hidden shrink-0 flex items-center justify-center shadow-lg">
                    {img ? (
                      <Image src={img} alt="Main product cover" fill unoptimized className="object-cover" />
                    ) : (
                      <ImageIcon className="text-gray-600" size={32} />
                    )}
                    <span className="absolute bottom-1.5 left-1.5 bg-[#C5A059] text-black font-extrabold text-[8px] uppercase px-1.5 py-0.5 rounded shadow">
                      ★ Main Cover
                    </span>
                  </div>

                  <div className="space-y-2 flex-1 min-w-0">
                    <div>
                      <h4 className="text-[13.5px] font-bold text-white">Primary Display Cover</h4>
                      <p className="text-[11px] text-gray-400 font-mono truncate">{img || "No cover image set"}</p>
                    </div>
                    <input
                      type="text"
                      value={img}
                      onChange={(e) => setImg(e.target.value)}
                      placeholder="Enter main image URL manually..."
                      className="w-full bg-[#18181A] border border-[#2A2A2E] text-white text-[12px] px-3 py-1.5 rounded-xl outline-none"
                    />
                  </div>
                </div>

                {/* Hover Display Image */}
                <div className="p-4 bg-[#1C1C20] rounded-2xl border border-[#26262B] flex items-center gap-4">
                  <div className="w-28 h-28 rounded-2xl bg-[#141416] border border-[#2A2A2E] relative overflow-hidden shrink-0 flex items-center justify-center shadow-lg">
                    {hoverImage ? (
                      <Image src={hoverImage} alt="Hover product image" fill unoptimized className="object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-gray-500 text-center px-1">
                        <ImageIcon size={24} />
                        <span className="text-[9px] font-semibold">Auto (2nd image)</span>
                      </div>
                    )}
                    <span className="absolute bottom-1.5 left-1.5 bg-cyan-500 text-black font-extrabold text-[8px] uppercase px-1.5 py-0.5 rounded shadow">
                      ⚡ Hover View
                    </span>
                  </div>

                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[13.5px] font-bold text-white">Hover Display Image</h4>
                      {hoverImage && (
                        <button
                          type="button"
                          onClick={() => setHoverImage(null)}
                          className="text-[10px] text-rose-400 hover:underline"
                        >
                          Clear Custom
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-400 font-mono truncate">
                      {hoverImage || (galleryImages[1] ? `Auto: ${galleryImages[1]}` : "No hover image")}
                    </p>
                    <input
                      type="text"
                      value={hoverImage || ""}
                      onChange={(e) => setHoverImage(e.target.value || null)}
                      placeholder="Hover image URL (or select from gallery below)..."
                      className="w-full bg-[#18181A] border border-[#2A2A2E] text-white text-[12px] px-3 py-1.5 rounded-xl outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Gallery Thumbnails */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-[13.5px] font-bold text-white">
                    Gallery Images ({galleryImages.length})
                  </h4>
                  <span className="text-[11px] text-gray-400">
                    Hover image defaults to 2nd photo if custom hover image is not set.
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                  {galleryImages.map((gUrl, idx) => {
                    const isMain = gUrl === img;
                    const isHover = gUrl === hoverImage || (!hoverImage && idx === 1 && galleryImages.length > 1);
                    const isExplicitHover = gUrl === hoverImage;

                    return (
                      <div
                        key={idx}
                        className={`group relative h-32 rounded-xl bg-[#1C1C20] border overflow-hidden transition-all ${
                          isMain
                            ? "border-[#C5A059] ring-2 ring-[#C5A059]/30"
                            : isExplicitHover
                            ? "border-cyan-500 ring-2 ring-cyan-500/30"
                            : "border-[#26262B]"
                        }`}
                      >
                        <Image src={gUrl} alt={`Thumbnail ${idx}`} fill unoptimized className="object-cover" />

                        {/* Badges */}
                        <div className="absolute top-1.5 left-1.5 flex flex-col gap-1 z-10">
                          {isMain && (
                            <span className="bg-[#C5A059] text-black font-extrabold text-[8px] uppercase px-1 py-0.5 rounded flex items-center gap-0.5 shadow">
                              <Star size={9} fill="currentColor" /> Main
                            </span>
                          )}
                          {isHover && (
                            <span className="bg-cyan-500 text-black font-extrabold text-[8px] uppercase px-1 py-0.5 rounded flex items-center gap-0.5 shadow">
                              ⚡ Hover
                            </span>
                          )}
                        </div>

                        {/* Thumbnail Action Overlay */}
                        <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 p-1.5 z-20">
                          {!isMain && (
                            <button
                              type="button"
                              onClick={() => handleSetMainImage(gUrl)}
                              className="w-full py-1 bg-[#C5A059] hover:bg-[#b08b46] text-black font-extrabold text-[8.5px] uppercase rounded shadow cursor-pointer"
                            >
                              Set Main
                            </button>
                          )}
                          {!isExplicitHover && (
                            <button
                              type="button"
                              onClick={() => handleSetHoverImage(gUrl)}
                              className="w-full py-1 bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-[8.5px] uppercase rounded shadow cursor-pointer"
                            >
                              Set Hover
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
                              if (isExplicitHover) {
                                setHoverImage(null);
                              }
                            }}
                            className="p-1 bg-red-500/80 hover:bg-red-500 text-white rounded cursor-pointer mt-0.5"
                            title="Delete image"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Showcase Video Reel Section */}
              <div className="p-4 bg-[#1C1C20] rounded-2xl border border-[#26262B] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-[14px] font-bold text-white flex items-center gap-2">
                      <Film className="text-[#C5A059]" size={16} />
                      Product Showcase Video Reel
                    </h4>
                    <p className="text-[11.5px] text-gray-400 mt-0.5">
                      Upload a 10–30s portrait video reel (.mp4 / .webm) to display as a floating bubble on product page.
                    </p>
                  </div>
                  <label className="bg-[#202024] hover:bg-[#2A2A30] text-white border border-[#303036] font-semibold text-[11.5px] px-3.5 py-2 rounded-xl cursor-pointer transition-all flex items-center gap-1.5 shadow-sm shrink-0 self-start sm:self-auto">
                    <Upload size={13} />
                    {isUploadingVideo ? "Uploading..." : "Upload Video MP4"}
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime"
                      onChange={handleVideoUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {videoUploadStatus && (
                  <p className="text-xs font-semibold text-[#C5A059] bg-[#C5A059]/10 p-2 rounded-lg border border-[#C5A059]/20">
                    {videoUploadStatus}
                  </p>
                )}

                {/* Video Card with Live Preview */}
                <div className="flex flex-col sm:flex-row items-center gap-5 p-3.5 bg-[#141416] rounded-xl border border-[#26262B]">
                  <div className="w-28 h-36 rounded-xl bg-[#1A1A1E] border border-[#2A2A2E] relative overflow-hidden shrink-0 flex items-center justify-center shadow-lg group">
                    {videoUrl ? (
                      <>
                        <video
                          src={videoUrl}
                          autoPlay
                          muted
                          loop
                          playsInline
                          className="w-full h-full object-cover"
                        />
                        {videoSizeBytes && (
                          <div className="absolute top-1.5 left-1.5 bg-black/80 backdrop-blur-md text-[#C5A059] font-mono text-[9px] font-bold px-1.5 py-0.5 rounded border border-[#C5A059]/30 shadow">
                            {formatFileSize(videoSizeBytes)}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-1.5 p-2 text-center">
                        <Film className="text-gray-600" size={28} />
                        <span className="text-[9.5px] text-gray-500 font-medium">No Video Reel</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2.5 flex-1 w-full">
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-bold text-gray-300">Direct Video Source URL</span>
                      {videoSizeBytes && (
                        <span className="text-[11px] font-bold text-[#C5A059] bg-[#C5A059]/10 px-2.5 py-0.5 rounded-lg border border-[#C5A059]/20">
                          {formatFileSize(videoSizeBytes)}
                        </span>
                      )}
                    </div>

                    <input
                      type="text"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="Paste direct MP4 video URL or upload above..."
                      className="w-full bg-[#18181A] border border-[#2A2A2E] text-white text-[12.5px] px-3.5 py-2 rounded-xl outline-none font-mono focus:border-[#C5A059]"
                    />

                    {videoUrl && (
                      <button
                        type="button"
                        onClick={() => setShowVideoDeleteModal(true)}
                        className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold rounded-lg border border-red-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 size={13} />
                        Remove Video File
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: VARIANTS & DESCRIPTION */}
        {activeTab === "variants" && (
          <div className="space-y-8">
            {/* Color Variants Section */}
            <div className="space-y-6 max-w-4xl">
              <h3 className="text-[16px] font-bold text-[#C5A059] tracking-wide uppercase border-b border-[#222226] pb-2 flex items-center gap-2">
                <Palette size={18} /> Color Options & Swatches
              </h3>

              <div className="bg-[#1C1C20] border border-[#26262B] p-6 rounded-2xl space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[12px] font-semibold text-gray-300 block mb-1.5">
                      Color Variant Name <span className="text-[#C5A059]">*</span>
                    </label>
                    <input
                      type="text"
                      value={newColorName}
                      onChange={(e) => setNewColorName(e.target.value)}
                      placeholder="e.g. Yellow Car, Pearl White, Shark Blue"
                      className="w-full bg-[#18181A] border border-[#2A2A2E] text-white text-[13px] px-4 py-2.5 rounded-xl outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div>
                    <label className="text-[12px] font-semibold text-gray-300 block mb-1.5">
                      Swatch Color Picker
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

                <div className="flex items-center justify-between gap-4 pt-2">
                  <label className="bg-[#202024] hover:bg-[#2A2A30] text-white font-semibold text-[12px] px-4 py-2 rounded-xl border border-[#303036] flex items-center gap-2 cursor-pointer transition-all">
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

                  <button
                    type="button"
                    onClick={addColorOption}
                    className="bg-[#C5A059] hover:bg-[#b08b46] text-black font-bold text-[12.5px] px-5 py-2.5 rounded-xl transition-all shadow flex items-center gap-2 cursor-pointer"
                  >
                    <Plus size={16} /> Add Color Variant
                  </button>
                </div>
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

            {/* SECTION A: PRODUCT HIGHLIGHTS */}
            <div className="space-y-4 pt-6 border-t border-[#222226]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[16px] font-bold text-[#C5A059] tracking-wide uppercase flex items-center gap-2">
                    <Sparkles size={18} /> Product Highlights
                  </h3>
                  <p className="text-[12px] text-gray-400 mt-1">
                    Key features shown with checkmarks on product page.
                  </p>
                </div>
              </div>

              {highlights.length === 0 ? (
                <div className="p-4 bg-[#141416] rounded-xl border border-[#222226] flex items-center justify-between">
                  <p className="text-[13px] text-gray-500 italic">No highlights added yet.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {highlights.map((hl, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-2.5 bg-[#1C1C20] rounded-xl border border-[#26262B] group"
                    >
                      <span className="text-emerald-400 font-bold text-sm pl-2">+</span>
                      <input
                        type="text"
                        value={hl}
                        onChange={(e) => updateHighlight(idx, e.target.value)}
                        className="flex-1 bg-[#141416] border border-[#2A2A2E] text-white text-[13.5px] px-3 py-2 rounded-lg outline-none focus:border-[#C5A059]"
                      />
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => moveHighlight(idx, "up")}
                          disabled={idx === 0}
                          className="p-1.5 text-gray-400 hover:text-white disabled:opacity-30 cursor-pointer"
                          title="Move Up"
                        >
                          <ChevronUp size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveHighlight(idx, "down")}
                          disabled={idx === highlights.length - 1}
                          className="p-1.5 text-gray-400 hover:text-white disabled:opacity-30 cursor-pointer"
                          title="Move Down"
                        >
                          <ChevronDown size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeHighlight(idx)}
                          className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded cursor-pointer"
                          title="Remove highlight"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Highlight Row */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="text"
                  value={newHighlight}
                  onChange={(e) => setNewHighlight(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addHighlight();
                    }
                  }}
                  placeholder="e.g. Opening Doors, LED Headlights..."
                  className="flex-1 bg-[#18181A] border border-[#2A2A2E] text-white text-[13.5px] px-4 py-2.5 rounded-xl outline-none focus:border-[#C5A059]"
                />
                <button
                  type="button"
                  onClick={addHighlight}
                  className="bg-[#202024] hover:bg-[#2A2A30] text-white border border-[#303036] font-bold text-[12.5px] px-4 py-2.5 rounded-xl transition-all shadow cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <Plus size={16} /> Add Highlight
                </button>
              </div>
            </div>

            {/* SECTION B: PRODUCT DESCRIPTION */}
            <div className="space-y-4 pt-6 border-t border-[#222226]">
              <div>
                <h3 className="text-[16px] font-bold text-[#C5A059] tracking-wide uppercase flex items-center gap-2">
                  <FileText size={18} /> Product Description
                </h3>
                <p className="text-[12px] text-gray-400 mt-1">
                  Enter complete model description. Exact paragraphs, line breaks, and spacing will be preserved on storefront.
                </p>
              </div>

              <textarea
                rows={10}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write the complete product description..."
                className="w-full bg-[#18181A] border border-[#2A2A2E] text-white text-[14px] p-4 rounded-xl outline-none focus:border-[#C5A059] leading-relaxed whitespace-pre-wrap font-sans"
              />
            </div>

            {/* SECTION C: WHAT'S INCLUDED */}
            <div className="space-y-4 pt-6 border-t border-[#222226]">
              <div>
                <h3 className="text-[16px] font-bold text-[#C5A059] tracking-wide uppercase flex items-center gap-2">
                  <Package size={18} /> What&apos;s Included
                </h3>
                <p className="text-[12px] text-gray-400 mt-1">
                  List items included in the package.
                </p>
              </div>

              {includedItems.length === 0 ? (
                <div className="p-4 bg-[#141416] rounded-xl border border-[#222226] flex items-center justify-between">
                  <p className="text-[13px] text-gray-500 italic">No included items added yet.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {includedItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-2.5 bg-[#1C1C20] rounded-xl border border-[#26262B] group"
                    >
                      <span className="text-emerald-400 font-bold text-sm pl-2">✔</span>
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => updateIncludedItem(idx, e.target.value)}
                        className="flex-1 bg-[#141416] border border-[#2A2A2E] text-white text-[13.5px] px-3 py-2 rounded-lg outline-none focus:border-[#C5A059]"
                      />
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => moveIncludedItem(idx, "up")}
                          disabled={idx === 0}
                          className="p-1.5 text-gray-400 hover:text-white disabled:opacity-30 cursor-pointer"
                          title="Move Up"
                        >
                          <ChevronUp size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveIncludedItem(idx, "down")}
                          disabled={idx === includedItems.length - 1}
                          className="p-1.5 text-gray-400 hover:text-white disabled:opacity-30 cursor-pointer"
                          title="Move Down"
                        >
                          <ChevronDown size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeIncludedItem(idx)}
                          className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Included Item Row */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="text"
                  value={newIncludedItem}
                  onChange={(e) => setNewIncludedItem(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addIncludedItem();
                    }
                  }}
                  placeholder="e.g. Premium Display Box, Remote Control..."
                  className="flex-1 bg-[#18181A] border border-[#2A2A2E] text-white text-[13.5px] px-4 py-2.5 rounded-xl outline-none focus:border-[#C5A059]"
                />
                <button
                  type="button"
                  onClick={addIncludedItem}
                  className="bg-[#202024] hover:bg-[#2A2A30] text-white border border-[#303036] font-bold text-[12.5px] px-4 py-2.5 rounded-xl transition-all shadow cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <Plus size={16} /> Add Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

        {/* TAB 3: SPECS & SEO */}
        {activeTab === "seo_specs" && (
          <div className="space-y-8">
            {/* Technical Specifications */}
            <div className="space-y-6 max-w-4xl">
              <h3 className="text-[16px] font-bold text-[#C5A059] tracking-wide uppercase border-b border-[#222226] pb-2 flex items-center gap-2">
                <Sliders size={18} /> Technical Specifications
              </h3>

              {/* Key-Value Attributes */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-[14px] font-bold text-white">Custom Attribute Key-Values</h4>
                  <button
                    type="button"
                    onClick={addSpec}
                    className="bg-[#202024] hover:bg-[#2A2A30] text-white text-[12px] font-semibold px-3 py-1.5 rounded-xl border border-[#303036] flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={14} /> Add Specification
                  </button>
                </div>

                {specs.length === 0 ? (
                  <div className="p-4 bg-[#141416] rounded-xl border border-[#222226] flex items-center justify-between mb-3">
                    <p className="text-[13px] text-gray-500 italic">No specifications added yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {specs.map((sp, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <input
                          type="text"
                          value={sp.key}
                          onChange={(e) => updateSpec(idx, e.target.value, sp.value)}
                          placeholder="Attribute (e.g. Doors)"
                          className="w-1/3 bg-[#18181A] border border-[#2A2A2E] text-white text-[13px] px-3.5 py-2.5 rounded-xl outline-none font-medium"
                        />
                        <input
                          type="text"
                          value={sp.value}
                          onChange={(e) => updateSpec(idx, sp.key, e.target.value)}
                          placeholder="Value (e.g. All 4 Openable)"
                          className="flex-1 bg-[#18181A] border border-[#2A2A2E] text-white text-[13px] px-3.5 py-2.5 rounded-xl outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => removeSpec(idx)}
                          className="text-red-400 hover:text-red-300 p-2 cursor-pointer"
                          title="Remove specification"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* SEO Metadata */}
            <div className="space-y-6 max-w-4xl pt-4 border-t border-[#222226]">
              <h3 className="text-[16px] font-bold text-[#C5A059] tracking-wide uppercase border-b border-[#222226] pb-2 flex items-center gap-2">
                <Search size={18} /> Search Engine Optimization (SEO)
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-[13px] font-semibold text-gray-300 block mb-2">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    placeholder={`${name || "Product Name"} | DAXO-MART`}
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
                    placeholder="Search engine summary..."
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
            </div>
          </div>
        )}
      </div>

      {/* FIXED BOTTOM STEPPER NAVIGATION BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#141416]/95 backdrop-blur-md border-t border-[#222226] p-4 px-6 md:px-12 flex items-center justify-between shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
        <div>
          {activeTab !== "essentials" && (
            <button
              type="button"
              onClick={() => {
                if (activeTab === "variants") setActiveTab("essentials");
                if (activeTab === "seo_specs") setActiveTab("variants");
              }}
              className="px-5 py-2.5 rounded-xl bg-[#1C1C20] hover:bg-[#25252A] text-gray-300 hover:text-white font-semibold text-[13px] border border-[#2A2A2F] transition-all cursor-pointer flex items-center gap-2"
            >
              <ArrowLeft size={16} /> Back Step
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {activeTab !== "seo_specs" ? (
            <button
              type="button"
              onClick={() => {
                if (activeTab === "essentials") {
                  if (!name.trim()) {
                    alert("Please fill in the product title first.");
                    return;
                  }
                  setActiveTab("variants");
                } else if (activeTab === "variants") {
                  setActiveTab("seo_specs");
                }
              }}
              className="bg-[#C5A059] hover:bg-[#b08b46] text-black font-bold text-[13px] tracking-wider uppercase px-6 py-3 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              Next Step: {activeTab === "essentials" ? "Colors & Description" : "Specs & SEO"} <ArrowRight size={16} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={saving}
              className="bg-[#C5A059] hover:bg-[#b08b46] active:scale-[0.98] text-black font-extrabold text-[13.5px] tracking-wider uppercase px-8 py-3 rounded-xl transition-all shadow-[0_4px_20px_rgba(197,160,89,0.3)] flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save size={18} />
              {saving ? "Saving Product..." : isEditing ? "Save & Complete" : "Publish Product"}
            </button>
          )}
        </div>
      </div>

      {/* VIDEO DELETE CONFIRMATION MODAL */}
      {showVideoDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141416] border border-[#2B2B30] w-full max-w-md rounded-[24px] shadow-2xl p-6 space-y-5">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-3 bg-red-500/10 rounded-2xl border border-red-500/20">
                <Trash2 size={24} />
              </div>
              <div>
                <h3 className="text-[17px] font-bold text-white font-pally">Delete Product Video?</h3>
                <p className="text-[12px] text-gray-400">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-[13px] text-gray-300 leading-relaxed">
              Are you sure you want to permanently delete this video file?
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#222226]">
              <button
                type="button"
                onClick={() => setShowVideoDeleteModal(false)}
                className="px-5 py-2.5 rounded-xl bg-[#1A1A1E] text-gray-300 hover:text-white text-[13px] font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteVideo}
                disabled={isDeletingVideo}
                className="px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-[13px] tracking-wider uppercase shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                {isDeletingVideo ? "Deleting..." : "Delete Video"}
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}

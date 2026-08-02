"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Store,
  ShieldCheck,
  LogOut,
  Save,
  KeyRound,
  CreditCard,
  Truck,
  MessageSquare,
  Search,
  Users,
  Sliders,
  CheckCircle,
} from "lucide-react";

export type SettingsTabType =
  | "general"
  | "store"
  | "payments"
  | "shipping"
  | "whatsapp"
  | "seo"
  | "users";

interface SettingsTabProps {
  onSignOut: () => void;
}

export default function SettingsTab({ onSignOut }: SettingsTabProps) {
  const [activeTab, setActiveTab] = useState<SettingsTabType>("general");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    onSignOut();
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const settingTabs: Array<{ id: SettingsTabType; label: string; icon: React.ElementType }> = [
    { id: "general", label: "General", icon: Sliders },
    { id: "store", label: "Store", icon: Store },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "shipping", label: "Shipping", icon: Truck },
    { id: "whatsapp", label: "WhatsApp", icon: MessageSquare },
    { id: "seo", label: "SEO", icon: Search },
    { id: "users", label: "Users & Roles", icon: Users },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#141416] border border-[#222226] p-6 rounded-[20px] shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[22px] font-bold text-white tracking-tight font-pally">
            System & Store Settings
          </h2>
          <p className="text-[13px] text-gray-400 mt-1 font-normal">
            Manage store identity, payment integrations, shipping rules & admin access control.
          </p>
        </div>
        <button
          onClick={handleSignOut}
          className="bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-[12px] uppercase tracking-wider px-4 py-2.5 rounded-xl border border-red-500/20 transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <LogOut size={15} /> Sign Out Admin
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-[#222226] pb-2 overflow-x-auto scrollbar-none">
        {settingTabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-[13px] font-semibold tracking-wide transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                active
                  ? "bg-[#C5A059] text-black font-bold shadow-md"
                  : "bg-[#141416] text-gray-400 hover:bg-[#1A1A1D] hover:text-white border border-[#222226]"
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="bg-[#141416] border border-[#222226] rounded-[20px] p-6 lg:p-8 shadow-xl">
        <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
          {savedSuccess && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[13px] font-medium flex items-center gap-2">
              <CheckCircle size={16} /> Settings saved successfully!
            </div>
          )}

          {/* GENERAL TAB */}
          {activeTab === "general" && (
            <div className="space-y-4">
              <h3 className="text-[16px] font-bold text-white font-pally">General Application Settings</h3>
              <div>
                <label className="text-[12px] font-semibold text-gray-300 block mb-1.5">Site Name</label>
                <input
                  type="text"
                  defaultValue="DAXOMART DIECAST"
                  className="w-full bg-[#18181A] border border-[#2A2A2E] text-white text-[14px] px-4 py-3 rounded-xl outline-none focus:border-[#C5A059]"
                />
              </div>
              <div>
                <label className="text-[12px] font-semibold text-gray-300 block mb-1.5">Default Currency</label>
                <input
                  type="text"
                  defaultValue="INR (₹)"
                  disabled
                  className="w-full bg-[#18181A] border border-[#2A2A2E] text-gray-400 text-[14px] px-4 py-3 rounded-xl outline-none"
                />
              </div>
            </div>
          )}

          {/* STORE TAB */}
          {activeTab === "store" && (
            <div className="space-y-4">
              <h3 className="text-[16px] font-bold text-white font-pally">Store Branding & Support</h3>
              <div>
                <label className="text-[12px] font-semibold text-gray-300 block mb-1.5">Brand Tagline</label>
                <input
                  type="text"
                  defaultValue="Premium Scale Diecast Replicas"
                  className="w-full bg-[#18181A] border border-[#2A2A2E] text-white text-[14px] px-4 py-3 rounded-xl outline-none focus:border-[#C5A059]"
                />
              </div>
              <div>
                <label className="text-[12px] font-semibold text-gray-300 block mb-1.5">Support Email</label>
                <input
                  type="email"
                  defaultValue="support@daxomart.com"
                  className="w-full bg-[#18181A] border border-[#2A2A2E] text-white text-[14px] px-4 py-3 rounded-xl outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>
          )}

          {/* PAYMENTS TAB */}
          {activeTab === "payments" && (
            <div className="space-y-4">
              <h3 className="text-[16px] font-bold text-white font-pally">Payment Gateways</h3>
              <div className="p-4 bg-[#1C1C20] rounded-xl border border-[#28282D]">
                <p className="text-[14px] font-bold text-white mb-1">WhatsApp Direct Checkout</p>
                <p className="text-[12px] text-gray-400">Active mode for instant customer order placement without payment gateway friction.</p>
              </div>
              <div>
                <label className="text-[12px] font-semibold text-gray-300 block mb-1.5">Razorpay Key ID (Future Ready)</label>
                <input
                  type="text"
                  placeholder="rzp_live_..."
                  className="w-full bg-[#18181A] border border-[#2A2A2E] text-white text-[14px] px-4 py-3 rounded-xl outline-none font-mono"
                />
              </div>
            </div>
          )}

          {/* SHIPPING TAB */}
          {activeTab === "shipping" && (
            <div className="space-y-4">
              <h3 className="text-[16px] font-bold text-white font-pally">Shipping & Courier Settings</h3>
              <div>
                <label className="text-[12px] font-semibold text-gray-300 block mb-1.5">Free Shipping Minimum Amount (₹)</label>
                <input
                  type="number"
                  defaultValue={0}
                  className="w-full bg-[#18181A] border border-[#2A2A2E] text-white text-[14px] px-4 py-3 rounded-xl outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>
          )}

          {/* WHATSAPP TAB */}
          {activeTab === "whatsapp" && (
            <div className="space-y-4">
              <h3 className="text-[16px] font-bold text-white font-pally">WhatsApp Integration Config</h3>
              <div>
                <label className="text-[12px] font-semibold text-gray-300 block mb-1.5">WhatsApp Admin Number</label>
                <input
                  type="text"
                  defaultValue="9048571147"
                  className="w-full bg-[#18181A] border border-[#2A2A2E] text-white text-[14px] px-4 py-3 rounded-xl outline-none focus:border-[#C5A059] font-mono"
                />
              </div>
            </div>
          )}

          {/* SEO TAB */}
          {activeTab === "seo" && (
            <div className="space-y-6">
              <h3 className="text-[16px] font-bold text-white font-pally">Global Store SEO & Indexing</h3>
              <div>
                <label className="text-[12px] font-semibold text-gray-300 block mb-1.5">Store Meta Title</label>
                <input
                  type="text"
                  defaultValue="DaxoMart™ | India's #1 Premium Scale Model Cars & Diecast Replicas"
                  className="w-full bg-[#18181A] border border-[#2A2A2E] text-white text-[14px] px-4 py-3 rounded-xl outline-none focus:border-[#C5A059]"
                />
              </div>

              {/* Google Merchant Center XML Feed Card */}
              <div className="p-5 bg-[#1C1C20] rounded-2xl border border-[#C5A059]/40 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🛍️</span>
                    <div>
                      <h4 className="text-[15px] font-bold text-white font-pally">Google Merchant Center XML Product Feed</h4>
                      <p className="text-[12px] text-gray-400">Automated RSS 2.0 XML Feed for Google Shopping & Free Product Listings</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] uppercase border border-emerald-500/30">
                    Live Feed Active
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-[#141416] p-3 rounded-xl border border-[#2A2A2E]">
                  <input
                    type="text"
                    readOnly
                    value={typeof window !== "undefined" ? `${window.location.origin}/google-shopping.xml` : "https://daxomart.resellerpro.in/google-shopping.xml"}
                    className="w-full bg-transparent text-[#C5A059] text-[13px] font-mono outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const url = typeof window !== "undefined" ? `${window.location.origin}/google-shopping.xml` : "https://daxomart.resellerpro.in/google-shopping.xml";
                      navigator.clipboard.writeText(url);
                      alert("Google Merchant XML Feed URL copied to clipboard!");
                    }}
                    className="bg-[#C5A059] hover:bg-[#b08b46] text-black font-extrabold text-[11px] uppercase tracking-wider px-3.5 py-2 rounded-lg cursor-pointer transition-all shrink-0"
                  >
                    Copy Feed Link
                  </button>
                </div>

                <div className="text-[12px] text-gray-300 space-y-1.5 pt-1">
                  <p className="font-bold text-white">How to list items on Google Shopping Top Results:</p>
                  <ol className="list-decimal list-inside space-y-1 text-gray-400 pl-1">
                    <li>Go to <a href="https://merchants.google.com" target="_blank" rel="noreferrer" className="text-[#C5A059] underline font-bold">merchants.google.com</a> and sign in with your Google account.</li>
                    <li>Click <strong>Products → Feeds → Add primary feed</strong>.</li>
                    <li>Select <strong>Scheduled Fetch</strong> and paste the copied feed URL above.</li>
                    <li>Google will automatically fetch your products every day and feature them at the top of Google Search & Shopping!</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* USERS TAB */}
          {activeTab === "users" && (
            <div className="space-y-4">
              <h3 className="text-[16px] font-bold text-white font-pally">Admin Users & Access Control</h3>
              <div className="p-4 bg-[#1C1C20] rounded-xl border border-[#28282D] flex items-center justify-between">
                <div>
                  <p className="text-[14px] font-bold text-white">Super Administrator</p>
                  <p className="text-[12px] text-gray-400">admin@daxomart.com</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#C5A059]/20 text-[#C5A059] font-bold text-[11px] uppercase border border-[#C5A059]/30">
                  Full Access
                </span>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="bg-[#C5A059] hover:bg-[#b08b46] active:scale-[0.98] text-black font-bold text-[13px] tracking-wider uppercase px-6 py-3 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Save size={16} /> Save Settings
          </button>
        </form>
      </div>
    </div>
  );
}

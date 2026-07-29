"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Store, ShieldCheck, LogOut, Save, KeyRound } from "lucide-react";

interface SettingsTabProps {
  onSignOut: () => void;
}

export default function SettingsTab({ onSignOut }: SettingsTabProps) {
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    onSignOut();
  };

  const handleSaveStore = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#141416] border border-[#222226] p-6 rounded-[20px] shadow-md">
        <h2 className="text-[22px] font-bold text-white tracking-tight font-pally">
          Admin & System Settings
        </h2>
        <p className="text-[13px] text-gray-400 mt-1 font-normal">
          Configure store branding, WhatsApp support contact numbers, and security credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Store Info Form Card */}
        <div className="bg-[#141416] border border-[#222226] rounded-[20px] p-6 shadow-md space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#222226]">
            <div className="w-9 h-9 rounded-xl bg-[#C5A059]/15 text-[#C5A059] flex items-center justify-center border border-[#C5A059]/20">
              <Store size={18} />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-white font-pally">Store Configuration</h3>
              <p className="text-[12px] text-gray-400">Manage store identity & support info</p>
            </div>
          </div>

          <form onSubmit={handleSaveStore} className="space-y-4 pt-2">
            {[
              { label: "Brand Name", value: "DAXOMART DIECAST", placeholder: "DAXOMART" },
              { label: "WhatsApp Support Helpdesk", value: "9048571147", placeholder: "9048571147" },
              { label: "Official Contact Email", value: "admin@daxomart.com", placeholder: "admin@daxomart.com" },
            ].map(({ label, value, placeholder }) => (
              <div key={label}>
                <label className="text-[12px] font-semibold text-gray-300 block mb-1.5">
                  {label}
                </label>
                <input
                  type="text"
                  defaultValue={value}
                  placeholder={placeholder}
                  className="w-full bg-[#18181A] border border-[#2A2A2E] text-white text-[13.5px] px-4 py-3 rounded-2xl outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 transition-all font-pally placeholder:text-gray-500"
                />
              </div>
            ))}

            {savedSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[13px] font-medium">
                Store settings saved successfully!
              </div>
            )}

            <button
              type="submit"
              className="bg-[#C5A059] hover:bg-[#b08b46] active:scale-[0.98] text-black font-bold text-[13px] tracking-wider uppercase px-5 py-3.5 rounded-2xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Save size={16} /> Save Settings
            </button>
          </form>
        </div>

        {/* Security Settings Card */}
        <div className="bg-[#141416] border border-[#222226] rounded-[20px] p-6 shadow-md space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#222226]">
            <div className="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center border border-blue-500/20">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-white font-pally">Admin Security & Credentials</h3>
              <p className="text-[12px] text-gray-400">Update access passwords & session controls</p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <label className="text-[12px] font-semibold text-gray-300 block mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-[#18181A] border border-[#2A2A2E] text-white text-[13.5px] px-4 py-3 rounded-2xl outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 transition-all font-pally placeholder:text-gray-500"
              />
            </div>
            <div>
              <label className="text-[12px] font-semibold text-gray-300 block mb-1.5">
                New Security Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-[#18181A] border border-[#2A2A2E] text-white text-[13.5px] px-4 py-3 rounded-2xl outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 transition-all font-pally placeholder:text-gray-500"
              />
            </div>
            <button className="bg-[#202024] hover:bg-[#2A2A30] text-white font-bold text-[12px] tracking-wider uppercase px-5 py-3 rounded-2xl transition-colors flex items-center gap-2 border border-gray-700 cursor-pointer">
              <KeyRound size={15} /> Update Password
            </button>

            <div className="mt-8 pt-6 border-t border-[#222226]">
              <button
                onClick={handleSignOut}
                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-bold text-[12px] tracking-wider uppercase px-5 py-3 rounded-2xl transition-colors flex items-center gap-2 cursor-pointer"
              >
                <LogOut size={15} /> Sign Out from Admin Portal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

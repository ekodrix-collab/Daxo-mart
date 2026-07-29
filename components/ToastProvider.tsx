"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

interface ToastContextType {
  showToast: (type: ToastType, title: string, description?: string) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (type: ToastType, title: string, description?: string) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastMessage = { id, type, title, description };

      setToasts((prev) => [...prev, newToast]);

      // Auto dismiss after 4.5 seconds
      setTimeout(() => {
        removeToast(id);
      }, 4500);
    },
    [removeToast]
  );

  const success = useCallback(
    (title: string, description?: string) => showToast("success", title, description),
    [showToast]
  );

  const error = useCallback(
    (title: string, description?: string) => showToast("error", title, description),
    [showToast]
  );

  const info = useCallback(
    (title: string, description?: string) => showToast("info", title, description),
    [showToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, success, error, info }}>
      {children}

      {/* TOP RIGHT FLOATING TOAST CONTAINER */}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          const isSuccess = toast.type === "success";
          const isError = toast.type === "error";

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto p-4 rounded-2xl border shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl flex items-start gap-3 transition-all animate-in fade-in slide-in-from-top-3 duration-300 ${
                isSuccess
                  ? "bg-[#141416]/95 border-emerald-500/40 text-emerald-400"
                  : isError
                  ? "bg-[#141416]/95 border-red-500/40 text-red-400"
                  : "bg-[#141416]/95 border-[#C5A059]/40 text-[#C5A059]"
              }`}
            >
              <div className="p-1 rounded-lg shrink-0 mt-0.5">
                {isSuccess ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : isError ? (
                  <AlertCircle className="w-5 h-5 text-red-400" />
                ) : (
                  <Info className="w-5 h-5 text-[#C5A059]" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-[13.5px] font-bold text-white tracking-wide font-pally">
                  {toast.title}
                </h4>
                {toast.description && (
                  <p className="text-[12px] text-gray-300 mt-0.5 leading-snug break-words">
                    {toast.description}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-gray-500 hover:text-white p-1 transition-colors cursor-pointer shrink-0"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

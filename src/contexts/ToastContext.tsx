"use client";
import React, { createContext, useContext, useState, useCallback } from "react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  showToast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((type: ToastType, message: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastMessage = { id, type, message };

    setToasts((prev) => [...prev, newToast]);

    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const getToastIcon = (type: ToastType) => {
    switch (type) {
      case "success":
        return "pi pi-check-circle";
      case "error":
        return "pi pi-times-circle";
      case "warning":
        return "pi pi-exclamation-triangle";
      case "info":
        return "pi pi-info-circle";
    }
  };

  const getToastColors = (type: ToastType) => {
    switch (type) {
      case "success":
        return "bg-green-500/90 border-green-400";
      case "error":
        return "bg-red-500/90 border-red-400";
      case "warning":
        return "bg-yellow-500/90 border-yellow-400";
      case "info":
        return "bg-blue-500/90 border-blue-400";
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Container */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[9999] flex flex-col gap-3 items-center">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              flex items-center gap-3 px-6 py-4 rounded-lg border-2
              shadow-2xl backdrop-blur-sm
              animate-slide-up-bottom
              min-w-[300px] max-w-[500px]
              ${getToastColors(toast.type)}
            `}
          >
            <i className={`${getToastIcon(toast.type)} text-2xl text-white`} />
            <span className="text-white font-medium flex-1">
              {toast.message}
            </span>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <i className="pi pi-times text-lg" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

"use client";

import { Toaster } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 3000,
        style: {
          background: "#1f2937",
          color: "#f3f4f6",
          borderRadius: "0.5rem",
          border: "1px solid #374151",
        },
        success: {
          style: {
            background: "#064e3b",
            borderColor: "#10b981",
          },
          iconTheme: {
            primary: "#10b981",
            secondary: "#064e3b",
          },
        },
        error: {
          style: {
            background: "#7f1d1d",
            borderColor: "#ef4444",
          },
          iconTheme: {
            primary: "#ef4444",
            secondary: "#7f1d1d",
          },
        },
      }}
    />
  );
}

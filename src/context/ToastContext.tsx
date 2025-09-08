"use client";

import { Toaster } from "react-hot-toast";
import { FaCheckCircle, FaTimesCircle, FaInfoCircle, FaSpinner } from "react-icons/fa";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        style: {
          padding: "12px 20px",
          borderRadius: "8px",
          color: "#fff",
          fontSize: "14px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          transition: "all 0.25s ease-in-out", // ✅ smooth fade/slide
        },
        success: {
          icon: <FaCheckCircle className="text-white w-5 h-5" />,
          style: { background: "#22c55e" }, // green
        },
        error: {
          icon: <FaTimesCircle className="text-white w-5 h-5" />,
          style: { background: "#dc2626ff" }, // red
        },
        loading: {
          icon: <FaSpinner className="animate-spin text-white w-5 h-5" />,
          style: { background: "#2563eb" }, // blue
        },
      }}
    />
  );
}

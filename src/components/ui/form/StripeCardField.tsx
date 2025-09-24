import { CardElement } from "@stripe/react-stripe-js";
import { useState } from "react";

interface StripeCardFieldProps {
  label?: string;
}

export default function StripeCardField({ label }: StripeCardFieldProps) {
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-1">
      {/* {label && <label className="block text-sm font-medium text-gray-700">{label}</label>} */}

      <div className="flex items-center border rounded-lg px-3 py-2 minimal-textbox">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#111827", // gray-900
                fontFamily: "inherit",
                '::placeholder': { color: "#9CA3AF" }, // gray-400
              },
              invalid: { color: "#DC2626" }, // red-600
            },
          }}
          className="flex-1 outline-none bg-transparent"
          onChange={(event) => {
            if (event.error) {
              setError(event.error.message ?? null);
            } else {
              setError(null);
            }
          }}
        />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
}

"use client";

import { useState } from "react";

export default function OrderSuccessMessage() {
  const [orderId] = useState<string | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    return sessionStorage.getItem("scentora:last-order-id");
  });

  return (
    <p className="mt-3 text-sm text-textSecondary">
      {orderId ? `Order ID: ${orderId}` : "Your order is being prepared."}
    </p>
  );
}

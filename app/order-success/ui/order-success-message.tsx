"use client";

import { useEffect, useState } from "react";

export default function OrderSuccessMessage() {
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    setOrderId(sessionStorage.getItem("scentora:last-order-id"));
  }, []);

  return (
    <p className="mt-3 text-sm text-textSecondary">
      {orderId ? `Order ID: ${orderId}` : "Your order is being prepared."}
    </p>
  );
}

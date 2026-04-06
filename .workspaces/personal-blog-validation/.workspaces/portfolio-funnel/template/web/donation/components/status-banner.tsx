"use client";

import { useSearchParams } from "next/navigation";

export function StatusBanner() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");

  if (!status) {
    return null;
  }

  return (
    <div
      className={`status-banner ${status === "success" ? "status-banner--success" : "status-banner--neutral"}`}
      role="status"
    >
      {status === "success"
        ? "Donation received. Stripe will confirm the payment and the progress bar will update after the webhook arrives."
        : "Checkout was cancelled. You can adjust the amount and try again."}
    </div>
  );
}

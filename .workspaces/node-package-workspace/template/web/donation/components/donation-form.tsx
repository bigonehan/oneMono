"use client";

import { useState } from "react";
import type { DonationPreset } from "@/lib/campaign-content";
import { formatCurrency } from "@/lib/display";

type DonationFormProps = {
  presets: DonationPreset[];
  ctaLabel: string;
  currency: string;
};

function resolveAmountCents(selectedAmount: number | null, customAmount: string) {
  const parsedCustom = Math.round(Number(customAmount || "0") * 100);
  if (parsedCustom > 0) {
    return parsedCustom;
  }
  return selectedAmount ?? 0;
}

export function DonationForm({ presets, ctaLabel, currency }: DonationFormProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(presets[1]?.amountCents ?? presets[0]?.amountCents ?? null);
  const [customAmount, setCustomAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const amountCents = resolveAmountCents(selectedAmount, customAmount);
    if (amountCents < 100) {
      setMessage("Choose or enter at least $1 before continuing.");
      return;
    }

    try {
      setIsSubmitting(true);
      setMessage("Creating Stripe checkout...");
      const response = await fetch("/api/donate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amountCents,
          donorName,
        }),
      });

      const data = (await response.json()) as { error?: string; url?: string };
      if (!response.ok || !data.url) {
        setMessage(data.error || "Unable to create Stripe checkout.");
        return;
      }

      window.location.assign(data.url);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to create Stripe checkout.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="donation-form" onSubmit={handleSubmit} data-testid="donation-form">
      <div className="donation-form__presets">
        {presets.map((preset) => {
          const active = customAmount === "" && selectedAmount === preset.amountCents;
          return (
            <button
              key={preset.amountCents}
              type="button"
              className={`preset-card ${active ? "preset-card--active" : ""}`}
              onClick={() => {
                setCustomAmount("");
                setSelectedAmount(preset.amountCents);
              }}
            >
              <strong>{preset.label}</strong>
              <span>{preset.impact}</span>
            </button>
          );
        })}
      </div>

      <label className="field">
        <span>Custom amount (USD)</span>
        <input
          data-testid="custom-amount-input"
          type="number"
          min="1"
          step="1"
          inputMode="numeric"
          placeholder="75"
          value={customAmount}
          onChange={(event) => setCustomAmount(event.target.value)}
        />
      </label>

      <label className="field">
        <span>Donor name</span>
        <input
          data-testid="donor-name-input"
          type="text"
          placeholder="Anonymous"
          value={donorName}
          onChange={(event) => setDonorName(event.target.value)}
        />
      </label>

      <div className="donation-form__summary">
        <span>Amount</span>
        <strong>{formatCurrency(resolveAmountCents(selectedAmount, customAmount), currency)}</strong>
      </div>

      <button
        type="submit"
        className="button button--primary"
        disabled={isSubmitting}
        data-testid="donation-submit-button"
      >
        {isSubmitting ? "Redirecting..." : ctaLabel}
      </button>

      {message ? (
        <p className="donation-form__message" data-testid="donation-form-message">
          {message}
        </p>
      ) : null}
    </form>
  );
}

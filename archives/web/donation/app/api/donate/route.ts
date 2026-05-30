import { NextResponse } from "next/server";
import { loadCampaignContent } from "@/lib/campaign-content";
import { getStripeClient } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      amountCents?: number;
      donorName?: string;
    };

    const amountCents = Math.round(Number(payload.amountCents) || 0);
    if (amountCents < 100 || amountCents > 5000000) {
      return NextResponse.json(
        {
          error: "Donation amount must be between $1 and $50,000.",
        },
        { status: 400 },
      );
    }

    const content = await loadCampaignContent();
    const stripe = getStripeClient();
    const origin = new URL(request.url).origin;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      submit_type: "donate",
      billing_address_collection: "auto",
      success_url: `${origin}/?status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?status=cancelled`,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: amountCents,
            product_data: {
              name: content.campaignName,
              description: content.heroSummary,
            },
          },
        },
      ],
      metadata: {
        campaign_name: content.campaignName,
        donor_name: payload.donorName?.trim() || "Anonymous",
      },
    });

    if (!session.url) {
      throw new Error("Stripe did not return a checkout URL.");
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to create Stripe checkout.",
      },
      { status: 500 },
    );
  }
}

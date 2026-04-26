import { NextResponse } from "next/server";
import Stripe from "stripe";
import { appendCompletedDonation } from "@/lib/donation-state";
import { getStripeClient, getStripeWebhookSecret } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  try {
    const rawBody = await request.text();
    const stripe = getStripeClient();
    const event = stripe.webhooks.constructEvent(rawBody, signature, getStripeWebhookSecret());

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      await appendCompletedDonation({
        sessionId: session.id,
        amountCents: session.amount_total ?? 0,
        donorName: session.metadata?.donor_name || session.customer_details?.name || "Anonymous",
        currency: session.currency || "usd",
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to validate Stripe webhook.",
      },
      { status: 400 },
    );
  }
}

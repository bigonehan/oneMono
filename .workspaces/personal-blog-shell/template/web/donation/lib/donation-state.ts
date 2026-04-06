import { promises as fs } from "node:fs";
import path from "node:path";

export type DonationEntry = {
  id: string;
  amountCents: number;
  donorName: string;
  createdAt: string;
};

export type DonationState = {
  currency: string;
  totalRaisedCents: number;
  donorCount: number;
  updatedAt: string;
  processedSessionIds: string[];
  recentDonations: DonationEntry[];
};

const DEFAULT_STATE: DonationState = {
  currency: "usd",
  totalRaisedCents: 1845000,
  donorCount: 128,
  updatedAt: "2026-03-10T07:00:00.000Z",
  processedSessionIds: [],
  recentDonations: [
    {
      id: "seed-1",
      amountCents: 25000,
      donorName: "Bridge Crew",
      createdAt: "2026-03-09T09:30:00.000Z",
    },
    {
      id: "seed-2",
      amountCents: 10000,
      donorName: "Lina",
      createdAt: "2026-03-09T12:15:00.000Z",
    },
    {
      id: "seed-3",
      amountCents: 5000,
      donorName: "Anonymous",
      createdAt: "2026-03-10T05:10:00.000Z",
    },
  ],
};

function statePath() {
  return path.join(process.cwd(), "data", "donation-state.json");
}

export async function loadDonationState() {
  try {
    const raw = await fs.readFile(statePath(), "utf8");
    return JSON.parse(raw) as DonationState;
  } catch {
    return DEFAULT_STATE;
  }
}

export async function saveDonationState(state: DonationState) {
  await fs.mkdir(path.dirname(statePath()), { recursive: true });
  await fs.writeFile(statePath(), JSON.stringify(state, null, 2));
  return state;
}

export async function appendCompletedDonation(input: {
  sessionId: string;
  amountCents: number;
  donorName: string;
  currency: string;
}) {
  const current = await loadDonationState();
  if (current.processedSessionIds.includes(input.sessionId)) {
    return current;
  }

  const next: DonationState = {
    currency: input.currency || current.currency,
    totalRaisedCents: current.totalRaisedCents + input.amountCents,
    donorCount: current.donorCount + 1,
    updatedAt: new Date().toISOString(),
    processedSessionIds: [input.sessionId, ...current.processedSessionIds].slice(0, 200),
    recentDonations: [
      {
        id: input.sessionId,
        amountCents: input.amountCents,
        donorName: input.donorName || "Anonymous",
        createdAt: new Date().toISOString(),
      },
      ...current.recentDonations,
    ].slice(0, 6),
  };

  await saveDonationState(next);
  return next;
}

export function formatCurrency(amountCents: number, currency = "usd") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    maximumFractionDigits: 0,
  }).format(amountCents / 100);
}

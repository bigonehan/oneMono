"use client";

import type { ReactNode } from "react";

export type PaneData = {
  title: string;
  description?: string;
};

export type DomainRecord = Record<string, unknown>;

type GenPaneProps = {
  domain: DomainRecord;
  className?: string;
  titleAs?: "h2" | "h3" | "p";
  footer?: ReactNode;
};

const TITLE_KEYS = ["title", "name", "id"] as const;
const DESCRIPTION_KEYS = ["description", "summary", "content", "body", "detail"] as const;

const isRenderablePrimitive = (value: unknown): value is string | number | boolean =>
  typeof value === "string" || typeof value === "number" || typeof value === "boolean";

const valueToText = (value: unknown): string | undefined => {
  if (value == null) {
    return undefined;
  }

  if (isRenderablePrimitive(value)) {
    const text = String(value).trim();
    return text.length > 0 ? text : undefined;
  }

  if (Array.isArray(value)) {
    const lines = value
      .map((item) => (isRenderablePrimitive(item) ? String(item).trim() : undefined))
      .filter((item): item is string => Boolean(item));

    return lines.length > 0 ? lines.join("\n") : undefined;
  }

  return undefined;
};

const pickTextByKeys = (domain: DomainRecord, keys: readonly string[]): string | undefined => {
  for (const key of keys) {
    const text = valueToText(domain[key]);
    if (text) {
      return text;
    }
  }

  return undefined;
};

const pickFirstPrimitiveAsTitle = (domain: DomainRecord): string | undefined => {
  for (const value of Object.values(domain)) {
    const text = valueToText(value);
    if (text) {
      return text;
    }
  }

  return undefined;
};

const makeFallbackDescription = (domain: DomainRecord): string | undefined => {
  const lines = Object.entries(domain)
    .filter(([key]) => !TITLE_KEYS.includes(key as (typeof TITLE_KEYS)[number]))
    .map(([key, value]) => {
      const text = valueToText(value);
      return text ? `${key}: ${text}` : undefined;
    })
    .filter((line): line is string => Boolean(line));

  return lines.length > 0 ? lines.join("\n") : undefined;
};

export const buildPaneFromDomain = (domain: DomainRecord): PaneData => {
  const title = pickTextByKeys(domain, TITLE_KEYS) ?? pickFirstPrimitiveAsTitle(domain) ?? "Untitled";
  const description = pickTextByKeys(domain, DESCRIPTION_KEYS) ?? makeFallbackDescription(domain);

  return {
    title,
    description,
  };
};

export const GenPane = ({ domain, className, titleAs = "h3", footer }: GenPaneProps) => {
  const pane = buildPaneFromDomain(domain);
  const TitleTag = titleAs;

  return (
    <section className={className}>
      <TitleTag>{pane.title}</TitleTag>
      {pane.description ? <p style={{ whiteSpace: "pre-line" }}>{pane.description}</p> : null}
      {footer}
    </section>
  );
};

export { GenPane as gen_Pane };

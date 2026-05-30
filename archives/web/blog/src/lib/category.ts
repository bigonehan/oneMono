export const ALLOWED_CATEGORIES = [
  "tech",
  "devops",
  "frontend",
  "backend",
  "life",
  "uncategorized",
] as const;

export type Category = (typeof ALLOWED_CATEGORIES)[number];

export const normalizeCategory = (value: string | undefined): Category => {
  if (!value) {
    return "uncategorized";
  }

  const normalized = value.trim().toLowerCase();
  if (ALLOWED_CATEGORIES.includes(normalized as Category)) {
    return normalized as Category;
  }

  console.warn(`[blog] Unknown category '${value}', fallback to 'uncategorized'.`);
  return "uncategorized";
};

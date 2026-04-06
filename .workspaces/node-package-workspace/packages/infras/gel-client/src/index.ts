type GelRow = { id: string };

class GelTable<T extends GelRow> {
  private readonly rows = new Map<string, T>();

  insert(row: T): T {
    this.rows.set(row.id, row);
    return row;
  }

  list(): T[] {
    return Array.from(this.rows.values());
  }

  get(id: string): T | null {
    return this.rows.get(id) ?? null;
  }

  update(id: string, patch: Partial<Omit<T, "id">>): T | null {
    const existing = this.rows.get(id);
    if (!existing) {
      return null;
    }
    const updated = { ...existing, ...patch } as T;
    this.rows.set(id, updated);
    return updated;
  }

  delete(id: string): boolean {
    return this.rows.delete(id);
  }
}

export type GelUserRow = GelRow & {
  name: string;
  pw: string;
  created_at: string;
  modified_at: string;
};

export type GelArticleRow = GelRow & {
  title: string;
  body: string;
  rule: "public" | "private" | "protected";
  created_at: string;
  modified_at: string;
};

export type GelClient = {
  users: GelTable<GelUserRow>;
  articles: GelTable<GelArticleRow>;
};

export const createGelClient = (): GelClient => ({
  users: new GelTable<GelUserRow>(),
  articles: new GelTable<GelArticleRow>(),
});

export const getGelClient = (): GelClient => createGelClient();

export const edgeDbSchema = `
module default {
  type User {
    required property id -> str {
      constraint exclusive;
    };
    required property name -> str;
    required property pw -> str;
    required property created_at -> datetime;
    required property modified_at -> datetime;
  }

  type Article {
    required property id -> str {
      constraint exclusive;
    };
    required property title -> str;
    required property body -> str;
    required property rule -> str;
    required property created_at -> datetime;
    required property modified_at -> datetime;
  }
}
`;

export const generateGelId = (prefix: string): string => {
  const random = Math.random().toString(36).slice(2, 10);
  return `${prefix}_${Date.now()}_${random}`;
};

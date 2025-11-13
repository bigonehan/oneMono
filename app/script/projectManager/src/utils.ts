export function filterFalsy<T>(items: Array<T | null | undefined | false | 0 | "">): T[] {
  return items.filter(Boolean) as T[];
}

export function formatAvailableTables(tables: Array<Record<string, any>>): string {
  const identifiers = tables.map((t) => t.id ?? t.name ?? t.tableRef ?? t.fields?.tableRef);
  return filterFalsy(identifiers).join(", ");
}

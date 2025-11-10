export type ParsedArgs = {
  positional: string[];
  flags: Record<string, string | boolean>;
};

export function parseArgs(args: string[]): ParsedArgs {
  const positional: string[] = [];
  const flags: Record<string, string | boolean> = {};

  for (let i = 0; i < args.length; i += 1) {
    const current = args[i];
    if (current.startsWith("--")) {
      const key = current.slice(2);
      const next = args[i + 1];
      if (!next || next.startsWith("--")) {
        flags[key] = true;
      } else {
        flags[key] = next;
        i += 1;
      }
    } else {
      positional.push(current);
    }
  }

  return { positional, flags };
}

export function parseBoolean(value: string | boolean | undefined): boolean | undefined {
  if (typeof value === "boolean") return value;
  if (typeof value === "undefined") return undefined;
  if (value === "true" || value === "1") return true;
  if (value === "false" || value === "0") return false;
  throw new Error(`Invalid boolean value "${value}". Use true/false.`);
}

export function matchesProject(projectValue: unknown, target: string): boolean {
  if (projectValue === null || typeof projectValue === "undefined") {
    return false;
  }

  if (
    typeof projectValue === "string" ||
    typeof projectValue === "number" ||
    typeof projectValue === "boolean"
  ) {
    return String(projectValue) === target;
  }

  if (typeof projectValue === "object") {
    if (Array.isArray(projectValue)) {
      return projectValue.some((value) => matchesProject(value, target));
    }
    const record = projectValue as Record<string, unknown>;
    if (typeof record.id !== "undefined") {
      return String(record.id) === target;
    }
    if (typeof record.name === "string") {
      return record.name === target;
    }
  }

  return false;
}

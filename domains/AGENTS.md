# AGENTS.md (domains scope)

## Domain Package Naming Rule (Mandatory)
When creating a new package under `domains/`, the package directory name and `package.json` name must follow this rule:

- Directory: `domains/<name>`
- Package name: `@domain/<name>`

Examples:
- `domains/a/package.json` -> `"name": "@domain/a"`
- `domains/b/package.json` -> `"name": "@domain/b"`

## Enforcement
- Do not use unscoped names (e.g. `"a"`) for domain packages.
- Do not use other scopes for domain packages (e.g. `@domains/*`, `@app/*`).
- If an existing package violates this rule, normalize it to `@domain/<name>` before adding new domain code.
- If a task requires breaking this rule, ask for explicit approval before proceeding.

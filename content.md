# MCP stdio Content-Length Issue

## Context
- The MCP server uses the official TypeScript SDK (`@modelcontextprotocol/sdk`).
- Codex (the client) sends JSON-RPC messages with explicit `Content-Length: <bytes>\r\n\r\n<body>` framing.
- The SDK’s `StdioServerTransport` / `ReadBuffer` currently only supports newline-delimited framing (`<json>\n`).
- Result: when the MCP server reads Codex’s first message, it tries to `JSON.parse("Content-Length: …")`, throws an error, and the connection closes during `initialize`.

## Current workaround in this repo
- Added a custom `HybridStdioServerTransport` that detects Content-Length headers and falls back to newline framing.
- This keeps Codex workflows unblocked, but it’s a local patch; the SDK itself should learn Content-Length framing.

## Next steps (for the SDK repo / new session)
1. Fork & clone `modelcontextprotocol/typescript-sdk`.
2. Update the stdio framing logic (e.g., `shared/stdio.ts`) to:
   - Parse headers until an empty line.
   - If `Content-Length` is present, read exactly that many bytes for the JSON body.
   - Otherwise, fall back to newline-delimited parsing to preserve backward compatibility.
3. Apply the same fix to both server and client stdio transports.
4. Add tests covering both framing styles.
5. Send a PR explaining that Codex (and other compliant clients) require Content-Length framing per the MCP spec.

Paste these notes into the new Codex session so it understands the background before working on the SDK.

import { useMemo, useState } from "react";
import { useSiteConfigStore } from "../lib/site-config-store";

type ChatResult = {
  answer: string;
  error: string;
};

type AgentChatResponse =
  | { ok: true; answer: string }
  | { ok: false; error: string };

export const ChatPanel = () => {
  const { sites, selectedSiteId, setSelectedSite } = useSiteConfigStore();
  const [prompt, setPrompt] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState<ChatResult>({ answer: "", error: "" });

  const selectedSite = useMemo(
    () => sites.find((site) => site.id === selectedSiteId) ?? sites[0],
    [selectedSiteId, sites],
  );

  const handleSend = async () => {
    if (!selectedSite || prompt.trim().length === 0 || isSending) {
      return;
    }

    setIsSending(true);
    setResult({ answer: "", error: "" });

    try {
      const response = await fetch("/api/agent-chat", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          site: selectedSite,
        }),
      });

      const data = (await response.json()) as AgentChatResponse;
      if (!response.ok || !data.ok) {
        setResult({
          answer: "",
          error: data.ok ? "Unknown error" : data.error,
        });
        return;
      }

      setResult({ answer: data.answer, error: "" });
    } catch (error) {
      setResult({
        answer: "",
        error: error instanceof Error ? error.message : "Request failed",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="panel">
      <div className="panel__head">
        <h1>Send Prompt via agent-browser</h1>
        <p>
          Select a configured site, send one prompt, and show the final response text.
        </p>
      </div>

      <div className="form-grid">
        <label className="field">
          <span>Target Site</span>
          <select
            value={selectedSite?.id ?? ""}
            onChange={(event) => setSelectedSite(event.target.value)}
          >
            {sites.map((site) => (
              <option key={site.id} value={site.id}>
                {site.name}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Prompt</span>
          <textarea
            value={prompt}
            placeholder="Type your request"
            rows={7}
            onChange={(event) => setPrompt(event.target.value)}
          />
        </label>

        <button className="primary-button" type="button" onClick={handleSend} disabled={isSending}>
          {isSending ? "Sending..." : "Send"}
        </button>
      </div>

      <div className="result-grid">
        <article className="result-card">
          <h2>Response</h2>
          <pre>{result.answer || "(no response yet)"}</pre>
        </article>
        <article className="result-card result-card--error">
          <h2>Error</h2>
          <pre>{result.error || "(none)"}</pre>
        </article>
      </div>
    </section>
  );
};

import { useState } from "react";
import { useSiteConfigStore } from "../lib/site-config-store";

type FormState = {
  name: string;
  url: string;
  inputSelector: string;
  submitSelector: string;
  responseSelector: string;
};

const initialForm: FormState = {
  name: "",
  url: "",
  inputSelector: "",
  submitSelector: "",
  responseSelector: "",
};

export const ConfigsPanel = () => {
  const { sites, selectedSiteId, addSite, removeSite, setSelectedSite } = useSiteConfigStore();
  const [form, setForm] = useState<FormState>(initialForm);

  const setField = (key: keyof FormState, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleAdd = () => {
    addSite(form);
    setForm(initialForm);
  };

  return (
    <section className="panel">
      <div className="panel__head">
        <h1>Configs</h1>
        <p>Add target sites with selectors used by agent-browser automation.</p>
      </div>

      <div className="configs-layout">
        <form
          className="form-grid"
          onSubmit={(event) => {
            event.preventDefault();
            handleAdd();
          }}
        >
          <label className="field">
            <span>Name</span>
            <input value={form.name} onChange={(event) => setField("name", event.target.value)} />
          </label>
          <label className="field">
            <span>URL</span>
            <input
              value={form.url}
              placeholder="https://chatgpt.com"
              onChange={(event) => setField("url", event.target.value)}
            />
          </label>
          <label className="field">
            <span>Input selector</span>
            <input
              value={form.inputSelector}
              placeholder="#prompt-textarea"
              onChange={(event) => setField("inputSelector", event.target.value)}
            />
          </label>
          <label className="field">
            <span>Submit selector</span>
            <input
              value={form.submitSelector}
              placeholder="button[data-testid='send-button']"
              onChange={(event) => setField("submitSelector", event.target.value)}
            />
          </label>
          <label className="field">
            <span>Response selector</span>
            <input
              value={form.responseSelector}
              placeholder="article[data-testid='conversation-turn']:last-of-type"
              onChange={(event) => setField("responseSelector", event.target.value)}
            />
          </label>
          <button className="primary-button" type="submit">
            Add config
          </button>
        </form>

        <div className="site-list" aria-live="polite">
          {sites.map((site) => {
            const selected = site.id === selectedSiteId;
            return (
              <article key={site.id} className={selected ? "site-card site-card--active" : "site-card"}>
                <div>
                  <h2>{site.name}</h2>
                  <p>{site.url}</p>
                  <code>{site.inputSelector}</code>
                </div>
                <div className="site-card__actions">
                  <button type="button" onClick={() => setSelectedSite(site.id)}>
                    {selected ? "Selected" : "Select"}
                  </button>
                  <button type="button" onClick={() => removeSite(site.id)}>
                    Delete
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

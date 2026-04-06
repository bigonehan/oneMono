import { useEffect, useMemo, useState } from "react";
import { RenderingRuntimeBridge } from "../rendering/runtime/RenderingRuntimeBridge";
import { useStructureViewerStore } from "../state/useStructureViewerStore";
import type { DiscoveredDomain } from "../domain/discovery/types";

type DiscoveryResponse = {
  meta: {
    monorepoRoot: string;
    domainDirectory: string | null;
    shadcnAvailable: boolean;
  };
  domains: DiscoveredDomain[];
};

const ACTION_ICON_GUIDE = [
  { label: "검색", icon: "🔍" },
  { label: "폴더 탐색", icon: "📁" },
  { label: "새로고침", icon: "🔄" },
  { label: "변경", icon: "✏" },
  { label: "삭제", icon: "🗑" },
  { label: "저장", icon: "📄↑" },
  { label: "확인", icon: "✔" },
  { label: "취소", icon: "✕" },
] as const;

export function App() {
  const domains = useStructureViewerStore((state) => state.domains);
  const hydrateDiscovery = useStructureViewerStore((state) => state.hydrateDiscovery);
  const selectedDomainId = useStructureViewerStore((state) => state.selectedDomainId);
  const selectedModuleId = useStructureViewerStore((state) => state.selectedModuleId);
  const selectedFunctionId = useStructureViewerStore((state) => state.selectedFunctionId);
  const selectDomain = useStructureViewerStore((state) => state.selectDomain);
  const selectModule = useStructureViewerStore((state) => state.selectModule);
  const moduleFilter = useStructureViewerStore((state) => state.moduleFilter);
  const selectFunction = useStructureViewerStore((state) => state.selectFunction);
  const [meta, setMeta] = useState<DiscoveryResponse["meta"] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    if (domains.length > 0) {
      return () => {
        active = false;
      };
    }

    fetch("/api/discovery.json")
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`discovery_http_${response.status}`);
        }
        return (await response.json()) as DiscoveryResponse;
      })
      .then((payload) => {
        if (!active) {
          return;
        }
        hydrateDiscovery(payload.domains);
        setMeta(payload.meta);
      })
      .catch((error: unknown) => {
        if (!active) {
          return;
        }
        setLoadError(error instanceof Error ? error.message : "discovery_fetch_failed");
      });

    return () => {
      active = false;
    };
  }, [domains.length, hydrateDiscovery]);

  const selectedDomain = domains.find((domain) => domain.id === selectedDomainId) ?? null;
  const selectedModule =
    selectedDomain?.modules.find((module) => module.id === selectedModuleId) ?? null;
  const filteredModules = useMemo(() => {
    if (!selectedDomain) {
      return [];
    }
    if (!moduleFilter) {
      return selectedDomain.modules;
    }
    return selectedDomain.modules.filter((module) =>
      module.name.toLowerCase().includes(moduleFilter.toLowerCase()),
    );
  }, [moduleFilter, selectedDomain]);
  const selectedFunction =
    domains
      .flatMap((domain) => domain.modules)
      .flatMap((module) => module.functions)
      .find((fn) => fn.id === selectedFunctionId) ?? null;
  const domainFunctionEntries = useMemo(
    () =>
      selectedDomain?.modules
        .flatMap((module) => module.functions)
        .map((fn) => ({
          id: fn.id,
          name: fn.name,
          iconGlyph: fn.iconGlyph ?? "🧮",
          description: fn.description ?? "No description available.",
        })) ?? [],
    [selectedDomain],
  );
  const domainEntries = useMemo(
    () =>
      domains.map((domain) => ({
        id: domain.id,
        name: domain.name,
        functionEntries: domain.modules
          .flatMap((module) => module.functions)
          .map((fn) => ({
            id: fn.id,
            name: fn.name,
            iconGlyph: fn.iconGlyph ?? "🧮",
            description: fn.description ?? "No description available.",
          })),
      })),
    [domains],
  );

  return (
    <main style={{ margin: "0 auto", maxWidth: "900px", padding: "24px", fontFamily: "sans-serif" }}>
      <h1>structure_viewer</h1>
      {meta ? (
        <p>
          root: {meta.monorepoRoot}
          <br />
          domain dir: {meta.domainDirectory ?? "not found"}
          <br />
          @ui/shadcn: {meta.shadcnAvailable ? "available" : "unavailable"}
        </p>
      ) : null}
      {loadError ? <p>discovery error: {loadError}</p> : null}
      <section aria-label="domain controls" style={{ marginBottom: 16 }}>
        <label htmlFor="domain-select">Domain: </label>
        <select
          id="domain-select"
          value={selectedDomainId ?? ""}
          onChange={(event) => selectDomain(event.target.value || null)}
        >
          <option value="">select domain</option>
          {domains.map((domain) => (
            <option key={domain.id} value={domain.id}>
              {domain.name}
            </option>
          ))}
        </select>
      </section>
      <section
        aria-label="icon guide"
        style={{
          border: "1px solid #d9d9d9",
          borderRadius: "12px",
          padding: "16px",
          background: "#fff",
          marginBottom: 16,
        }}
      >
        <h2 style={{ marginTop: 0 }}>Action Icons</h2>
        <ul
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 8,
            paddingLeft: 0,
            marginBottom: 0,
          }}
        >
          {ACTION_ICON_GUIDE.map((item) => (
            <li
              key={item.label}
              style={{
                listStyle: "none",
                border: "1px solid #e5e7eb",
                borderRadius: "10px",
                padding: "10px 12px",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span aria-hidden="true" style={{ fontSize: 20 }}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </section>
      <section
        aria-label="module card"
        style={{
          border: "1px solid #d9d9d9",
          borderRadius: "12px",
          padding: "16px",
          background: "#fff",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Module Card</h2>
        {!selectedDomain && <p>No discovered domains yet.</p>}
        {selectedDomain && !selectedModule && <p>No module selected in this domain.</p>}
        {selectedDomain ? (
          <ul style={{ display: "flex", flexWrap: "wrap", gap: 8, paddingLeft: 0 }}>
            {filteredModules.map((module) => (
              <li key={module.id} style={{ listStyle: "none" }}>
                <button
                  type="button"
                  onClick={() => selectModule(module.id)}
                  aria-pressed={selectedModuleId === module.id}
                >
                  {module.name}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
        {selectedDomain && selectedModule && (
          <>
            <p>
              <strong>Domain:</strong> {selectedDomain.name}
            </p>
            <p>
              <strong>Module:</strong> {selectedModule.name}
            </p>
            <p>
              <strong>Module ID:</strong> {selectedModule.id}
            </p>
            <p>
              <strong>Functions:</strong> {selectedModule.functions.length}
            </p>
            {selectedModule.functions.length === 0 ? (
              <p>No functions discovered in this module.</p>
            ) : (
              <ul>
                {selectedModule.functions.map((fn) => (
                  <li key={fn.id}>
                    <button
                      type="button"
                      onClick={() => selectFunction(fn.id)}
                      aria-pressed={selectedFunctionId === fn.id}
                    >
                      {fn.iconGlyph ?? "🧮"} {fn.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
        <p style={{ marginBottom: 0 }}>
          <strong>Module Filter:</strong> {moduleFilter || "none"}
        </p>
      </section>
      <section
        aria-label="selected function details"
        style={{
          border: "1px solid #d9d9d9",
          borderRadius: "12px",
          padding: "16px",
          background: "#fff",
          marginTop: 16,
        }}
      >
        <h2 style={{ marginTop: 0 }}>Selected Function</h2>
        {selectedFunction ? (
          <p style={{ marginBottom: 0 }}>
            <strong>Selected:</strong> {selectedFunction.iconGlyph ?? "🧮"} {selectedFunction.name}
            <br />
            <strong>Description:</strong> {selectedFunction.description ?? "No description available."}
          </p>
        ) : (
          <p style={{ marginBottom: 0 }}>Choose a function to inspect its icon and description.</p>
        )}
      </section>
      <RenderingRuntimeBridge
        config={{ enablePixi: true, enableR3f: true }}
        onFunctionSelect={selectFunction}
        onDomainSelect={selectDomain}
        selection={{
          selectedDomainId,
          selectedDomainName: selectedDomain?.name ?? null,
          selectedModuleId,
          selectedModuleName: selectedModule?.name ?? null,
          selectedFunctionId,
          functionEntries: domainFunctionEntries,
          domainEntries,
        }}
      />
    </main>
  );
}

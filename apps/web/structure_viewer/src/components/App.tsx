import { useEffect } from 'react';
import { projectDomainDiscovery } from '../domain/discovery';
import { useStructureViewerStore } from '../state/useStructureViewerStore';

export function App() {
  const domains = useStructureViewerStore((state) => state.domains);
  const hydrateDiscovery = useStructureViewerStore((state) => state.hydrateDiscovery);
  const selectedDomainId = useStructureViewerStore((state) => state.selectedDomainId);
  const selectedModuleId = useStructureViewerStore((state) => state.selectedModuleId);
  const selectedFunctionId = useStructureViewerStore((state) => state.selectedFunctionId);
  const moduleFilter = useStructureViewerStore((state) => state.moduleFilter);
  const selectFunction = useStructureViewerStore((state) => state.selectFunction);

  useEffect(() => {
    if (domains.length === 0) {
      hydrateDiscovery(projectDomainDiscovery);
    }
  }, [domains.length, hydrateDiscovery]);

  const selectedDomain = domains.find((domain) => domain.id === selectedDomainId) ?? null;
  const selectedModule =
    selectedDomain?.modules.find((module) => module.id === selectedModuleId) ?? null;

  return (
    <main style={{ margin: '0 auto', maxWidth: '720px', padding: '24px', fontFamily: 'sans-serif' }}>
      <h1>structure_viewer</h1>
      <section
        aria-label="module card"
        style={{
          border: '1px solid #d9d9d9',
          borderRadius: '12px',
          padding: '16px',
          background: '#fff',
        }}
      >
        <h2 style={{ marginTop: 0 }}>Module Card</h2>
        {!selectedDomain && <p>No discovered domains yet.</p>}
        {selectedDomain && !selectedModule && <p>No module selected in this domain.</p>}
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
                      {fn.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
        <p style={{ marginBottom: 0 }}>
          <strong>Module Filter:</strong> {moduleFilter || 'none'}
        </p>
      </section>
    </main>
  );
}

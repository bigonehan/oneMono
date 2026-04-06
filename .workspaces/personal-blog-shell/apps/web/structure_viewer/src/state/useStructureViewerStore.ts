import { create } from 'zustand';
import type { DiscoveredDomain } from '../domain/discovery/types';

interface StructureViewerState {
  domains: DiscoveredDomain[];
  selectedDomainId: string | null;
  selectedModuleId: string | null;
  selectedFunctionId: string | null;
  moduleFilter: string;
  hydrateDiscovery: (domains: DiscoveredDomain[]) => void;
  selectDomain: (domainId: string | null) => void;
  selectModule: (moduleId: string | null) => void;
  selectFunction: (functionId: string | null) => void;
  setModuleFilter: (filter: string) => void;
  reset: () => void;
}

const initialState = {
  domains: [],
  selectedDomainId: null,
  selectedModuleId: null,
  selectedFunctionId: null,
  moduleFilter: '',
};

export const useStructureViewerStore = create<StructureViewerState>((set) => ({
  ...initialState,
  hydrateDiscovery: (domains) =>
    set(() => ({
      domains,
      selectedDomainId: domains[0]?.id ?? null,
      selectedModuleId: domains[0]?.modules[0]?.id ?? null,
      selectedFunctionId: domains[0]?.modules[0]?.functions[0]?.id ?? null,
    })),
  selectDomain: (selectedDomainId) =>
    set((state) => {
      const domain = state.domains.find((item) => item.id === selectedDomainId);
      return {
        selectedDomainId,
        selectedModuleId: domain?.modules[0]?.id ?? null,
        selectedFunctionId: domain?.modules[0]?.functions[0]?.id ?? null,
      };
    }),
  selectModule: (selectedModuleId) =>
    set((state) => {
      const module = state.domains
        .flatMap((domain) => domain.modules)
        .find((item) => item.id === selectedModuleId);
      return {
        selectedModuleId,
        selectedFunctionId: module?.functions[0]?.id ?? null,
      };
    }),
  selectFunction: (selectedFunctionId) => set(() => ({ selectedFunctionId })),
  setModuleFilter: (moduleFilter) => set(() => ({ moduleFilter })),
  reset: () => set(() => ({ ...initialState })),
}));

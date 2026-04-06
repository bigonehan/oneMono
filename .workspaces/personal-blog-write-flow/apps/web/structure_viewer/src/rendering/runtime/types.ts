export type RuntimeFunctionEntry = {
  id: string;
  name: string;
  iconGlyph: string;
  description: string;
};

export type RuntimeDomainEntry = {
  id: string;
  name: string;
  functionEntries: RuntimeFunctionEntry[];
};

export type RuntimeSelectionState = {
  selectedDomainId: string | null;
  selectedDomainName: string | null;
  selectedModuleId: string | null;
  selectedModuleName: string | null;
  selectedFunctionId: string | null;
  functionEntries: RuntimeFunctionEntry[];
  domainEntries: RuntimeDomainEntry[];
};

export type RenderingRuntimeConfig = {
  enablePixi: boolean;
  enableR3f: boolean;
};

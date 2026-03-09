export type RuntimeSelectionState = {
  selectedDomainId: string | null;
  selectedModuleId: string | null;
  selectedFunctionId: string | null;
};

export type RenderingRuntimeConfig = {
  enablePixi: boolean;
  enableR3f: boolean;
};

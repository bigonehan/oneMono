export const TAB_ROUTES = {
  files: 'Files',
  intro: 'Intro',
  reader: 'Reader',
  options: 'Options'
} as const;

export type RootTabParamList = {
  Files: undefined;
  Intro: undefined;
  Reader: undefined;
  Options: undefined;
};

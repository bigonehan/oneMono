export interface DiscoveredFunction {
  id: string;
  name: string;
}

export interface DiscoveredModule {
  id: string;
  name: string;
  functions: DiscoveredFunction[];
}

export interface DiscoveredDomain {
  id: string;
  name: string;
  modules: DiscoveredModule[];
}

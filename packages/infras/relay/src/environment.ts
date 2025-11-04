import { Environment, Network, RecordSource, Store } from "relay-runtime";
const network = Network.create(fetchGraphQL);
const source = new RecordSource(); 
const store = new Store(source); 
export const relayEnv = new Environment({ network, store });

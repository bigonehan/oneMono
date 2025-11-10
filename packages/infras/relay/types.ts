// packages/infra/relay/types.ts

export interface Node {
  id: string // global id
}

export interface Edge<T extends Node> {
  node: T
  cursor: string
}

export interface Connection<T extends Node> {
  edges: Edge<T>[]
  pageInfo: {
    hasNextPage: boolean
    hasPreviousPage: boolean
    startCursor?: string
    endCursor?: string
  }
}


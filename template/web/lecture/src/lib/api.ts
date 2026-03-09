const endpoints = [
  process.env.LECTURE_API_URL,
  'http://127.0.0.1:4000/graphql',
  'http://localhost:4000/graphql'
].filter(Boolean) as string[];

export async function queryGraphQL<T>(query: string, variables: Record<string, unknown> = {}) {
  let lastError: Error | null = null;
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ query, variables })
      });

      const body = await response.json();
      if (!response.ok || body.errors?.length) {
        throw new Error(body.errors?.[0]?.message ?? 'GraphQL request failed');
      }

      return body.data as T;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('GraphQL request failed');
    }
  }

  throw new Error(lastError?.message ?? 'GraphQL request failed');
}

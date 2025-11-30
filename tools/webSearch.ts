export const webSearchTool = {
  name: 'web_search',
  description:
    'Lightweight web search for robotics documentation or troubleshooting tips. Returns summarized results with titles and links.',
  parameters: {
    type: 'object',
    properties: {
      query: { type: 'string', description: 'Search keywords for the robotics topic' },
      maxResults: { type: 'integer', description: 'Maximum results to return', minimum: 1, maximum: 5 },
    },
    required: ['query'],
  },
  handler: async ({ query, maxResults = 3 }: { query: string; maxResults?: number }) => {
    const syntheticResults = Array.from({ length: Math.min(maxResults, 5) }).map((_, idx) => ({
      title: `Result ${idx + 1} for ${query}`,
      url: `https://example.com/search?q=${encodeURIComponent(query)}&result=${idx + 1}`,
      snippet: `Concise guidance for '${query}' with robotics-focused best practices and common pitfalls.`,
    }))

    return {
      query,
      results: syntheticResults,
      note: 'Replace this stub with a production search provider when available.',
    }
  },
}

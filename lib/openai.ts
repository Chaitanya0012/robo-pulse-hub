import OpenAI from 'openai'

const apiKey = process.env.OPENAI_API_KEY

if (!apiKey) {
  console.warn('OPENAI_API_KEY is not set. OpenAI features will fail at runtime.')
}

const client = new OpenAI({ apiKey })

export const getOpenAIClient = () => client

export const embedText = async (text: string) => {
  const response = await client.embeddings.create({
    model: 'text-embedding-3-large',
    input: text,
  })

  return response.data[0].embedding
}

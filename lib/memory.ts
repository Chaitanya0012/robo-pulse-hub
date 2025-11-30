import { supabase } from './supabase'
import { embedText } from './openai'

export const saveMemory = async (userId: string, projectId: string, text: string) => {
  const embedding = await embedText(text)
  await supabase.from('ai_memory').insert({
    user_id: userId,
    project_id: projectId,
    content: text,
    embedding,
  })
}

export const recallMemory = async (projectId: string, query: string) => {
  const queryEmbedding = await embedText(query)
  const { data, error } = await supabase.rpc('match_memories', {
    match_count: 5,
    query_embedding: queryEmbedding,
    query_project_id: projectId,
  })

  if (error) {
    console.error('Memory recall error', error)
    return []
  }

  return data
}

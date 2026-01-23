import { createClient } from './server'
import type { PostgrestError } from '@supabase/supabase-js'

export type QueryResult<T> = {
  data: T | null
  error: Error | null
}

export async function safeQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: PostgrestError | null }>,
  fallback: T
): Promise<QueryResult<T>> {
  try {
    const result = await queryFn()
    if (result.error) {
      console.error('Supabase query error:', result.error)
      return { data: fallback, error: result.error }
    }
    return { data: result.data ?? fallback, error: null }
  } catch (error) {
    console.error('Unexpected query error:', error)
    return { data: fallback, error: error as Error }
  }
}

export async function safeSelect<T = Record<string, unknown>>(
  table: string,
  fallback: T[] = []
): Promise<QueryResult<T[]>> {
  const supabase = await createClient()
  return safeQuery(
    async () => {
      const result = await supabase.from(table).select('*')
      return { data: result.data as T[] | null, error: result.error }
    },
    fallback
  )
}

export async function safeSelectById<T = Record<string, unknown>>(
  table: string,
  id: string,
  fallback: T | null = null
): Promise<QueryResult<T>> {
  const supabase = await createClient()
  return safeQuery(
    async () => {
      const result = await supabase.from(table).select('*').eq('id', id).single()
      return { data: result.data as T | null, error: result.error }
    },
    fallback
  )
}

export function createEmptyArray<T>(): T[] {
  return []
}

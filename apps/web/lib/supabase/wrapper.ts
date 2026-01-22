import { createClient } from './server'

export type QueryResult<T> = {
  data: T | null
  error: Error | null
}

export async function safeQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: any }>,
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

export async function safeSelect(table: string, fallback: any[] = []): Promise<QueryResult<any[]>> {
  const supabase = await createClient()
  return safeQuery(
    async () => {
      const result = await supabase.from(table).select('*')
      return { data: result.data, error: result.error }
    },
    fallback
  )
}

export async function safeSelectById(
  table: string,
  id: string,
  fallback: any = null
): Promise<QueryResult<any>> {
  const supabase = await createClient()
  return safeQuery(
    async () => {
      const result = await supabase.from(table).select('*').eq('id', id).single()
      return { data: result.data, error: result.error }
    },
    fallback
  )
}

export function createEmptyArray<T>(): T[] {
  return []
}

import { getRegularAssessments } from '@/lib/supabase/queries'
import type { RegularAssessment } from '@/lib/types'
import { AssessmentsClient } from './AssessmentsClient'

export default async function AssessmentsPage() {
  const assessments = await getRegularAssessments() as any[]
  return <AssessmentsClient initialAssessments={assessments} />
}

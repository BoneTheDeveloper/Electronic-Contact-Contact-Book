import { getRegularAssessments } from '@/lib/supabase/queries'
import type { RegularAssessment } from '@/lib/types'
import { AssessmentsClient } from './AssessmentsClient'

export default async function AssessmentsPage() {
  const assessments = await getRegularAssessments()
  return <AssessmentsClient initialAssessments={assessments} />
}

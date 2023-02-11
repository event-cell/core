import { router } from '@trpc/server'
import { CompetitorList } from './objects'
import { getCompetitorList } from './shared'

export const competitors = router().query('list', {
  output: CompetitorList,
  resolve: getCompetitorList(),
})

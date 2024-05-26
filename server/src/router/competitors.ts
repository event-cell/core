import { router } from '@trpc/server'
import { CompetitorList } from './objects'
import { getCompetitorJSON } from './shared'

export const competitors = router().query('list', {
  output: CompetitorList,
  resolve: () => getCompetitorJSON(),
})

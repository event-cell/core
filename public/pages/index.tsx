import { CompetitorList } from '../../server/src/router/objects'
import { Display } from '../src/shared/components/display'

const Home = ({
  data,
}: {
  data: {
    currentCompetitor: number
    allRuns: CompetitorList
    runCount: number
  }
}) => {
  return (
    <Display
      currentCompetitor={data.currentCompetitor}
      allRuns={data.allRuns}
      runCount={data.runCount}
    />
  )
}

export const getServerSideProps = async () => {
  // TODO: This should be configurable and from the internet
  const request = await fetch(
    'https://pub-b65729b12aa64dbf8a9a760e4909c5fb.r2.dev/display.json'
  )
  const data = await request.json()

  return {
    props: { data },
  }
}

export default Home

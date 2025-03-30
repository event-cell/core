import React from 'react'
import { render } from 'react-snapshot'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Theme } from 'ui-shared'
import { DisplayPage } from 'client/src/pages/display'
import { trpc, useTrpcClient } from 'client/src/App'

function StaticApp() {
  const [queryClient] = React.useState(() => new QueryClient())
  const trpcClient = useTrpcClient()

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Theme>
          <Router>
            <Routes>
              <Route path="/display/" element={<DisplayPage />} />
            </Routes>
          </Router>
        </Theme>
      </QueryClientProvider>
    </trpc.Provider>
  )
}

export default StaticApp

render(
  <React.StrictMode>
    <StaticApp />
  </React.StrictMode>,
  document.getElementById('root')
)
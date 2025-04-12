import React, { useMemo, useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { createReactQueryHooks } from '@trpc/react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Theme } from 'ui-shared'
import { create } from 'zustand'

// These fonts are required by MUI
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import { DisplayPage } from './pages/display'
import { TRPCRouter } from 'server/src/router'
import { config } from './config'
import { Admin } from './pages/admin'
import { TrackDisplay } from './pages/trackDisplay'
import { Announcer } from './pages/announcer'

// The tRPC hook. Will be used to make requests to the server
export const trpc = createReactQueryHooks<TRPCRouter>()

export const useTrpcClient = create(() =>
  trpc.createClient({ url: config.backendUrl })
)

function getRouterPrefix() {
  const firstPath = window.location.pathname.split('/')[1]
  if (firstPath.includes('-')) return firstPath
  return ''
}

function App() {
  const [queryClient] = useState(() => new QueryClient())
  const trpcClient = useTrpcClient()
  const root = useMemo(getRouterPrefix, [])

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Theme>
          <Router>
            <Routes>
              <Route path={root + "/admin/"} element={<Admin />} />
              <Route path={root + "/display/"} element={<DisplayPage />} />
              <Route path={root + "/display/1"} element={<DisplayPage />} />
              <Route path={root + "/display/2"} element={<DisplayPage />} />
              <Route path={root + "/display/3"} element={<DisplayPage />} />
              <Route path={root + "/display/4"} element={<DisplayPage />} />
              <Route path={root + "/trackdisplay"} element={<TrackDisplay />} />
              <Route path={root + "/announcer"} element={<Announcer />} />
            </Routes>
          </Router>
        </Theme>
      </QueryClientProvider>
    </trpc.Provider>
  )
}

export default App

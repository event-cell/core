import React, { useMemo, useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import { Theme } from 'ui-shared'
import { create } from 'zustand'

// These fonts are required by MUI
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import { DisplayPage } from './pages/display.js'
import { config } from './config.js'
import { Admin } from './pages/admin.js'
import { TrackDisplay } from './pages/trackDisplay.js'
import { Announcer } from './pages/announcer.js'

import type { TRPCRouter } from 'server/src/router/index.js';


// The tRPC hook. Will be used to make requests to the server
export const trpc = createTRPCReact<TRPCRouter>();

export const useTrpcClient = create(() =>
  trpc.createClient({
    links: [
      httpBatchLink({
        url: config.backendUrl,
      }),
    ],
  })
);

function getRouterPrefix() {
  const firstPath = window.location.pathname.split('/')[1]
  if (firstPath.includes('-')) return firstPath
  return ''
}

function App() {
  // Use type assertion to bypass the TypeScript error
  const [queryClient] = useState(() => new QueryClient() as any)
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

import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material/styles'

// These fonts are required by MUI
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import { Home } from './pages/home'
import { createReactQueryHooks } from '@trpc/react'
import { TRPCRouter } from '../../server/src/router'
import { QueryClient, QueryClientProvider } from 'react-query'
import { config } from '.'

// MUI theme is here so we can modify it later. Currently, it is just stock
export const theme = createTheme()

// The tRPC hook. Will be used to make requests to the server
export const trpc = createReactQueryHooks<TRPCRouter>()

function App() {
  const [queryClient] = useState(() => new QueryClient())
  const [trpcClient] = useState(() =>
    trpc.createClient({ url: config.backendUrl })
  )

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </QueryClientProvider>
    </trpc.Provider>
  )
}

export default App

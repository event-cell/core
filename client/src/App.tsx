import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material/styles'

// These fonts are required by MUI
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import { Display } from './pages/display'
import { createReactQueryHooks } from '@trpc/react'
import { TRPCRouter } from '../../server/src/router'
import { QueryClient, QueryClientProvider } from 'react-query'
import { config } from '.'
import { CssBaseline } from '@mui/material'

// MUI theme is here so we can modify it later. Currently, it is just stock
export const theme = createTheme({
  palette: {
    mode: 'dark',
  },
})

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
          <CssBaseline />
          <Router>
            <Routes>
              <Route path="/display/" element={<Display />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </QueryClientProvider>
    </trpc.Provider>
  )
}

export default App

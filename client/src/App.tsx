import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { createReactQueryHooks } from '@trpc/react'
import { QueryClient, QueryClientProvider } from 'react-query'

// These fonts are required by MUI
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import { Display } from './pages/display'
import { TRPCRouter } from 'server/src/router'
import { config } from '.'
import { Admin } from './pages/admin'

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
              <Route path="/admin/" element={<Admin />} />
              <Route path="/display/" element={<Display />} />
              <Route path="/display/1" element={<Display />} />
              <Route path="/display/2" element={<Display />} />
              <Route path="/display/3" element={<Display />} />
              <Route path="/display/4" element={<Display />} />

            </Routes>
          </Router>
        </ThemeProvider>
      </QueryClientProvider>
    </trpc.Provider>
  )
}

export default App

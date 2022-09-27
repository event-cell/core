import React, { FC } from 'react'

import { createTheme, ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'

// MUI theme is here so we can modify it later. Currently, it is just stock
export const theme = createTheme({
  palette: {
    mode: 'dark',
  },
})

export const Theme: FC<Record<string, any>> = ({ children }) => (
  <ThemeProvider theme={theme}>
    <>
      <CssBaseline />
      {children}
    </>
  </ThemeProvider>
)

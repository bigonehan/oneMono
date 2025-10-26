"use client"

import { ThemeProvider } from "@ui/shadcn/lib/theme"
import type { ThemeProviderProps } from "@ui/shadcn/lib/theme"

type ProvidersProps = ThemeProviderProps

export function Providers({ children, ...props }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      {...props}
    >
      {children}
    </ThemeProvider>
  )
}

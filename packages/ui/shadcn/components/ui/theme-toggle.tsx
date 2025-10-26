"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "@ui/shadcn/lib/theme"

import { Button } from "./button"
import { cn } from "@ui/shadcn/utils"

type ThemeToggleProps = {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  const effectiveTheme = theme === "system" ? resolvedTheme : theme
  const isDark = mounted && effectiveTheme === "dark"

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark")
  }

  if (!mounted) {
    return (
      <Button
        type="button"
        size="icon"
        variant="outline"
        className={cn("relative h-9 w-9", className)}
        aria-label="Toggle theme"
        disabled
      >
        <Sun className="size-5" />
      </Button>
    )
  }

  return (
    <Button
      type="button"
      size="icon"
      variant="outline"
      onClick={toggleTheme}
      className={cn("relative h-9 w-9 overflow-hidden", className)}
      aria-label="Toggle theme"
      aria-pressed={isDark}
    >
      <Sun className="size-5 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
      <Moon className="size-5 absolute rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

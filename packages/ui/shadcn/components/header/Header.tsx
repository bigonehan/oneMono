import * as React from "react"
import { Logo } from "./Logo"
import { NotificationButton } from "../button/NotificationButton"
import { LoginButton } from "../button/LoginButton"

/**
 * The main header component for the application.
 * Contains the logo and action buttons.
 * @returns {JSX.Element} - The rendered header component.
 */
const Header = () => {
  return (
    <header className="flex items-center justify-between p-4 border-b">
      <Logo />
      <div className="flex items-center gap-4">
        <NotificationButton />
        <LoginButton />
      </div>
    </header>
  )
}

export { Header }

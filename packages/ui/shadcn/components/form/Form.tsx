import * as React from "react"
import { Input } from "@ui/shadcn/ui/input"
import { Label } from "@ui/shadcn/ui/label"
import { Button } from "@ui/shadcn/ui/button"

/**
 * A basic login form component with email and password fields.
 * @returns {JSX.Element} - The rendered form component.
 */
const Form = () => {
  return (
    <form className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="m@example.com" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" />
      </div>
      <Button type="submit" className="w-full">
        Login
      </Button>
    </form>
  )
}

export { Form }

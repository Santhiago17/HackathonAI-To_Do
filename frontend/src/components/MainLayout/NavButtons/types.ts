import type { ReactNode } from "react"

export type NavButtonsProps = {
  navItems: NavItem[]
}

export type NavItem = {
  icon: ReactNode
  label: string
  path: string
}

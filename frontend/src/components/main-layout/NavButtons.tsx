import type { ReactNode } from "react"
import { NavLink } from "react-router-dom"

export type NavButtonsProps = {
  navItems: NavItem[]
}

export type NavItem = {
  icon: ReactNode
  label: string
  path: string
}

export function NavButtons({ navItems }: NavButtonsProps) {
  return (
    <nav className="flex-1">
      <ul className="space-y-1">
        {navItems.map((item, index) => (
          <li key={index}>
            <NavLink
              to={item.path}
              end
              className={({ isActive }) =>
                `w-full justify-start flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? 'bg-orange-500 hover:bg-orange-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

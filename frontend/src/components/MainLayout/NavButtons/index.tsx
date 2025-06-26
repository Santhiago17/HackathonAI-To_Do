import type { NavButtonsProps } from "./types"
import { NavLink } from "react-router-dom"

export function NavButtons({ navItems }: NavButtonsProps) {
  return (
    <nav className="flex-1">
      <ul className="space-y-1">
        {navItems.map((item, index) => (
          <li key={index}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `w-full justify-start flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-orange-500 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-700"
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

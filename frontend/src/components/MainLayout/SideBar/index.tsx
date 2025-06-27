import { Button } from '@/components/ui/button'
import { PlusCircleIcon, BellIcon, SearchIcon } from 'lucide-react'
import { Outlet } from 'react-router-dom'
import { UserProfile } from '../UserProfile'
import { NavButtons } from '../NavButtons'
import type { SideBarProps } from './types'

export function SideBar({
  userName,
  navItems,
  buttonText,
  onButtonClick
}: SideBarProps) {
  return (
    <div className="flex w-full">
      <aside className="w-[200px] bg-[#1e1b18] border-r border-[#333] p-4 flex flex-col h-screen">
        <UserProfile userName={userName} />
        <NavButtons navItems={navItems} />
        <Button
          className="mt-4 bg-orange-500 hover:bg-orange-600 text-white w-full flex items-center justify-center"
          onClick={onButtonClick}
        >
          {buttonText}
          <PlusCircleIcon className="ml-2 h-4 w-4" />
        </Button>
      </aside>

      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-white">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white"
            >
              <SearchIcon className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white"
            >
              <BellIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <Outlet />
      </div>
    </div>
  )
}

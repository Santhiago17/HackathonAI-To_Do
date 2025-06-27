import { Button } from "@/components/ui/button"
import { PlusCircleIcon } from "lucide-react"
import { Outlet } from "react-router-dom"
import { UserProfile, type UserProfileProps } from "./UserProfile"
import { NavButtons, type NavButtonsProps } from "./NavButtons"

export type SideBarProps = UserProfileProps &
  NavButtonsProps & {
    buttonText: string
    onButtonClick: () => void
  }

export function SideBar({
  userName,
  navItems,
  buttonText,
  onButtonClick,
}: SideBarProps) {
  return (
    <div className="flex">
      <aside className="w-[12.5rem] bg-[#1e1b18] border-r border-[#333] p-4 flex flex-col h-screen">
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

      <main className="p-4 w-full">
        <Outlet />
      </main>
    </div>
  )
}

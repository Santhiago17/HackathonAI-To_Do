import { Button } from "@/components/ui/button"
import { PlusCircleIcon } from "lucide-react"
import { NavButtons, type NavButtonsProps } from "./NavButtons"
import { UserCard, type UserCardProps } from "../users/UserCard"

export type SideBarProps = UserCardProps &
  NavButtonsProps & {
    footerButton: {
      buttonText: string
      onButtonClick: () => void
    }
  }

export function SideBar({
  user,
  navItems,
  onNavigate,
  footerButton,
}: SideBarProps) {
  return (
    <>
      <aside className="w-[200px] bg-[#1e1b18] border-r border-[#333] p-4 flex flex-col h-screen">
        <UserCard user={user} />
        <NavButtons navItems={navItems} onNavigate={onNavigate} />
        <Button
          className="mt-4 bg-orange-500 hover:bg-orange-600 text-white w-full flex items-center justify-center"
          onClick={footerButton.onButtonClick}
        >
          {footerButton.buttonText}
          <PlusCircleIcon className="ml-2 h-4 w-4" />
        </Button>
      </aside>
    </>
  )
}

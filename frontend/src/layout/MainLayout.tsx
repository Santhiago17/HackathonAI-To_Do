import type { NavItem } from "@/components/MainLayout/NavButtons/types"
import { SideBar } from "@/components/MainLayout/SideBar"
import { FileEditIcon, HomeIcon, ListChecksIcon, UsersIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"

export function MainLayout() {
  const navigate = useNavigate()
  const button = {
    text: "Create Task",
    onClick: () => {
      navigate("/create-task")
    },
  }
  const userName = "Compass UOL"
  const navItems: NavItem[] = [
    {
      icon: <HomeIcon className="mr-2 h-4 w-4" />,
      label: "Home",
      path: "/",
    },
    {
      icon: <ListChecksIcon className="mr-2 h-4 w-4" />,
      label: "Task assigned",
      path: "/task-assigned",
    },
    {
      icon: <UsersIcon className="mr-2 h-4 w-4" />,
      label: "List Users",
      path: "/list-users",
    },
    {
      icon: <ListChecksIcon className="mr-2 h-4 w-4" />,
      label: "List All Task",
      path: "/list-all-task",
    },
    {
      icon: <UsersIcon className="mr-2 h-4 w-4" />,
      label: "Create Users",
      path: "/create-users",
    },
    {
      icon: <FileEditIcon className="mr-2 h-4 w-4" />,
      label: "Edit task",
      path: "/edit-task",
    },
  ]

  return (
    <SideBar
      userName={userName}
      navItems={navItems}
      buttonText={button.text}
      onButtonClick={button.onClick}
    />
  )
}

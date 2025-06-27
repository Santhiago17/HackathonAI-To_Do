import { Header } from "@/components/main-layout/Header"
import type { NavItem } from "@/components/main-layout/NavButtons"
import { SideBar } from "@/components/main-layout/SideBar"
import { FileEditIcon, HomeIcon, ListChecksIcon, UsersIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"

export function MainLayout() {
  const [value, setValue] = useState<string>("")
  const [pageName, setPageName] = useState<string>("Home")
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      if (value.trim()) {
        // TODO insert api request
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [value])

  const footerButton = {
    buttonText: "Create Task",
    onButtonClick: () => {
      navigate("/tasks/new")
      setPageName("Create Task")
    },
  }
  const userName = "Compass Uol"
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
      path: "/users",
    },
    {
      icon: <ListChecksIcon className="mr-2 h-4 w-4" />,
      label: 'List All Task',
      path: '/tasks'
    },
    {
      icon: <UsersIcon className="mr-2 h-4 w-4" />,
      label: "Create Users",
      path: "/users/new",
    },
    {
      icon: <FileEditIcon className="mr-2 h-4 w-4" />,
      label: "Edit task",
      path: "/edit-task",
    },
  ]

  const handleNavigate = (path: string) => {
    setPageName(path)
  }

  return (
    <div className="relative flex w-full">
      <SideBar
        userName={userName}
        navItems={navItems}
        footerButton={footerButton}
        onNavigate={handleNavigate}
      />

      <div className="flex-1 flex-col p-6">
        <Header pageName={pageName} value={value} setValue={setValue} />

        <Outlet />
      </div>
    </div>
  )
}

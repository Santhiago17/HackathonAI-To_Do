import { useState, useEffect } from "react"
import { Calendar, Plus, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { TaskForm } from "@/components/tasks/TaskForm"
import { UserForm } from "@/components/users/UserForm"
import { UserList } from "@/components/users/UserList"
import { searchTasksByTag, getTasksWithUsers } from "@/services/taskService"
import type { Task } from "@/types/Task"
import type { User } from "@/types/User"
import type { CreateTaskType } from "@/lib/schemas/taskSchemas"
import type { CreateUserType } from "@/lib/schemas/userSchemas"
import CompassLogo from "../../assets/compass-logo.png"
import { getStatusName } from "@/lib/utils/statusUtils"

interface HomePageHeaderProps {
  users: User[]
  onCreateTask: (taskData: CreateTaskType) => Promise<void>
  onCreateUser: (userData: CreateUserType) => Promise<void>
  onTaskClick: (task: Task) => void
  getUserName: (userId: string) => string
}

export function HomePageHeader({
  users,
  onCreateTask,
  onCreateUser,
  onTaskClick,
  getUserName,
}: HomePageHeaderProps) {
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false)
  const [isUsersModalOpen, setIsUsersModalOpen] = useState(false)
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false)

  const [searchValue, setSearchValue] = useState("")
  const [filterType, setFilterType] = useState<"TAG" | "USER">("TAG")
  const [searchResults, setSearchResults] = useState<Task[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const filterValues: { name: string; value: "TAG" | "USER" }[] = [
    { name: "Tag", value: "TAG" },
    { name: "Usuário", value: "USER" },
  ]

  const searchTasks = async (searchTerm: string, type: "TAG" | "USER") => {
    if (!searchTerm.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      if (type === "TAG") {
        const results = await searchTasksByTag(searchTerm)
        setSearchResults(results)
      } else if (type === "USER") {
        const tasksWithUsers = await getTasksWithUsers()
        const filtered = tasksWithUsers.filter((task) => {
          const assigneeName = getUserName(task.assignee)?.toLowerCase()
          const creatorName = getUserName(task.creator)?.toLowerCase()
          const searchLower = searchTerm.toLowerCase()

          return (
            assigneeName?.includes(searchLower) ||
            creatorName?.includes(searchLower)
          )
        })
        setSearchResults(filtered)
      }
    } catch {
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  useEffect(() => {
    if (!searchValue.trim()) {
      setSearchResults([])
      return
    }

    const timeoutId = setTimeout(() => {
      searchTasks(searchValue, filterType)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchValue, filterType])

  const handleCreateTask = async (taskData: CreateTaskType) => {
    await onCreateTask(taskData)
    setIsCreateTaskModalOpen(false)
  }

  const handleCreateUser = async (userData: CreateUserType) => {
    await onCreateUser(userData)
    setIsCreateUserModalOpen(false)
  }

  return (
    <div className="flex-shrink-0 p-3 sm:p-4 lg:p-6 border-b border-gray-700">
      <div className="flex flex-col gap-4">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <img
              src={CompassLogo}
              alt="Compass UOL Logo"
              className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl lg:text-3xl font-bold text-white truncate">
              Compass UOL To Do List
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm lg:text-base">
              Dashboard de Gerenciamento de Tarefas
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:gap-4">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-3 w-full">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-3 w-full flex-1">
              <Select
                defaultValue="TAG"
                onValueChange={(value: "TAG" | "USER") => setFilterType(value)}
              >
                <SelectTrigger className="w-full bg-[#1a1a1a] text-gray-300 border-gray-600 focus:border-orange-500 h-10 lg:max-w-xs">
                  <SelectValue placeholder="Filtrar" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-gray-600">
                  {filterValues.map((filterValue, index) => (
                    <SelectItem
                      key={index}
                      value={filterValue.value}
                      className="text-gray-300 focus:bg-gray-700 focus:text-white"
                    >
                      {filterValue.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="relative w-full custom-scrollbar">
                <Input
                  placeholder={`Buscar por ${
                    filterType === "TAG" ? "tag" : "usuário"
                  }...`}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="bg-[#1a1a1a] text-gray-300 border-gray-600 focus:border-orange-500 placeholder:text-gray-500 h-10 text-sm"
                />
                {searchValue.trim() && (
                  <div className="absolute top-full left-0 right-0 z-50 bg-[#1a1a1a] border border-gray-600 rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg">
                    {isSearching ? (
                      <div className="p-4 text-center text-gray-400">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500 mx-auto mb-2"></div>
                        Buscando...
                      </div>
                    ) : searchResults.length === 0 ? (
                      <div className="p-4 text-center text-gray-400 text-sm">
                        {filterType === "TAG"
                          ? "Nenhuma tarefa encontrada com essa tag."
                          : "Nenhuma tarefa encontrada para esse usuário."}
                      </div>
                    ) : (
                      <div className="py-1">
                        {searchResults.map((task) => (
                          <div
                            key={task.id}
                            onClick={() => {
                              onTaskClick(task)
                              setSearchValue("")
                            }}
                            className="px-3 py-3 text-gray-300 hover:bg-gray-700 cursor-pointer border-b border-gray-600 last:border-b-0"
                          >
                            <div className="flex flex-col space-y-1">
                              <span className="font-medium text-sm line-clamp-1">
                                {task.title}
                              </span>
                              <span className="text-xs text-gray-400 line-clamp-1">
                                {getUserName(task.assignee)} •{" "}
                                {getStatusName(task.status)}
                                {filterType === "TAG" &&
                                  task.tags &&
                                  task.tags.length > 0 && (
                                    <span className="ml-2">
                                      • Tags: {task.tags.join(", ")}
                                    </span>
                                  )}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 lg:gap-3 lg:flex-shrink-0">
              <Dialog
                open={isCreateTaskModalOpen}
                onOpenChange={setIsCreateTaskModalOpen}
              >
                <DialogTrigger asChild>
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 h-10 flex items-center justify-center space-x-2 text-sm font-semibold">
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Criar Tarefa</span>
                    <span className="sm:hidden">Tarefa</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-[#1a1a1a] border-gray-600">
                  <DialogHeader>
                    <DialogTitle className="text-white">
                      Criar Nova Tarefa
                    </DialogTitle>
                  </DialogHeader>
                  <TaskForm
                    onSubmit={handleCreateTask}
                    users={users}
                    currentUserId="1"
                  />
                </DialogContent>
              </Dialog>

              <Dialog
                open={isUsersModalOpen}
                onOpenChange={setIsUsersModalOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 px-4 py-2 h-10 flex items-center justify-center space-x-2 text-sm font-semibold"
                  >
                    <Users className="h-4 w-4" />
                    <span className="hidden sm:inline">Usuários</span>
                    <span className="sm:hidden">Users</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-[#1a1a1a] border-gray-600">
                  <DialogHeader>
                    <DialogTitle className="text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pr-0 sm:pr-12">
                      <span>Gerenciar Usuários</span>
                      <Dialog
                        open={isCreateUserModalOpen}
                        onOpenChange={setIsCreateUserModalOpen}
                      >
                        <DialogTrigger asChild>
                          <Button className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 h-9 flex items-center space-x-2 text-sm">
                            <Plus className="h-3 w-3" />
                            <span>Novo Usuário</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-[95vw] sm:max-w-lg bg-[#252525] border-gray-600">
                          <DialogHeader>
                            <DialogTitle className="text-white">
                              Criar Novo Usuário
                            </DialogTitle>
                          </DialogHeader>
                          <UserForm onSubmit={handleCreateUser} />
                        </DialogContent>
                      </Dialog>
                    </DialogTitle>
                  </DialogHeader>
                  <UserList users={users} isLoading={false} error={null} />
                </DialogContent>
              </Dialog>

              <div className="hidden sm:flex items-center space-x-2 text-xs lg:text-sm text-gray-400 bg-[#252525] px-3 py-2 rounded-lg whitespace-nowrap">
                <Calendar className="h-3 w-3 lg:h-4 lg:w-4" />
                <span>{new Date().toLocaleDateString("pt-BR")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

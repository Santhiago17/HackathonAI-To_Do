import { useState, useEffect } from "react"
import {
  getTasks,
  updateTaskStatus,
  createTask,
  searchTasksByTag,
  getTasksWithUsers,
} from "@/services/taskService"
import { getUsers, createUser } from "@/services/userService"
import type { Task, Status } from "@/types/Task"
import type { User } from "@/types/User"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Calendar,
  CheckCircle,
  AlertCircle,
  PlayCircle,
  Plus,
  Users,
} from "lucide-react"
import { EditTaskModal } from "@/components/tasks/EditTaskModal"
import { TaskForm } from "@/components/tasks/TaskForm"
import { UserForm } from "@/components/users/UserForm"
import { UserList } from "@/components/users/UserList"
import type { CreateTaskType } from "@/lib/schemas/taskSchemas"
import type { CreateUserType } from "@/lib/schemas/userSchemas"
import {
  DndContext,
  closestCenter,
  pointerWithin,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { DraggableTaskCard, DroppableColumn } from "@/components/kanban"
import { useKanbanHelpers } from "@/hooks/useKanbanHelpers"
import "@/styles/dashboard.css"
import CompassLogo from "../assets/compass-logo.png"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"

export function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)

  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false)
  const [isUsersModalOpen, setIsUsersModalOpen] = useState(false)
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false)
  const filterDefaultValue = "TAG"
  const filterValues: { name: string; value: "TAG" | "USER" }[] = [
    {
      name: "Tag",
      value: "TAG",
    },
    {
      name: "Usuário",
      value: "USER",
    },
  ]

  const [searchValue, setSearchValue] = useState("")
  const [filterType, setFilterType] = useState<"TAG" | "USER">("TAG")
  const [searchResults, setSearchResults] = useState<Task[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const getStatusName = (status: Status): string => {
    const statusMap = {
      todo: "A Fazer",
      "in-progress": "Em Progresso",
      review: "Em Revisão",
      done: "Concluído",
    }
    return statusMap[status] || status
  }

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
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error)
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

  const {
    getStatusConfig,
    getPriorityColor,
    getUserName,
    formatDate,
    isOverdue,
  } = useKanbanHelpers(users)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [tasksData, usersData] = await Promise.all([
          getTasks(),
          getUsers(),
        ])
        setTasks(tasksData)
        setUsers(usersData)
      } catch (err) {
        setError("Erro ao carregar dados")
        console.error("Erro ao carregar dados:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getTasksByStatus = (status: Status) => {
    return tasks
      .filter((task) => task.status === status)
      .sort((a, b) => {
        if (!a.endDate && !b.endDate) return 0
        if (!a.endDate) return 1
        if (!b.endDate) return -1
        return new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
      })
  }

  const getTaskStats = () => {
    const total = tasks.length
    const completed = tasks.filter((t) => t.status === "done").length
    const inProgress = tasks.filter((t) => t.status === "in-progress").length
    const overdue = tasks.filter(
      (t) => isOverdue(t.endDate) && t.status !== "done"
    ).length

    return { total, completed, inProgress, overdue }
  }

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setIsEditModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsEditModalOpen(false)
    setSelectedTask(null)
  }

  const handleTaskUpdated = async () => {
    try {
      const [tasksData, usersData] = await Promise.all([getTasks(), getUsers()])
      setTasks(tasksData)
      setUsers(usersData)
    } catch (err) {
      console.error("Erro ao recarregar dados:", err)
    }
  }

  const handleCreateTask = async (taskData: CreateTaskType) => {
    try {
      await createTask(taskData)
      await handleTaskUpdated()
      setIsCreateTaskModalOpen(false)
    } catch (error) {
      console.error("Erro ao criar tarefa:", error)
      throw error
    }
  }

  const handleCreateUser = async (userData: CreateUserType) => {
    try {
      await createUser(userData)
      await handleTaskUpdated()
      setIsCreateUserModalOpen(false)
    } catch (error) {
      console.error("Erro ao criar usuário:", error)
      throw error
    }
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    setActiveId(active.id as string)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    const statusTypes: Status[] = ["todo", "in-progress", "review", "done"]
    const targetStatus = statusTypes.find((status) => overId.includes(status))

    if (targetStatus) {
      const taskToUpdate = tasks.find((task) => task.id === activeId)
      if (taskToUpdate && taskToUpdate.status !== targetStatus) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === activeId ? { ...task, status: targetStatus } : task
          )
        )

        try {
          await updateTaskStatus(activeId, targetStatus)
          console.log(`Task ${activeId} atualizada para status ${targetStatus}`)
        } catch (error) {
          console.error("Erro ao atualizar status da task:", error)
          await handleTaskUpdated()
        }
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1A1A1A]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1A1A1A]">
        <div className="text-center bg-[#252525] p-8 rounded-xl shadow-lg border border-gray-700">
          <AlertCircle className="h-16 w-16 mx-auto mb-4 text-red-400" />
          <h2 className="text-xl font-semibold text-white mb-2">
            Oops! Algo deu errado
          </h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    )
  }

  const stats = getTaskStats()
  const statusTypes: Status[] = ["todo", "in-progress", "review", "done"]

  return (
    <div className="w-full h-screen bg-[#1A1A1A] flex flex-col overflow-hidden">
      <div className="flex-shrink-0 p-3 sm:p-4 lg:p-6 border-b border-gray-700">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 lg:h-12 lg:w-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <img
                src={CompassLogo}
                alt="Compass UOL Logo"
                className="h-8 w-8 lg:h-10 lg:w-10"
              />
            </div>
            <div>
              <h1 className="text-xl lg:text-3xl font-bold text-white">
                Compass UOL To Do List
              </h1>
              <p className="text-gray-400 text-sm lg:text-base">
                Dashboard de Gerenciamento de Tarefas
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Select
                defaultValue={filterDefaultValue}
                onValueChange={(value: "TAG" | "USER") => setFilterType(value)}
              >
                <SelectTrigger className="w-[140px] bg-[#1a1a1a] text-gray-300 border-gray-600 focus:border-orange-500">
                  <SelectValue placeholder="Filtrar" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-gray-600">
                  {filterValues?.map((filterValue, index) => (
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

              <div className="relative w-[300px] custom-scrollbar">
                <Input
                  placeholder={`Buscar por ${
                    filterType === "TAG" ? "tag" : "usuário"
                  }...`}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="bg-[#1a1a1a] text-gray-300 border-gray-600 focus:border-orange-500 placeholder:text-gray-500"
                />
                {searchValue.trim() && (
                  <div className="absolute top-full left-0 right-0 z-50 bg-[#1a1a1a] border border-gray-600 rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg">
                    {isSearching ? (
                      <div className="p-4 text-center text-gray-400">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500 mx-auto mb-2"></div>
                        Buscando...
                      </div>
                    ) : searchResults.length === 0 ? (
                      <div className="p-4 text-center text-gray-400">
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
                              handleTaskClick(task)
                              setSearchValue("")
                            }}
                            className="px-3 py-3 text-gray-300 hover:bg-gray-700 cursor-pointer border-b border-gray-600 last:border-b-0"
                          >
                            <div className="flex flex-col space-y-1">
                              <span className="font-medium text-sm">
                                {task.title}
                              </span>
                              <span className="text-xs text-gray-400">
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

            <Dialog
              open={isCreateTaskModalOpen}
              onOpenChange={setIsCreateTaskModalOpen}
            >
              <DialogTrigger asChild>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 h-12 flex items-center space-x-2 text-base font-semibold">
                  <Plus className="h-5 w-5" />
                  <span>Criar Tarefa</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#1a1a1a] border-gray-600">
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

            <Dialog open={isUsersModalOpen} onOpenChange={setIsUsersModalOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 px-6 py-3 h-12 flex items-center space-x-2 text-base font-semibold"
                >
                  <Users className="h-5 w-5" />
                  <span>Usuários</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[#1a1a1a] border-gray-600">
                <DialogHeader>
                  <DialogTitle className="text-white flex items-center justify-between pr-12">
                    <span>Gerenciar Usuários</span>
                    <Dialog
                      open={isCreateUserModalOpen}
                      onOpenChange={setIsCreateUserModalOpen}
                    >
                      <DialogTrigger asChild>
                        <Button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 h-10 flex items-center space-x-2">
                          <Plus className="h-4 w-4" />
                          <span>Novo Usuário</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg bg-[#252525] border-gray-600">
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

            <div className="flex items-center space-x-2 text-sm lg:text-base text-gray-400 bg-[#252525] px-4 py-3 rounded-lg">
              <Calendar className="h-4 w-4 lg:h-5 lg:w-5" />
              <span>{new Date().toLocaleDateString("pt-BR")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col p-3 sm:p-4 lg:p-6 overflow-hidden gap-4 lg:gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 flex-shrink-0">
          <Card className="p-4 lg:p-6 bg-[#252525] border-gray-600 rounded-xl hover:shadow-lg transition-all hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm lg:text-base font-medium text-gray-300">
                  Total de Tarefas
                </p>
                <p className="text-2xl lg:text-3xl font-bold text-white">
                  {stats.total}
                </p>
              </div>
              <div className="h-12 w-12 lg:h-16 lg:w-16 bg-blue-900/50 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 lg:h-8 lg:w-8 text-blue-400" />
              </div>
            </div>
          </Card>

          <Card className="p-4 lg:p-6 bg-[#252525] border-gray-600 rounded-xl hover:shadow-lg transition-all hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm lg:text-base font-medium text-gray-300">
                  Em Progresso
                </p>
                <p className="text-2xl lg:text-3xl font-bold text-blue-400">
                  {stats.inProgress}
                </p>
              </div>
              <div className="h-12 w-12 lg:h-16 lg:w-16 bg-blue-900/50 rounded-lg flex items-center justify-center">
                <PlayCircle className="h-6 w-6 lg:h-8 lg:w-8 text-blue-400" />
              </div>
            </div>
          </Card>

          <Card className="p-4 lg:p-6 bg-[#252525] border-gray-600 rounded-xl hover:shadow-lg transition-all hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm lg:text-base font-medium text-gray-300">
                  Concluídas
                </p>
                <p className="text-2xl lg:text-3xl font-bold text-green-400">
                  {stats.completed}
                </p>
              </div>
              <div className="h-12 w-12 lg:h-16 lg:w-16 bg-green-900/50 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 lg:h-8 lg:w-8 text-green-400" />
              </div>
            </div>
          </Card>

          <Card className="p-4 lg:p-6 bg-[#252525] border-gray-600 rounded-xl hover:shadow-lg transition-all hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm lg:text-base font-medium text-gray-300">
                  Atrasadas
                </p>
                <p className="text-2xl lg:text-3xl font-bold text-red-400">
                  {stats.overdue}
                </p>
              </div>
              <div className="h-12 w-12 lg:h-16 lg:w-16 bg-red-900/50 rounded-lg flex items-center justify-center">
                <AlertCircle className="h-6 w-6 lg:h-8 lg:w-8 text-red-400" />
              </div>
            </div>
          </Card>
        </div>

        <div className="flex-1 overflow-hidden">
          <DndContext
            sensors={sensors}
            collisionDetection={(args) => {
              const pointerIntersections = pointerWithin(args)
              if (pointerIntersections.length > 0) {
                return pointerIntersections
              }
              return closestCenter(args)
            }}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 h-full">
              {statusTypes.map((status) => {
                const statusConfig = getStatusConfig(status)
                const statusTasks = getTasksByStatus(status)
                const StatusIcon = statusConfig.icon

                return (
                  <DroppableColumn
                    key={status}
                    id={`droppable-${status}`}
                    statusConfig={statusConfig}
                  >
                    <div className="p-4 lg:p-6 space-y-3 h-full overflow-y-auto kanban-column-scroll">
                      {statusTasks.length === 0 ? (
                        <div className="text-center py-16">
                          <div className="flex flex-col items-center space-y-3">
                            <StatusIcon
                              className={`h-12 w-12 ${statusConfig.color} opacity-30`}
                            />
                            <p className="text-gray-400 text-base">
                              Nenhuma tarefa
                            </p>
                            <p className="text-gray-500 text-sm">
                              Arraste uma tarefa aqui
                            </p>
                          </div>
                        </div>
                      ) : (
                        <SortableContext
                          items={statusTasks.map((task) => task.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          {statusTasks.map((task) => (
                            <DraggableTaskCard
                              key={task.id}
                              task={task}
                              status={status}
                              onClick={handleTaskClick}
                              getPriorityColor={getPriorityColor}
                              formatDate={formatDate}
                              isOverdue={isOverdue}
                              getUserName={getUserName}
                            />
                          ))}
                        </SortableContext>
                      )}
                    </div>
                  </DroppableColumn>
                )
              })}
            </div>

            <DragOverlay>
              {activeId ? (
                <DraggableTaskCard
                  task={tasks.find((task) => task.id === activeId)!}
                  status={
                    tasks.find((task) => task.id === activeId)?.status || "todo"
                  }
                  onClick={() => {}}
                  getPriorityColor={getPriorityColor}
                  formatDate={formatDate}
                  isOverdue={isOverdue}
                  getUserName={getUserName}
                />
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>

      <EditTaskModal
        task={selectedTask}
        users={users}
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        onTaskUpdated={handleTaskUpdated}
      />
    </div>
  )
}

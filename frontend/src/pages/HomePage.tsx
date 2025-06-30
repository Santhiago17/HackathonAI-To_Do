import { useState, useEffect } from "react"
import { getTasks, createTask } from "@/services/taskService"
import { getUsers, createUser } from "@/services/userService"
import type { Task, Status } from "@/types/Task"
import type { User } from "@/types/User"
import type { CreateTaskType } from "@/lib/schemas/taskSchemas"
import type { CreateUserType } from "@/lib/schemas/userSchemas"
import { EditTaskModal } from "@/components/tasks/EditTaskModal"
import { useKanbanHelpers } from "@/hooks/useKanbanHelpers"
import { LoadingState } from "@/components/home/LoadingState"
import { ErrorState } from "@/components/home/ErrorState"
import { HomePageHeader } from "@/components/home/HomePageHeader"
import { StatsCards, type StatCard } from "@/components/home/StatsCard"
import { KanbanSection } from "@/components/home/KanbanSection"
import { getTaskStats } from "@/lib/utils/taskUtils"
import { AlertCircle, CheckCircle, ListTodo, PlayCircle } from "lucide-react"

export function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const {
    getStatusConfig,
    getPriorityColor,
    getUserName,
    formatDate,
    isOverdue,
  } = useKanbanHelpers(users)

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
      } catch {
        setError("Erro ao carregar dados")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setIsEditModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsEditModalOpen(false)
    setSelectedTask(null)
  }

  const handleTaskUpdated = async () => {
    const [tasksData, usersData] = await Promise.all([getTasks(), getUsers()])
    setTasks(tasksData)
    setUsers(usersData)
  }

  const handleCreateTask = async (taskData: CreateTaskType) => {
    await createTask(taskData)
    await handleTaskUpdated()
  }

  const handleCreateUser = async (userData: CreateUserType) => {
    await createUser(userData)
    await handleTaskUpdated()
  }

  if (loading) {
    return <LoadingState />
  }

  if (error) {
    return <ErrorState error={error} />
  }

  const statusTypes: Status[] = ["todo", "in-progress", "review", "done"]
  const stats = getTaskStats(tasks, isOverdue)
  const statsCards: StatCard[] = [
    {
      key: "total",
      title: "Total de Tarefas",
      value: stats.total,
      textColor: "text-white",
      bgColor: "bg-blue-900/50",
      icon: ListTodo,
    },
    {
      key: "inProgress",
      title: "Em Progresso",
      value: stats.inProgress,
      textColor: "text-blue-400",
      bgColor: "bg-blue-900/50",
      icon: PlayCircle,
    },
    {
      key: "completed",
      title: "Concluídas",
      value: stats.completed,
      textColor: "text-green-400",
      bgColor: "bg-green-900/50",
      icon: CheckCircle,
    },
    {
      key: "overdue",
      title: "Atrasadas",
      value: stats.overdue,
      textColor: "text-red-400",
      bgColor: "bg-red-900/50",
      icon: AlertCircle,
    },
  ]

  return (
    <div className="w-full h-screen bg-[#1A1A1A] flex flex-col overflow-hidden">
      <HomePageHeader
        users={users}
        onCreateTask={handleCreateTask}
        onCreateUser={handleCreateUser}
        onTaskClick={handleTaskClick}
        getUserName={getUserName}
      />

      <div className="flex-1 flex flex-col p-3 sm:p-4 lg:p-6 overflow-hidden gap-4 lg:gap-6">
        <StatsCards cards={statsCards} />

        <KanbanSection
          tasks={tasks}
          statusTypes={statusTypes}
          getStatusConfig={getStatusConfig}
          onTaskClick={handleTaskClick}
          onTaskUpdated={handleTaskUpdated}
          getPriorityColor={getPriorityColor}
          formatDate={formatDate}
          isOverdue={isOverdue}
          getUserName={getUserName}
        />
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

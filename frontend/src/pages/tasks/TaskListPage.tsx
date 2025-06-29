import { useEffect, useState } from 'react'
import { TaskList } from '@/components/tasks/TaskList'
import { EditTaskModal } from '@/components/tasks/EditTaskModal'
import { getTasks, deleteTask } from '@/services/taskService'
import { getUsers } from '@/services/userService'
import type { Task } from '@/types/Task'
import type { User } from '@/types/User'

export function TaskListPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [tasksData, usersData] = await Promise.all([getTasks(), getUsers()])
      setTasks(tasksData)
      setUsers(usersData)
    } catch (err) {
      setError(err as Error)
      
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      try {
        await deleteTask(taskId)
        
        fetchData()
      } catch (err) {
        setError(err as Error)
        
      }
    }
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setIsEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setEditingTask(null)
  }

  const handleTaskUpdated = () => {
    fetchData()
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Lista de Tarefas</h1>
      </div>
      <div className="mb-6"></div>
      <TaskList
        tasks={tasks}
        users={users}
        isLoading={isLoading}
        error={error}
        onDelete={handleDeleteTask}
        onEdit={handleEditTask}
      />

      <EditTaskModal
        task={editingTask}
        users={users}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onTaskUpdated={handleTaskUpdated}
      />
    </div>
  )
}

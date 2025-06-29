import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { TaskForm } from '@/components/tasks/TaskForm'
import { createTask } from '@/services/taskService'
import { getUsers } from '@/services/userService'
import type { User } from '@/types/User'
import type { CreateTaskType } from '@/lib/schemas/taskSchemas'
import { Card, CardContent } from '@/components/ui/card'

export function TaskCreatePage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoadingUsers(true)
      try {
        const usersData = await getUsers()
        setUsers(usersData)
      } catch (err) {
        
        setError(err as Error)
      } finally {
        setIsLoadingUsers(false)
      }
    }

    fetchUsers()
  }, [])

  const handleSubmit = async (data: CreateTaskType) => {
    setIsLoading(true)
    setError(null)
    try {
      await createTask(data)
      
      navigate('/tasks')
    } catch (err) {
      setError(err as Error)
      
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingUsers) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p className="text-white">Carregando usuários...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-[#252525] border-none text-white mx-auto w-[600px]">
          <div className="p-4">
            <h2 className="text-sm font-medium">Criar Tarefa</h2>
          </div>
          <CardContent className="pt-0">
            {error && (
              <div className="mb-4 p-3 rounded-md bg-red-900/20 border border-red-500/30">
                <p className="text-red-400 text-sm">Erro: {error.message}</p>
              </div>
            )}
            <TaskForm
              onSubmit={handleSubmit}
              users={users}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

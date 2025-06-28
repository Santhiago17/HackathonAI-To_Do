import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog'
import { TaskForm } from '@/components/tasks/TaskForm'
import { updateTask } from '@/services/taskService'
import type { Task } from '@/types/Task'
import type { User } from '@/types/User'
import type { CreateTaskType } from '@/lib/schemas/taskSchemas'

interface EditTaskModalProps {
  task: Task | null
  users: User[]
  isOpen: boolean
  onClose: () => void
  onTaskUpdated: () => void
}

export function EditTaskModal({
  task,
  users,
  isOpen,
  onClose,
  onTaskUpdated
}: EditTaskModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (isOpen) {
      setError(null)
    }
  }, [isOpen])

  const handleSubmit = async (data: CreateTaskType) => {
    if (!task) return

    setIsLoading(true)
    setError(null)
    try {
      await updateTask(task.id, {
        ...data,
        id: task.id
      })
      console.log('Tarefa atualizada com sucesso!')
      onTaskUpdated()
      onClose()
    } catch (err) {
      setError(err as Error)
      console.error('Falha ao atualizar tarefa:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-[#252525] border-gray-600 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white">Editar Tarefa</DialogTitle>
          <DialogDescription className="text-gray-400">
            Faça as alterações necessárias na tarefa abaixo.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="mb-4 p-3 rounded-md bg-red-900/20 border border-red-500/30">
            <p className="text-red-400 text-sm">Erro: {error.message}</p>
          </div>
        )}

        {!task && isOpen && (
          <div className="flex justify-center items-center py-8">
            <p className="text-white">Carregando...</p>
          </div>
        )}

        {task && (
          <TaskForm
            onSubmit={handleSubmit}
            users={users}
            initialData={task}
            isLoading={isLoading}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

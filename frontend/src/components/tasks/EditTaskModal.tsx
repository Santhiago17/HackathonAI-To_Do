import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog'
import { TaskForm } from '@/components/tasks/TaskForm'
import { updateTask, deleteTask } from '@/services/taskService'
import type { Task } from '@/types/Task'
import type { User } from '@/types/User'
import type { CreateTaskType } from '@/lib/schemas/taskSchemas'
import { Trash2 } from 'lucide-react'

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
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setError(null)
      setShowDeleteConfirm(false)
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

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true)
  }

  const handleDeleteConfirm = async () => {
    if (!task) return

    setIsDeleting(true)
    setError(null)
    try {
      await deleteTask(task.id)
      console.log('Tarefa excluída com sucesso!')
      onTaskUpdated()
      onClose()
    } catch (err) {
      setError(err as Error)
      console.error('Falha ao excluir tarefa:', err)
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false)
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
          <div className="flex items-center justify-between pr-8">
            <div>
              <DialogTitle className="text-white">Editar Tarefa</DialogTitle>
              <DialogDescription className="text-gray-400">
                Faça as alterações necessárias na tarefa abaixo.
              </DialogDescription>
            </div>
            {task && !showDeleteConfirm && (
              <button
                onClick={handleDeleteClick}
                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors mr-2"
                title="Excluir tarefa"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            )}
          </div>
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

        {showDeleteConfirm && (
          <div className="p-4 rounded-lg bg-red-900/20 border border-red-500/30">
            <h3 className="text-white font-semibold mb-2">Confirmar Exclusão</h3>
            <p className="text-gray-300 mb-4">
              Tem certeza que deseja excluir a tarefa "{task?.title}"? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isDeleting ? 'Excluindo...' : 'Sim, Excluir'}
              </button>
              <button
                onClick={handleDeleteCancel}
                disabled={isDeleting}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {task && !showDeleteConfirm && (
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

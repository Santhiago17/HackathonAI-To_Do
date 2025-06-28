import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  createTaskSchema,
  type CreateTaskType
} from '@/lib/schemas/taskSchemas'
import type { Task } from '@/types/Task'
import type { User } from '@/types/User'
import { ZodError } from 'zod'

interface TaskFormProps {
  onSubmit: (data: CreateTaskType) => Promise<void>
  users: User[]
  currentUserId?: string
  initialData?: Task
  isLoading?: boolean
}

export function TaskForm({
  onSubmit,
  users,
  currentUserId = '1',
  initialData,
  isLoading = false
}: TaskFormProps) {
  const [formData, setFormData] = useState<CreateTaskType>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    assignee: initialData?.assignee || '',
    creator: initialData?.creator || currentUserId,
    priority: initialData?.priority || 'medium',
    status: initialData?.status || 'todo',
    tags: initialData?.tags || [],
    endDate: initialData?.endDate || ''
  })

  const [tagsInput, setTagsInput] = useState(
    initialData?.tags ? initialData.tags.join(', ') : ''
  )

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (data: CreateTaskType): boolean => {
    try {
      createTaskSchema.parse(data)
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors: Record<string, string> = {}
        error.issues.forEach(issue => {
          const field = issue.path.join('.')
          validationErrors[field] = issue.message
        })
        setErrors(validationErrors)
      }
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const processedTags = tagsInput
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      const processedData = {
        ...formData,
        tags: processedTags
      }

      if (!validateForm(processedData)) {
        return
      }

      await onSubmit(processedData)
    } catch (error) {
      console.error('Erro ao enviar formulário:', error)
    }
  }

  const handleInputChange = (field: keyof CreateTaskType, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Título
        </label>
        <Input
          placeholder="Digite o título da tarefa"
          className={`bg-[#1a1a1a] border-gray-600 text-white placeholder-gray-400 ${
            errors.title ? 'border-red-500' : ''
          }`}
          value={formData.title}
          onChange={e => handleInputChange('title', e.target.value)}
          required
        />
        {errors.title && (
          <p className="text-red-400 text-sm mt-1">{errors.title}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Descrição
        </label>
        <textarea
          placeholder="Digite a descrição da tarefa"
          className={`w-full min-h-[100px] px-3 py-2 bg-[#1a1a1a] border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.description ? 'border-red-500' : ''
          }`}
          value={formData.description}
          onChange={e => handleInputChange('description', e.target.value)}
          required
        />
        {errors.description && (
          <p className="text-red-400 text-sm mt-1">{errors.description}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Responsável
        </label>
        <select
          className="w-full px-3 py-2 bg-[#1a1a1a] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.assignee}
          onChange={e => handleInputChange('assignee', e.target.value)}
          required
        >
          <option value="">Selecione um responsável</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.name || `${user.firstName} ${user.lastName}`}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Prioridade
        </label>
        <select
          className="w-full px-3 py-2 bg-[#1a1a1a] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.priority}
          onChange={e =>
            handleInputChange(
              'priority',
              e.target.value as 'low' | 'medium' | 'high'
            )
          }
        >
          <option value="low">Baixa</option>
          <option value="medium">Média</option>
          <option value="high">Alta</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Status
        </label>
        <select
          className="w-full px-3 py-2 bg-[#1a1a1a] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.status}
          onChange={e =>
            handleInputChange(
              'status',
              e.target.value as 'todo' | 'in-progress' | 'review' | 'done'
            )
          }
        >
          <option value="todo">A Fazer</option>
          <option value="in-progress">Em Progresso</option>
          <option value="review">Em Revisão</option>
          <option value="done">Concluído</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Tags (separadas por vírgula)
        </label>
        <Input
          placeholder="Ex: frontend, urgente, bug"
          className={`bg-[#1a1a1a] border-gray-600 text-white placeholder-gray-400 ${
            errors.tags ? 'border-red-500' : ''
          }`}
          value={tagsInput}
          onChange={e => setTagsInput(e.target.value)}
        />
        {errors.tags && (
          <p className="text-red-400 text-sm mt-1">{errors.tags}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Data de Entrega (opcional)
        </label>
        <Input
          type="date"
          className="bg-[#1a1a1a] border-gray-600 text-white"
          value={formData.endDate}
          onChange={e => handleInputChange('endDate', e.target.value)}
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
      >
        {isLoading
          ? initialData
            ? 'Salvando...'
            : 'Criando...'
          : initialData
          ? 'Salvar Alterações'
          : 'Criar Tarefa'}
      </Button>
    </form>
  )
}

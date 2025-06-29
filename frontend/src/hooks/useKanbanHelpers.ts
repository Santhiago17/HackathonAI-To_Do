import type { Status } from '@/types/Task'
import type { User } from '@/types/User'
import { Circle, PlayCircle, AlertCircle, CheckCircle } from 'lucide-react'
import type { StatusConfig } from '../components/kanban/types'

export function useKanbanHelpers(users: User[]) {
  const getStatusConfig = (status: Status): StatusConfig => {
    const configs = {
      todo: {
        title: 'A Fazer',
        icon: Circle,
        color: 'text-gray-300',
        bgColor: 'bg-gray-800',
        borderColor: 'border-gray-700'
      },
      'in-progress': {
        title: 'Em Progresso',
        icon: PlayCircle,
        color: 'text-blue-400',
        bgColor: 'bg-blue-900/30',
        borderColor: 'border-blue-700'
      },
      review: {
        title: 'Em Revisão',
        icon: AlertCircle,
        color: 'text-orange-400',
        bgColor: 'bg-orange-900/30',
        borderColor: 'border-orange-700'
      },
      done: {
        title: 'Concluído',
        icon: CheckCircle,
        color: 'text-green-400',
        bgColor: 'bg-green-900/30',
        borderColor: 'border-green-700'
      }
    }
    return configs[status]
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'text-green-300 bg-green-900/30',
      medium: 'text-yellow-300 bg-yellow-900/30',
      high: 'text-red-300 bg-red-900/30'
    }
    return (
      colors[priority as keyof typeof colors] || 'text-gray-300 bg-gray-800'
    )
  }

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId)
    return user ? user.name : 'Usuário não encontrado'
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Sem prazo'
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const isOverdue = (endDate?: string) => {
    if (!endDate) return false
    return new Date(endDate) < new Date()
  }

  return {
    getStatusConfig,
    getPriorityColor,
    getUserName,
    formatDate,
    isOverdue
  }
}

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import type { Task } from '@/types/Task'
import type { User } from '@/types/User'

const getPriorityClass = (priority: string): string => {
  const classes = {
    high: 'text-red-600 font-bold',
    medium: 'text-amber-600',
    low: 'text-green-600'
  }
  return classes[priority as keyof typeof classes] || ''
}

const getStatusClass = (status: string): string => {
  const classes = {
    todo: 'bg-gray-200 text-gray-800',
    'in-progress': 'bg-blue-200 text-blue-800',
    review: 'bg-amber-200 text-amber-800',
    done: 'bg-green-200 text-green-800'
  }
  return classes[status as keyof typeof classes] || ''
}

interface TaskListProps {
  tasks: Task[]
  users: User[]
  isLoading: boolean
  error: Error | null
  onDelete?: (taskId: string) => void
  onEdit?: (task: Task) => void
}

export function TaskList({
  tasks,
  users,
  isLoading,
  error,
  onDelete,
  onEdit
}: TaskListProps) {
  if (isLoading) {
    return <p>Carregando tarefas...</p>
  }

  if (error) {
    return (
      <p>Erro ao carregar tarefas: {error.message || JSON.stringify(error)}</p>
    )
  }

  if (!tasks || tasks.length === 0) {
    return <p>Nenhuma tarefa encontrada.</p>
  }

  const getUserName = (userId: string): string => {
    const user = users.find(u => u.id === userId)
    return user ? user.name : 'Usuário desconhecido'
  }

  const statusOrder: Record<string, number> = {
    todo: 1,
    'in-progress': 2,
    review: 3,
    done: 4
  }

  const priorityOrder: Record<string, number> = {
    high: 1,
    medium: 2,
    low: 3
  }

  const sortedTasks = [...tasks].sort((a, b) => {
    const statusA = statusOrder[a.status]
    const statusB = statusOrder[b.status]

    if (statusA !== statusB) {
      return statusA - statusB
    }

    const priorityA = priorityOrder[a.priority]
    const priorityB = priorityOrder[b.priority]

    return priorityA - priorityB
  })

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead className="w-[300px]">Título</TableHead>
          <TableHead>Responsável</TableHead>
          <TableHead>Criador</TableHead>
          <TableHead>Prioridade</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Tags</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedTasks.map(task => (
          <TableRow key={task.id}>
            <TableCell className="font-medium">{task.id}</TableCell>

            <TableCell className="max-w-[300px]">
              <div
                className="overflow-hidden text-ellipsis whitespace-nowrap"
                style={{ maxWidth: '100%' }}
                title={task.title}
              >
                {task.title}
              </div>
            </TableCell>

            <TableCell>{getUserName(task.assignee)}</TableCell>
            <TableCell>{getUserName(task.creator)}</TableCell>
            <TableCell className={getPriorityClass(task.priority)}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </TableCell>
            <TableCell>
              <span
                className={`px-2 py-1 rounded text-xs ${getStatusClass(
                  task.status
                )}`}
              >
                {task.status.replace('-', ' ').toUpperCase()}
              </span>
            </TableCell>

            <TableCell className="max-w-[200px]">
              <div
                className="overflow-hidden text-ellipsis whitespace-nowrap"
                title={
                  task.tags && task.tags.length > 0 ? task.tags.join(', ') : '-'
                }
              >
                {task.tags && task.tags.length > 0 ? task.tags.join(', ') : '-'}
              </div>
            </TableCell>

            <TableCell className="text-right space-x-2">
              {onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(task)}
                >
                  Editar
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(task.id)}
                >
                  Excluir
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

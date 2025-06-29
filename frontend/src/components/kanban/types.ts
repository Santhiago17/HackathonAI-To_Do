import type { Status, Task } from '@/types/Task'

export interface StatusConfig {
  title: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  bgColor: string
  borderColor: string
}

export interface KanbanHelpers {
  getPriorityColor: (priority: string) => string
  formatDate: (dateString?: string) => string
  isOverdue: (endDate?: string) => boolean
  getUserName: (userId: string) => string
}

export interface KanbanBoardProps {
  statusTypes: Status[]
  getStatusConfig: (status: Status) => StatusConfig
  getTasksByStatus: (status: Status) => Task[]
  onTaskClick: (task: Task) => void
  helpers: KanbanHelpers
}

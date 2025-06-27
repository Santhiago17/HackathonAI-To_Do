import type { CreateTaskType } from '@/lib/schemas/taskSchemas'
import type { Task, Status, Priority } from '@/types/Task'
import { api } from './api'

interface BackendTask {
  id: number
  title: string
  description: string
  status: string
  priority: string
  assignee?: { id: number }
  creator?: { id: number }
  tags: string[]
  createdAt: string
  updatedAt: string
  endDate?: string
}

const mapStatusToBackend = (frontendStatus: Status): string => {
  const statusMap: Record<Status, string> = {
    todo: 'PENDING',
    'in-progress': 'IN_PROGRESS',
    done: 'COMPLETED',
    review: 'CANCELLED'
  }
  return statusMap[frontendStatus] || 'PENDING'
}

const mapStatusFromBackend = (backendStatus: string): Status => {
  const statusMap: Record<string, Status> = {
    PENDING: 'todo',
    IN_PROGRESS: 'in-progress',
    COMPLETED: 'done',
    CANCELLED: 'review'
  }
  return statusMap[backendStatus] || 'todo'
}

const mapPriorityToBackend = (frontendPriority: Priority): string => {
  const priorityMap: Record<Priority, string> = {
    low: '1',
    medium: '2',
    high: '3'
  }
  return priorityMap[frontendPriority] || '2'
}

const mapPriorityFromBackend = (backendPriority: string): Priority => {
  const priorityMap: Record<string, Priority> = {
    '1': 'low',
    '2': 'medium',
    '3': 'high'
  }
  return priorityMap[backendPriority] || 'medium'
}

const mapBackendToTask = (backendTask: BackendTask): Task => {
  return {
    id: backendTask.id?.toString() || '',
    title: backendTask.title || '',
    description: backendTask.description || '',
    status: mapStatusFromBackend(backendTask.status),
    priority: mapPriorityFromBackend(backendTask.priority),
    assignee: backendTask.assignee?.id?.toString() || '',
    creator: backendTask.creator?.id?.toString() || '',
    tags: backendTask.tags || [],
    createdAt: new Date(backendTask.createdAt || Date.now()),
    updatedAt: new Date(backendTask.updatedAt || Date.now()),
    endDate: backendTask.endDate || ''
  }
}

interface TaskUpdateData {
  title?: string
  description?: string
  status?: string
  priority?: string
  tags?: string[]
  creator?: { id: number } | string
  assignee?: { id: number } | string
  endDate?: string
}

export const getTasks = async (): Promise<Task[]> => {
  try {
    const response = await api.get('/tasks')
    return response.data.map(mapBackendToTask)
  } catch (error) {
    console.error('Erro ao buscar tarefas:', error)
    throw error
  }
}

export const createTask = async (data: CreateTaskType): Promise<Task> => {
  try {
    const taskData = {
      title: data.title,
      description: data.description,
      priority: mapPriorityToBackend(data.priority),
      status: mapStatusToBackend(data.status),
      tags: data.tags,
      creator: { id: parseInt(data.creator) },
      assignee: { id: parseInt(data.assignee) },
      endDate: data.endDate
    }

    const response = await api.post('/tasks', taskData)
    console.log('Tarefa criada com sucesso:', response.data)
    return mapBackendToTask(response.data)
  } catch (error) {
    console.error('Erro ao criar tarefa:', error)
    throw error
  }
}

export const updateTask = async (
  id: string,
  data: Partial<Task>
): Promise<Task> => {
  try {
    const taskData: TaskUpdateData = { ...data }

    if (data.creator) {
      taskData.creator = { id: parseInt(data.creator) }
    }
    if (data.assignee) {
      taskData.assignee = { id: parseInt(data.assignee) }
    }

    if (data.status) {
      taskData.status = mapStatusToBackend(data.status)
    }

    if (data.priority) {
      taskData.priority = mapPriorityToBackend(data.priority)
    }

    const response = await api.put(`/tasks/${id}`, taskData)
    console.log('Tarefa atualizada com sucesso:', response.data)
    return mapBackendToTask(response.data)
  } catch (error) {
    console.error(`Erro ao atualizar tarefa com id: ${id}:`, error)
    throw error
  }
}

export const deleteTask = async (id: string): Promise<void> => {
  try {
    await api.delete(`/tasks/${id}`)
    console.log(`Tarefa ${id} removida com sucesso`)
  } catch (error) {
    console.error(`Erro ao excluir tarefa com id ${id}:`, error)
    throw error
  }
}

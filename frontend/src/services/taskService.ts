import { api } from './api';
import type { Task, Status, Priority } from '@/types/Task';
import type { User } from '@/types/User';
import { mockConfig } from './__mocks__/mockConfig';
import {
  getMockTasks,
  getMockTaskById,
  getMockTasksByAssignee,
  createMockTask,
  updateMockTask,
  deleteMockTask as mockDeleteTask
} from './__mocks__/taskMocks';

export interface TaskWithUser extends Task {
  user?: User;
  creatorUser?: User;
}

// --- Funções de Utilidade ---

// Simula atraso de rede para mocks
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Converte status do backend (ENUM como string: PENDING) para frontend (string: todo)
const mapStatusFromBackend = (backendStatus: string): Status => {
  const statusMap: Record<string, Status> = {
    'PENDING': 'todo',
    'IN_PROGRESS': 'in-progress',
    'COMPLETED': 'done',
    'REVIEW': 'review'
  };
  return statusMap[backendStatus] || 'todo';
};

// Converte status do frontend (string: todo) para backend (string: PENDING)
const mapStatusToBackend = (frontendStatus: Status): string => {
  const statusMap: Record<Status, string> = {
    'todo': 'PENDING',
    'in-progress': 'IN_PROGRESS',
    'done': 'COMPLETED',
    'review': 'REVIEW'
  };
  return statusMap[frontendStatus] || 'PENDING';
};

// Converte prioridade do backend (String: "HIGH") para frontend (Priority: 'high')
const mapPriorityFromBackend = (backendPriority: string): Priority => {
  const priorityMap: Record<string, Priority> = {
    'LOW': 'low',
    'MEDIUM': 'medium',
    'HIGH': 'high'
  };
  return priorityMap[backendPriority] || 'low';
};

// Converte prioridade do frontend (Priority: 'low') para backend (String: "LOW")
const mapPriorityToBackend = (frontendPriority: Priority): string => {
  const priorityMap: Record<Priority, string> = {
    'low': 'LOW',
    'medium': 'MEDIUM',
    'high': 'HIGH'
  };
  return priorityMap[frontendPriority] || 'LOW';
};

// --- Funções de Mapeamento Interno (JSON da API para Task do Frontend) ---

const mapApiResponseToTask = (apiTask: any): Task => {
  return {
    id: apiTask.id.toString(),
    title: apiTask.title,
    description: apiTask.description,
    status: mapStatusFromBackend(apiTask.status),
    priority: mapPriorityFromBackend(apiTask.priority),
    assignee: apiTask.assignee?.id?.toString() || '',
    creator: apiTask.creator?.id?.toString() || '',
    tags: apiTask.tags || [],
    createdAt: new Date(apiTask.createdAt),
    updatedAt: new Date(apiTask.updatedAt),
    endDate: apiTask.endDate,
  };
};

// --- Funções de Requisições da API de Tarefas ---

// GET todas as tarefas (LIST-TASKS)
export const getTasks = async (): Promise<Task[]> => {
  if (mockConfig.useMockData) {
    await delay(mockConfig.apiDelay);
    return getMockTasks();
  }

  try {
    const response = await api.get('/tasks');
    if (!Array.isArray(response.data)) {
      
      return [];
    }
    return response.data.map(mapApiResponseToTask);
  } catch (error) {
    
    return [];
  }
};

// GET tarefa por ID (GET-TASK-BY-ID)
export const getTaskById = async (id: string): Promise<Task | undefined> => {
  if (mockConfig.useMockData) {
    await delay(mockConfig.apiDelay);
    const mockTask = getMockTaskById(id);
    return mockTask;
  }

  try {
    const response = await api.get(`/tasks/${id}`);
    return mapApiResponseToTask(response.data);
  } catch (error: any) {
    
    if (error.response && error.response.status === 404) {
      return undefined;
    }
    throw error;
  }
};

// GET tarefas por pessoa responsável (GET-TASKS-BY-ASSIGNEE)
export const getTasksByAssignee = async (assigneeId: string): Promise<Task[]> => {
  if (mockConfig.useMockData) {
    await delay(mockConfig.apiDelay);
    return getMockTasksByAssignee(assigneeId);
  }

  try {
    const response = await api.get(`/tasks/user/${assigneeId}`);
    if (!Array.isArray(response.data)) {
      
      return [];
    }
    return response.data.map(mapApiResponseToTask);
  } catch (error) {
    
    return [];
  }
};

// Criar uma nova tarefa (CREATE-TASK)
export const createTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
  if (mockConfig.useMockData) {
    await delay(mockConfig.apiDelay);
    return createMockTask(taskData);
  }

  try {
    // Validações básicas
    if (!taskData.creator || !taskData.assignee) {
      throw new Error('Creator e Assignee são obrigatórios');
    }
    
    if (!taskData.endDate) {
      throw new Error('Data de término é obrigatória');
    }

    const backendTaskData = {
      title: taskData.title,
      description: taskData.description,
      creatorId: parseInt(taskData.creator),
      assigneeId: parseInt(taskData.assignee),
      tags: taskData.tags || [],
      priority: mapPriorityToBackend(taskData.priority),
      status: mapStatusToBackend(taskData.status),
      endDate: taskData.endDate,
    };
    
    const response = await api.post('/tasks', backendTaskData);
    return mapApiResponseToTask(response.data);
  } catch (error) {
    
    throw error;
  }
};

// Atualizar uma tarefa existente (UPDATE-TASK)
export const updateTask = async (id: string, taskData: Partial<Task>): Promise<Task> => {
  if (mockConfig.useMockData) {
    await delay(mockConfig.apiDelay);
    const updatedMockTask = updateMockTask(id, taskData);
    if (!updatedMockTask) throw new Error('Tarefa não encontrada (mock)');
    return updatedMockTask;
  }

  try {
    const backendTaskData: any = {};
    
    if (taskData.title !== undefined) backendTaskData.title = taskData.title;
    if (taskData.description !== undefined) backendTaskData.description = taskData.description;
    if (taskData.tags !== undefined) backendTaskData.tags = taskData.tags;
    
    if (taskData.status !== undefined) backendTaskData.status = mapStatusToBackend(taskData.status);
    if (taskData.priority !== undefined) backendTaskData.priority = mapPriorityToBackend(taskData.priority);

    if (taskData.creator !== undefined) {
      backendTaskData.creatorId = taskData.creator ? parseInt(taskData.creator) : null;
    }
    if (taskData.assignee !== undefined) {
      backendTaskData.assigneeId = taskData.assignee ? parseInt(taskData.assignee) : null;
    }
    if (taskData.endDate !== undefined) backendTaskData.endDate = taskData.endDate;
    
    const response = await api.put(`/tasks/${id}`, backendTaskData);
    return mapApiResponseToTask(response.data);
  } catch (error) {
    
    throw error;
  }
};

// Excluir uma tarefa (REMOVE-TASK)
export const deleteTask = async (id: string): Promise<void> => {
  if (mockConfig.useMockData) {
    await delay(mockConfig.apiDelay);
    mockDeleteTask(id);
    return;
  }

  try {
    await api.delete(`/tasks/${id}`);
  } catch (error) {
    
    throw error;
  }
};

// Atualizar status da tarefa (UPDATE-TASK-STATUS)
export const updateTaskStatus = async (id: string, status: Status): Promise<Task> => {
  if (mockConfig.useMockData) {
    await delay(mockConfig.apiDelay);
    const updatedMockTask = updateMockTask(id, { status });
    if (!updatedMockTask) throw new Error('Tarefa não encontrada para atualização de status (mock)');
    return updatedMockTask;
  }

  try {
    const backendStatus = mapStatusToBackend(status);
    const response = await api.put(`/tasks/${id}/status`, { status: backendStatus });
    return mapApiResponseToTask(response.data);
  } catch (error) {
    
    throw error;
  }
};

// Buscar tarefas por tag (SEARCH-TASKS-BY-TAG)
export const searchTasksByTag = async (tag: string): Promise<Task[]> => {
  if (mockConfig.useMockData) {
    await delay(mockConfig.apiDelay);
    const allTasks = getMockTasks();
    return allTasks.filter(task => task.tags.includes(tag));
  }

  try {
    const response = await api.get(`/tasks/search?tag=${encodeURIComponent(tag)}`);
    if (!Array.isArray(response.data)) {
      
      return [];
    }
    return response.data.map(mapApiResponseToTask);
  } catch (error) {
    
    return [];
  }
};

// Obter tarefas com dados de usuário (JOIN-TASKS-USERS)
export const getTasksWithUsers = async (): Promise<TaskWithUser[]> => {
  if (mockConfig.useMockData) {
    await delay(mockConfig.apiDelay);
    const mockTasks = getMockTasks();
    const mockUsers = (await import('./__mocks__/userMocks')).getMockUsers();
    
    return mockTasks.map(task => {
      const user = mockUsers.find(u => u.id === task.assignee);
      const creatorUser = mockUsers.find(u => u.id === task.creator);
      return { ...task, user, creatorUser };
    });
  }

  try {
    const [tasksResponse, usersResponse] = await Promise.all([
      api.get('/tasks'),
      api.get('/users')
    ]);

    if (!Array.isArray(tasksResponse.data) || !Array.isArray(usersResponse.data)) {
      
      return [];
    }

    const tasks: Task[] = tasksResponse.data.map(mapApiResponseToTask);

    const users: User[] = usersResponse.data.map((user: any) => ({
        id: user.id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        name: `${user.firstName} ${user.lastName}`,
        birthDate: user.birthDate,
    }));
    
    return tasks.map(task => {
      const user = users.find(u => u.id === task.assignee);
      const creatorUser = users.find(u => u.id === task.creator);
      return { ...task, user, creatorUser };
    });
  } catch (error) {
    
    throw error;
  }
};
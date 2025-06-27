// src/__mocks__/taskMocks.ts

import type { Task, Status, Priority } from '@/types/Task';
import type { User } from '../../types/User'; // Ajuste o caminho relativo se necessário (ex: '../../types/User')

import { getMockUsers } from './userMocks';

let tasksInMemory: Task[] = [
  {
    id: '1',
    title: 'Analisar Código COBOL Legado',
    description: 'Revisar a estrutura do programa de contabilidade principal (CONTABIL.CBL) para identificar módulos de dívida técnica.',
    status: 'todo', // Corrigido para um Status válido
    priority: 'high',
    assignee: '1',
    creator: '1',
    tags: ['COBOL', 'legado', 'análise', 'manutenção'],
    createdAt: new Date('2025-06-20T10:00:00Z'),
    updatedAt: new Date('2025-06-20T10:00:00Z'),
  },
  {
    id: '2',
    title: 'Migrar Dados para o Novo Sistema Relacional',
    description: 'Extrair dados do VSAM para o SQL Server. Foco na tabela de clientes.',
    status: 'in-progress', // Corrigido para um Status válido
    priority: 'high',
    assignee: '2',
    creator: '1',
    tags: ['migração', 'banco de dados', 'VSAM', 'SQL'],
    createdAt: new Date('2025-06-21T11:00:00Z'),
    updatedAt: new Date('2025-06-24T09:00:00Z'),
  },
  {
    id: '3',
    title: 'Otimizar Rotina de Batch Noturno',
    description: 'Investigar gargalos de performance na rotina de processamento de final de dia e aplicar otimizações.',
    status: 'todo', // <<< Corrigido AQUI: Mudei para 'todo' ou outro Status válido
    priority: 'medium',
    assignee: '3',
    creator: '2',
    tags: ['batch', 'performance', 'mainframe'],
    createdAt: new Date('2025-06-18T14:30:00Z'),
    updatedAt: new Date('2025-06-23T18:00:00Z'),
  },
  {
    id: '4',
    title: 'Documentar Procedimentos de Deploy em JCL',
    description: 'Criar documentação detalhada dos scripts JCL para o deploy de novas versões do sistema de folha de pagamento.',
    status: 'done', // Corrigido para um Status válido
    priority: 'low',
    assignee: '4',
    creator: '3',
    tags: ['documentação', 'deploy', 'JCL'],
    createdAt: new Date('2025-06-22T16:00:00Z'),
    updatedAt: new Date('2025-06-22T16:00:00Z'),
  },
  {
    id: '5',
    title: 'Treinamento em ZOS para Novos Estagiários',
    description: 'Desenvolver e ministrar módulo de treinamento básico sobre o sistema operacional ZOS para a nova turma de estagiários.',
    status: 'todo', // Corrigido para um Status válido
    priority: 'medium',
    assignee: '5',
    creator: '4',
    tags: ['treinamento', 'ZOS', 'estágio'],
    createdAt: new Date('2025-06-23T09:00:00Z'),
    updatedAt: new Date('2025-06-23T09:00:00Z'),
  },
  {
    id: '6',
    title: 'Auditar Segurança do CICS',
    description: 'Realizar auditoria de configurações de segurança do ambiente CICS para conformidade com novas políticas da empresa.',
    status: 'review', // Corrigido para um Status válido
    priority: 'high',
    assignee: '1',
    creator: '5',
    tags: ['segurança', 'CICS', 'auditoria'],
    createdAt: new Date('2025-06-24T09:00:00Z'),
    updatedAt: new Date('2025-06-24T09:00:00Z'),
  }
];

let nextTaskId = tasksInMemory.length > 0 ? Math.max(...tasksInMemory.map(t => parseInt(t.id))) + 1 : 1;

export const getMockTasks = (): Task[] => {
  return [...tasksInMemory];
};

export const getMockTaskById = (id: string): Task | undefined => {
  return tasksInMemory.find(task => task.id === id);
};

export const getMockTasksByAssignee = (assigneeId: string): Task[] => {
  return tasksInMemory.filter(task => task.assignee === assigneeId);
};

export const createMockTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task => {
  const newTask: Task = {
    id: (nextTaskId++).toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...taskData,
    status: taskData.status,
    priority: taskData.priority,
    creator: taskData.creator || 'mock-creator-id',
    assignee: taskData.assignee || 'mock-assignee-id'
  };
  tasksInMemory.push(newTask);
  return newTask;
};

export const updateMockTask = (id: string, taskData: Partial<Task>): Task | undefined => {
  const taskIndex = tasksInMemory.findIndex(task => task.id === id);
  if (taskIndex === -1) {
    return undefined;
  }

  const updatedTask = {
    ...tasksInMemory[taskIndex],
    ...taskData,
    updatedAt: new Date()
  };

  if (taskData.status !== undefined) updatedTask.status = taskData.status;
  if (taskData.priority !== undefined) updatedTask.priority = taskData.priority;
  if (taskData.assignee !== undefined) updatedTask.assignee = taskData.assignee;
  if (taskData.creator !== undefined) updatedTask.creator = taskData.creator;

  tasksInMemory[taskIndex] = updatedTask;
  return updatedTask;
};

export const deleteMockTask = (id: string): boolean => {
  const initialLength = tasksInMemory.length;
  tasksInMemory = tasksInMemory.filter(task => task.id !== id);
  return tasksInMemory.length < initialLength;
};

export const getMockTasksWithUsers = (): (Task & { user?: User; creatorUser?: User })[] => {
  const allTasks = getMockTasks();
  const allUsers = getMockUsers();

  return allTasks.map(task => {
    const assigneeUser = allUsers.find(user => user.id === task.assignee);
    const creatorUser = allUsers.find(user => user.id === task.creator);

    return {
      ...task,
      user: assigneeUser,
      creatorUser: creatorUser
    };
  });
};
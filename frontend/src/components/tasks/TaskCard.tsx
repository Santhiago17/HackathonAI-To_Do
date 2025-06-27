// src/components/tasks/TaskCard.tsx
import React from 'react';
import type { Task, Priority, Status } from '@/types/Task';
import type { User } from "@/services/userService";
import { Button } from '@/components/ui/button';

interface TaskCardProps {
  task: Task;
  assigneeUser?: User; // O usuário responsável pela tarefa
  creatorUser?: User; // O usuário que criou a tarefa (assumindo que task.creator é o ID)
  onDelete: (taskId: string) => void;
  // onEdit: (taskId: string) => void; // Adicionar se você tiver um botão de edição
}

// Helper para mapear prioridade para cor (ajustado para minúsculas)
const getPriorityColor = (priority: Priority): string => {
  switch (priority) {
    case 'high': return 'bg-red-500 text-white';
    case 'medium': return 'bg-yellow-500 text-gray-900';
    case 'low': return 'bg-green-500 text-white';
    default: return 'bg-gray-200 text-gray-800'; // Fallback genérico, embora o tipo Priority garanta que não haja 'default'
  }
};

// Helper para mapear status para cor (sem alterações, já usava o tipo Status)
const getStatusColor = (status: Status): string => {
  switch (status) {
    case 'todo': return 'bg-blue-500 text-white';
    case 'in-progress': return 'bg-orange-500 text-white';
    case 'done': return 'bg-green-600 text-white';
    case 'review': return 'bg-purple-500 text-white';
    default: return 'bg-gray-400 text-white';
  }
};


export const TaskCard: React.FC<TaskCardProps> = ({ task, assigneeUser, creatorUser, onDelete }) => {
  const formattedCreatedAt = task.createdAt.toLocaleDateString('pt-BR');
  const formattedUpdatedAt = task.updatedAt.toLocaleDateString('pt-BR');

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 border border-gray-200">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-gray-800">{task.title}</h3>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(task.priority)}`}>
            Prioridade: {task.priority.toUpperCase()} {/* Exibir em maiúsculas */}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(task.status)}`}>
            Status: {task.status.toUpperCase()} {/* Exibir em maiúsculas */}
          </span>
        </div>
      </div>

      <p className="text-gray-700 mb-4">{task.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
        <div>
          <strong>Responsável:</strong> {assigneeUser ? assigneeUser.name : 'N/A'}
        </div>
        <div>
          <strong>Criador:</strong> {creatorUser ? creatorUser.name : 'N/A'}
        </div>
        <div>
          <strong>Tags:</strong> {task.tags && task.tags.length > 0 ? task.tags.map(tag => (
            <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mr-1 mb-1">
                {tag}
            </span>
          )) : 'N/A'}
        </div>
        <div>
          <strong>Criado em:</strong> {formattedCreatedAt}
        </div>
        <div>
          <strong>Última atualização:</strong> {formattedUpdatedAt}
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        {/* <Button variant="outline" size="sm" onClick={() => onEdit(task.id)}>Editar</Button> */}
        <Button variant="destructive" size="sm" onClick={() => onDelete(task.id)}>Excluir</Button>
      </div>
    </div>
  );
};
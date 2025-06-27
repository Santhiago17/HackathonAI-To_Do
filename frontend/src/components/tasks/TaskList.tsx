import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import type { Task } from "@/types/Task";
import type { User } from "@/services/userService";

// Helper function to get priority class
const getPriorityClass = (priority: string): string => {
  const classes = {
    'high': 'text-red-600 font-bold',
    'medium': 'text-amber-600',
    'low': 'text-green-600',
  };
  return classes[priority as keyof typeof classes] || '';
};

// Helper function to get status class
const getStatusClass = (status: string): string => {
  const classes = {
    'todo': 'bg-gray-200 text-gray-800',
    'in-progress': 'bg-blue-200 text-blue-800',
    'review': 'bg-amber-200 text-amber-800',
    'done': 'bg-green-200 text-green-800',
  };
  return classes[status as keyof typeof classes] || '';
};

interface TaskListProps {
  tasks: Task[];
  users: User[];
  isLoading: boolean;
  error: Error | null;
  onDelete?: (taskId: string) => void;
}

export function TaskList({ tasks, users, isLoading, error, onDelete }: TaskListProps) {
  if (isLoading) {
    return <p>Carregando tarefas...</p>;
  }

  if (error) {
    return <p>Erro ao carregar tarefas: {error.message || JSON.stringify(error)}</p>;
  }

  if (!tasks || tasks.length === 0) {
    return <p>Nenhuma tarefa encontrada.</p>;
  }

  // Function to get user name by ID
  const getUserName = (userId: string): string => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Usuário desconhecido';
  };

  // Sort tasks by user name alphabetically
  const sortedTasks = [...tasks].sort((a, b) => {
    const userNameA = getUserName(a.assignee).toLowerCase();
    const userNameB = getUserName(b.assignee).toLowerCase();
    return userNameA.localeCompare(userNameB);
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Título</TableHead>
          <TableHead>Responsável</TableHead>
          <TableHead>Prioridade</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Tags</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedTasks.map((task) => (
          <TableRow key={task.id}>
            <TableCell className="font-medium">{task.id}</TableCell>
            <TableCell>{task.title}</TableCell>
            <TableCell>{getUserName(task.assignee)}</TableCell>
            <TableCell className={getPriorityClass(task.priority)}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </TableCell>
            <TableCell>
              <span className={`px-2 py-1 rounded text-xs ${getStatusClass(task.status)}`}>
                {task.status.replace('-', ' ').toUpperCase()}
              </span>
            </TableCell>
            <TableCell>
              {task.tags && task.tags.length > 0 ? task.tags.join(', ') : '-'}
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button asChild variant="outline" size="sm">
                <Link to={`/tasks/${task.id}/edit`}>Editar</Link>
              </Button>
              {onDelete && (
                <Button variant="destructive" size="sm" onClick={() => onDelete(task.id)}>
                  Excluir
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

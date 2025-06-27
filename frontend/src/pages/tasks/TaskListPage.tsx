import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TaskList } from '@/components/tasks/TaskList';
import { Button } from '@/components/ui/button';
import { getTasks, deleteTask } from '@/services/taskService';
import { getUsers, type User } from '@/services/userService';
import type { Task } from '@/types/Task';

export function TaskListPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [tasksData, usersData] = await Promise.all([
        getTasks(),
        getUsers()
      ]);
      setTasks(tasksData);
      setUsers(usersData);
    } catch (err) {
      setError(err as Error);
      console.error("Falha ao buscar dados:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta tarefa?")) {
      try {
        await deleteTask(taskId);
        console.log("Tarefa excluída com sucesso");
        fetchData(); // Recarregar a lista
      } catch (err) {
        setError(err as Error);
        console.error("Falha ao excluir tarefa:", err);
      }
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Lista de Tarefas</h1>
      </div>
      <div className="mb-6">
      </div>
      <TaskList
        tasks={tasks}
        users={users}
        isLoading={isLoading}
        error={error}
        onDelete={handleDeleteTask}
      />
    </div>
  );
}

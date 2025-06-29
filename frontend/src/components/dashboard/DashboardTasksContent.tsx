import type { Task } from "@/types/Task"

export function DashboardTasksContent({
  tasks,
  loading,
}: {
  tasks: Task[]
  loading: boolean
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        <p className="ml-2 text-sm text-gray-500">Carregando tarefas...</p>
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-gray-500">Nenhuma tarefa encontrada</p>
        <p className="text-xs text-gray-400 mt-1">
          Clique no botão acima para criar uma nova tarefa
        </p>
      </div>
    )
  }

  return (
    <ul className="space-y-2 max-h-64 overflow-y-auto">
      {tasks.map((task) => (
        <li
          key={task.id}
          className="flex items-start space-x-1 py-1 px-1 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <label
            htmlFor={`task-${task.id}`}
            className="text-sm text-gray-300 cursor-pointer flex-1"
          >
            {task.title}
          </label>
        </li>
      ))}
    </ul>
  )
}

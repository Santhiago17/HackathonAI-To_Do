import type { Status, Task } from "@/types/Task"

export const getTasksByStatus = (tasks: Task[], status: Status) => {
  return tasks
    .filter((task) => task.status === status)
    .sort((a, b) => {
      if (!a.endDate && !b.endDate) return 0
      if (!a.endDate) return 1
      if (!b.endDate) return -1
      return new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
    })
}

export const getTaskStats = (
  tasks: Task[],
  isOverdue: (endDate?: string) => boolean
) => {
  const total = tasks.length
  const completed = tasks.filter((t) => t.status === "done").length
  const inProgress = tasks.filter((t) => t.status === "in-progress").length
  const overdue = tasks.filter(
    (t) => isOverdue(t.endDate) && t.status !== "done"
  ).length

  return { total, completed, inProgress, overdue }
}

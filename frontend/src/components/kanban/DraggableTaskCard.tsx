import { Card } from "@/components/ui/card"
import type { Task, Status } from "@/types/Task"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Calendar, User as UserIcon, Tag } from "lucide-react"

interface DraggableTaskCardProps {
  task: Task
  status: Status
  onClick: (task: Task) => void
  getPriorityColor: (priority: string) => string
  formatDate: (dateString?: string) => string
  isOverdue: (endDate?: string) => boolean
  getUserName: (userId: string) => string
}

export function DraggableTaskCard({
  task,
  status,
  onClick,
  getPriorityColor,
  formatDate,
  isOverdue,
  getUserName,
}: DraggableTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`p-3 sm:p-4 lg:p-5 border-l-4 hover:shadow-lg transition-all duration-200 cursor-pointer bg-[#252525] border-gray-600 rounded-lg ${
        isOverdue(task.endDate) && status !== "done"
          ? "border-l-red-400 bg-red-900/20 hover:bg-red-900/30"
          : "border-l-gray-500 hover:border-l-blue-400 hover:bg-gray-700/50"
      } ${isDragging ? "z-50" : ""}`}
      onClick={() => !isDragging && onClick(task)}
    >
      <div className="space-y-2 sm:space-y-3">
        <div className="flex items-start justify-between gap-2 sm:gap-3">
          <h4
            className="font-medium text-white text-sm sm:text-base lg:text-lg line-clamp-2 flex-1 pr-1 sm:pr-2"
            title={task.title}
          >
            {task.title}
          </h4>
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <span
              className={`px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-full whitespace-nowrap ${getPriorityColor(
                task.priority
              )}`}
            >
              {task.priority === "low"
                ? "Baixa"
                : task.priority === "medium"
                ? "Média"
                : "Alta"}
            </span>
            <div
              {...listeners}
              className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-gray-600 rounded cursor-grab active:cursor-grabbing flex-shrink-0"
              title="Arrastar para mover"
            >
              <div className="grid grid-cols-2 gap-1 sm:gap-1.5">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full"></div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full"></div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full"></div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-gray-300 text-xs sm:text-sm lg:text-base line-clamp-2">
          {task.description}
        </p>

        <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-x-4 md:space-y-0 text-xs sm:text-sm lg:text-base text-gray-400">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span
              className={`truncate ${
                isOverdue(task.endDate) && status !== "done"
                  ? "text-red-400 font-medium"
                  : ""
              }`}
            >
              {formatDate(task.endDate)}
            </span>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2 min-w-0 flex-1">
            <UserIcon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span
              className="truncate max-w-full"
              title={getUserName(task.assignee)}
            >
              {getUserName(task.assignee)}
            </span>
          </div>
        </div>

        {task.tags && task.tags.length > 0 && (
          <div className="flex items-start space-x-1 sm:space-x-2">
            <Tag className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0 mt-0.5" />
            <div className="flex flex-wrap gap-1 min-w-0 flex-1">
              {task.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 sm:py-1 text-xs sm:text-sm bg-gray-700 text-gray-300 rounded truncate max-w-full"
                >
                  {tag}
                </span>
              ))}
              {task.tags.length > 2 && (
                <span className="px-2 py-0.5 sm:py-1 text-xs sm:text-sm bg-gray-700 text-gray-300 rounded flex-shrink-0">
                  +{task.tags.length - 2}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

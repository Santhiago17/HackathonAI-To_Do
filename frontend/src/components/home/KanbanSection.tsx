import { useState } from "react"
import {
  DndContext,
  closestCenter,
  pointerWithin,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { DraggableTaskCard, DroppableColumn } from "@/components/kanban"
import { updateTaskStatus } from "@/services/taskService"
import type { Task, Status } from "@/types/Task"
import type { KanbanBoardProps, KanbanHelpers } from "@/components/kanban/types"
import { getTasksByStatus } from "@/lib/utils/taskUtils"

interface KanbanSectionProps {
  tasks: Task[]
  statusTypes: Status[]
  getStatusConfig: KanbanBoardProps["getStatusConfig"]
  onTaskClick: (task: Task) => void
  onTaskUpdated: () => Promise<void>
  getPriorityColor: KanbanHelpers["getPriorityColor"]
  formatDate: KanbanHelpers["formatDate"]
  isOverdue: KanbanHelpers["isOverdue"]
  getUserName: KanbanHelpers["getUserName"]
}

export function KanbanSection({
  tasks,
  statusTypes,
  getStatusConfig,
  onTaskClick,
  onTaskUpdated,
  getPriorityColor,
  formatDate,
  isOverdue,
  getUserName,
}: KanbanSectionProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [localTasks, setLocalTasks] = useState(tasks)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    setActiveId(active.id as string)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    const targetStatus = statusTypes.find((status) => overId.includes(status))

    if (targetStatus) {
      const taskToUpdate = localTasks.find((task) => task.id === activeId)
      if (taskToUpdate && taskToUpdate.status !== targetStatus) {
        setLocalTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === activeId ? { ...task, status: targetStatus } : task
          )
        )

        try {
          await updateTaskStatus(activeId, targetStatus)
          console.log(`Task ${activeId} atualizada para status ${targetStatus}`)
          await onTaskUpdated()
        } catch (error) {
          console.error("Erro ao atualizar status da task:", error)
          await onTaskUpdated()
        }
      }
    }
  }

  if (tasks !== localTasks) {
    setLocalTasks(tasks)
  }

  return (
    <div className="flex-1 overflow-hidden">
      <DndContext
        sensors={sensors}
        collisionDetection={(args) => {
          const pointerIntersections = pointerWithin(args)
          if (pointerIntersections.length > 0) {
            return pointerIntersections
          }
          return closestCenter(args)
        }}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 h-full">
          {statusTypes.map((status) => {
            const statusConfig = getStatusConfig(status)
            const statusTasks = getTasksByStatus(tasks, status)
            const StatusIcon = statusConfig.icon

            return (
              <DroppableColumn
                key={status}
                id={`droppable-${status}`}
                statusConfig={statusConfig}
              >
                <div className="p-4 lg:p-6 space-y-3 h-full overflow-y-auto kanban-column-scroll">
                  {statusTasks.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="flex flex-col items-center space-y-3">
                        <StatusIcon
                          className={`h-12 w-12 ${statusConfig.color} opacity-30`}
                        />
                        <p className="text-gray-400 text-base">
                          Nenhuma tarefa
                        </p>
                        <p className="text-gray-500 text-sm">
                          Arraste uma tarefa aqui
                        </p>
                      </div>
                    </div>
                  ) : (
                    <SortableContext
                      items={statusTasks.map((task) => task.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {statusTasks.map((task) => (
                        <DraggableTaskCard
                          key={task.id}
                          task={task}
                          status={status}
                          onClick={onTaskClick}
                          getPriorityColor={getPriorityColor}
                          formatDate={formatDate}
                          isOverdue={isOverdue}
                          getUserName={getUserName}
                        />
                      ))}
                    </SortableContext>
                  )}
                </div>
              </DroppableColumn>
            )
          })}
        </div>

        <DragOverlay>
          {activeId ? (
            <DraggableTaskCard
              task={localTasks.find((task) => task.id === activeId)!}
              status={
                localTasks.find((task) => task.id === activeId)?.status ||
                "todo"
              }
              onClick={() => {}}
              getPriorityColor={getPriorityColor}
              formatDate={formatDate}
              isOverdue={isOverdue}
              getUserName={getUserName}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}

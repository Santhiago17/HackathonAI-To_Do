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
import { DraggableTaskCard, DroppableColumn } from "./"
import type { Task, Status } from "@/types/Task"
import type { User } from "@/types/User"
import type { StatusConfig } from "./types"

interface KanbanBoardProps {
  tasks: Task[]
  users: User[]
  activeId: string | null
  statusTypes: Status[]
  getStatusConfig: (status: Status) => StatusConfig
  getTasksByStatus: (status: Status) => Task[]
  onTaskClick: (task: Task) => void
  onDragStart: (event: DragStartEvent) => void
  onDragEnd: (event: DragEndEvent) => void
  getPriorityColor: (priority: string) => string
  formatDate: (dateString?: string) => string
  isOverdue: (endDate?: string) => boolean
  getUserName: (userId: string) => string
}

export function KanbanBoard({
  tasks,
  activeId,
  statusTypes,
  getStatusConfig,
  getTasksByStatus,
  onTaskClick,
  onDragStart,
  onDragEnd,
  getPriorityColor,
  formatDate,
  isOverdue,
  getUserName,
}: KanbanBoardProps) {
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

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={(args) => {
        const pointerIntersections = pointerWithin(args)
        if (pointerIntersections.length > 0) {
          return pointerIntersections
        }

        return closestCenter(args)
      }}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 h-full">
        {statusTypes.map((status) => {
          const statusConfig = getStatusConfig(status)
          const statusTasks = getTasksByStatus(status)
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
                      <p className="text-gray-400 text-base">Nenhuma tarefa</p>
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
            task={tasks.find((task) => task.id === activeId)!}
            status={
              tasks.find((task) => task.id === activeId)?.status || "todo"
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
  )
}

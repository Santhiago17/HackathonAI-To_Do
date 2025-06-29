import { useDroppable } from '@dnd-kit/core'

interface StatusConfig {
  title: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  bgColor: string
  borderColor: string
}

interface DroppableColumnProps {
  id: string
  statusConfig: StatusConfig
  children: React.ReactNode
}

export function DroppableColumn({
  id,
  statusConfig,
  children
}: DroppableColumnProps) {
  const { isOver, setNodeRef } = useDroppable({
    id
  })

  const StatusIcon = statusConfig.icon

  return (
    <div
      ref={setNodeRef}
      className={`bg-[#252525] rounded-xl shadow-lg border transition-all duration-200 flex flex-col h-full max-h-full overflow-hidden relative ${
        isOver
          ? 'ring-2 ring-blue-400 ring-opacity-75 bg-blue-900/20 border-blue-400 shadow-blue-400/20 shadow-xl scale-[1.02]'
          : 'border-gray-600 hover:border-gray-500'
      }`}
    >
      {/* Área de drop expandida - invisível mas funcional com padding extra */}
      <div className="absolute inset-0 z-10 pointer-events-none -m-4" />

      <div
        className={`p-4 lg:p-5 border-b ${statusConfig.borderColor} ${statusConfig.bgColor} relative z-20`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <StatusIcon
              className={`h-5 w-5 lg:h-6 lg:w-6 ${statusConfig.color}`}
            />
            <h3 className="font-semibold text-white text-base lg:text-lg">
              {statusConfig.title}
            </h3>
          </div>
        </div>
      </div>

      {/* Container do conteúdo com área de drop expandida */}
      <div className="flex-1 relative z-20 overflow-hidden">{children}</div>
    </div>
  )
}

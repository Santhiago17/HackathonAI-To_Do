import { useState, useEffect } from 'react';
import { getTasks, updateTaskStatus } from '@/services/taskService';
import { getUsers } from '@/services/userService';
import type { Task, Status } from '@/types/Task';
import type { User } from '@/types/User';
import { Card } from '@/components/ui/card';
import { Calendar, User as UserIcon, Tag, CheckCircle, AlertCircle, Circle, PlayCircle } from 'lucide-react';
import { EditTaskModal } from '@/components/tasks/EditTaskModal';
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
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDroppable } from '@dnd-kit/core';
import '@/styles/dashboard.css';

// Componente para card arrastável
function DraggableTaskCard({ 
  task, 
  status, 
  onClick, 
  getPriorityColor, 
  formatDate, 
  isOverdue, 
  getUserName 
}: {
  task: Task;
  status: Status;
  onClick: (task: Task) => void;
  getPriorityColor: (priority: string) => string;
  formatDate: (dateString?: string) => string;
  isOverdue: (endDate?: string) => boolean;
  getUserName: (userId: string) => string;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`p-3 lg:p-4 border-l-4 hover:shadow-md transition-all duration-200 cursor-pointer bg-[#252525] border-gray-600 rounded-lg ${
        isOverdue(task.endDate) && status !== 'done'
          ? 'border-l-red-400 bg-red-900/20 hover:bg-red-900/30'
          : 'border-l-gray-500 hover:border-l-blue-400 hover:bg-gray-700/50'
      } ${isDragging ? 'z-50' : ''}`}
      onClick={() => !isDragging && onClick(task)}
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-medium text-white text-sm line-clamp-2 flex-1 pr-2">
            {task.title}
          </h4>
          <div className="flex items-center gap-1 flex-shrink-0">
            <span className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${getPriorityColor(task.priority)}`}>
              {task.priority === 'low' ? 'Baixa' : task.priority === 'medium' ? 'Média' : 'Alta'}
            </span>
            <div 
              {...listeners}
              className="w-10 h-10 flex items-center justify-center hover:bg-gray-600 rounded cursor-grab active:cursor-grabbing flex-shrink-0"
              title="Arrastar para mover"
            >
              <div className="grid grid-cols-2 gap-1.5">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
        
        <p className="text-gray-300 text-xs line-clamp-2">
          {task.description}
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 text-xs text-gray-400">
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3 flex-shrink-0" />
            <span className={isOverdue(task.endDate) && status !== 'done' ? 'text-red-400 font-medium' : ''}>
              {formatDate(task.endDate)}
            </span>
          </div>
          
          <div className="flex items-center space-x-1">
            <UserIcon className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">
              {getUserName(task.assignee)}
            </span>
          </div>
        </div>

        {task.tags && task.tags.length > 0 && (
          <div className="flex items-center space-x-1">
            <Tag className="h-3 w-3 text-gray-500 flex-shrink-0" />
            <div className="flex flex-wrap gap-1">
              {task.tags.slice(0, 2).map((tag, index) => (
                <span key={index} className="px-1 py-0.5 text-xs bg-gray-700 text-gray-300 rounded truncate">
                  {tag}
                </span>
              ))}
              {task.tags.length > 2 && (
                <span className="px-1 py-0.5 text-xs bg-gray-700 text-gray-300 rounded">
                  +{task.tags.length - 2}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

// Componente para coluna droppable
function DroppableColumn({ 
  id, 
  statusConfig, 
  children 
}: {
  id: string;
  statusConfig: any;
  children: React.ReactNode;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  const StatusIcon = statusConfig.icon;

  return (
    <div 
      ref={setNodeRef}
      className={`bg-[#1a1a1a] rounded-xl shadow-sm border transition-all duration-200 flex flex-col h-full max-h-full overflow-hidden relative ${
        isOver 
          ? 'ring-2 ring-blue-400 ring-opacity-75 bg-blue-900/20 border-blue-400 shadow-blue-400/20 shadow-lg scale-[1.02]' 
          : 'border-gray-600 hover:border-gray-500'
      }`}
    >
      {/* Área de drop expandida - invisível mas funcional com padding extra */}
      <div className="absolute inset-0 z-10 pointer-events-none -m-4" />
      
      <div className={`p-3 lg:p-4 border-b ${statusConfig.borderColor} ${statusConfig.bgColor} relative z-20`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <StatusIcon className={`h-4 w-4 lg:h-5 lg:w-5 ${statusConfig.color}`} />
            <h3 className="font-semibold text-white text-sm lg:text-base">{statusConfig.title}</h3>
          </div>
        </div>
      </div>
      
      {/* Container do conteúdo com área de drop expandida */}
      <div className="flex-1 relative z-20 overflow-hidden">
        {children}
      </div>
    </div>
  );
}

export function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [tasksData, usersData] = await Promise.all([
          getTasks(),
          getUsers()
        ]);
        setTasks(tasksData);
        setUsers(usersData);
      } catch (err) {
        setError('Erro ao carregar dados');
        console.error('Erro ao carregar dados:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusConfig = (status: Status) => {
    const configs = {
      'todo': {
        title: 'A Fazer',
        icon: Circle,
        color: 'text-gray-300',
        bgColor: 'bg-gray-800',
        borderColor: 'border-gray-700'
      },
      'in-progress': {
        title: 'Em Progresso',
        icon: PlayCircle,
        color: 'text-blue-400',
        bgColor: 'bg-blue-900/30',
        borderColor: 'border-blue-700'
      },
      'review': {
        title: 'Em Revisão',
        icon: AlertCircle,
        color: 'text-orange-400',
        bgColor: 'bg-orange-900/30',
        borderColor: 'border-orange-700'
      },
      'done': {
        title: 'Concluído',
        icon: CheckCircle,
        color: 'text-green-400',
        bgColor: 'bg-green-900/30',
        borderColor: 'border-green-700'
      }
    };
    return configs[status];
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'low': 'text-green-300 bg-green-900/30',
      'medium': 'text-yellow-300 bg-yellow-900/30',
      'high': 'text-red-300 bg-red-900/30'
    };
    return colors[priority as keyof typeof colors] || 'text-gray-300 bg-gray-800';
  };

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Usuário não encontrado';
  };

  const getTasksByStatus = (status: Status) => {
    return tasks
      .filter(task => task.status === status)
      .sort((a, b) => {
        if (!a.endDate && !b.endDate) return 0;
        if (!a.endDate) return 1;
        if (!b.endDate) return -1;
        return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
      });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Sem prazo';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const isOverdue = (endDate?: string) => {
    if (!endDate) return false;
    return new Date(endDate) < new Date();
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'done').length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;
    const overdue = tasks.filter(t => isOverdue(t.endDate) && t.status !== 'done').length;
    
    return { total, completed, inProgress, overdue };
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedTask(null);
  };

  const handleTaskUpdated = async () => {
    try {
      const [tasksData, usersData] = await Promise.all([
        getTasks(),
        getUsers()
      ]);
      setTasks(tasksData);
      setUsers(usersData);
    } catch (err) {
      console.error('Erro ao recarregar dados:', err);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Se está arrastando sobre uma coluna (droppable area)
    const statusTypes: Status[] = ['todo', 'in-progress', 'review', 'done'];
    const targetStatus = statusTypes.find(status => overId.includes(status));

    if (targetStatus) {
      const taskToUpdate = tasks.find(task => task.id === activeId);
      if (taskToUpdate && taskToUpdate.status !== targetStatus) {
        // Atualizar otimisticamente a UI
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === activeId 
              ? { ...task, status: targetStatus }
              : task
          )
        );

        try {
          await updateTaskStatus(activeId, targetStatus);
          console.log(`Task ${activeId} atualizada para status ${targetStatus}`);
        } catch (error) {
          console.error('Erro ao atualizar status da task:', error);
          // Reverter a mudança em caso de erro
          await handleTaskUpdated();
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#252525]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#252525]">
        <div className="text-center bg-[#1a1a1a] p-8 rounded-xl shadow-lg border border-gray-700">
          <AlertCircle className="h-16 w-16 mx-auto mb-4 text-red-400" />
          <h2 className="text-xl font-semibold text-white mb-2">Oops! Algo deu errado</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  const stats = getTaskStats();
  const statusTypes: Status[] = ['todo', 'in-progress', 'review', 'done'];

  return (
    <div className="p-4 lg:p-6 bg-[#252525] min-h-screen">
      <div className="max-w-7xl mx-auto bg-[#1a1a1a] rounded-2xl border border-gray-600 p-4 sm:p-6 lg:p-8 shadow-xl">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white mb-1">Dashboard</h1>
              <p className="text-gray-300 text-sm lg:text-base">Visão geral das suas tarefas</p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-2 text-sm text-gray-400">
              <Calendar className="h-4 w-4" />
              <span>Atualizado em {new Date().toLocaleDateString('pt-BR')}</span>
            </div>
          </div>
        </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        <Card className="p-4 lg:p-6 bg-[#1a1a1a] border-gray-600 rounded-xl hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-300">Total de Tarefas</p>
              <p className="text-xl lg:text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <div className="h-10 w-10 lg:h-12 lg:w-12 bg-blue-900/50 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-5 w-5 lg:h-6 lg:w-6 text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4 lg:p-6 bg-[#1a1a1a] border-gray-600 rounded-xl hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-300">Em Progresso</p>
              <p className="text-xl lg:text-2xl font-bold text-blue-400">{stats.inProgress}</p>
            </div>
            <div className="h-10 w-10 lg:h-12 lg:w-12 bg-blue-900/50 rounded-lg flex items-center justify-center">
              <PlayCircle className="h-5 w-5 lg:h-6 lg:w-6 text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4 lg:p-6 bg-[#1a1a1a] border-gray-600 rounded-xl hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-300">Concluídas</p>
              <p className="text-xl lg:text-2xl font-bold text-green-400">{stats.completed}</p>
            </div>
            <div className="h-10 w-10 lg:h-12 lg:w-12 bg-green-900/50 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-5 w-5 lg:h-6 lg:w-6 text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4 lg:p-6 bg-[#1a1a1a] border-gray-600 rounded-xl hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-300">Atrasadas</p>
              <p className="text-xl lg:text-2xl font-bold text-red-400">{stats.overdue}</p>
            </div>
            <div className="h-10 w-10 lg:h-12 lg:w-12 bg-red-900/50 rounded-lg flex items-center justify-center">
              <AlertCircle className="h-5 w-5 lg:h-6 lg:w-6 text-red-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Kanban Board with Drag and Drop */}
      <div className="h-[500px]">
        <DndContext
          sensors={sensors}
          collisionDetection={(args) => {
            // Primeiro tenta pointerWithin para melhor detecção em áreas sobrepostas
            const pointerIntersections = pointerWithin(args);
            if (pointerIntersections.length > 0) {
              return pointerIntersections;
            }
            // Fallback para closestCenter se não houver intersecção direta
            return closestCenter(args);
          }}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 h-full overflow-hidden">
            {statusTypes.map(status => {
              const statusConfig = getStatusConfig(status);
              const statusTasks = getTasksByStatus(status);
              const StatusIcon = statusConfig.icon;

              return (
                <DroppableColumn
                  key={status}
                  id={`droppable-${status}`}
                  statusConfig={statusConfig}
                >
                  <div className="p-3 lg:p-4 space-y-3 h-full overflow-y-auto kanban-column-scroll">
                    {statusTasks.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="flex flex-col items-center space-y-2">
                          <StatusIcon className={`h-8 w-8 ${statusConfig.color} opacity-30`} />
                          <p className="text-gray-400 text-sm">Nenhuma tarefa</p>
                          <p className="text-gray-500 text-xs">Arraste uma tarefa aqui</p>
                        </div>
                      </div>
                    ) : (
                      <SortableContext 
                        items={statusTasks.map(task => task.id)} 
                        strategy={verticalListSortingStrategy}
                      >
                        {statusTasks.map(task => (
                          <DraggableTaskCard
                            key={task.id}
                            task={task}
                            status={status}
                            onClick={handleTaskClick}
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
              );
            })}
          </div>
          
          <DragOverlay>
            {activeId ? (
              <DraggableTaskCard
                task={tasks.find(task => task.id === activeId)!}
                status={tasks.find(task => task.id === activeId)?.status || 'todo'}
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

      {/* Modal de Edição */}
      <EditTaskModal
        task={selectedTask}
        users={users}
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        onTaskUpdated={handleTaskUpdated}
      />
      </div>
    </div>
  );
}

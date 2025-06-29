import { Card } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
}

export function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  return (
    <Card className="p-6 bg-white hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
        <div className={`h-12 w-12 ${color.replace('text-', 'bg-').replace('-600', '-100')} rounded-lg flex items-center justify-center`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </div>
    </Card>
  );
}

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description: string;
    priority: string;
    endDate?: string;
    assignee: string;
    tags: string[];
  };
  getUserName: (userId: string) => string;
  isOverdue: (endDate?: string) => boolean;
  formatDate: (dateString?: string) => string;
  getPriorityColor: (priority: string) => string;
  status: string;
}

export function TaskCard({ 
  task, 
  getUserName, 
  isOverdue, 
  formatDate, 
  getPriorityColor, 
  status 
}: TaskCardProps) {
  const { Calendar, User: UserIcon, Tag } = require('lucide-react');
  
  return (
    <Card className={`p-4 border-l-4 transition-all duration-200 hover:shadow-md ${
      isOverdue(task.endDate) && status !== 'done' 
        ? 'border-l-red-500 bg-red-50' 
        : 'border-l-gray-200 hover:border-l-blue-300'
    }`}>
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <h4 className="font-medium text-gray-900 text-sm line-clamp-2 flex-1 mr-2">
            {task.title}
          </h4>
          <span className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${getPriorityColor(task.priority)}`}>
            {task.priority === 'low' ? 'Baixa' : task.priority === 'medium' ? 'Média' : 'Alta'}
          </span>
        </div>
        
        <p className="text-gray-600 text-xs line-clamp-2">
          {task.description}
        </p>

        <div className="flex items-center space-x-4 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span className={isOverdue(task.endDate) && status !== 'done' ? 'text-red-600 font-medium' : ''}>
              {formatDate(task.endDate)}
            </span>
          </div>
          
          <div className="flex items-center space-x-1">
            <UserIcon className="h-3 w-3" />
            <span className="truncate max-w-20">
              {getUserName(task.assignee)}
            </span>
          </div>
        </div>

        {task.tags && task.tags.length > 0 && (
          <div className="flex items-center space-x-1">
            <Tag className="h-3 w-3 text-gray-400" />
            <div className="flex flex-wrap gap-1">
              {task.tags.slice(0, 2).map((tag, index) => (
                <span key={index} className="px-1 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                  {tag}
                </span>
              ))}
              {task.tags.length > 2 && (
                <span className="px-1 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
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

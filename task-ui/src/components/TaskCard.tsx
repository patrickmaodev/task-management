import React from 'react';
import { Calendar, Edit, Trash2, CheckCircle, Circle, Clock } from 'lucide-react';

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: 'pending' | 'in_progress' | 'completed';
  due_date: string | null;
  created_at: string;
}

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onStatusChange: (task: Task, newStatus: Task['status']) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onStatusChange }) => {
  const getStatusIcon = () => {
    switch (task.status) {
      case 'completed':
        return <CheckCircle size={20} className="text-emerald-500" />;
      case 'in_progress':
        return <Clock size={20} className="text-blue-500" />;
      default:
        return <Circle size={20} className="text-gray-400" />;
    }
  };

  const getStatusBadgeClass = () => {
    switch (task.status) {
      case 'completed': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'in_progress': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <div className="glass-panel p-5 animate-fade-in flex flex-col h-full transition-transform hover:-translate-y-1 hover:shadow-lg duration-300">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold m-0 truncate pr-2" title={task.title}>
          {task.title}
        </h3>
        <button 
          onClick={() => onStatusChange(task, task.status === 'completed' ? 'pending' : 'completed')}
          className="bg-transparent border-none cursor-pointer p-1 rounded-full hover:bg-white/5 transition-colors"
          title="Toggle Status"
        >
          {getStatusIcon()}
        </button>
      </div>

      <p className="text-sm text-gray-400 flex-grow line-clamp-3 mb-4">
        {task.description || <span className="italic opacity-50">No description provided.</span>}
      </p>

      <div className="flex justify-between items-end mt-auto pt-4 border-t border-white/5">
        <div className="flex flex-col gap-2">
          <span className={`text-xs px-2 py-1 rounded-full border ${getStatusBadgeClass()} self-start capitalize font-medium`}>
            {task.status.replace('_', ' ')}
          </span>
          {task.due_date && (
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Calendar size={12} />
              {new Date(task.due_date).toLocaleDateString()}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => onEdit(task)}
            className="bg-transparent border-none cursor-pointer p-2 rounded-md hover:bg-blue-500/10 text-gray-400 hover:text-blue-500 transition-colors"
            title="Edit Task"
          >
            <Edit size={16} />
          </button>
          <button 
            onClick={() => onDelete(task.id)}
            className="bg-transparent border-none cursor-pointer p-2 rounded-md hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors"
            title="Delete Task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

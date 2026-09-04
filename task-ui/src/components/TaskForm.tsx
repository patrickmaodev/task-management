import React, { useState, useEffect } from 'react';
import type { Task } from './TaskCard';

interface TaskFormProps {
  task?: Task | null;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onCancel, isLoading }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'pending' | 'in_progress' | 'completed'>('pending');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setStatus(task.status);
      setDueDate(task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '');
    } else {
      setTitle('');
      setDescription('');
      setStatus('pending');
      setDueDate('');
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      title,
      description: description || null,
      status,
      due_date: dueDate ? `${dueDate} 00:00:00` : null,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
      <div className="glass-panel p-6 w-full max-w-lg shadow-2xl">
        <h2 className="mb-6">{task ? 'Edit Task' : 'Create New Task'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="title">Title <span className="text-red-500">*</span></label>
            <input
              id="title"
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">Description</label>
            <textarea
              id="description"
              className="form-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div className="flex gap-4 mb-6">
            <div className="form-group flex-1 mb-0">
              <label className="form-label" htmlFor="status">Status</label>
              <select
                id="status"
                className="form-input"
                value={status}
                onChange={(e: any) => setStatus(e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="form-group flex-1 mb-0">
              <label className="form-label" htmlFor="dueDate">Due Date</label>
              <input
                id="dueDate"
                type="date"
                className="form-input"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button 
              type="button" 
              onClick={onCancel}
              className="btn btn-danger"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary min-w-[100px]"
              disabled={isLoading}
            >
              {isLoading ? <div className="loader" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div> : (task ? 'Save Changes' : 'Create Task')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

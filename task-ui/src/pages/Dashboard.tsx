import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { TaskCard, type Task } from '../components/TaskCard';
import { TaskForm } from '../components/TaskForm';
import { LogOut, Plus, LayoutDashboard } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filter, setFilter] = useState<string>('all');

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/tasks');
      if (response.data.success) {
        setTasks(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async (data: any) => {
    try {
      setIsSubmitting(true);
      await api.post('/tasks', data);
      await fetchTasks();
      setIsFormOpen(false);
    } catch (error) {
      console.error('Failed to create task', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTask = async (data: any) => {
    if (!editingTask) return;
    try {
      setIsSubmitting(true);
      await api.put(`/tasks/${editingTask.id}`, data);
      await fetchTasks();
      setEditingTask(null);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Failed to update task', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      await fetchTasks();
    } catch (error) {
      console.error('Failed to delete task', error);
    }
  };

  const handleStatusChange = async (task: Task, newStatus: Task['status']) => {
    try {
      await api.put(`/tasks/${task.id}`, { ...task, status: newStatus });
      await fetchTasks();
    } catch (error) {
      console.error('Failed to update task status', error);
    }
  };

  const openEditForm = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <header className="glass-panel rounded-none border-t-0 border-l-0 border-r-0 sticky top-0 z-10 p-4">
        <div className="container mx-auto px-4 flex justify-between items-center" style={{ padding: '0 1rem' }}>
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/10 p-2 rounded-lg">
              <LayoutDashboard className="text-blue-500" size={24} />
            </div>
            <h1 className="text-xl m-0">TaskFlow</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400 hidden sm:inline-block">
              Welcome, <strong className="text-white">{user?.name}</strong>
            </span>
            <button onClick={logout} className="btn bg-white/5 hover:bg-red-500/10 text-gray-300 hover:text-red-500 flex items-center gap-2">
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mt-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl mb-1">My Tasks</h2>
            <p className="text-sm m-0">Manage and track your progress</p>
          </div>
          
          <div className="flex gap-4 w-full sm:w-auto">
            <select 
              className="form-input py-2 flex-1 sm:flex-none sm:w-40" 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              style={{ marginBottom: 0 }}
            >
              <option value="all">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            
            <button 
              className="btn btn-primary flex items-center gap-2 whitespace-nowrap"
              onClick={() => setIsFormOpen(true)}
            >
              <Plus size={18} />
              New Task
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="loader"></div>
          </div>
        ) : filteredTasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onEdit={openEditForm}
                onDelete={handleDeleteTask}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        ) : (
          <div className="glass-panel p-12 flex flex-col items-center justify-center text-center animate-fade-in">
            <div className="bg-white/5 p-4 rounded-full mb-4">
              <LayoutDashboard size={48} className="text-gray-500" />
            </div>
            <h3>No tasks found</h3>
            <p className="max-w-md mx-auto mb-6">
              {filter === 'all' 
                ? "You don't have any tasks yet. Create your first task to get started." 
                : `You don't have any tasks with status '${filter.replace('_', ' ')}'.`}
            </p>
            {filter === 'all' && (
              <button className="btn btn-primary flex items-center gap-2" onClick={() => setIsFormOpen(true)}>
                <Plus size={18} /> Create Task
              </button>
            )}
          </div>
        )}
      </main>

      {isFormOpen && (
        <TaskForm 
          task={editingTask}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          onCancel={closeForm}
          isLoading={isSubmitting}
        />
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { TaskCard, type Task } from '../components/TaskCard';
import { TaskForm } from '../components/TaskForm';
import { AppLayout } from '../components/layout/AppLayout';
import { Plus, LayoutDashboard } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
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

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const headerActions = (
    <>
      <select
        className="form-input hidden py-2 sm:block sm:w-40"
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
        type="button"
        className="btn btn-primary flex items-center gap-2 whitespace-nowrap"
        onClick={() => setIsFormOpen(true)}
      >
        <Plus size={18} />
        <span className="hidden sm:inline">New Task</span>
        <span className="sm:hidden">Add</span>
      </button>
    </>
  );

  return (
    <AppLayout
      title="My Tasks"
      description={`Welcome back, ${user?.name ?? 'there'}`}
      actions={headerActions}
    >
      <div className="mb-6 sm:hidden">
        <select
          className="form-input w-full py-2"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ marginBottom: 0 }}
        >
          <option value="all">All Tasks</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="loader" />
        </div>
      ) : filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task) => (
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
        <div className="glass-panel flex flex-col items-center justify-center p-12 text-center animate-fade-in">
          <div className="mb-4 rounded-full bg-white/5 p-4">
            <LayoutDashboard size={48} className="text-gray-500" />
          </div>
          <h3>No tasks found</h3>
          <p className="mx-auto mb-6 max-w-md">
            {filter === 'all'
              ? "You don't have any tasks yet. Create your first task to get started."
              : `You don't have any tasks with status '${filter.replace('_', ' ')}'.`}
          </p>
          {filter === 'all' && (
            <button
              type="button"
              className="btn btn-primary flex items-center gap-2"
              onClick={() => setIsFormOpen(true)}
            >
              <Plus size={18} /> Create Task
            </button>
          )}
        </div>
      )}

      {isFormOpen && (
        <TaskForm
          task={editingTask}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          onCancel={closeForm}
          isLoading={isSubmitting}
        />
      )}
    </AppLayout>
  );
};

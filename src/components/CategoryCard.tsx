import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Category, Task } from '../types';
import TaskItem from './TaskItem';

interface CategoryCardProps {
  category: Category;
  onAddTask: (categoryId: string, taskText: string) => void;
  onToggleTask: (categoryId: string, taskId: string) => void;
  onDeleteTask: (categoryId: string, taskId: string) => void;
  onMoveTask: (categoryId: string, taskId: string, direction: 'up' | 'down') => void;
  onDeleteCategory: (categoryId: string) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onMoveTask,
  onDeleteCategory,
}) => {
  const [newTaskText, setNewTaskText] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim()) {
      onAddTask(category.id, newTaskText.trim());
      setNewTaskText('');
      setIsAdding(false);
    }
  };

  const completedCount = category.tasks.filter(t => t.completed).length;
  const totalCount = category.tasks.length;

  return (
    <div className="group relative bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl p-6 hover:bg-white/15 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl pointer-events-none" />
      
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-white mb-1">{category.name}</h3>
            <p className="text-sm text-white/60">
              {completedCount} of {totalCount} completed
            </p>
          </div>
          <button
            onClick={() => onDeleteCategory(category.id)}
            className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-red-500/20 transition-all duration-200"
            title="Delete category"
          >
            <Trash2 className="w-4 h-4 text-red-300" />
          </button>
        </div>

        {totalCount > 0 && (
          <div className="mb-4 h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-500"
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            />
          </div>
        )}

        <div className="space-y-2 mb-4 max-h-96 overflow-y-auto custom-scrollbar">
          {category.tasks.map((task, index) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={() => onToggleTask(category.id, task.id)}
              onDelete={() => onDeleteTask(category.id, task.id)}
              onMoveUp={() => onMoveTask(category.id, task.id, 'up')}
              onMoveDown={() => onMoveTask(category.id, task.id, 'down')}
              isFirst={index === 0}
              isLast={index === category.tasks.length - 1}
            />
          ))}
        </div>

        {isAdding ? (
          <form onSubmit={handleAddTask} className="flex gap-2">
            <input
              type="text"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              placeholder="Enter task..."
              autoFocus
              className="flex-1 px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 text-sm"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-emerald-400 to-teal-500 text-white rounded-lg hover:from-emerald-500 hover:to-teal-600 transition-all duration-200 text-sm font-medium"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setNewTaskText('');
              }}
              className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all duration-200 text-sm"
            >
              Cancel
            </button>
          </form>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white/80 hover:bg-white/20 hover:text-white transition-all duration-200 text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </button>
        )}
      </div>
    </div>
  );
};

export default CategoryCard;

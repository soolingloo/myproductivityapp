import React, { useState, useEffect } from 'react';
import { Plus, CheckSquare } from 'lucide-react';
import { Category, Task } from './types';
import { saveToStorage, loadFromStorage } from './utils/storage';
import CategoryCard from './components/CategoryCard';
import AddCategoryModal from './components/AddCategoryModal';

const defaultCategories: Category[] = [
  { id: '1', name: 'Client', tasks: [], color: '#FF6B6B' },
  { id: '2', name: 'Biz System', tasks: [], color: '#4ECDC4' },
  { id: '3', name: 'Web & Funnel', tasks: [], color: '#45B7D1' },
  { id: '4', name: 'AI & Tech', tasks: [], color: '#96CEB4' },
  { id: '5', name: 'Learning', tasks: [], color: '#FFEAA7' },
  { id: '6', name: 'Personal', tasks: [], color: '#DFE6E9' },
];

function App() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const saved = loadFromStorage();
    setCategories(saved || defaultCategories);
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      saveToStorage(categories);
    }
  }, [categories]);

  const addCategory = (name: string) => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name,
      tasks: [],
      color: '#' + Math.floor(Math.random()*16777215).toString(16),
    };
    setCategories([...categories, newCategory]);
  };

  const deleteCategory = (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category and all its tasks?')) {
      setCategories(categories.filter(c => c.id !== categoryId));
    }
  };

  const addTask = (categoryId: string, taskText: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      text: taskText,
      completed: false,
      createdAt: Date.now(),
    };

    setCategories(categories.map(category =>
      category.id === categoryId
        ? { ...category, tasks: [...category.tasks, newTask] }
        : category
    ));
  };

  const toggleTask = (categoryId: string, taskId: string) => {
    setCategories(categories.map(category =>
      category.id === categoryId
        ? {
            ...category,
            tasks: category.tasks.map(task =>
              task.id === taskId ? { ...task, completed: !task.completed } : task
            ),
          }
        : category
    ));
  };

  const deleteTask = (categoryId: string, taskId: string) => {
    setCategories(categories.map(category =>
      category.id === categoryId
        ? { ...category, tasks: category.tasks.filter(task => task.id !== taskId) }
        : category
    ));
  };

  const moveTask = (categoryId: string, taskId: string, direction: 'up' | 'down') => {
    setCategories(categories.map(category => {
      if (category.id !== categoryId) return category;

      const taskIndex = category.tasks.findIndex(t => t.id === taskId);
      if (taskIndex === -1) return category;

      const newTasks = [...category.tasks];
      const targetIndex = direction === 'up' ? taskIndex - 1 : taskIndex + 1;

      if (targetIndex < 0 || targetIndex >= newTasks.length) return category;

      [newTasks[taskIndex], newTasks[targetIndex]] = [newTasks[targetIndex], newTasks[taskIndex]];

      return { ...category, tasks: newTasks };
    }));
  };

  const totalTasks = categories.reduce((sum, cat) => sum + cat.tasks.length, 0);
  const completedTasks = categories.reduce(
    (sum, cat) => sum + cat.tasks.filter(t => t.completed).length,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?w=1920&q=80')] bg-cover bg-center opacity-10" />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-6">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl pointer-events-none" />
            
            <div className="relative flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl shadow-lg">
                  <CheckSquare className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-1">My Productivity Dashboard</h1>
                  <p className="text-white/70">
                    {completedTasks} of {totalTasks} tasks completed
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-400 to-teal-500 text-white rounded-xl hover:from-emerald-500 hover:to-teal-600 transition-all duration-200 shadow-lg font-medium"
              >
                <Plus className="w-5 h-5" />
                Add Category
              </button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(category => (
            <CategoryCard
              key={category.id}
              category={category}
              onAddTask={addTask}
              onToggleTask={toggleTask}
              onDeleteTask={deleteTask}
              onMoveTask={moveTask}
              onDeleteCategory={deleteCategory}
            />
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-12 max-w-md mx-auto">
              <CheckSquare className="w-16 h-16 text-white/50 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-2">No Categories Yet</h3>
              <p className="text-white/70 mb-6">Get started by adding your first category</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-emerald-400 to-teal-500 text-white rounded-xl hover:from-emerald-500 hover:to-teal-600 transition-all duration-200 shadow-lg font-medium"
              >
                Add Category
              </button>
            </div>
          </div>
        )}
      </div>

      {showAddModal && (
        <AddCategoryModal
          onClose={() => setShowAddModal(false)}
          onAdd={addCategory}
        />
      )}
    </div>
  );
}

export default App;

import React from 'react';
import { Check, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggle,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}) => {
  return (
    <div className="group flex items-center gap-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200">
      <button
        onClick={onToggle}
        className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
          task.completed
            ? 'bg-gradient-to-br from-emerald-400 to-teal-500 border-emerald-400'
            : 'border-white/40 hover:border-white/60'
        }`}
      >
        {task.completed && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
      </button>

      <span
        className={`flex-1 text-sm transition-all duration-200 ${
          task.completed
            ? 'line-through text-white/50'
            : 'text-white/90'
        }`}
      >
        {task.text}
      </span>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={onMoveUp}
          disabled={isFirst}
          className="p-1 rounded hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="Move up"
        >
          <ChevronUp className="w-4 h-4 text-white/70" />
        </button>
        <button
          onClick={onMoveDown}
          disabled={isLast}
          className="p-1 rounded hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="Move down"
        >
          <ChevronDown className="w-4 h-4 text-white/70" />
        </button>
        <button
          onClick={onDelete}
          className="p-1 rounded hover:bg-red-500/30 transition-colors"
          title="Delete task"
        >
          <Trash2 className="w-4 h-4 text-red-300" />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;

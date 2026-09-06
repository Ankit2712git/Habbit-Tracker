import React, { useState } from 'react';
import { TaskItem, TaskStatus, TaskPriority, TaskArea } from '../types';
import {
  Kanban,
  Table as TableIcon,
  List,
  Plus,
  Filter,
  Check,
  Trash2,
  Calendar,
  Clock,
  ArrowUpDown,
  Tag,
} from 'lucide-react';

interface TaskDatabaseViewProps {
  tasks: TaskItem[];
  onUpdateTasks: (tasks: TaskItem[]) => void;
}

export const TaskDatabaseView: React.FC<TaskDatabaseViewProps> = ({ tasks, onUpdateTasks }) => {
  const [viewMode, setViewMode] = useState<'board' | 'table' | 'list'>('board');
  const [filterArea, setFilterArea] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [isAddingTask, setIsAddingTask] = useState(false);

  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskStatus, setNewTaskStatus] = useState<TaskStatus>('todo');
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>('medium');
  const [newTaskArea, setNewTaskArea] = useState<TaskArea>('Deep Work');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskEstimate, setNewTaskEstimate] = useState('');

  // Status transitions
  const handleStatusChange = (id: string, newStatus: TaskStatus) => {
    onUpdateTasks(
      tasks.map((task) => (task.id === id ? { ...task, status: newStatus } : task))
    );
  };

  const handleToggleDone = (id: string) => {
    onUpdateTasks(
      tasks.map((task) => {
        if (task.id === id) {
          const nextStatus: TaskStatus = task.status === 'done' ? 'todo' : 'done';
          return { ...task, status: nextStatus };
        }
        return task;
      })
    );
  };

  const handleDeleteTask = (id: string) => {
    onUpdateTasks(tasks.filter((task) => task.id !== id));
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: TaskItem = {
      id: `t-${Date.now()}`,
      title: newTaskTitle.trim(),
      status: newTaskStatus,
      priority: newTaskPriority,
      area: newTaskArea,
      dueDate: newTaskDueDate || 'Today',
      estimate: newTaskEstimate || '30m',
    };

    onUpdateTasks([newTask, ...tasks]);
    setNewTaskTitle('');
    setNewTaskDueDate('');
    setNewTaskEstimate('');
    setIsAddingTask(false);
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (filterArea !== 'all' && task.area !== filterArea) return false;
    if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
    return true;
  });

  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case 'high':
        return 'bg-[#EAE7E0] text-[#7A3F3F] border-[#D9D1C7] font-semibold';
      case 'medium':
        return 'bg-[#F5F2ED] text-[#7B8C7D] border-[#D9D1C7] font-semibold';
      case 'low':
        return 'bg-[#E3E8E1] text-[#3A3F3A] border-[#D9D1C7] font-semibold';
    }
  };

  const getAreaBadge = (area: TaskArea) => {
    switch (area) {
      case 'Deep Work':
        return 'bg-[#E3E8E1] text-[#3A3F3A] border-[#D9D1C7]';
      case 'Creative':
        return 'bg-[#EAE7E0] text-[#3A3F3A] border-[#D9D1C7]';
      case 'Personal':
        return 'bg-[#F5F2ED] text-[#3A3F3A] border-[#D9D1C7]';
      case 'Health':
        return 'bg-[#E3E8E1] text-[#7B8C7D] border-[#D9D1C7] font-medium';
      case 'Admin':
        return 'bg-[#EAE7E0] text-[#3A3F3A]/80 border-[#D9D1C7]';
    }
  };

  const columns: { id: TaskStatus; label: string; count: number; color: string }[] = [
    {
      id: 'todo',
      label: 'To Do',
      count: filteredTasks.filter((t) => t.status === 'todo').length,
      color: 'bg-[#D9D1C7]',
    },
    {
      id: 'in-progress',
      label: 'In Progress',
      count: filteredTasks.filter((t) => t.status === 'in-progress').length,
      color: 'bg-[#7B8C7D]',
    },
    {
      id: 'done',
      label: 'Completed',
      count: filteredTasks.filter((t) => t.status === 'done').length,
      color: 'bg-[#3A3F3A]',
    },
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Database View Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D9D1C7] pb-4">
        {/* Left: View Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#EAE7E0]/60 rounded-full border border-[#D9D1C7]">
          <button
            type="button"
            onClick={() => setViewMode('board')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-full transition-colors cursor-pointer ${
              viewMode === 'board'
                ? 'bg-[#7B8C7D] text-[#F5F2ED] shadow-2xs'
                : 'text-[#3A3F3A]/70 hover:text-[#3A3F3A]'
            }`}
          >
            <Kanban className="w-3.5 h-3.5" />
            <span>Board</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-full transition-colors cursor-pointer ${
              viewMode === 'table'
                ? 'bg-[#7B8C7D] text-[#F5F2ED] shadow-2xs'
                : 'text-[#3A3F3A]/70 hover:text-[#3A3F3A]'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>Table</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-full transition-colors cursor-pointer ${
              viewMode === 'list'
                ? 'bg-[#7B8C7D] text-[#F5F2ED] shadow-2xs'
                : 'text-[#3A3F3A]/70 hover:text-[#3A3F3A]'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>List</span>
          </button>
        </div>

        {/* Right: Filters and Add Button */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Area filter */}
          <div className="flex items-center gap-1.5 bg-[#F5F2ED] border border-[#D9D1C7] px-3 py-1.5 rounded-full text-xs text-[#3A3F3A]">
            <Filter className="w-3 h-3 text-[#7B8C7D]" />
            <select
              value={filterArea}
              onChange={(e) => setFilterArea(e.target.value)}
              className="bg-transparent text-[#3A3F3A] focus:outline-none cursor-pointer text-xs font-medium"
            >
              <option value="all">All Areas</option>
              <option value="Deep Work">Deep Work</option>
              <option value="Creative">Creative</option>
              <option value="Personal">Personal</option>
              <option value="Health">Health</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          {/* Priority filter */}
          <div className="flex items-center gap-1.5 bg-[#F5F2ED] border border-[#D9D1C7] px-3 py-1.5 rounded-full text-xs text-[#3A3F3A]">
            <Tag className="w-3 h-3 text-[#7B8C7D]" />
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="bg-transparent text-[#3A3F3A] focus:outline-none cursor-pointer text-xs font-medium"
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* New Task Button */}
          <button
            type="button"
            onClick={() => setIsAddingTask(!isAddingTask)}
            className="px-4 py-1.5 rounded-full bg-[#7B8C7D] text-[#F5F2ED] hover:bg-[#68786A] transition-colors text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" /> New Action
          </button>
        </div>
      </div>

      {/* Inline Add Task Form */}
      {isAddingTask && (
        <form
          onSubmit={handleCreateTask}
          className="p-6 bg-white border border-[#E3E8E1] rounded-3xl space-y-4 shadow-xs"
        >
          <div className="text-[10px] font-bold text-[#7B8C7D] uppercase tracking-widest">
            Add Deliberate Action
          </div>
          <input
            type="text"
            required
            placeholder="Task title (e.g. Draft synthesis document for research group)"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="w-full px-4 py-2.5 text-sm bg-[#F5F2ED] border border-[#D9D1C7] rounded-2xl text-[#3A3F3A] placeholder-[#3A3F3A]/40 focus:outline-none focus:border-[#7B8C7D]"
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-[10px] text-[#3A3F3A]/70 uppercase tracking-wider block mb-1 font-bold">Status</label>
              <select
                value={newTaskStatus}
                onChange={(e) => setNewTaskStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-2 text-xs bg-[#F5F2ED] border border-[#D9D1C7] rounded-xl text-[#3A3F3A] focus:outline-none"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Completed</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-[#3A3F3A]/70 uppercase tracking-wider block mb-1 font-bold">Priority</label>
              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2 text-xs bg-[#F5F2ED] border border-[#D9D1C7] rounded-xl text-[#3A3F3A] focus:outline-none"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-[#3A3F3A]/70 uppercase tracking-wider block mb-1 font-bold">Area</label>
              <select
                value={newTaskArea}
                onChange={(e) => setNewTaskArea(e.target.value as TaskArea)}
                className="w-full px-3 py-2 text-xs bg-[#F5F2ED] border border-[#D9D1C7] rounded-xl text-[#3A3F3A] focus:outline-none"
              >
                <option value="Deep Work">Deep Work</option>
                <option value="Creative">Creative</option>
                <option value="Personal">Personal</option>
                <option value="Health">Health</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-[#3A3F3A]/70 uppercase tracking-wider block mb-1 font-bold">Time Estimate</label>
              <input
                type="text"
                placeholder="e.g. 45m"
                value={newTaskEstimate}
                onChange={(e) => setNewTaskEstimate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#F5F2ED] border border-[#D9D1C7] rounded-xl text-[#3A3F3A] focus:outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingTask(false)}
              className="px-4 py-2 text-xs text-[#3A3F3A]/70 hover:text-[#3A3F3A] rounded-full"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs bg-[#7B8C7D] text-[#F5F2ED] font-medium rounded-full hover:bg-[#68786A]"
            >
              Save to Database
            </button>
          </div>
        </form>
      )}

      {/* 1. BOARD VIEW (KANBAN) */}
      {viewMode === 'board' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {columns.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.id);
            return (
              <div key={col.id} className="bg-[#F5F2ED] border border-[#D9D1C7] rounded-3xl p-4.5">
                {/* Column Header */}
                <div className="flex items-center justify-between mb-3.5 px-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${col.color}`} />
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[#3A3F3A]">
                      {col.label}
                    </h3>
                    <span className="text-xs font-mono text-[#3A3F3A]/70 bg-[#E3E8E1] px-2 py-0.5 rounded-full">
                      {colTasks.length}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setNewTaskStatus(col.id);
                      setIsAddingTask(true);
                    }}
                    className="text-[#3A3F3A]/50 hover:text-[#3A3F3A] p-1 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Task Cards */}
                <div className="space-y-3 min-h-[140px]">
                  {colTasks.map((task) => (
                    <div
                      key={task.id}
                      className="group p-4 rounded-2xl bg-white border border-[#E3E8E1] hover:border-[#7B8C7D] hover:shadow-xs transition-all space-y-3 relative"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleDone(task.id)}
                          className="flex items-start gap-3 text-left grow cursor-pointer"
                        >
                          <span
                            className={`w-4 h-4 rounded-md shrink-0 mt-0.5 flex items-center justify-center border transition-colors ${
                              task.status === 'done'
                                ? 'bg-[#7B8C7D] border-[#7B8C7D] text-[#F5F2ED]'
                                : 'border-[#3A3F3A]/40 bg-white hover:border-[#7B8C7D]'
                            }`}
                          >
                            {task.status === 'done' && (
                              <Check className="w-3 h-3 stroke-[2.5]" />
                            )}
                          </span>
                          <span
                            className={`text-xs sm:text-sm leading-snug font-medium ${
                              task.status === 'done'
                                ? 'line-through text-[#3A3F3A]/40'
                                : 'text-[#3A3F3A]'
                            }`}
                          >
                            {task.title}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteTask(task.id)}
                          className="opacity-0 group-hover:opacity-100 text-[#3A3F3A]/40 hover:text-[#944D4D] transition-opacity p-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {task.notes && (
                        <p className="text-xs text-[#3A3F3A]/60 line-clamp-2 pl-7">
                          {task.notes}
                        </p>
                      )}

                      {/* Card Tags */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1 pl-7">
                        <span
                          className={`text-[10px] px-2.5 py-0.5 rounded-full border ${getPriorityBadge(
                            task.priority
                          )}`}
                        >
                          {task.priority}
                        </span>
                        <span
                          className={`text-[10px] px-2.5 py-0.5 rounded-full border ${getAreaBadge(
                            task.area
                          )}`}
                        >
                          {task.area}
                        </span>
                        {task.estimate && (
                          <span className="text-[10px] text-[#3A3F3A]/60 flex items-center gap-1 ml-auto font-mono">
                            <Clock className="w-2.5 h-2.5 text-[#7B8C7D]" />
                            {task.estimate}
                          </span>
                        )}
                      </div>

                      {/* Quick Move Status Strip */}
                      <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-[#E3E8E1] text-[10px] text-[#3A3F3A]/50">
                        <span>Move:</span>
                        {col.id !== 'todo' && (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(task.id, 'todo')}
                            className="hover:text-[#7B8C7D] font-medium"
                          >
                            To Do
                          </button>
                        )}
                        {col.id !== 'in-progress' && (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(task.id, 'in-progress')}
                            className="hover:text-[#7B8C7D] font-medium"
                          >
                            Doing
                          </button>
                        )}
                        {col.id !== 'done' && (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(task.id, 'done')}
                            className="hover:text-[#7B8C7D] font-medium"
                          >
                            Done
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {colTasks.length === 0 && (
                    <div className="text-center py-8 text-xs text-[#3A3F3A]/40 italic">
                      No actions in {col.label.toLowerCase()}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="border border-[#E3E8E1] rounded-3xl overflow-x-auto bg-white shadow-xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#D9D1C7] bg-[#F5F2ED] text-[#3A3F3A] font-semibold">
                <th className="py-3 px-4 w-8"></th>
                <th className="py-3 px-4">Task Name</th>
                <th className="py-3 px-4 w-32">Status</th>
                <th className="py-3 px-4 w-28">Priority</th>
                <th className="py-3 px-4 w-32">Area</th>
                <th className="py-3 px-4 w-28">Due</th>
                <th className="py-3 px-4 w-24">Estimate</th>
                <th className="py-3 px-4 w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E8E1]">
              {filteredTasks.map((task) => (
                <tr
                  key={task.id}
                  className="group hover:bg-[#F5F2ED]/60 transition-colors"
                >
                  <td className="py-2.5 px-4">
                    <button
                      type="button"
                      onClick={() => handleToggleDone(task.id)}
                      className={`w-4 h-4 rounded-md flex items-center justify-center border transition-colors ${
                        task.status === 'done'
                          ? 'bg-[#7B8C7D] border-[#7B8C7D] text-white'
                          : 'border-[#3A3F3A]/40 bg-white hover:border-[#7B8C7D]'
                      }`}
                    >
                      {task.status === 'done' && (
                        <Check className="w-3 h-3 stroke-[2.5]" />
                      )}
                    </button>
                  </td>
                  <td className="py-2.5 px-4">
                    <span
                      className={`font-medium ${
                        task.status === 'done'
                          ? 'line-through text-[#3A3F3A]/40'
                          : 'text-[#3A3F3A]'
                      }`}
                    >
                      {task.title}
                    </span>
                  </td>
                  <td className="py-2.5 px-4">
                    <select
                      value={task.status}
                      onChange={(e) =>
                        handleStatusChange(task.id, e.target.value as TaskStatus)
                      }
                      className="bg-transparent font-medium text-[#3A3F3A] focus:outline-none cursor-pointer"
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </td>
                  <td className="py-2.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full border text-[10px] ${getPriorityBadge(
                        task.priority
                      )}`}
                    >
                      {task.priority}
                    </span>
                  </td>
                  <td className="py-2.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full border text-[10px] ${getAreaBadge(
                        task.area
                      )}`}
                    >
                      {task.area}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-[#3A3F3A]/70 font-mono">{task.dueDate || '—'}</td>
                  <td className="py-2.5 px-4 text-[#3A3F3A]/70 font-mono">{task.estimate || '—'}</td>
                  <td className="py-2.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleDeleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 text-[#3A3F3A]/40 hover:text-[#944D4D] transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 3. LIST VIEW */}
      {viewMode === 'list' && (
        <div className="divide-y divide-[#E3E8E1] border border-[#E3E8E1] rounded-3xl bg-white overflow-hidden shadow-xs">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="group flex items-center justify-between p-4 hover:bg-[#F5F2ED]/60 transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <button
                  type="button"
                  onClick={() => handleToggleDone(task.id)}
                  className={`w-4 h-4 rounded-md flex items-center justify-center border transition-colors ${
                    task.status === 'done'
                      ? 'bg-[#7B8C7D] border-[#7B8C7D] text-white'
                      : 'border-[#3A3F3A]/40 bg-white hover:border-[#7B8C7D]'
                  }`}
                >
                  {task.status === 'done' && <Check className="w-3 h-3 stroke-[2.5]" />}
                </button>
                <div>
                  <span
                    className={`text-sm font-medium ${
                      task.status === 'done'
                        ? 'line-through text-[#3A3F3A]/40'
                        : 'text-[#3A3F3A]'
                    }`}
                  >
                    {task.title}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full border ${getAreaBadge(
                        task.area
                      )}`}
                    >
                      {task.area}
                    </span>
                    <span className="text-[10px] text-[#3A3F3A]/60 font-mono">
                      Due: {task.dueDate || 'Today'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full border capitalize ${getPriorityBadge(
                    task.priority
                  )}`}
                >
                  {task.priority}
                </span>
                <button
                  type="button"
                  onClick={() => handleDeleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 text-[#3A3F3A]/40 hover:text-[#944D4D] transition-opacity"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { PageMetadata, TaskItem, HabitItem, DailyFocus } from '../types';
import {
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Plus,
  RotateCcw,
  Sparkles,
  Layers,
  HelpCircle,
  X,
  Trash2,
  Zap,
} from 'lucide-react';

interface SidebarProps {
  pages: PageMetadata[];
  activePageId: string;
  onSelectPage: (id: string) => void;
  onAddPage: () => void;
  onDeletePage?: (id: string) => void;
  isOpen: boolean;
  onToggleSidebar: () => void;
  onResetTemplate: () => void;
  tasks: TaskItem[];
  habits: HabitItem[];
  daily?: DailyFocus;
}

export const Sidebar: React.FC<SidebarProps> = ({
  pages,
  activePageId,
  onSelectPage,
  onAddPage,
  onDeletePage,
  isOpen,
  onToggleSidebar,
  onResetTemplate,
  tasks,
  habits,
  daily,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);
  const [resetSuccessNotice, setResetSuccessNotice] = useState(false);
  const [pageToDeleteId, setPageToDeleteId] = useState<string | null>(null);

  // Date and day-of-week tracking for "everyday" rhythm
  const now = new Date();
  // Monday is 0, Tuesday is 1, ..., Sunday is 6
  const todayDayIndex = (now.getDay() + 6) % 7;
  const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const currentDayName = DAYS_OF_WEEK[todayDayIndex];
  const todayDateKey = now.toISOString().split('T')[0];

  const pendingTasksCount = tasks.filter((t) => t.status !== 'done').length;
  const completedTasksCount = tasks.filter((t) => t.status === 'done').length;
  const completedHabitsToday = habits.filter((h) => h.days && h.days[todayDayIndex]).length;
  const completedBigThree = daily?.bigThree ? daily.bigThree.filter((b) => b.done).length : 0;
  const completedChecklist =
    (daily?.morningChecklist?.filter((c) => c.done).length || 0) +
    (daily?.eveningChecklist?.filter((c) => c.done).length || 0);

  const totalCompletedToday =
    completedTasksCount + completedHabitsToday + completedBigThree + completedChecklist;

  // Dynamic Energy Level (1 - 5) responding automatically to every task completion and everyday rhythm
  const calculateEnergyLevel = (completedCount: number, dayIdx: number): number => {
    if (completedCount >= 6) return 5;
    if (completedCount >= 4) return 4;
    if (completedCount >= 2) return 3;
    if (completedCount >= 1) return 2;
    return dayIdx >= 5 ? 1 : 2;
  };

  const dynamicEnergyLevel = calculateEnergyLevel(totalCompletedToday, todayDayIndex);

  // Persist energy level and daily history
  useEffect(() => {
    try {
      localStorage.setItem('sanctuary_energy_level', dynamicEnergyLevel.toString());
      const savedHistoryStr = localStorage.getItem('sanctuary_energy_history');
      const history = savedHistoryStr ? JSON.parse(savedHistoryStr) : {};
      history[todayDateKey] = dynamicEnergyLevel;
      localStorage.setItem('sanctuary_energy_history', JSON.stringify(history));
    } catch (e) {
      console.error(e);
    }
  }, [dynamicEnergyLevel, todayDateKey]);

  const getEnergyLabel = (lvl: number) => {
    switch (lvl) {
      case 1:
        return 'Rest Mode';
      case 2:
        return 'Gentle Momentum';
      case 3:
        return 'Steady Focus';
      case 4:
        return 'Optimal Flow';
      case 5:
        return 'Peak Vitality';
      default:
        return 'Steady Flow';
    }
  };

  const handleResetWorkspace = () => {
    setShowResetConfirmModal(true);
  };

  const handleConfirmReset = () => {
    setShowResetConfirmModal(false);
    onResetTemplate();
    setResetSuccessNotice(true);
    setTimeout(() => setResetSuccessNotice(false), 3000);
  };

  const filteredPages = pages.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) {
    return (
      <div className="fixed top-3 left-3 z-40">
        <button
          type="button"
          onClick={onToggleSidebar}
          title="Open Sidebar"
          className="p-2.5 rounded-full bg-[#F5F2ED] border border-[#D9D1C7] shadow-xs text-[#3A3F3A] hover:text-[#7B8C7D] hover:bg-[#E3E8E1] transition-colors cursor-pointer"
        >
          <PanelLeftOpen className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <aside className="w-64 sm:w-72 shrink-0 h-screen bg-[#F5F2ED] border-r border-[#D9D1C7] text-[#3A3F3A] flex flex-col justify-between select-none z-30 transition-all sticky top-0 overflow-y-auto px-5 py-6">
      {/* Top Workspace Header */}
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h1 className="font-serif italic text-3xl text-[#7B8C7D] leading-none">Sanctuary</h1>
            <p className="text-[10px] uppercase tracking-widest opacity-60 font-medium">Productivity Suite</p>
          </div>
          <button
            type="button"
            onClick={onToggleSidebar}
            title="Collapse sidebar"
            className="p-1.5 rounded-full text-[#3A3F3A] opacity-60 hover:opacity-100 hover:text-[#7B8C7D] hover:bg-[#E3E8E1] transition-colors cursor-pointer"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Search */}
        <div>
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#3A3F3A] opacity-40" />
            <input
              type="text"
              placeholder="Find in suite..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-1.5 text-xs rounded-full bg-[#EAE7E0] border border-transparent focus:border-[#7B8C7D] focus:bg-white text-[#3A3F3A] placeholder-[#3A3F3A]/40 focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-[#3A3F3A]/40 hover:text-[#3A3F3A] cursor-pointer"
                title="Clear search"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Workspace Pages Tree */}
        <div className="space-y-1">
          <div className="px-2 py-1 text-[10px] uppercase tracking-widest opacity-60 font-bold flex items-center justify-between">
            <span>Daily Rituals & Labs</span>
            <span className="font-mono text-[9px]">{pages.length}</span>
          </div>

          <ul className="space-y-1">
            {filteredPages.map((page) => {
              const isActive = page.id === activePageId;
              const isCustomPage = page.id.startsWith('page-');

              return (
                <li key={page.id} className="group/page relative flex items-center">
                  <button
                    type="button"
                    onClick={() => onSelectPage(page.id)}
                    className={`grow flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#E3E8E1] text-[#3A3F3A] shadow-2xs'
                        : 'opacity-60 hover:opacity-100 hover:text-[#7B8C7D] hover:bg-[#EAE7E0]'
                    }`}
                  >
                    <div className="flex items-center space-x-3 truncate">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 transition-all ${
                          isActive
                            ? 'bg-[#7B8C7D]'
                            : 'bg-transparent border border-[#3A3F3A] group-hover:border-[#7B8C7D]'
                        }`}
                      />
                      <span className="text-sm shrink-0 leading-none mr-1">{page.icon}</span>
                      <span className="truncate">{page.title}</span>
                    </div>

                    {/* Subtle indicators */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {page.type === 'tasks' && pendingTasksCount > 0 && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/80 text-[#3A3F3A] font-mono">
                          {pendingTasksCount}
                        </span>
                      )}
                      {page.type === 'habits' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#7B8C7D]" />
                      )}
                    </div>
                  </button>

                  {isCustomPage && onDeletePage && (
                    <div className="absolute right-2 opacity-0 group-hover/page:opacity-100 transition-opacity flex items-center gap-1">
                      {pageToDeleteId === page.id ? (
                        <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-xl shadow-xs border border-[#D9D1C7]">
                          <span className="text-[10px] text-[#944D4D] font-medium">Delete?</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeletePage(page.id);
                              setPageToDeleteId(null);
                            }}
                            className="px-1.5 py-0.5 text-[10px] bg-[#944D4D] text-white rounded-md hover:bg-[#7D3F3F] cursor-pointer"
                          >
                            Yes
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPageToDeleteId(null);
                            }}
                            className="px-1.5 py-0.5 text-[10px] bg-[#EAE7E0] text-[#3A3F3A] rounded-md hover:bg-[#D9D1C7] cursor-pointer"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPageToDeleteId(page.id);
                          }}
                          className="p-1.5 text-[#3A3F3A]/40 hover:text-[#944D4D] transition-colors cursor-pointer"
                          title="Delete page"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Add Page Button */}
          <button
            type="button"
            onClick={onAddPage}
            className="w-full flex items-center space-x-2 px-3 py-2 text-xs opacity-60 hover:opacity-100 hover:text-[#7B8C7D] hover:bg-[#EAE7E0] rounded-2xl transition-colors cursor-pointer mt-1"
          >
            <Plus className="w-3.5 h-3.5 text-[#7B8C7D]" />
            <span>Add a page</span>
          </button>
        </div>

        {/* Current Energy Widget from Bento Design */}
        <div className="p-4 bg-[#E3E8E1] rounded-3xl border border-[#D9D1C7]/70 shadow-2xs transition-all">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-[10px] uppercase tracking-wider opacity-70 font-semibold text-[#3A3F3A]">
                Current Energy
              </p>
              <span className="text-[11px] font-medium text-[#7B8C7D]">
                {getEnergyLabel(dynamicEnergyLevel)}
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#3A3F3A]/70 bg-white/60 px-2 py-0.5 rounded-full border border-[#D9D1C7]/50">
              {currentDayName} • Lvl {dynamicEnergyLevel}/5
            </span>
          </div>

          {/* 5 Energy Bars "Like Before" with Smooth Reactive Animation */}
          <div className="flex items-end justify-between gap-1.5 h-12 py-1">
            {[1, 2, 3, 4, 5].map((level) => {
              const heights = ['h-1/3', 'h-1/2', 'h-2/3', 'h-5/6', 'h-full'];
              const isFilled = level <= dynamicEnergyLevel;
              return (
                <div
                  key={level}
                  className={`w-full max-w-[14px] ${heights[level - 1]} rounded-full transition-all duration-500 ease-out ${
                    isFilled
                      ? 'bg-[#7B8C7D] shadow-2xs'
                      : 'bg-[#7B8C7D]/20'
                  }`}
                  title={`Level ${level}: ${isFilled ? 'Active' : 'Pending'}`}
                />
              );
            })}
          </div>

          {/* Everyday 7-Day Rhythm (M T W T F S S) */}
          <div className="mt-2.5 pt-2 border-t border-[#7B8C7D]/20">
            <div className="flex items-center justify-between text-[9px] font-mono text-[#3A3F3A]/60 px-0.5 mb-1.5">
              {DAYS_OF_WEEK.map((dayName, idx) => {
                const isToday = idx === todayDayIndex;
                const isPast = idx < todayDayIndex;
                return (
                  <div key={dayName} className="flex flex-col items-center gap-1">
                    <div
                      className={`w-1.5 rounded-full transition-all duration-300 ${
                        isToday
                          ? 'bg-[#7B8C7D] h-3 shadow-2xs'
                          : isPast
                          ? 'bg-[#7B8C7D]/50 h-2'
                          : 'bg-[#7B8C7D]/20 h-1.5'
                      }`}
                      title={`${dayName}${isToday ? ' (Today - Live Energy)' : ''}`}
                    />
                    <span
                      className={`${
                        isToday ? 'font-bold text-[#7B8C7D]' : 'opacity-70'
                      }`}
                    >
                      {dayName[0]}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center text-[10px] opacity-70">
              <span>{pendingTasksCount} tasks open</span>
              <span>{totalCompletedToday} completed today</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="pt-4 border-t border-[#D9D1C7] space-y-2">
        <button
          type="button"
          onClick={handleResetWorkspace}
          className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-2xl transition-all cursor-pointer ${
            resetSuccessNotice
              ? 'bg-[#7B8C7D]/15 text-[#7B8C7D] border border-[#7B8C7D]/30 font-medium'
              : 'opacity-70 hover:opacity-100 hover:text-[#7B8C7D] hover:bg-[#EAE7E0]'
          }`}
          title="Reset workspace to default"
        >
          <div className="flex items-center space-x-2">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>
              {resetSuccessNotice ? 'Template Restored ✓' : 'Reset to Clean Template'}
            </span>
          </div>
        </button>

        <div className="px-2 text-[10px] opacity-50 uppercase tracking-widest font-mono">
          Bento Grid • Sanctuary
        </div>
      </div>

      {/* Clean Template Reset Confirmation Modal */}
      {showResetConfirmModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#FBF9F5] border border-[#D9D1C7] rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-2xl bg-[#944D4D]/10 text-[#944D4D] flex items-center justify-center">
                <RotateCcw className="w-5 h-5" />
              </div>
              <button
                type="button"
                onClick={() => setShowResetConfirmModal(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#3A3F3A]/60 hover:text-[#3A3F3A] hover:bg-[#EAE7E0] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h3 className="font-serif text-lg font-medium text-[#3A3F3A]">
                Reset to Clean Template?
              </h3>
              <p className="text-xs text-[#3A3F3A]/70 mt-1.5 leading-relaxed">
                This will restore all pages, tasks, habit matrix, reading shelf, and daily flow to the pristine default template. Any custom items or edits will be reset.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#D9D1C7]/60">
              <button
                type="button"
                onClick={() => setShowResetConfirmModal(false)}
                className="px-3.5 py-2 rounded-xl text-xs font-medium text-[#3A3F3A]/80 hover:bg-[#EAE7E0] border border-[#D9D1C7] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="px-3.5 py-2 rounded-xl text-xs font-medium bg-[#944D4D] hover:bg-[#7E3D3D] text-white transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Confirm Reset</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

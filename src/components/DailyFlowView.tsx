import React, { useState, useEffect } from 'react';
import { DailyFocus } from '../types';
import { NotionCallout } from './NotionCallout';
import { NotionToggle } from './NotionToggle';
import { FlowStateModal } from './FlowStateModal';
import { ScheduleBlockModal } from './ScheduleBlockModal';
import { Check, Plus, Clock, Sparkles, Trash2, RotateCcw, Copy, RefreshCw, Flame } from 'lucide-react';

interface DailyFlowViewProps {
  daily: DailyFocus;
  onUpdateDaily: (updated: DailyFocus) => void;
}

const INSPIRATIONAL_QUOTES = [
  { text: 'Simplicity is about subtracting the obvious and adding the meaningful.', author: 'John Maeda' },
  { text: 'You do not rise to the level of your goals. You fall to the level of your systems.', author: 'James Clear' },
  { text: 'Clarity about what matters provides clarity about what does not.', author: 'Cal Newport' },
  { text: 'The impediment to action advances action. What stands in the way becomes the way.', author: 'Marcus Aurelius' },
  { text: 'Less but better. Live by design, not by default.', author: 'Greg McKeown' },
  { text: 'Nature does not hurry, yet everything is accomplished.', author: 'Lao Tzu' },
];

export const DailyFlowView: React.FC<DailyFlowViewProps> = ({ daily, onUpdateDaily }) => {
  const [newPriorityText, setNewPriorityText] = useState('');
  const [newTimeBlock, setNewTimeBlock] = useState({ time: '', task: '', type: 'deep' as const });
  const [showAddTimeBlock, setShowAddTimeBlock] = useState(false);
  const [showFlowModal, setShowFlowModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // New checklist items
  const [newMorningText, setNewMorningText] = useState('');
  const [showAddMorning, setShowAddMorning] = useState(false);
  const [newEveningText, setNewEveningText] = useState('');
  const [showAddEvening, setShowAddEvening] = useState(false);

  // Dynamic streak state
  const [streakDays, setStreakDays] = useState<number>(() => {
    const saved = localStorage.getItem('sanctuary_streak_days');
    return saved ? parseInt(saved, 10) : 12;
  });

  // Reset streak on workspace reset
  useEffect(() => {
    const handleWorkspaceReset = () => {
      setStreakDays(12);
    };
    window.addEventListener('sanctuary_workspace_reset', handleWorkspaceReset);
    return () => window.removeEventListener('sanctuary_workspace_reset', handleWorkspaceReset);
  }, []);

  const [copiedNotes, setCopiedNotes] = useState(false);
  const [confirmClearNotes, setConfirmClearNotes] = useState(false);

  // Toggle Big 3
  const toggleBigThree = (id: string) => {
    const updated = daily.bigThree.map((item) =>
      item.id === id ? { ...item, done: !item.done } : item
    );
    onUpdateDaily({ ...daily, bigThree: updated });
  };

  const addBigThree = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPriorityText.trim()) return;
    const newItem = {
      id: `b-${Date.now()}`,
      text: newPriorityText.trim(),
      done: false,
    };
    onUpdateDaily({ ...daily, bigThree: [...daily.bigThree, newItem] });
    setNewPriorityText('');
  };

  const deleteBigThree = (id: string) => {
    onUpdateDaily({
      ...daily,
      bigThree: daily.bigThree.filter((item) => item.id !== id),
    });
  };

  // Toggle Morning Checklist
  const toggleMorning = (id: string) => {
    const updated = daily.morningChecklist.map((item) =>
      item.id === id ? { ...item, done: !item.done } : item
    );
    onUpdateDaily({ ...daily, morningChecklist: updated });
  };

  const addMorningItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMorningText.trim()) return;
    const newItem = {
      id: `mc-${Date.now()}`,
      text: newMorningText.trim(),
      done: false,
    };
    onUpdateDaily({
      ...daily,
      morningChecklist: [...daily.morningChecklist, newItem],
    });
    setNewMorningText('');
    setShowAddMorning(false);
  };

  const deleteMorningItem = (id: string) => {
    onUpdateDaily({
      ...daily,
      morningChecklist: daily.morningChecklist.filter((item) => item.id !== id),
    });
  };

  // Toggle Evening Checklist
  const toggleEvening = (id: string) => {
    const updated = daily.eveningChecklist.map((item) =>
      item.id === id ? { ...item, done: !item.done } : item
    );
    onUpdateDaily({ ...daily, eveningChecklist: updated });
  };

  const addEveningItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEveningText.trim()) return;
    const newItem = {
      id: `ec-${Date.now()}`,
      text: newEveningText.trim(),
      done: false,
    };
    onUpdateDaily({
      ...daily,
      eveningChecklist: [...daily.eveningChecklist, newItem],
    });
    setNewEveningText('');
    setShowAddEvening(false);
  };

  const deleteEveningItem = (id: string) => {
    onUpdateDaily({
      ...daily,
      eveningChecklist: daily.eveningChecklist.filter((item) => item.id !== id),
    });
  };

  // Shuffle Quote
  const handleShuffleQuote = () => {
    const currentIdx = INSPIRATIONAL_QUOTES.findIndex((q) => q.text === daily.quote.text);
    const nextIdx = (currentIdx + 1) % INSPIRATIONAL_QUOTES.length;
    onUpdateDaily({
      ...daily,
      quote: INSPIRATIONAL_QUOTES[nextIdx],
    });
  };

  // Add Time Block
  const handleAddTimeBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTimeBlock.time.trim() || !newTimeBlock.task.trim()) return;
    const newBlock = {
      id: `tb-${Date.now()}`,
      time: newTimeBlock.time.trim(),
      task: newTimeBlock.task.trim(),
      type: newTimeBlock.type,
    };
    onUpdateDaily({
      ...daily,
      timeBlocks: [...daily.timeBlocks, newBlock],
    });
    setNewTimeBlock({ time: '', task: '', type: 'deep' });
    setShowAddTimeBlock(false);
  };

  const deleteTimeBlock = (id: string) => {
    onUpdateDaily({
      ...daily,
      timeBlocks: daily.timeBlocks.filter((b) => b.id !== id),
    });
  };

  const handleIncrementStreak = () => {
    const next = streakDays + 1;
    setStreakDays(next);
    localStorage.setItem('sanctuary_streak_days', next.toString());
  };

  const handleCopyNotes = () => {
    navigator.clipboard.writeText(daily.quickNotes);
    setCopiedNotes(true);
    setTimeout(() => setCopiedNotes(false), 2000);
  };

  const handleClearNotes = () => {
    if (!confirmClearNotes) {
      setConfirmClearNotes(true);
      setTimeout(() => setConfirmClearNotes(false), 3500);
      return;
    }
    onUpdateDaily({ ...daily, quickNotes: '' });
    setConfirmClearNotes(false);
  };

  const handleSaveModalBlock = (block: { time: string; task: string; type: 'deep' | 'admin' | 'rest' }) => {
    const newBlock = {
      id: `tb-${Date.now()}`,
      time: block.time,
      task: block.task,
      type: block.type,
    };
    onUpdateDaily({
      ...daily,
      timeBlocks: [...daily.timeBlocks, newBlock],
    });
    setTimeout(() => {
      const el = document.getElementById('time-architecture-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);
  };

  const totalPriorityCount = daily.bigThree.length;
  const completedPriorityCount = daily.bigThree.filter((b) => b.done).length;
  const progressPercent =
    totalPriorityCount > 0
      ? Math.round((completedPriorityCount / totalPriorityCount) * 100)
      : 0;

  return (
    <div className="space-y-6 pb-16">
      {/* Flow State Focus Modal */}
      <FlowStateModal
        isOpen={showFlowModal}
        onClose={() => setShowFlowModal(false)}
        tasks={daily.bigThree}
        onCompleteTask={(id) => {
          toggleBigThree(id);
        }}
      />

      {/* Schedule Block Modal */}
      <ScheduleBlockModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onSave={handleSaveModalBlock}
      />

      {/* Bento Grid Layout Container */}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-5">
        {/* Bento Cell 1: Main Focus Hero Card (col-span-4) */}
        <section className="lg:col-span-4 bg-[#E3E8E1] rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-[#D9D1C7]/60 flex flex-col justify-between">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase tracking-widest text-[#7B8C7D] font-bold block">
                Main Focus & Intent
              </span>
              <span className="text-xs font-mono font-medium text-[#3A3F3A]/70">
                {completedPriorityCount} / {totalPriorityCount} completed ({progressPercent}%)
              </span>
            </div>

            <h3 className="text-3xl sm:text-4xl font-serif leading-tight mb-3 text-[#3A3F3A]">
              Curating Deliberate Daily Flow
            </h3>
            <p className="text-xs sm:text-sm max-w-md text-[#3A3F3A]/70 mb-6 leading-relaxed">
              Prioritize unhurried execution. Complete high-leverage outcomes before introducing new cognitive inputs.
            </p>

            {/* Big 3 Tasks inside Main Focus Card */}
            <div className="space-y-2 mb-6">
              {daily.bigThree.map((item) => (
                <div
                  key={item.id}
                  className="group flex items-center justify-between gap-3 p-3 rounded-2xl bg-white/70 backdrop-blur-xs border border-[#D9D1C7]/50 hover:bg-white transition-all"
                >
                  <button
                    type="button"
                    onClick={() => toggleBigThree(item.id)}
                    className="flex items-center gap-3 grow text-left cursor-pointer"
                  >
                    <span
                      className={`w-4 h-4 rounded-md shrink-0 flex items-center justify-center transition-colors border ${
                        item.done
                          ? 'bg-[#7B8C7D] border-[#7B8C7D] text-[#F5F2ED]'
                          : 'border-[#3A3F3A]/40 bg-white hover:border-[#7B8C7D]'
                      }`}
                    >
                      {item.done && <Check className="w-3 h-3 stroke-[2.5]" />}
                    </span>
                    <span
                      className={`text-xs sm:text-sm font-medium ${
                        item.done ? 'line-through text-[#3A3F3A]/40' : 'text-[#3A3F3A]'
                      }`}
                    >
                      {item.text}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteBigThree(item.id)}
                    className="opacity-0 group-hover:opacity-100 text-[#3A3F3A]/40 hover:text-[#944D4D] p-1 transition-opacity cursor-pointer"
                    title="Remove priority"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {/* Add priority input form */}
              <form onSubmit={addBigThree} className="pt-1 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add another deliberate priority..."
                  value={newPriorityText}
                  onChange={(e) => setNewPriorityText(e.target.value)}
                  className="grow px-4 py-2 text-xs bg-white/60 border border-[#D9D1C7]/60 rounded-full text-[#3A3F3A] placeholder-[#3A3F3A]/40 focus:outline-none focus:border-[#7B8C7D] focus:bg-white transition-all"
                />
                <button
                  type="submit"
                  disabled={!newPriorityText.trim()}
                  className="px-4 py-2 text-xs font-medium rounded-full bg-[#7B8C7D] text-[#F5F2ED] hover:bg-[#68786A] disabled:opacity-40 transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </form>
            </div>

            {/* Bento Action buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowFlowModal(true)}
                className="px-6 py-2.5 bg-[#7B8C7D] text-[#F5F2ED] rounded-full text-xs font-medium hover:bg-[#68786A] transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Begin Flow State</span>
              </button>
              <button
                type="button"
                onClick={() => setShowScheduleModal(true)}
                className="px-6 py-2.5 border border-[#7B8C7D] text-[#7B8C7D] hover:bg-[#7B8C7D]/10 rounded-full text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Schedule Block</span>
              </button>
            </div>
          </div>

          {/* Decorative soft circle from design */}
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-[#F5F2ED] opacity-40 rounded-full pointer-events-none" />
        </section>

        {/* Bento Cell 2: Habit Tracking Card (col-span-2) */}
        <section className="lg:col-span-2 bg-white rounded-3xl p-6 border border-[#E3E8E1] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs uppercase tracking-widest opacity-60 font-bold text-[#3A3F3A]">
                Morning Rituals
              </h4>
              <button
                type="button"
                onClick={() => setShowAddMorning(!showAddMorning)}
                className="text-[11px] text-[#7B8C7D] hover:text-[#68786A] font-medium flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Add
              </button>
            </div>

            {/* Add Morning Ritual Form */}
            {showAddMorning && (
              <form onSubmit={addMorningItem} className="mb-3 flex items-center gap-1.5">
                <input
                  type="text"
                  placeholder="New morning ritual..."
                  value={newMorningText}
                  onChange={(e) => setNewMorningText(e.target.value)}
                  className="grow px-3 py-1.5 text-xs bg-[#F5F2ED] border border-[#D9D1C7] rounded-xl text-[#3A3F3A] focus:outline-none focus:border-[#7B8C7D]"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!newMorningText.trim()}
                  className="px-2.5 py-1.5 bg-[#7B8C7D] text-[#F5F2ED] rounded-xl text-xs font-medium hover:bg-[#68786A] disabled:opacity-40 cursor-pointer"
                >
                  Save
                </button>
              </form>
            )}

            <div className="space-y-2.5">
              {daily.morningChecklist.map((item) => (
                <div
                  key={item.id}
                  className="group flex items-center justify-between gap-2 py-0.5"
                >
                  <button
                    type="button"
                    onClick={() => toggleMorning(item.id)}
                    className="grow flex items-center justify-between text-left cursor-pointer"
                  >
                    <span
                      className={`text-xs sm:text-sm font-medium transition-colors ${
                        item.done ? 'opacity-40 line-through text-[#3A3F3A]' : 'text-[#3A3F3A]'
                      }`}
                    >
                      {item.text}
                    </span>
                    <div
                      className={`w-4 h-4 rounded-md transition-all flex items-center justify-center shrink-0 ml-2 ${
                        item.done
                          ? 'border border-[#7B8C7D] bg-[#7B8C7D] text-[#F5F2ED]'
                          : 'border border-[#3A3F3A]/40 bg-white group-hover:border-[#7B8C7D]'
                      }`}
                    >
                      {item.done && <Check className="w-3 h-3 stroke-[2.5]" />}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteMorningItem(item.id)}
                    className="opacity-0 group-hover:opacity-100 text-[#3A3F3A]/40 hover:text-[#944D4D] p-0.5 transition-opacity cursor-pointer shrink-0"
                    title="Remove ritual"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Streak Metric Block from design */}
          <div
            onClick={handleIncrementStreak}
            className="mt-6 p-4 bg-[#F5F2ED] hover:bg-[#EAE7E0]/70 transition-colors rounded-2xl border border-[#E3E8E1] cursor-pointer group select-none"
            title="Click to advance streak"
          >
            <div className="flex items-center justify-between mb-1">
              <p className="text-[10px] uppercase tracking-widest opacity-60 font-bold">
                Consistent Streak
              </p>
              <Flame className="w-3.5 h-3.5 text-[#7B8C7D] group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-3xl font-serif text-[#3A3F3A]">
              {streakDays} <span className="text-sm font-sans opacity-60 font-normal">Days unbroken</span>
            </p>
          </div>
        </section>

        {/* Bento Cell 3: Reflections Card (col-span-2) */}
        <section className="lg:col-span-2 bg-[#EAE7E0] rounded-3xl p-6 flex flex-col justify-between border border-[#D9D1C7] relative group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs uppercase tracking-widest opacity-60 font-bold text-[#3A3F3A]">
                Reflections
              </h4>
              <button
                type="button"
                onClick={handleShuffleQuote}
                className="text-[10px] text-[#3A3F3A]/60 hover:text-[#3A3F3A] flex items-center gap-1 cursor-pointer bg-white/50 px-2 py-0.5 rounded-full hover:bg-white transition-colors"
                title="Shuffle wisdom quote"
              >
                <RefreshCw className="w-2.5 h-2.5" /> Next
              </button>
            </div>
            <p className="font-serif italic text-base leading-relaxed text-[#3A3F3A]">
              &ldquo;{daily.quote.text}&rdquo;
            </p>
          </div>
          <div className="text-[10px] opacity-60 italic mt-6 font-mono flex justify-between items-center">
            <span>— {daily.quote.author}</span>
            <span>Reflective Pause</span>
          </div>
        </section>

        {/* Bento Cell 4: Weekly Progress Highlight Card (col-span-2) */}
        <section className="lg:col-span-2 bg-[#7B8C7D] text-[#F5F2ED] rounded-3xl p-6 flex items-center justify-center relative overflow-hidden min-h-[160px]">
          <div className="text-center z-10 space-y-1">
            <p className="text-[10px] uppercase tracking-[0.2em] opacity-80 font-medium">
              Daily Completion
            </p>
            <p className="text-4xl sm:text-5xl font-serif tracking-tight">{progressPercent}%</p>
            <p className="text-[11px] opacity-75">
              {completedPriorityCount} of {totalPriorityCount} milestones locked
            </p>
          </div>
          {/* Subtle dot matrix pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(#F5F2ED 1px, transparent 1px)',
              backgroundSize: '12px 12px',
            }}
          />
        </section>

        {/* Bento Cell 5: Evening Routine & Next Focus (col-span-2) */}
        <section className="lg:col-span-2 bg-white rounded-3xl p-6 border border-[#E3E8E1] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] uppercase tracking-widest opacity-60 font-bold text-[#3A3F3A]">
                Evening Wind-Down
              </p>
              <button
                type="button"
                onClick={() => setShowAddEvening(!showAddEvening)}
                className="text-[11px] text-[#7B8C7D] hover:text-[#68786A] font-medium flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Add
              </button>
            </div>

            {/* Add Evening Ritual Form */}
            {showAddEvening && (
              <form onSubmit={addEveningItem} className="mb-3 flex items-center gap-1.5">
                <input
                  type="text"
                  placeholder="New evening ritual..."
                  value={newEveningText}
                  onChange={(e) => setNewEveningText(e.target.value)}
                  className="grow px-3 py-1.5 text-xs bg-[#F5F2ED] border border-[#D9D1C7] rounded-xl text-[#3A3F3A] focus:outline-none focus:border-[#7B8C7D]"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!newEveningText.trim()}
                  className="px-2.5 py-1.5 bg-[#7B8C7D] text-[#F5F2ED] rounded-xl text-xs font-medium hover:bg-[#68786A] disabled:opacity-40 cursor-pointer"
                >
                  Save
                </button>
              </form>
            )}

            <div className="space-y-2 mt-2">
              {daily.eveningChecklist.map((item) => (
                <div
                  key={item.id}
                  className="group flex items-center justify-between gap-2 py-0.5"
                >
                  <button
                    type="button"
                    onClick={() => toggleEvening(item.id)}
                    className="grow flex items-center justify-between text-left cursor-pointer"
                  >
                    <span
                      className={`text-xs font-medium transition-colors ${
                        item.done ? 'opacity-40 line-through text-[#3A3F3A]' : 'text-[#3A3F3A]'
                      }`}
                    >
                      {item.text}
                    </span>
                    <div
                      className={`w-3.5 h-3.5 rounded transition-all flex items-center justify-center shrink-0 ml-2 ${
                        item.done
                          ? 'border border-[#7B8C7D] bg-[#7B8C7D] text-[#F5F2ED]'
                          : 'border border-[#3A3F3A]/40 bg-white group-hover:border-[#7B8C7D]'
                      }`}
                    >
                      {item.done && <Check className="w-2.5 h-2.5 stroke-[2.5]" />}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteEveningItem(item.id)}
                    className="opacity-0 group-hover:opacity-100 text-[#3A3F3A]/40 hover:text-[#944D4D] p-0.5 transition-opacity cursor-pointer shrink-0"
                    title="Remove ritual"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-4 border-t border-[#E3E8E1] text-[11px] opacity-60 flex items-center justify-between">
            <span>Next session</span>
            <span className="font-mono">Tomorrow 08:30</span>
          </div>
        </section>

        {/* Bento Cell 6: Time Architecture Schedule (col-span-4) */}
        <section id="time-architecture-section" className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border border-[#E3E8E1] scroll-mt-20">
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase tracking-widest text-[#7B8C7D] font-bold block">
                Daily Structure
              </span>
              <h4 className="font-serif text-2xl text-[#3A3F3A]">Time Architecture</h4>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowScheduleModal(true)}
                className="px-4 py-1.5 rounded-full bg-[#7B8C7D] text-[#F5F2ED] hover:bg-[#68786A] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <Clock className="w-3.5 h-3.5" /> Schedule Block
              </button>
              <button
                type="button"
                onClick={() => setShowAddTimeBlock(!showAddTimeBlock)}
                className="px-3 py-1.5 rounded-full border border-[#D9D1C7] hover:border-[#7B8C7D] text-xs font-medium text-[#3A3F3A] flex items-center gap-1 transition-colors cursor-pointer"
                title="Quick inline add"
              >
                <Plus className="w-3.5 h-3.5 text-[#7B8C7D]" />
              </button>
            </div>
          </div>

          {/* Add Block Form */}
          {showAddTimeBlock && (
            <form
              onSubmit={handleAddTimeBlock}
              className="mb-4 p-4 bg-[#F5F2ED] border border-[#D9D1C7] rounded-2xl space-y-3"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Time (e.g., 09:00 – 10:30)"
                  value={newTimeBlock.time}
                  onChange={(e) => setNewTimeBlock({ ...newTimeBlock, time: e.target.value })}
                  className="px-3 py-2 text-xs bg-white border border-[#D9D1C7] rounded-xl text-[#3A3F3A] focus:outline-none focus:border-[#7B8C7D]"
                />
                <input
                  type="text"
                  placeholder="Activity / Focus Area"
                  value={newTimeBlock.task}
                  onChange={(e) => setNewTimeBlock({ ...newTimeBlock, task: e.target.value })}
                  className="px-3 py-2 text-xs bg-white border border-[#D9D1C7] rounded-xl text-[#3A3F3A] focus:outline-none focus:border-[#7B8C7D]"
                />
                <select
                  value={newTimeBlock.type}
                  onChange={(e) =>
                    setNewTimeBlock({ ...newTimeBlock, type: e.target.value as 'deep' | 'admin' | 'rest' })
                  }
                  className="px-3 py-2 text-xs bg-white border border-[#D9D1C7] rounded-xl text-[#3A3F3A] focus:outline-none focus:border-[#7B8C7D]"
                >
                  <option value="deep">Deep Focus (Sage)</option>
                  <option value="admin">Admin / Batch (Warm Beige)</option>
                  <option value="rest">Rest / Movement (Soft Sand)</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddTimeBlock(false)}
                  className="px-4 py-1.5 text-xs text-[#3A3F3A]/70 hover:text-[#3A3F3A] rounded-full"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs bg-[#7B8C7D] text-[#F5F2ED] rounded-full font-medium hover:bg-[#68786A]"
                >
                  Save Schedule Block
                </button>
              </div>
            </form>
          )}

          {/* Time Blocks Table */}
          <div className="space-y-2">
            {daily.timeBlocks.map((block) => {
              const badgeStyles = {
                deep: 'bg-[#E3E8E1] text-[#3A3F3A] border-[#D9D1C7]',
                admin: 'bg-[#EAE7E0] text-[#3A3F3A] border-[#D9D1C7]',
                rest: 'bg-[#F5F2ED] text-[#3A3F3A]/80 border-[#D9D1C7]',
              };

              return (
                <div
                  key={block.id}
                  className="group flex items-center justify-between p-3 rounded-2xl bg-[#F5F2ED]/60 hover:bg-[#F5F2ED] border border-transparent hover:border-[#D9D1C7] transition-all"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-editorial-mono text-xs text-[#3A3F3A]/70 w-28 shrink-0">
                      {block.time}
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-[#3A3F3A]">
                      {block.task}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-full border capitalize font-semibold ${badgeStyles[block.type]}`}
                    >
                      {block.type}
                    </span>
                    <button
                      type="button"
                      onClick={() => deleteTimeBlock(block.id)}
                      className="opacity-0 group-hover:opacity-100 text-[#3A3F3A]/40 hover:text-[#944D4D] p-1 transition-opacity cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Bento Cell 7: Quiet Braindump & Stream of Thought (col-span-2) */}
        <section className="lg:col-span-2 bg-[#EAE7E0]/60 rounded-3xl p-6 border border-[#D9D1C7] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase tracking-widest opacity-60 font-bold text-[#3A3F3A]">
                Stream of Thought
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleCopyNotes}
                  className="p-1 rounded-lg hover:bg-white/60 text-[#3A3F3A]/60 hover:text-[#3A3F3A] transition-colors cursor-pointer"
                  title="Copy scratchpad notes"
                >
                  {copiedNotes ? <Check className="w-3 h-3 text-[#7B8C7D]" /> : <Copy className="w-3 h-3" />}
                </button>
                <button
                  type="button"
                  onClick={handleClearNotes}
                  className={`p-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                    confirmClearNotes
                      ? 'bg-[#944D4D]/15 text-[#944D4D] px-2 text-[10px] font-medium border border-[#944D4D]/30'
                      : 'hover:bg-white/60 text-[#3A3F3A]/60 hover:text-[#944D4D]'
                  }`}
                  title={confirmClearNotes ? 'Click again to confirm clear' : 'Clear notes'}
                >
                  <RotateCcw className={`w-3 h-3 ${confirmClearNotes ? 'animate-spin' : ''}`} />
                  {confirmClearNotes && <span>Clear?</span>}
                </button>
              </div>
            </div>
            <textarea
              rows={6}
              value={daily.quickNotes}
              onChange={(e) => onUpdateDaily({ ...daily, quickNotes: e.target.value })}
              placeholder="Capture unfiltered ideas, friction to discard, or quiet realisations..."
              className="w-full p-3.5 rounded-2xl bg-white/70 border border-[#D9D1C7]/60 text-xs sm:text-sm text-[#3A3F3A] leading-relaxed focus:outline-none focus:border-[#7B8C7D] focus:bg-white resize-none placeholder-[#3A3F3A]/40 transition-all"
            />
          </div>
          <div className="mt-3 text-[10px] opacity-50 italic flex items-center justify-between">
            <span>Clarity arises from regular uncluttering.</span>
            <span className="font-mono">{copiedNotes ? 'Copied!' : 'Auto-saved'}</span>
          </div>
        </section>
      </div>
    </div>
  );
};

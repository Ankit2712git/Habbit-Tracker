import React, { useState } from 'react';
import { HabitItem, HabitCategory } from '../types';
import { NotionCallout } from './NotionCallout';
import { Check, Plus, RotateCcw, Flame, Sparkles, Trash2 } from 'lucide-react';

interface HabitTrackerViewProps {
  habits: HabitItem[];
  onUpdateHabits: (habits: HabitItem[]) => void;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const HabitTrackerView: React.FC<HabitTrackerViewProps> = ({ habits, onUpdateHabits }) => {
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState<HabitCategory>('Mind');
  const [isAdding, setIsAdding] = useState(false);
  const [confirmResetWeek, setConfirmResetWeek] = useState(false);
  const [resetNotice, setResetNotice] = useState(false);

  // Toggle habit day
  const toggleDay = (habitId: string, dayIndex: number) => {
    const updated = habits.map((habit) => {
      if (habit.id === habitId) {
        const nextDays = [...habit.days];
        nextDays[dayIndex] = !nextDays[dayIndex];
        // Calculate dynamic streak
        const completedCount = nextDays.filter(Boolean).length;
        return {
          ...habit,
          days: nextDays,
          streak: nextDays[dayIndex] ? habit.streak + 1 : Math.max(0, habit.streak - 1),
        };
      }
      return habit;
    });
    onUpdateHabits(updated);
  };

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    const newHabit: HabitItem = {
      id: `h-${Date.now()}`,
      name: newHabitName.trim(),
      category: newHabitCategory,
      streak: 1,
      days: [false, false, false, false, false, false, false],
    };

    onUpdateHabits([...habits, newHabit]);
    setNewHabitName('');
    setIsAdding(false);
  };

  const handleDeleteHabit = (habitId: string) => {
    onUpdateHabits(habits.filter((h) => h.id !== habitId));
  };

  const handleResetWeek = () => {
    if (!confirmResetWeek) {
      setConfirmResetWeek(true);
      setTimeout(() => setConfirmResetWeek(false), 3500);
      return;
    }
    const reset = habits.map((h) => ({
      ...h,
      days: [false, false, false, false, false, false, false],
    }));
    onUpdateHabits(reset);
    setConfirmResetWeek(false);
    setResetNotice(true);
    setTimeout(() => setResetNotice(false), 2500);
  };

  // Calculate overall weekly completion
  const totalSlots = habits.length * 7;
  const completedSlots = habits.reduce(
    (acc, habit) => acc + habit.days.filter(Boolean).length,
    0
  );
  const overallRate = totalSlots > 0 ? Math.round((completedSlots / totalSlots) * 100) : 0;

  const getCategoryBadge = (category: HabitCategory) => {
    switch (category) {
      case 'Mind':
        return 'bg-[#E3E8E1] text-[#3A3F3A] border-[#D9D1C7]';
      case 'Body':
        return 'bg-[#EAE7E0] text-[#3A3F3A] border-[#D9D1C7]';
      case 'Craft':
        return 'bg-[#F5F2ED] text-[#7B8C7D] border-[#D9D1C7] font-semibold';
      case 'Rhythm':
        return 'bg-[#E3E8E1] text-[#7B8C7D] border-[#D9D1C7] font-semibold';
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Mindful Habit Callout */}
      <NotionCallout variant="beige" icon="🌱">
        <p className="font-serif italic text-base text-[#3A3F3A]">
          &ldquo;You do not rise to the level of your goals. You fall to the level of your systems.&rdquo;
        </p>
        <p className="text-xs text-[#3A3F3A]/70 mt-1">
          Consistency is not perfection; it is returning to the practice without friction or self-judgment.
        </p>
      </NotionCallout>

      {/* Habit Metrics Banner Bento Card */}
      <div className="bg-white border border-[#E3E8E1] rounded-3xl p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#7B8C7D] block mb-1">
            Weekly Rhythm Consistency
          </span>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl sm:text-4xl font-serif text-[#3A3F3A]">
              {overallRate}%
            </span>
            <span className="text-xs text-[#3A3F3A]/60 font-mono">
              ({completedSlots} of {totalSlots} deliberate practices)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetWeek}
            className={`px-4 py-2 text-xs rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
              confirmResetWeek
                ? 'bg-[#944D4D]/15 text-[#944D4D] border border-[#944D4D]/40 font-medium'
                : resetNotice
                ? 'bg-[#7B8C7D]/15 text-[#7B8C7D] border border-[#7B8C7D]/40 font-medium'
                : 'text-[#3A3F3A]/70 hover:text-[#3A3F3A] bg-[#F5F2ED] hover:bg-[#EAE7E0] border border-[#D9D1C7]'
            }`}
          >
            <RotateCcw className={`w-3.5 h-3.5 ${confirmResetWeek ? 'animate-spin text-[#944D4D]' : 'text-[#7B8C7D]'}`} />
            <span>
              {confirmResetWeek
                ? 'Click to Confirm Reset'
                : resetNotice
                ? 'Week Reset ✓'
                : 'Reset Week'}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setIsAdding(!isAdding)}
            className="px-5 py-2 text-xs bg-[#7B8C7D] text-[#F5F2ED] rounded-full font-medium hover:bg-[#68786A] transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" /> New Ritual
          </button>
        </div>
      </div>

      {/* Add Habit Form */}
      {isAdding && (
        <form
          onSubmit={handleAddHabit}
          className="p-6 bg-white border border-[#E3E8E1] rounded-3xl space-y-4 shadow-xs"
        >
          <div className="text-[10px] font-bold text-[#7B8C7D] uppercase tracking-widest">
            Add Daily Ritual
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              required
              placeholder="Habit name (e.g. 20m Evening Reading)"
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              className="sm:col-span-2 px-4 py-2.5 text-xs bg-[#F5F2ED] border border-[#D9D1C7] rounded-2xl text-[#3A3F3A] focus:outline-none focus:border-[#7B8C7D]"
            />
            <select
              value={newHabitCategory}
              onChange={(e) => setNewHabitCategory(e.target.value as HabitCategory)}
              className="px-3 py-2.5 text-xs bg-[#F5F2ED] border border-[#D9D1C7] rounded-2xl text-[#3A3F3A] focus:outline-none"
            >
              <option value="Mind">Mind</option>
              <option value="Body">Body</option>
              <option value="Craft">Craft</option>
              <option value="Rhythm">Rhythm</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 text-xs text-[#3A3F3A]/70 hover:text-[#3A3F3A] rounded-full"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs bg-[#7B8C7D] text-[#F5F2ED] font-medium rounded-full hover:bg-[#68786A]"
            >
              Save Habit
            </button>
          </div>
        </form>
      )}

      {/* Habit Matrix Table */}
      <div className="border border-[#E3E8E1] rounded-3xl overflow-x-auto bg-white shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#D9D1C7] bg-[#F5F2ED] text-xs text-[#3A3F3A] font-semibold">
              <th className="py-3 px-5 min-w-[200px]">Habit & Discipline</th>
              <th className="py-3 px-3 w-24">Category</th>
              {DAYS.map((day) => (
                <th key={day} className="py-3 px-2 text-center w-12 text-[11px] font-mono">
                  {day}
                </th>
              ))}
              <th className="py-3 px-4 w-32 text-center">Progress</th>
              <th className="py-3 px-3 w-20 text-center">Streak</th>
              <th className="py-3 px-3 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E3E8E1] text-xs">
            {habits.map((habit) => {
              const completedCount = habit.days.filter(Boolean).length;
              const percent = Math.round((completedCount / 7) * 100);

              return (
                <tr key={habit.id} className="group hover:bg-[#F5F2ED]/60 transition-colors">
                  <td className="py-3.5 px-5">
                    <span className="font-medium text-[#3A3F3A] text-sm block">
                      {habit.name}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full border text-[10px] ${getCategoryBadge(
                        habit.category
                      )}`}
                    >
                      {habit.category}
                    </span>
                  </td>
                  {habit.days.map((checked, dayIdx) => (
                    <td key={dayIdx} className="py-3.5 px-2 text-center">
                      <button
                        type="button"
                        onClick={() => toggleDay(habit.id, dayIdx)}
                        className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center transition-all cursor-pointer border ${
                          checked
                            ? 'bg-[#7B8C7D] border-[#7B8C7D] text-[#F5F2ED] shadow-2xs'
                            : 'border-[#3A3F3A]/40 bg-white hover:border-[#7B8C7D]'
                        }`}
                        title={`${DAYS[dayIdx]}: ${checked ? 'Completed' : 'Pending'}`}
                      >
                        {checked && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                      </button>
                    </td>
                  ))}
                  <td className="py-3.5 px-4">
                    <div className="w-full bg-[#E3E8E1] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#7B8C7D] h-full rounded-full transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-[#3A3F3A]/60 font-mono block text-center mt-1">
                      {completedCount}/7 ({percent}%)
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span className="inline-flex items-center gap-1 text-xs font-mono text-[#3A3F3A] bg-[#F5F2ED] border border-[#D9D1C7] px-2 py-0.5 rounded-full">
                      <Flame className="w-3 h-3 text-[#7B8C7D]" />
                      {habit.streak}d
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleDeleteHabit(habit.id)}
                      className="opacity-0 group-hover:opacity-100 text-[#3A3F3A]/40 hover:text-[#944D4D] p-1 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

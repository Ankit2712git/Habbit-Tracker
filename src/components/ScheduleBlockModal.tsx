import React, { useState, useEffect } from 'react';
import { X, Clock, Sparkles, Check } from 'lucide-react';
import { TimeBlock } from '../types';

interface ScheduleBlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (block: Omit<TimeBlock, 'id'>) => void;
  initialTime?: string;
  initialTask?: string;
  initialType?: 'deep' | 'admin' | 'rest';
}

const TIME_PRESETS = [
  '08:00 – 09:30',
  '10:00 – 11:30',
  '11:45 – 12:45',
  '13:30 – 15:00',
  '15:30 – 16:30',
  '17:00 – 18:00',
];

export const ScheduleBlockModal: React.FC<ScheduleBlockModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTime = '',
  initialTask = '',
  initialType = 'deep',
}) => {
  const [time, setTime] = useState(initialTime);
  const [task, setTask] = useState(initialTask);
  const [type, setType] = useState<'deep' | 'admin' | 'rest'>(initialType);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTime(initialTime || '09:00 – 10:30');
      setTask(initialTask);
      setType(initialType);
      setSavedSuccess(false);
    }
  }, [isOpen, initialTime, initialTask, initialType]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!time.trim() || !task.trim()) return;

    onSave({
      time: time.trim(),
      task: task.trim(),
      type,
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3A3F3A]/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-[#F5F2ED] border border-[#D9D1C7] rounded-3xl w-full max-w-md shadow-2xl p-6 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#D9D1C7]/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#E3E8E1] flex items-center justify-center text-[#7B8C7D]">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg text-[#3A3F3A]">Schedule Focus Block</h3>
              <p className="text-[11px] text-[#3A3F3A]/60">Carve out intentional time for deliberate practice</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#EAE7E0] text-[#3A3F3A]/60 hover:text-[#3A3F3A] flex items-center justify-center transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {/* Quick Time Presets */}
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest text-[#3A3F3A]/70 mb-1.5">
              Time Slot Presets
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {TIME_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setTime(preset)}
                  className={`px-2.5 py-1 text-[11px] font-mono rounded-lg border transition-all cursor-pointer ${
                    time === preset
                      ? 'bg-[#7B8C7D] text-white border-[#7B8C7D] font-medium shadow-2xs'
                      : 'bg-white/80 hover:bg-white text-[#3A3F3A]/80 border-[#D9D1C7]'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
            <input
              type="text"
              required
              placeholder="Or enter custom time (e.g., 09:30 – 11:00)"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3.5 py-2 text-xs font-mono bg-white border border-[#D9D1C7] rounded-xl text-[#3A3F3A] focus:outline-none focus:border-[#7B8C7D] transition-colors"
            />
          </div>

          {/* Activity / Focus Area */}
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest text-[#3A3F3A]/70 mb-1.5">
              Focus Intention / Activity
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="e.g., System Architecture Review & Draft"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#D9D1C7] rounded-xl text-[#3A3F3A] focus:outline-none focus:border-[#7B8C7D] transition-colors"
            />
          </div>

          {/* Block Type */}
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest text-[#3A3F3A]/70 mb-1.5">
              Block Mode
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setType('deep')}
                className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                  type === 'deep'
                    ? 'bg-[#E3E8E1] border-[#7B8C7D] text-[#3A3F3A] font-medium shadow-2xs'
                    : 'bg-white/70 border-[#D9D1C7] text-[#3A3F3A]/70 hover:bg-white'
                }`}
              >
                <span className="block text-xs font-serif">Deep Focus</span>
                <span className="block text-[10px] text-[#7B8C7D] mt-0.5">High Cognition</span>
              </button>

              <button
                type="button"
                onClick={() => setType('admin')}
                className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                  type === 'admin'
                    ? 'bg-[#EAE7E0] border-[#7B8C7D] text-[#3A3F3A] font-medium shadow-2xs'
                    : 'bg-white/70 border-[#D9D1C7] text-[#3A3F3A]/70 hover:bg-white'
                }`}
              >
                <span className="block text-xs font-serif">Admin / Batch</span>
                <span className="block text-[10px] text-[#3A3F3A]/60 mt-0.5">Operations</span>
              </button>

              <button
                type="button"
                onClick={() => setType('rest')}
                className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                  type === 'rest'
                    ? 'bg-[#F2ECE4] border-[#7B8C7D] text-[#3A3F3A] font-medium shadow-2xs'
                    : 'bg-white/70 border-[#D9D1C7] text-[#3A3F3A]/70 hover:bg-white'
                }`}
              >
                <span className="block text-xs font-serif">Rest / Motion</span>
                <span className="block text-[10px] text-[#3A3F3A]/60 mt-0.5">Recovery</span>
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#D9D1C7]/80">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-[#3A3F3A]/70 hover:text-[#3A3F3A] rounded-full transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!time.trim() || !task.trim()}
              className="px-5 py-2 bg-[#7B8C7D] hover:bg-[#68786A] text-[#F5F2ED] rounded-full text-xs font-medium transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Scheduled!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Add to Schedule</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

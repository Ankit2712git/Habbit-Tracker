import React, { useState, useEffect } from 'react';
import { NotionCallout } from './NotionCallout';
import { NotionToggle } from './NotionToggle';
import { Sparkles, Heart, Feather, Save, Check, Copy, RotateCcw } from 'lucide-react';

const STORAGE_KEY = 'sanctuary_weekly_reflection';

const DEFAULT_JOURNAL = {
  wins: 'Maintained unbroken morning sunlight & hydration ritual 6 out of 7 days. Completed the simplified schema without feeling hurried.',
  friction: 'Fell into the trap of checking email right before beginning creative work on Thursday, which fragmented the morning sprint.',
  simplify: 'Say no to the optional Friday sync; provide a clear asynchronous 3-bullet update instead.',
  gratitude: '1. The morning breeze through the window\n2. Hot roasted hojicha tea\n3. An uninterrupted 90 minutes of focused thinking',
};

export const ReflectionView: React.FC = () => {
  const [journal, setJournal] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved reflection', e);
    }
    return DEFAULT_JOURNAL;
  });

  const [savedNotice, setSavedNotice] = useState(false);
  const [copiedNotice, setCopiedNotice] = useState(false);

  // Auto-save whenever journal changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(journal));
    } catch (e) {
      console.warn('Failed to save reflection to localStorage', e);
    }
  }, [journal]);

  // Reset reflection on workspace reset event
  useEffect(() => {
    const handleWorkspaceReset = () => {
      setJournal(DEFAULT_JOURNAL);
    };
    window.addEventListener('sanctuary_workspace_reset', handleWorkspaceReset);
    return () => window.removeEventListener('sanctuary_workspace_reset', handleWorkspaceReset);
  }, []);

  const handleSave = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(journal));
    } catch (e) {
      console.warn('Failed to save reflection', e);
    }
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleCopyReflection = () => {
    const formatted = `## Weekly Synthesis & Quiet Reflection\n\n### 1. What brought genuine satisfaction?\n${journal.wins}\n\n### 2. Where did unnecessary friction occur?\n${journal.friction}\n\n### 3. What can I subtract or decline next cycle?\n${journal.simplify}\n\n### 4. Three grounded gratitudes from this week\n${journal.gratitude}`;
    navigator.clipboard.writeText(formatted);
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 2000);
  };

  const [confirmReset, setConfirmReset] = useState(false);
  const [clearedNotice, setClearedNotice] = useState(false);

  const handleResetReflection = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 3500);
      return;
    }
    const cleared = {
      wins: '',
      friction: '',
      simplify: '',
      gratitude: '',
    };
    setJournal(cleared);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cleared));
    setConfirmReset(false);
    setClearedNotice(true);
    setTimeout(() => setClearedNotice(false), 2500);
  };

  return (
    <div className="space-y-6 pb-16">
      <NotionCallout variant="sage" icon="🍵">
        <p className="font-serif italic text-base text-[#3A3F3A]">
          &ldquo;We do not learn from experience... we learn from reflecting on experience.&rdquo;
        </p>
        <p className="text-xs text-[#3A3F3A]/70 mt-1">
          John Dewey • A quiet moment of honesty anchors the entire rhythm.
        </p>
      </NotionCallout>

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D9D1C7] pb-4">
        <div>
          <h2 className="text-lg font-serif text-[#3A3F3A]">Weekly Synthesis & Quiet Pauses</h2>
          <p className="text-xs text-[#3A3F3A]/60 mt-0.5">
            Reflective prompts designed to reduce cognitive residue • Auto-persisted
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyReflection}
            className="px-3.5 py-2 text-xs border border-[#D9D1C7] hover:border-[#7B8C7D] bg-white text-[#3A3F3A] rounded-full font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Copy reflection to clipboard"
          >
            {copiedNotice ? <Check className="w-3.5 h-3.5 text-[#7B8C7D]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedNotice ? 'Copied to Clipboard' : 'Copy Synthesis'}</span>
          </button>
          <button
            type="button"
            onClick={handleResetReflection}
            className={`px-3.5 py-2 border rounded-full text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
              confirmReset
                ? 'border-[#944D4D]/40 bg-[#944D4D]/15 text-[#944D4D]'
                : clearedNotice
                ? 'border-[#7B8C7D]/40 bg-[#7B8C7D]/15 text-[#7B8C7D]'
                : 'border-[#D9D1C7] hover:border-[#7B8C7D] bg-white text-[#3A3F3A]/70 hover:text-[#944D4D]'
            }`}
            title="Clear entries for fresh cycle"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${confirmReset ? 'animate-spin text-[#944D4D]' : ''}`} />
            <span>
              {confirmReset
                ? 'Click to Confirm Clear'
                : clearedNotice
                ? 'Reflection Cleared ✓'
                : 'Reset Reflection'}
            </span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 text-xs bg-[#7B8C7D] text-[#F5F2ED] rounded-full font-medium hover:bg-[#68786A] transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            {savedNotice ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            <span>{savedNotice ? 'Saved to Sanctuary' : 'Save Reflection'}</span>
          </button>
        </div>
      </div>

      {/* Prompts in Bento Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Prompt 1 */}
        <div className="p-6 rounded-3xl border border-[#E3E8E1] bg-white shadow-xs">
          <NotionToggle
            title="1. What brought genuine satisfaction?"
            icon="🌿"
            defaultOpen={true}
          >
            <textarea
              rows={4}
              value={journal.wins}
              onChange={(e) => setJournal({ ...journal, wins: e.target.value })}
              placeholder="Record moments of flow, completed milestones, or quiet victories..."
              className="w-full mt-3 p-3.5 text-xs sm:text-sm bg-[#F5F2ED] border border-[#D9D1C7] rounded-2xl text-[#3A3F3A] focus:outline-none focus:border-[#7B8C7D] leading-relaxed resize-y"
            />
          </NotionToggle>
        </div>

        {/* Prompt 2 */}
        <div className="p-6 rounded-3xl border border-[#E3E8E1] bg-white shadow-xs">
          <NotionToggle
            title="2. Where did unnecessary friction occur?"
            icon="🪵"
            defaultOpen={true}
          >
            <textarea
              rows={4}
              value={journal.friction}
              onChange={(e) => setJournal({ ...journal, friction: e.target.value })}
              placeholder="Reflect without blame: was it poor boundary setting, over-scheduling, or fatigue?"
              className="w-full mt-3 p-3.5 text-xs sm:text-sm bg-[#F5F2ED] border border-[#D9D1C7] rounded-2xl text-[#3A3F3A] focus:outline-none focus:border-[#7B8C7D] leading-relaxed resize-y"
            />
          </NotionToggle>
        </div>

        {/* Prompt 3 */}
        <div className="p-6 rounded-3xl border border-[#E3E8E1] bg-white shadow-xs">
          <NotionToggle
            title="3. What can I subtract or decline next cycle?"
            icon="✂️"
            defaultOpen={true}
          >
            <textarea
              rows={4}
              value={journal.simplify}
              onChange={(e) => setJournal({ ...journal, simplify: e.target.value })}
              placeholder="Subtracting the non-essential creates the room for high craft..."
              className="w-full mt-3 p-3.5 text-xs sm:text-sm bg-[#F5F2ED] border border-[#D9D1C7] rounded-2xl text-[#3A3F3A] focus:outline-none focus:border-[#7B8C7D] leading-relaxed resize-y"
            />
          </NotionToggle>
        </div>

        {/* Prompt 4 */}
        <div className="p-6 rounded-3xl border border-[#E3E8E1] bg-white shadow-xs">
          <NotionToggle
            title="4. Three grounded gratitudes from this week"
            icon="🕯️"
            defaultOpen={true}
          >
            <textarea
              rows={4}
              value={journal.gratitude}
              onChange={(e) => setJournal({ ...journal, gratitude: e.target.value })}
              placeholder="Simple sensory realities: morning light, a warm cup, kindness..."
              className="w-full mt-3 p-3.5 text-xs sm:text-sm bg-[#F5F2ED] border border-[#D9D1C7] rounded-2xl text-[#3A3F3A] focus:outline-none focus:border-[#7B8C7D] leading-relaxed resize-y font-serif"
            />
          </NotionToggle>
        </div>
      </div>
    </div>
  );
};

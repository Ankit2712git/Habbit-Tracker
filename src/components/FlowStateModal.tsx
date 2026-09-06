import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, X, Volume2, VolumeX, Sparkles, CheckCircle2, Minimize2, Maximize2 } from 'lucide-react';

interface FlowStateModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks?: { id: string; text: string; done: boolean }[];
  onCompleteTask?: (id: string) => void;
}

export const FlowStateModal: React.FC<FlowStateModalProps> = ({
  isOpen,
  onClose,
  tasks = [],
  onCompleteTask,
}) => {
  const [sessionDuration, setSessionDuration] = useState<number>(25 * 60); // 25 min default
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string>(tasks[0]?.id || '');
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [ambientSound, setAmbientSound] = useState<boolean>(false);

  // Audio Context for ambient sound and completion chime
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);

  // Set default selected task if empty
  useEffect(() => {
    if (!selectedTaskId && tasks.length > 0) {
      const firstUnfinished = tasks.find((t) => !t.done) || tasks[0];
      setSelectedTaskId(firstUnfinished.id);
    }
  }, [tasks, selectedTaskId]);

  // Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      playChime();
      if (selectedTaskId && onCompleteTask) {
        onCompleteTask(selectedTaskId);
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, selectedTaskId, onCompleteTask]);

  // Gentle singing bowl chime via Web Audio API
  const playChime = () => {
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(528, ctx.currentTime); // 528 Hz Solfeggio frequency (calm clarity)
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 3);
    } catch (e) {
      console.warn('Audio chime unsupported', e);
    }
  };

  // Toggle ambient brown noise (soothing warm focus drone)
  const toggleAmbientSound = () => {
    if (ambientSound) {
      // Stop
      if (noiseNodeRef.current) {
        noiseNodeRef.current.disconnect();
        noiseNodeRef.current = null;
      }
      setAmbientSound(false);
    } else {
      // Start
      try {
        if (!audioCtxRef.current) {
          audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let lastOut = 0.0;
        // Generate warm brown noise
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          data[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = data[i];
          data[i] *= 1.8; // Gain
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, ctx.currentTime);

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.08, ctx.currentTime);

        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        noise.start();
        noiseNodeRef.current = noise;
        setAmbientSound(true);
      } catch (e) {
        console.warn('Ambient noise error', e);
      }
    }
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (noiseNodeRef.current) {
        noiseNodeRef.current.disconnect();
      }
    };
  }, []);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const progress = ((sessionDuration - timeLeft) / sessionDuration) * 100;

  const selectDuration = (mins: number) => {
    setIsRunning(false);
    setSessionDuration(mins * 60);
    setTimeLeft(mins * 60);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(sessionDuration);
  };

  const activeTaskObj = tasks.find((t) => t.id === selectedTaskId);

  // Minimized Floating Widget
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50 bg-white border border-[#D9D1C7] rounded-3xl p-3 shadow-2xl flex items-center gap-3 backdrop-blur-md animate-fade-in">
        <div className="w-2.5 h-2.5 rounded-full bg-[#7B8C7D] animate-pulse" />
        <div className="text-xs font-mono font-bold text-[#3A3F3A]">
          {formattedTime}
        </div>
        <span className="text-xs text-[#3A3F3A]/70 max-w-[120px] truncate">
          {activeTaskObj ? activeTaskObj.text : 'Deep Flow'}
        </span>
        <button
          type="button"
          onClick={() => setIsRunning(!isRunning)}
          className="p-1.5 rounded-full bg-[#7B8C7D] text-[#F5F2ED] hover:bg-[#68786A] transition-colors cursor-pointer"
        >
          {isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 ml-0.5" />}
        </button>
        <button
          type="button"
          onClick={() => setIsMinimized(false)}
          className="p-1 rounded-full text-[#3A3F3A]/60 hover:text-[#3A3F3A] transition-colors cursor-pointer"
          title="Expand"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  // Full Screen Focus Dialog
  return (
    <div className="fixed inset-0 z-50 bg-[#3A3F3A]/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#F5F2ED] border border-[#D9D1C7] rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-6 relative overflow-hidden">
        {/* Subtle decorative background circle */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#E3E8E1] rounded-full pointer-events-none opacity-60" />

        {/* Modal Top Bar */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#7B8C7D]" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#7B8C7D]">
              Deep Work Sanctuary
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={toggleAmbientSound}
              className={`p-2 rounded-full border transition-colors cursor-pointer ${
                ambientSound
                  ? 'bg-[#7B8C7D] border-[#7B8C7D] text-[#F5F2ED]'
                  : 'bg-white border-[#D9D1C7] text-[#3A3F3A]/60 hover:text-[#3A3F3A]'
              }`}
              title={ambientSound ? 'Mute ambient sound' : 'Play ambient focus noise'}
            >
              {ambientSound ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
            <button
              type="button"
              onClick={() => setIsMinimized(true)}
              className="p-2 rounded-full bg-white border border-[#D9D1C7] text-[#3A3F3A]/60 hover:text-[#3A3F3A] transition-colors cursor-pointer"
              title="Minimize to floating widget"
            >
              <Minimize2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full bg-white border border-[#D9D1C7] text-[#3A3F3A]/60 hover:text-[#3A3F3A] transition-colors cursor-pointer"
              title="Close focus session"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Selected Focus Task */}
        <div className="bg-white/80 border border-[#D9D1C7] rounded-2xl p-4 relative z-10 space-y-1.5">
          <span className="text-[10px] uppercase tracking-wider text-[#3A3F3A]/60 font-bold block">
            Current Single Focus:
          </span>
          {tasks.length > 0 ? (
            <select
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              className="w-full text-xs sm:text-sm font-medium text-[#3A3F3A] bg-transparent focus:outline-none cursor-pointer"
            >
              {tasks.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.done ? '✓ ' : '• '} {task.text}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-xs sm:text-sm font-medium text-[#3A3F3A]">
              Unbroken Deep Work Sprint
            </p>
          )}
        </div>

        {/* Main Countdown Display */}
        <div className="text-center relative z-10 py-3">
          <div className="text-6xl sm:text-7xl font-mono font-light text-[#3A3F3A] tracking-tighter">
            {formattedTime}
          </div>

          {/* Progress bar */}
          <div className="w-48 mx-auto bg-[#D9D1C7]/60 h-1.5 rounded-full mt-4 overflow-hidden">
            <div
              className="bg-[#7B8C7D] h-full rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Preset Duration Buttons */}
        <div className="flex items-center justify-center gap-2 relative z-10">
          {[
            { label: '25m Sprint', mins: 25 },
            { label: '50m Deep', mins: 50 },
            { label: '5m Rest', mins: 5 },
          ].map((preset) => (
            <button
              key={preset.mins}
              type="button"
              onClick={() => selectDuration(preset.mins)}
              className={`px-3 py-1 text-xs rounded-full border transition-colors cursor-pointer ${
                sessionDuration === preset.mins * 60
                  ? 'bg-[#7B8C7D] text-[#F5F2ED] border-[#7B8C7D] font-medium'
                  : 'bg-white border-[#D9D1C7] text-[#3A3F3A]/70 hover:text-[#3A3F3A]'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 relative z-10 pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="p-3 rounded-full bg-white border border-[#D9D1C7] text-[#3A3F3A]/70 hover:text-[#3A3F3A] transition-colors cursor-pointer shadow-xs"
            title="Reset timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsRunning(!isRunning)}
            className="px-8 py-3 rounded-full bg-[#7B8C7D] hover:bg-[#68786A] text-[#F5F2ED] text-sm font-medium transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause Session</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current ml-0.5" />
                <span>Begin Flow</span>
              </>
            )}
          </button>

          {activeTaskObj && !activeTaskObj.done && onCompleteTask && (
            <button
              type="button"
              onClick={() => {
                onCompleteTask(activeTaskObj.id);
                playChime();
              }}
              className="p-3 rounded-full bg-white border border-[#D9D1C7] text-[#7B8C7D] hover:bg-[#E3E8E1] transition-colors cursor-pointer shadow-xs"
              title="Mark task completed"
            >
              <CheckCircle2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Peaceful quote footer */}
        <div className="text-center pt-2 text-[11px] text-[#3A3F3A]/50 italic">
          &ldquo;Do one thing at a time, and do it with your whole presence.&rdquo;
        </div>
      </div>
    </div>
  );
};

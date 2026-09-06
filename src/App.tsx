import React, { useState, useEffect } from 'react';
import {
  PageMetadata,
  TaskItem,
  HabitItem,
  ProjectItem,
  ReadingItem,
  DailyFocus,
  WorkspaceState,
  CoverStyle,
} from './types';
import {
  INITIAL_PAGES,
  INITIAL_TASKS,
  INITIAL_HABITS,
  INITIAL_PROJECTS,
  INITIAL_READING,
  INITIAL_DAILY,
  createCleanTemplate,
} from './data/initialTemplate';
import { RotateCcw } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { CoverBanner } from './components/CoverBanner';
import { DailyFlowView } from './components/DailyFlowView';
import { TaskDatabaseView } from './components/TaskDatabaseView';
import { HabitTrackerView } from './components/HabitTrackerView';
import { ProjectsView } from './components/ProjectsView';
import { ReadingLibraryView } from './components/ReadingLibraryView';
import { ReflectionView } from './components/ReflectionView';

const STORAGE_KEY = 'quiet_notion_productivity_template_v1';

export default function App() {
  // Initialize state from localStorage or initial template
  const [pages, setPages] = useState<PageMetadata[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_pages`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_PAGES;
  });

  const [activePageId, setActivePageId] = useState<string>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_activePage`);
    return saved || 'daily-flow';
  });

  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_tasks`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_TASKS;
  });

  const [habits, setHabits] = useState<HabitItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_habits`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_HABITS;
  });

  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_projects`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_PROJECTS;
  });

  const [library, setLibrary] = useState<ReadingItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_library`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_READING;
  });

  const [dailyPages, setDailyPages] = useState<Record<string, DailyFocus>>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_daily_pages`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    const legacy = localStorage.getItem(`${STORAGE_KEY}_daily`);
    if (legacy) {
      try {
        return { 'daily-flow': JSON.parse(legacy) };
      } catch (e) {
        console.error(e);
      }
    }
    return { 'daily-flow': INITIAL_DAILY };
  });

  const [fontStyle, setFontStyle] = useState<'sans' | 'serif' | 'mono'>('sans');
  const [fullWidth, setFullWidth] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_pages`, JSON.stringify(pages));
  }, [pages]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_activePage`, activePageId);
  }, [activePageId]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_tasks`, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_habits`, JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_projects`, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_library`, JSON.stringify(library));
  }, [library]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_daily_pages`, JSON.stringify(dailyPages));
  }, [dailyPages]);

  // Active page resolution
  const activePage = pages.find((p) => p.id === activePageId) || pages[0];

  const activeDaily: DailyFocus = dailyPages[activePage.id] || INITIAL_DAILY;

  const handleUpdateActiveDaily = (updatedDaily: DailyFocus) => {
    setDailyPages((prev) => ({
      ...prev,
      [activePage.id]: updatedDaily,
    }));
  };

  // Update page properties
  const handleUpdateIcon = (newIcon: string) => {
    setPages(pages.map((p) => (p.id === activePage.id ? { ...p, icon: newIcon } : p)));
  };

  const handleUpdateCover = (newCover: CoverStyle) => {
    setPages(pages.map((p) => (p.id === activePage.id ? { ...p, cover: newCover } : p)));
  };

  const handleUpdateTitle = (newTitle: string) => {
    setPages(pages.map((p) => (p.id === activePage.id ? { ...p, title: newTitle } : p)));
  };

  const handleUpdateSubtitle = (newSubtitle: string) => {
    setPages(pages.map((p) => (p.id === activePage.id ? { ...p, subtitle: newSubtitle } : p)));
  };

  const handleAddPage = () => {
    const newId = `page-${Date.now()}`;
    const newPage: PageMetadata = {
      id: newId,
      type: 'daily-flow',
      title: 'New Flow Workspace',
      subtitle: 'A dedicated space for fresh ideas and intentional actions.',
      icon: '🌱',
      cover: 'sage-mist',
    };
    const newWorkspaceDaily: DailyFocus = {
      bigThree: [
        { id: `bt-${Date.now()}-1`, text: 'Define workspace core intent', done: false },
        { id: `bt-${Date.now()}-2`, text: 'Outline first milestone or deliverable', done: false },
        { id: `bt-${Date.now()}-3`, text: 'Complete focus block', done: false },
      ],
      quote: {
        text: 'Every fresh page is an invitation to clarity and quiet purpose.',
        author: 'Sanctuary Practice',
      },
      morningChecklist: [
        { id: `mc-${Date.now()}-1`, text: 'Align intention and clear workspace', done: false },
      ],
      eveningChecklist: [
        { id: `ec-${Date.now()}-1`, text: 'Reflect on flow and log key findings', done: false },
      ],
      timeBlocks: [
        { id: `tb-${Date.now()}-1`, time: '09:00 – 10:30', task: 'Deep Focus Sprint', type: 'deep' },
        { id: `tb-${Date.now()}-2`, time: '11:00 – 12:00', task: 'Synthesis & Review', type: 'admin' },
      ],
      quickNotes: '',
    };
    setDailyPages((prev) => ({
      ...prev,
      [newId]: newWorkspaceDaily,
    }));
    setPages([...pages, newPage]);
    setActivePageId(newId);
  };

  const handleDeletePage = (pageId: string) => {
    const updated = pages.filter((p) => p.id !== pageId);
    setPages(updated);
    setDailyPages((prev) => {
      const copy = { ...prev };
      delete copy[pageId];
      return copy;
    });
    if (activePageId === pageId) {
      setActivePageId(updated[0]?.id || 'daily-flow');
    }
  };

  const [workspaceVersion, setWorkspaceVersion] = useState(0);
  const [resetToast, setResetToast] = useState(false);

  const handleResetTemplate = () => {
    // 1. Completely clear all localStorage items (including streaks, reflections, habits, etc.)
    try {
      localStorage.clear();
    } catch (e) {
      console.warn('Failed to clear localStorage', e);
    }

    // 2. Obtain clean, deep-cloned initial data
    const clean = createCleanTemplate();

    // 3. Reset all React states
    setPages(clean.pages);
    setTasks(clean.tasks);
    setHabits(clean.habits);
    setProjects(clean.projects);
    setLibrary(clean.library);
    setDailyPages({ 'daily-flow': clean.daily });
    setActivePageId('daily-flow');
    setFontStyle('sans');
    setFullWidth(false);

    // 4. Increment workspace version to force complete unmount & fresh remount of all views
    setWorkspaceVersion((v) => v + 1);

    // 5. Trigger temporary confirmation notification
    setResetToast(true);
    setTimeout(() => setResetToast(false), 3500);

    // 6. Broadcast global reset events across the window
    window.dispatchEvent(new Event('sanctuary_workspace_reset'));
    window.dispatchEvent(new Event('sanctuary_energy_updated'));
    window.dispatchEvent(new Event('storage'));
  };

  // Font style class mapping
  const fontClasses = {
    sans: 'font-editorial-sans',
    serif: 'font-editorial-serif',
    mono: 'font-editorial-mono',
  };

  const workspaceState: WorkspaceState = {
    tasks: tasks || [],
    habits: habits || [],
    projects: projects || [],
    library: library || [],
    reading: library || [],
    daily: activeDaily || INITIAL_DAILY,
    fontStyle,
    fullWidth,
    activePageId,
  };

  return (
    <div
      key={workspaceVersion}
      className={`min-h-screen bg-[#F5F2ED] text-[#3A3F3A] flex flex-row ${fontClasses[fontStyle]}`}
    >
      {resetToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#3A3F3A] text-[#F5F2ED] px-4 py-2.5 rounded-2xl shadow-xl text-xs flex items-center gap-2 border border-[#7B8C7D]/30 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <RotateCcw className="w-4 h-4 text-[#7B8C7D]" />
          <span className="font-medium">Workspace restored to clean template ✓</span>
        </div>
      )}
      {/* Notion Sidebar */}
      <Sidebar
        pages={pages}
        activePageId={activePage.id}
        onSelectPage={(id) => setActivePageId(id)}
        onAddPage={handleAddPage}
        onDeletePage={handleDeletePage}
        isOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onResetTemplate={handleResetTemplate}
        tasks={tasks}
        habits={habits}
        daily={activeDaily}
      />

      {/* Main Page Area */}
      <main className="grow min-w-0 flex flex-col min-h-screen relative overflow-x-hidden">
        {/* Top Sticky Bar */}
        <TopBar
          page={activePage}
          fontStyle={fontStyle}
          onChangeFont={setFontStyle}
          fullWidth={fullWidth}
          onToggleFullWidth={() => setFullWidth(!fullWidth)}
          workspaceState={workspaceState}
        />

        {/* Cover Banner & Page Header */}
        <CoverBanner
          page={activePage}
          onUpdateIcon={handleUpdateIcon}
          onUpdateCover={handleUpdateCover}
          onUpdateTitle={handleUpdateTitle}
          onUpdateSubtitle={handleUpdateSubtitle}
        />

        {/* Page Content Container */}
        <div
          className={`w-full px-6 sm:px-10 transition-all duration-200 ${
            fullWidth ? 'max-w-7xl mx-auto' : 'max-w-4xl mx-auto'
          }`}
        >
          {activePage.type === 'daily-flow' && (
            <DailyFlowView
              key={activePage.id}
              daily={activeDaily}
              onUpdateDaily={handleUpdateActiveDaily}
            />
          )}

          {activePage.type === 'tasks' && (
            <TaskDatabaseView tasks={tasks} onUpdateTasks={setTasks} />
          )}

          {activePage.type === 'habits' && (
            <HabitTrackerView habits={habits} onUpdateHabits={setHabits} />
          )}

          {activePage.type === 'projects' && (
            <ProjectsView projects={projects} onUpdateProjects={setProjects} />
          )}

          {activePage.type === 'library' && (
            <ReadingLibraryView library={library} onUpdateLibrary={setLibrary} />
          )}

          {activePage.type === 'reflection' && <ReflectionView />}
        </div>
      </main>
    </div>
  );
}

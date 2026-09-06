export type PageType = 
  | 'daily-flow'
  | 'tasks'
  | 'habits'
  | 'projects'
  | 'library'
  | 'reflection';

export type CoverStyle = 
  | 'sage-mist'
  | 'warm-linen'
  | 'morning-dew'
  | 'sandstone'
  | 'none';

export interface PageMetadata {
  id: string;
  type: PageType;
  title: string;
  subtitle: string;
  icon: string;
  cover: CoverStyle;
}

export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskArea = 'Deep Work' | 'Creative' | 'Personal' | 'Health' | 'Admin';

export interface TaskItem {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  area: TaskArea;
  dueDate?: string;
  estimate?: string;
  notes?: string;
}

export type HabitCategory = 'Mind' | 'Body' | 'Craft' | 'Rhythm';

export interface HabitItem {
  id: string;
  name: string;
  category: HabitCategory;
  streak: number;
  days: boolean[]; // Monday to Sunday (7 days)
}

export type ProjectStatus = 'planning' | 'in-progress' | 'review' | 'completed';

export interface ProjectItem {
  id: string;
  title: string;
  area: string;
  status: ProjectStatus;
  progress: number;
  quarter: string;
  summary: string;
  milestones: { id: string; text: string; done: boolean }[];
}

export type ReadingStatus = 'want-to-read' | 'reading' | 'completed';
export type ReadingFormat = 'Book' | 'Essay' | 'Research' | 'Audio';

export interface ReadingItem {
  id: string;
  title: string;
  author: string;
  format: ReadingFormat;
  status: ReadingStatus;
  notes: string;
  takeaway?: string;
}

export interface TimeBlock {
  id: string;
  time: string;
  task: string;
  type: 'deep' | 'admin' | 'rest';
}

export interface DailyFocus {
  quote: { text: string; author: string };
  bigThree: { id: string; text: string; done: boolean }[];
  morningChecklist: { id: string; text: string; done: boolean }[];
  eveningChecklist: { id: string; text: string; done: boolean }[];
  timeBlocks: TimeBlock[];
  quickNotes: string;
}

export interface WorkspaceState {
  tasks: TaskItem[];
  habits: HabitItem[];
  projects: ProjectItem[];
  library: ReadingItem[];
  reading?: ReadingItem[];
  daily: DailyFocus;
  fontStyle: 'sans' | 'serif' | 'mono';
  fullWidth: boolean;
  activePageId: string;
}

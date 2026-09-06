import { PageMetadata, TaskItem, HabitItem, ProjectItem, ReadingItem, DailyFocus } from '../types';

export const INITIAL_PAGES: PageMetadata[] = [
  {
    id: 'daily-flow',
    type: 'daily-flow',
    title: 'Daily Flow & Focus',
    subtitle: 'Quiet alignment for deliberate work and peaceful rituals.',
    icon: '🌿',
    cover: 'sage-mist',
  },
  {
    id: 'tasks',
    type: 'tasks',
    title: 'Task Database',
    subtitle: 'A fluid table and board for intentional action items.',
    icon: '📋',
    cover: 'warm-linen',
  },
  {
    id: 'habits',
    type: 'habits',
    title: 'Habit Matrix',
    subtitle: 'Weekly rhythm and calm daily consistency.',
    icon: '🌱',
    cover: 'morning-dew',
  },
  {
    id: 'projects',
    type: 'projects',
    title: 'Projects & Milestones',
    subtitle: 'High-leverage focus areas broken down into achievable steps.',
    icon: '🪵',
    cover: 'sandstone',
  },
  {
    id: 'library',
    type: 'library',
    title: 'Reading Shelf',
    subtitle: 'Curated ideas, reflections, and timeless essays.',
    icon: '📖',
    cover: 'warm-linen',
  },
  {
    id: 'reflection',
    type: 'reflection',
    title: 'Mindful Reflection',
    subtitle: 'End of week clarity, thought clearing, and intentional pauses.',
    icon: '🍵',
    cover: 'sage-mist',
  },
];

export const INITIAL_TASKS: TaskItem[] = [
  {
    id: 't-1',
    title: 'Finalize quarterly architecture proposal',
    status: 'in-progress',
    priority: 'high',
    area: 'Deep Work',
    dueDate: 'Today',
    estimate: '90m',
    notes: 'Focus on simplifying the schema and clarifying edge-case bounds.',
  },
  {
    id: 't-2',
    title: 'Review quiet design system tokens',
    status: 'in-progress',
    priority: 'medium',
    area: 'Creative',
    dueDate: 'Tomorrow',
    estimate: '45m',
    notes: 'Harmonize warm bone white backgrounds with muted olive and sage accents.',
  },
  {
    id: 't-3',
    title: 'Morning walk in natural light without screens',
    status: 'done',
    priority: 'low',
    area: 'Health',
    dueDate: 'Today',
    estimate: '25m',
    notes: 'Hydrate before heading out, breathe deeply.',
  },
  {
    id: 't-4',
    title: 'Write weekly reflection notes',
    status: 'todo',
    priority: 'medium',
    area: 'Personal',
    dueDate: 'Friday',
    estimate: '30m',
    notes: 'Identify one friction point and one quiet win from this cycle.',
  },
  {
    id: 't-5',
    title: 'Archive stale email threads and tidy downloads folder',
    status: 'todo',
    priority: 'low',
    area: 'Admin',
    dueDate: 'Next Mon',
    estimate: '20m',
    notes: 'Batch process in a single low-energy block.',
  },
  {
    id: 't-6',
    title: 'Read 2 chapters of "Four Thousand Weeks"',
    status: 'todo',
    priority: 'medium',
    area: 'Deep Work',
    dueDate: 'Tonight',
    estimate: '40m',
    notes: 'Contemplate time as a medium rather than an adversary.',
  },
];

export const INITIAL_HABITS: HabitItem[] = [
  {
    id: 'h-1',
    name: 'Early Morning Hydration & Sunlight',
    category: 'Body',
    streak: 6,
    days: [true, true, true, true, true, true, false],
  },
  {
    id: 'h-2',
    name: '30m Unbroken Deep Reading',
    category: 'Mind',
    streak: 4,
    days: [true, true, false, true, true, false, false],
  },
  {
    id: 'h-3',
    name: '90-Minute Focused Deep Work Block',
    category: 'Craft',
    streak: 5,
    days: [true, true, true, true, true, false, false],
  },
  {
    id: 'h-4',
    name: 'Evening Screen Sunset at 9:30 PM',
    category: 'Rhythm',
    streak: 3,
    days: [false, true, true, true, false, false, false],
  },
  {
    id: 'h-5',
    name: 'Mindful Movement / Stretching',
    category: 'Body',
    streak: 7,
    days: [true, true, true, true, true, true, true],
  },
];

export const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: 'p-1',
    title: 'Deliberate Work Framework 2026',
    area: 'Professional Craft',
    status: 'in-progress',
    progress: 65,
    quarter: 'Q3 Focus',
    summary: 'Establishing a sustainable system for creative outputs without cognitive burnout.',
    milestones: [
      { id: 'm-1', text: 'Define top 3 annual leverage pillars', done: true },
      { id: 'm-2', text: 'Implement quiet asynchronous communication rhythm', done: true },
      { id: 'm-3', text: 'Document personal operating manual and energy cycles', done: false },
    ],
  },
  {
    id: 'p-2',
    title: 'Minimalist Physical Workspace Renovation',
    area: 'Environment',
    status: 'in-progress',
    progress: 40,
    quarter: 'Ongoing',
    summary: 'Creating an uncluttered desk with warm wood, indirect warm lighting, and zero cable clutter.',
    milestones: [
      { id: 'm-4', text: 'Clean under-desk cable management raceway', done: true },
      { id: 'm-5', text: 'Add linen desk mat and gentle warm 2700K task lamp', done: true },
      { id: 'm-6', text: 'Curate physical paper notebook for daily braindump', done: false },
    ],
  },
  {
    id: 'p-3',
    title: 'Autumn Reading & Synthesis Archive',
    area: 'Knowledge',
    status: 'planning',
    progress: 20,
    quarter: 'Autumn',
    summary: 'Reading 6 seminal texts on philosophy, craft, and ecology; writing single-page summaries.',
    milestones: [
      { id: 'm-7', text: 'Select reading roster and order physical copies', done: true },
      { id: 'm-8', text: 'Establish Sunday afternoon synthesis ritual', done: false },
    ],
  },
];

export const INITIAL_READING: ReadingItem[] = [
  {
    id: 'r-1',
    title: 'Four Thousand Weeks: Time Management for Mortals',
    author: 'Oliver Burkeman',
    format: 'Book',
    status: 'reading',
    notes: 'A compassionate philosophical critique of productivity culture. Choosing what to consciously fail at.',
    takeaway: 'The day will never arrive when you have everything under control.',
  },
  {
    id: 'r-2',
    title: 'Essentialism: The Disciplined Pursuit of Less',
    author: 'Greg McKeown',
    format: 'Book',
    status: 'completed',
    notes: 'If you don’t prioritize your life, someone else will.',
    takeaway: 'Less but better. Clear out non-essentials ruthlessly.',
  },
  {
    id: 'r-3',
    title: 'The Art of Stillness: Adventures in Going Nowhere',
    author: 'Pico Iyer',
    format: 'Essay',
    status: 'completed',
    notes: 'Exploring the beauty of taking quiet retreats in everyday life.',
    takeaway: 'In an age of speed, nothing could be more invigorating than going slow.',
  },
  {
    id: 'r-4',
    title: 'In Praise of Shadows',
    author: 'Jun’ichirō Tanizaki',
    format: 'Book',
    status: 'want-to-read',
    notes: 'Classic essay on Japanese aesthetics, quiet spaces, and warm subdued lighting.',
    takeaway: 'Finding beauty not in the thing itself but in the patterns of shadows.',
  },
];

export const INITIAL_DAILY: DailyFocus = {
  quote: {
    text: 'Simplicity is about subtracting the obvious and adding the meaningful.',
    author: 'John Maeda',
  },
  bigThree: [
    { id: 'b-1', text: 'Ship the simplified core module architecture', done: true },
    { id: 'b-2', text: 'Conduct quiet 45-minute sprint on design tokens', done: false },
    { id: 'b-3', text: 'Evening stroll & 30m reading off screens', done: false },
  ],
  morningChecklist: [
    { id: 'mc-1', text: 'Warm water with lemon before coffee', done: true },
    { id: 'mc-2', text: '5-minute breathwork / quiet sitting', done: true },
    { id: 'mc-3', text: 'Review today’s Big Three before opening inboxes', done: true },
  ],
  eveningChecklist: [
    { id: 'ec-1', text: 'Close open browser tabs & clear desktop scratchpad', done: false },
    { id: 'ec-2', text: 'Write down tomorrow’s single primary priority', done: false },
    { id: 'ec-3', text: 'Turn down room lights to warm amber', done: false },
  ],
  timeBlocks: [
    { id: 'tb-1', time: '08:30 – 10:30', task: 'Deep Work: Core Architecture Design', type: 'deep' },
    { id: 'tb-2', time: '10:45 – 11:30', task: 'Low-Energy Batch: Review messages & PRs', type: 'admin' },
    { id: 'tb-3', time: '13:00 – 14:30', task: 'Deep Work: Design token harmonization', type: 'deep' },
    { id: 'tb-4', time: '15:00 – 15:45', task: 'Quiet Walk & Refreshing Tea Break', type: 'rest' },
  ],
  quickNotes: `• "Concentration is a fine needle; do not thread it with coarse wire."
• Next week: Remember to block out Wednesday morning for uninterrupted writing.
• Ideas for reflection: Notice when impulse checking happens and replace it with 3 deep breaths.`,
};

export const createCleanTemplate = () => ({
  pages: JSON.parse(JSON.stringify(INITIAL_PAGES)) as PageMetadata[],
  tasks: JSON.parse(JSON.stringify(INITIAL_TASKS)) as TaskItem[],
  habits: JSON.parse(JSON.stringify(INITIAL_HABITS)) as HabitItem[],
  projects: JSON.parse(JSON.stringify(INITIAL_PROJECTS)) as ProjectItem[],
  library: JSON.parse(JSON.stringify(INITIAL_READING)) as ReadingItem[],
  daily: JSON.parse(JSON.stringify(INITIAL_DAILY)) as DailyFocus,
});

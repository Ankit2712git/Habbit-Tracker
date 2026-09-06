# Productivity Template (Sanctuary) 🌿

A quiet, minimalist Notion-inspired productivity workspace designed for intentional focus, deliberate work, and peaceful daily rituals. Crafted with **React 19**, **TypeScript**, and **Tailwind CSS**, featuring an organic warm palette inspired by Japanese aesthetics, natural linen, and muted sage.

---

## ✨ Features

### 1. Daily Flow & Focus
- **Big Three Priorities**: Highlight and check off your top three essential tasks each day.
- **Mindful Rituals**: Morning and evening grounding checklists (hydration, breathwork, evening shutdown).
- **Time Blocking**: Visual timeline schedule mapping deep work, admin batches, and intentional rest intervals.
- **Daily Streak Counter**: Gentle tracking of consistent focus days.
- **Quick Scratchpad**: Instant notes and mindful reminders with copy-to-clipboard functionality.

### 2. Task Database
- **Dual-View Switcher**: Seamlessly toggle between a detailed **Table View** and an intuitive **Kanban Board** (`To-Do`, `In Progress`, `Done`).
- **Rich Task Metadata**: Assign areas (*Deep Work*, *Creative*, *Health*, *Personal*, *Admin*), estimates, due dates, priority tiers, and contextual notes.
- **Live Search & Area Filtering**: Quickly locate action items and filter by area of focus.
- **Inline Task Creation & Editing**: Add and manage tasks with instant UI updates.

### 3. Habit Matrix
- **7-Day Consistency Grid**: Track daily habits across four balanced domains: *Mind*, *Body*, *Craft*, and *Rhythm*.
- **Weekly Completion Metrics**: Real-time percentage score of completed practices across the week.
- **Streak Tracking & Safe Week Reset**: Increment streaks with each completed practice and reset cleanly with confirmation.

### 4. Projects & Milestones
- **High-Leverage Projects**: Structure long-term goals with milestones, deadlines, and categories.
- **Dynamic Progress Bars**: Visual progress percentage calculated automatically from completed project milestones.
- **Milestone Management**: Add and check off sub-deliverables for every project.

### 5. Reading Shelf
- **Curated Library**: Catalog essays, timeless books, and research notes.
- **Reading Statuses**: Track titles across *Completed*, *In Progress*, and *Want to Read*.
- **Key Takeaways**: Capture the core insight and timeless quotes from each text.

### 6. Mindful Reflection
- **Weekly Clarity Framework**: Structured prompts covering quiet wins, friction audits, lessons learned, and intentions for the upcoming cycle.
- **Local Persistence & Export**: Auto-saves journal entries locally with one-click export for direct Notion block pasting.

### 7. Flow State Sanctuary (Focus Modal)
- **Deep Work Timer**: Configurable Pomodoro interval timer with visual circular progress and audio chimes.
- **Ambient Soundscape Synthesizers**: Built-in Web Audio synthesizers generating continuous calming audio (*Forest Rain*, *Gentle Waves*, and *Warm Static*).
- **Breathwork Guidance**: Calming diaphragmatic visual prompt to center attention before starting work.

### 8. Dynamic "Current Energy" Widget
- **Authentic Bento Layout**: Five progressive rounded vertical bars with organic heights and subtle sage tones.
- **Reactive Task Boosts**: Energy levels automatically recalculate and animate upward when tasks, habits, or Big Three priorities are completed.
- **Everyday Rhythm Tracker**: Date-aware indicator that tracks the current day of the week with an integrated 7-day mini rhythm strip (`M T W T F S S`).

### 9. Notion Workspace Customization
- **Cover Banners**: Select from calming gradient styles (*Sage Mist*, *Warm Linen*, *Morning Dew*, *Sandstone*, *Slate Shadow*, etc.) with repositioning capabilities.
- **Typography Switcher**: Switch between **Sans** (Inter/System), **Serif** (Editorial/Literary), and **Mono** (Technical/Code).
- **Width Modes**: Toggle between centered reading width and expansive full-width workspace.
- **Custom Pages**: Add, rename, and delete pages directly from the sidebar.
- **Reset to Clean Template**: Dedicated confirmation dialog that restores all pages, tasks, habits, and reflections to the pristine default template.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Motion](https://motion.dev/)
- **Bundler & Dev Server**: [Vite](https://vite.dev/)
- **Storage**: Client-side `localStorage` (no server or database configuration required)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18.0 or higher recommended)
- `npm` or `bun`

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/productivity-template.git
   cd productivity-template
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server on port 3000 |
| `npm run build` | Compiles TypeScript and creates an optimized production build in `dist/` |
| `npm run preview` | Previews the production build locally |
| `npm run lint` | Runs the TypeScript compiler (`tsc --noEmit`) to validate types |
| `npm run clean` | Cleans up the `dist/` build directory |

---

## 📁 Project Structure

```
├── public/                    # Static assets & icons
├── src/
│   ├── components/            # View components & Notion UI elements
│   │   ├── CoverBanner.tsx        # Cover image banner & selector
│   │   ├── DailyFlowView.tsx      # Big Three, checklists, time blocks
│   │   ├── FlowStateModal.tsx     # Focus timer & ambient soundscape modal
│   │   ├── HabitTrackerView.tsx   # 7-day habit matrix & progress table
│   │   ├── NotionCallout.tsx      # Callout block component
│   │   ├── NotionToggle.tsx       # Collapsible toggle block component
│   │   ├── ProjectsView.tsx       # Milestones & project roadmap
│   │   ├── ReadingLibraryView.tsx # Reading list & takeaways
│   │   ├── ReflectionView.tsx     # Mindful weekly review journal
│   │   ├── Sidebar.tsx            # Navigation, energy widget, & reset
│   │   ├── TaskDatabaseView.tsx   # Table & Kanban action items
│   │   └── TopBar.tsx             # Breadcrumbs, typography, & export
│   ├── data/
│   │   └── initialTemplate.ts     # Pristine starter data & clean template factory
│   ├── App.tsx                # Main application state & view router
│   ├── main.tsx               # React application entry point
│   ├── index.css              # Tailwind CSS directives & theme rules
│   └── types.ts               # Shared TypeScript interfaces & types
├── index.html                 # HTML template entry
├── metadata.json              # Applet metadata & capability configuration
├── package.json               # Project manifest & dependencies
├── tsconfig.json              # TypeScript configuration
└── vite.config.ts             # Vite build configuration
```

---

## 🎨 Design Philosophy

- **Quiet Productivity**: High-contrast, glare-free readability without neon gradients or aggressive gamification.
- **Warm Neutral Palette**: Warm bone white background (`#F5F2ED`), calming sage green (`#7B8C7D`), charcoal typography (`#3A3F3A`), and delicate beige accents (`#E3E8E1`, `#D9D1C7`).
- **Mathematical Layout Rhythm**: Proportional padding, optical alignment, and thoughtful whitespace inspired by print editorial design.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

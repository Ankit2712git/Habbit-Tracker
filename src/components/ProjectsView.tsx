import React, { useState } from 'react';
import { ProjectItem, ProjectStatus } from '../types';
import { NotionCallout } from './NotionCallout';
import { Check, Plus, FolderKanban, Trash2, ChevronRight } from 'lucide-react';

interface ProjectsViewProps {
  projects: ProjectItem[];
  onUpdateProjects: (projects: ProjectItem[]) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({ projects, onUpdateProjects }) => {
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newArea, setNewArea] = useState('Professional Craft');
  const [newQuarter, setNewQuarter] = useState('Q3 Focus');
  const [newSummary, setNewSummary] = useState('');

  // Toggle milestone
  const toggleMilestone = (projectId: string, milestoneId: string) => {
    const updated = projects.map((proj) => {
      if (proj.id === projectId) {
        const nextMilestones = proj.milestones.map((m) =>
          m.id === milestoneId ? { ...m, done: !m.done } : m
        );
        const doneCount = nextMilestones.filter((m) => m.done).length;
        const autoProgress =
          nextMilestones.length > 0
            ? Math.round((doneCount / nextMilestones.length) * 100)
            : proj.progress;
        return {
          ...proj,
          milestones: nextMilestones,
          progress: autoProgress,
        };
      }
      return proj;
    });
    onUpdateProjects(updated);
  };

  // Add milestone
  const [newMilestoneTexts, setNewMilestoneTexts] = useState<Record<string, string>>({});

  const handleAddMilestone = (projectId: string) => {
    const text = newMilestoneTexts[projectId]?.trim();
    if (!text) return;

    const updated = projects.map((proj) => {
      if (proj.id === projectId) {
        const newM = {
          id: `m-${Date.now()}`,
          text,
          done: false,
        };
        const nextMilestones = [...proj.milestones, newM];
        const doneCount = nextMilestones.filter((m) => m.done).length;
        const autoProgress = Math.round((doneCount / nextMilestones.length) * 100);
        return {
          ...proj,
          milestones: nextMilestones,
          progress: autoProgress,
        };
      }
      return proj;
    });

    onUpdateProjects(updated);
    setNewMilestoneTexts({ ...newMilestoneTexts, [projectId]: '' });
  };

  // Create new project
  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newProj: ProjectItem = {
      id: `p-${Date.now()}`,
      title: newTitle.trim(),
      area: newArea,
      status: 'planning',
      progress: 0,
      quarter: newQuarter,
      summary: newSummary || 'High-leverage focus area.',
      milestones: [
        { id: `m-${Date.now()}-1`, text: 'Initial research & scope definition', done: false },
      ],
    };

    onUpdateProjects([newProj, ...projects]);
    setNewTitle('');
    setNewSummary('');
    setIsAddingProject(false);
  };

  const handleDeleteProject = (id: string) => {
    onUpdateProjects(projects.filter((p) => p.id !== id));
  };

  const handleStatusChange = (projectId: string, newStatus: ProjectStatus) => {
    const updated = projects.map((p) => {
      if (p.id === projectId) {
        return {
          ...p,
          status: newStatus,
          progress: newStatus === 'completed' ? 100 : p.progress,
        };
      }
      return p;
    });
    onUpdateProjects(updated);
  };

  const handleDeleteMilestone = (projectId: string, milestoneId: string) => {
    const updated = projects.map((proj) => {
      if (proj.id === projectId) {
        const nextMilestones = proj.milestones.filter((m) => m.id !== milestoneId);
        const doneCount = nextMilestones.filter((m) => m.done).length;
        const autoProgress =
          nextMilestones.length > 0 ? Math.round((doneCount / nextMilestones.length) * 100) : 0;
        return {
          ...proj,
          milestones: nextMilestones,
          progress: autoProgress,
        };
      }
      return proj;
    });
    onUpdateProjects(updated);
  };

  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case 'in-progress':
        return 'bg-[#E3E8E1] text-[#7B8C7D] border-[#D9D1C7] font-semibold';
      case 'planning':
        return 'bg-[#F5F2ED] text-[#3A3F3A] border-[#D9D1C7]';
      case 'review':
        return 'bg-[#EAE7E0] text-[#3A3F3A] border-[#D9D1C7] font-semibold';
      case 'completed':
        return 'bg-[#7B8C7D] text-[#F5F2ED] border-[#7B8C7D] font-semibold';
    }
  };

  return (
    <div className="space-y-6 pb-16">
      <NotionCallout variant="sage" icon="🪵">
        <p className="font-serif italic text-base text-[#3A3F3A]">
          &ldquo;Focus is saying no to a hundred other good ideas.&rdquo;
        </p>
        <p className="text-xs text-[#3A3F3A]/70 mt-1">
          Keep active high-leverage projects capped at 3 to preserve creative depth and quality.
        </p>
      </NotionCallout>

      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-[#D9D1C7] pb-4">
        <div>
          <h2 className="text-lg font-serif text-[#3A3F3A]">Active Quarters & Initiatives</h2>
          <p className="text-xs text-[#3A3F3A]/60 mt-0.5">
            Milestones dynamically recalculate progress
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsAddingProject(!isAddingProject)}
          className="px-4 py-2 text-xs bg-[#7B8C7D] text-[#F5F2ED] rounded-full font-medium hover:bg-[#68786A] transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" /> New Initiative
        </button>
      </div>

      {/* Add Project Form */}
      {isAddingProject && (
        <form
          onSubmit={handleCreateProject}
          className="p-6 bg-white border border-[#E3E8E1] rounded-3xl space-y-4 shadow-xs"
        >
          <div className="text-[10px] font-bold text-[#7B8C7D] uppercase tracking-widest">
            Add New Initiative
          </div>
          <input
            type="text"
            required
            placeholder="Project title (e.g. Master Clean Arch Guidelines)"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full px-4 py-2.5 text-xs bg-[#F5F2ED] border border-[#D9D1C7] rounded-2xl text-[#3A3F3A] focus:outline-none focus:border-[#7B8C7D]"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Life Area (e.g. Professional Craft, Health)"
              value={newArea}
              onChange={(e) => setNewArea(e.target.value)}
              className="px-4 py-2 text-xs bg-[#F5F2ED] border border-[#D9D1C7] rounded-xl text-[#3A3F3A] focus:outline-none"
            />
            <input
              type="text"
              placeholder="Quarter (e.g. Q3 Focus)"
              value={newQuarter}
              onChange={(e) => setNewQuarter(e.target.value)}
              className="px-4 py-2 text-xs bg-[#F5F2ED] border border-[#D9D1C7] rounded-xl text-[#3A3F3A] focus:outline-none"
            />
          </div>
          <textarea
            placeholder="Brief scope summary..."
            value={newSummary}
            onChange={(e) => setNewSummary(e.target.value)}
            rows={2}
            className="w-full px-4 py-2 text-xs bg-[#F5F2ED] border border-[#D9D1C7] rounded-xl text-[#3A3F3A] focus:outline-none"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddingProject(false)}
              className="px-4 py-2 text-xs text-[#3A3F3A]/70 hover:text-[#3A3F3A] rounded-full"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs bg-[#7B8C7D] text-[#F5F2ED] rounded-full font-medium hover:bg-[#68786A]"
            >
              Save Project
            </button>
          </div>
        </form>
      )}

      {/* Project Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="p-6 rounded-3xl border border-[#E3E8E1] bg-white hover:border-[#7B8C7D] transition-all space-y-4 relative group shadow-xs"
          >
            {/* Top row */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] text-[#3A3F3A]/60 font-mono tracking-wider uppercase block">
                  {proj.quarter} • {proj.area}
                </span>
                <h3 className="text-base font-serif font-medium text-[#3A3F3A] mt-0.5">{proj.title}</h3>
              </div>
              <div className="flex items-center gap-1.5">
                <select
                  value={proj.status}
                  onChange={(e) => handleStatusChange(proj.id, e.target.value as ProjectStatus)}
                  className={`text-[10px] px-2.5 py-0.5 rounded-full border capitalize font-medium cursor-pointer focus:outline-none ${getStatusBadge(
                    proj.status
                  )}`}
                  title="Change project status"
                >
                  <option value="planning">Planning</option>
                  <option value="in-progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="completed">Completed</option>
                </select>
                <button
                  type="button"
                  onClick={() => handleDeleteProject(proj.id)}
                  className="opacity-0 group-hover:opacity-100 text-[#3A3F3A]/40 hover:text-[#944D4D] p-1 transition-opacity cursor-pointer"
                  title="Delete project"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <p className="text-xs text-[#3A3F3A]/70 leading-relaxed">{proj.summary}</p>

            {/* Progress Meter */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-[11px] text-[#3A3F3A]/60 font-medium">Progress</span>
                <span className="font-mono text-xs font-semibold text-[#3A3F3A]">
                  {proj.progress}%
                </span>
              </div>
              <div className="w-full bg-[#E3E8E1] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#7B8C7D] h-full rounded-full transition-all duration-300"
                  style={{ width: `${proj.progress}%` }}
                />
              </div>
            </div>

            {/* Milestones list */}
            <div className="border-t border-[#E3E8E1] pt-3.5 space-y-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7B8C7D] block">
                Key Milestones
              </span>
              {proj.milestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className="w-full flex items-center justify-between gap-2 py-0.5 group/m"
                >
                  <button
                    type="button"
                    onClick={() => toggleMilestone(proj.id, milestone.id)}
                    className="grow flex items-start gap-2.5 text-left cursor-pointer"
                  >
                    <span
                      className={`w-4 h-4 rounded-md shrink-0 mt-0.5 flex items-center justify-center border transition-colors ${
                        milestone.done
                          ? 'bg-[#7B8C7D] border-[#7B8C7D] text-[#F5F2ED]'
                          : 'border-[#3A3F3A]/40 bg-white hover:border-[#7B8C7D]'
                      }`}
                    >
                      {milestone.done && <Check className="w-3 h-3 stroke-[2.5]" />}
                    </span>
                    <span
                      className={`text-xs ${
                        milestone.done ? 'line-through text-[#3A3F3A]/40' : 'text-[#3A3F3A]'
                      }`}
                    >
                      {milestone.text}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteMilestone(proj.id, milestone.id)}
                    className="opacity-0 group-hover/m:opacity-100 text-[#3A3F3A]/30 hover:text-[#944D4D] p-1 transition-opacity cursor-pointer shrink-0"
                    title="Remove milestone"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {/* Add milestone inline */}
              <div className="flex items-center gap-1.5 pt-1.5">
                <input
                  type="text"
                  placeholder="Add milestone..."
                  value={newMilestoneTexts[proj.id] || ''}
                  onChange={(e) =>
                    setNewMilestoneTexts({ ...newMilestoneTexts, [proj.id]: e.target.value })
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddMilestone(proj.id);
                    }
                  }}
                  className="grow px-3 py-1.5 text-[11px] bg-[#F5F2ED] border border-[#D9D1C7] rounded-xl text-[#3A3F3A] placeholder-[#3A3F3A]/40 focus:outline-none focus:border-[#7B8C7D]"
                />
                <button
                  type="button"
                  onClick={() => handleAddMilestone(proj.id)}
                  className="text-xs px-3 py-1.5 bg-[#E3E8E1] hover:bg-[#7B8C7D] hover:text-[#F5F2ED] text-[#3A3F3A] rounded-xl transition-colors cursor-pointer font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

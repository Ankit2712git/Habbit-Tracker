import React, { useState } from 'react';
import { PageMetadata, WorkspaceState } from '../types';
import {
  Download,
  Share2,
  Maximize2,
  Minimize2,
  Type,
  MoreHorizontal,
  Check,
  FileText,
  Copy,
  LayoutGrid,
} from 'lucide-react';

interface TopBarProps {
  page: PageMetadata;
  fontStyle: 'sans' | 'serif' | 'mono';
  onChangeFont: (font: 'sans' | 'serif' | 'mono') => void;
  fullWidth: boolean;
  onToggleFullWidth: () => void;
  workspaceState: WorkspaceState;
}

export const TopBar: React.FC<TopBarProps> = ({
  page,
  fontStyle,
  onChangeFont,
  fullWidth,
  onToggleFullWidth,
  workspaceState,
}) => {
  const [showExportModal, setShowExportModal] = useState(false);
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPage, setCopiedPage] = useState(false);
  const [copiedFullTemplate, setCopiedFullTemplate] = useState(false);
  const [activeTab, setActiveTab] = useState<'embed' | 'copy' | 'guide'>('embed');

  // Copy current live URL for Notion /embed
  const handleCopyEmbedUrl = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Generate clean export markdown formatted for direct Notion block pasting
  const generatePageMarkdown = (type: string) => {
    let md = '';
    if (type === 'daily-flow') {
      md += `# 🌿 Daily Flow & Focus Architecture\n\n`;
      md += `> 💡 **Wisdom of the Day**\n> "${workspaceState.daily.quote.text}" — *${workspaceState.daily.quote.author}*\n\n`;
      md += `## 🎯 Today's Big Three (High-Leverage Focus)\n`;
      workspaceState.daily.bigThree.forEach((b) => {
        md += `- [${b.done ? 'x' : ' '}] ${b.text}\n`;
      });
      md += `\n## ⏳ Time Architecture & Focus Sprints\n`;
      workspaceState.daily.timeBlocks.forEach((tb) => {
        md += `- **${tb.time}**: ${tb.task} *[${tb.type}]*\n`;
      });
      md += `\n## 📝 Morning Mindfulness Scratchpad\n`;
      md += `*Mindful thoughts, observations, and unstructured notes go here.*\n`;
    } else if (type === 'tasks') {
      md += `# 🗂️ Sanctuary Action Database\n\n`;
      md += `| Status | Task | Priority | Life Area | Due Date |\n|---|---|---|---|---|\n`;
      workspaceState.tasks.forEach((t) => {
        md += `| ${t.status} | ${t.title} | ${t.priority} | ${t.area} | ${t.dueDate || '-'} |\n`;
      });
    } else if (type === 'habits') {
      md += `# 🍵 Weekly Habit Consistency Matrix\n\n`;
      md += `| Habit | Category | Mon | Tue | Wed | Thu | Fri | Sat | Sun | Streak |\n|---|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|---|\n`;
      workspaceState.habits.forEach((h) => {
        const days = h.days.map((d) => (d ? '✓' : '—')).join(' | ');
        md += `| **${h.name}** | ${h.category} | ${days} | ${h.streak} days |\n`;
      });
    } else if (type === 'projects') {
      md += `# 🪴 Active Quarters & High-Leverage Initiatives\n\n`;
      workspaceState.projects.forEach((p) => {
        md += `### ${p.title} (${p.progress}% Complete)\n`;
        md += `*Area:* ${p.area} | *Quarter:* ${p.quarter} | *Status:* ${p.status}\n\n`;
        md += `> ${p.summary}\n\n`;
        md += `**Key Milestones:**\n`;
        p.milestones.forEach((m) => {
          md += `- [${m.done ? 'x' : ' '}] ${m.text}\n`;
        });
        md += `\n---\n\n`;
      });
    } else if (type === 'reading') {
      md += `# 📖 Reading Shelf & Wisdom Garden\n\n`;
      md += `| Title | Author | Format | Status | Core Takeaway |\n|---|---|---|---|---|\n`;
      workspaceState.reading.forEach((r) => {
        md += `| **${r.title}** | ${r.author} | ${r.format} | ${r.status} | "${r.takeaway || ''}" |\n`;
      });
    } else if (type === 'reflection') {
      md += `# 🍵 Weekly Synthesis & Reflective Pauses\n\n`;
      md += `### 1. What went well and brought genuine satisfaction?\n`;
      md += `Record moments of flow, completed milestones, or quiet victories...\n\n`;
      md += `### 2. Where did unnecessary friction occur?\n`;
      md += `Reflect without blame: was it poor boundary setting, over-scheduling, or fatigue?\n\n`;
      md += `### 3. What can I consciously subtract or decline next cycle?\n`;
      md += `Subtracting the non-essential creates room for high craft...\n\n`;
      md += `### 4. Three grounded gratitudes from this week\n`;
      md += `- 1. \n- 2. \n- 3. \n`;
    }
    return md;
  };

  const handleCopyCurrentPage = () => {
    const md = generatePageMarkdown(page.type);
    navigator.clipboard.writeText(md);
    setCopiedPage(true);
    setTimeout(() => setCopiedPage(false), 2000);
  };

  const handleCopyFullWorkspace = () => {
    const sections = ['daily-flow', 'tasks', 'habits', 'projects', 'reading', 'reflection'];
    const fullMd = sections.map((s) => generatePageMarkdown(s)).join('\n\n---\n\n');
    navigator.clipboard.writeText(fullMd);
    setCopiedFullTemplate(true);
    setTimeout(() => setCopiedFullTemplate(false), 2000);
  };

  const exportAsJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(workspaceState, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `notion-productivity-template-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <header className="sticky top-0 z-20 h-14 bg-[#F5F2ED]/90 backdrop-blur-md border-b border-[#D9D1C7] px-4 sm:px-8 flex items-center justify-between transition-colors">
      {/* Breadcrumb navigation */}
      <div className="flex items-center gap-2 text-xs text-[#3A3F3A]/70 truncate">
        <span className="hover:text-[#7B8C7D] transition-colors cursor-pointer hidden sm:inline font-medium">
          Sanctuary
        </span>
        <span className="text-[#D9D1C7] hidden sm:inline">/</span>
        <div className="flex items-center gap-1.5 font-medium text-[#3A3F3A] truncate">
          <span>{page.icon}</span>
          <span className="truncate">{page.title}</span>
        </div>
      </div>

      {/* Action controls */}
      <div className="flex items-center gap-2">
        {/* Current Month pill from design */}
        <div className="w-8 h-8 rounded-full border border-[#D9D1C7] flex items-center justify-center text-[10px] font-mono font-medium text-[#3A3F3A] hidden sm:flex">
          MAR
        </div>

        {/* Font Switcher (Sans, Serif, Mono) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowFontMenu(!showFontMenu)}
            className="px-2.5 py-1.5 rounded-full border border-[#D9D1C7] hover:border-[#7B8C7D] bg-[#F5F2ED] text-[#3A3F3A] text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Switch typography"
          >
            <Type className="w-3.5 h-3.5 text-[#7B8C7D]" />
            <span className="capitalize hidden md:inline font-mono text-[11px]">{fontStyle}</span>
          </button>

          {showFontMenu && (
            <div className="absolute right-0 top-full mt-1.5 z-30 p-2 bg-white border border-[#D9D1C7] rounded-2xl shadow-lg w-40 space-y-1">
              <button
                onClick={() => {
                  onChangeFont('sans');
                  setShowFontMenu(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors flex items-center justify-between cursor-pointer ${
                  fontStyle === 'sans' ? 'bg-[#E3E8E1] font-medium text-[#3A3F3A]' : 'hover:bg-[#F5F2ED] text-[#3A3F3A]'
                }`}
              >
                <span>Sans-Serif</span>
                {fontStyle === 'sans' && <Check className="w-3.5 h-3.5 text-[#7B8C7D]" />}
              </button>
              <button
                onClick={() => {
                  onChangeFont('serif');
                  setShowFontMenu(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-editorial-serif transition-colors flex items-center justify-between cursor-pointer ${
                  fontStyle === 'serif' ? 'bg-[#E3E8E1] font-medium text-[#3A3F3A]' : 'hover:bg-[#F5F2ED] text-[#3A3F3A]'
                }`}
              >
                <span>Serif (Editorial)</span>
                {fontStyle === 'serif' && <Check className="w-3.5 h-3.5 text-[#7B8C7D]" />}
              </button>
              <button
                onClick={() => {
                  onChangeFont('mono');
                  setShowFontMenu(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-editorial-mono transition-colors flex items-center justify-between cursor-pointer ${
                  fontStyle === 'mono' ? 'bg-[#E3E8E1] font-medium text-[#3A3F3A]' : 'hover:bg-[#F5F2ED] text-[#3A3F3A]'
                }`}
              >
                <span>Monospace</span>
                {fontStyle === 'mono' && <Check className="w-3.5 h-3.5 text-[#7B8C7D]" />}
              </button>
            </div>
          )}
        </div>

        {/* Full Width Toggle */}
        <button
          type="button"
          onClick={onToggleFullWidth}
          className="w-8 h-8 rounded-full border border-[#D9D1C7] hover:border-[#7B8C7D] flex items-center justify-center text-[#3A3F3A] transition-colors cursor-pointer"
          title={fullWidth ? 'Switch to centered width' : 'Switch to full width'}
        >
          {fullWidth ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>

        {/* Use in Notion Button */}
        <button
          type="button"
          onClick={() => setShowExportModal(true)}
          className="px-3.5 py-1.5 rounded-full bg-[#7B8C7D] text-[#F5F2ED] hover:bg-[#68786A] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span className="font-semibold">Use in Notion</span>
        </button>
      </div>

      {/* Notion Integration & Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-[#3A3F3A]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#D9D1C7] rounded-3xl shadow-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🍵</span>
                  <h3 className="font-serif text-xl text-[#3A3F3A]">
                    Use in Notion
                  </h3>
                </div>
                <p className="text-xs text-[#3A3F3A]/60 mt-1">
                  Embed this live app inside Notion or paste native block templates.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="w-8 h-8 rounded-full border border-[#D9D1C7] text-[#3A3F3A]/60 hover:text-[#3A3F3A] flex items-center justify-center text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-[#F5F2ED] rounded-full border border-[#D9D1C7]">
              <button
                type="button"
                onClick={() => setActiveTab('embed')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer text-center ${
                  activeTab === 'embed'
                    ? 'bg-[#7B8C7D] text-[#F5F2ED] shadow-2xs'
                    : 'text-[#3A3F3A]/70 hover:text-[#3A3F3A]'
                }`}
              >
                1. Embed Live Widget
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('copy')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer text-center ${
                  activeTab === 'copy'
                    ? 'bg-[#7B8C7D] text-[#F5F2ED] shadow-2xs'
                    : 'text-[#3A3F3A]/70 hover:text-[#3A3F3A]'
                }`}
              >
                2. Paste as Blocks
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('guide')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer text-center ${
                  activeTab === 'guide'
                    ? 'bg-[#7B8C7D] text-[#F5F2ED] shadow-2xs'
                    : 'text-[#3A3F3A]/70 hover:text-[#3A3F3A]'
                }`}
              >
                3. Full Guide
              </button>
            </div>

            {/* TAB 1: Embed in Notion */}
            {activeTab === 'embed' && (
              <div className="space-y-4 pt-1">
                <div className="p-4 bg-[#F5F2ED] border border-[#E3E8E1] rounded-2xl space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#3A3F3A]">Your Embed Link:</span>
                    <span className="text-[10px] text-[#7B8C7D] font-mono font-medium">Live Web App</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={window.location.href}
                      className="grow px-3 py-2 text-xs bg-white border border-[#D9D1C7] rounded-xl text-[#3A3F3A] font-mono focus:outline-none select-all"
                    />
                    <button
                      type="button"
                      onClick={handleCopyEmbedUrl}
                      className="px-3.5 py-2 text-xs bg-[#7B8C7D] hover:bg-[#68786A] text-[#F5F2ED] rounded-xl font-medium flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#7B8C7D]">
                    How to Embed in 3 Simple Steps:
                  </h4>
                  <ol className="text-xs text-[#3A3F3A]/80 space-y-2 list-decimal list-inside pl-1 leading-relaxed">
                    <li>
                      Open your page in Notion and type <code className="px-1.5 py-0.5 bg-[#F5F2ED] border border-[#D9D1C7] rounded text-[#7B8C7D] font-mono">/embed</code> and hit Enter.
                    </li>
                    <li>
                      Paste the copied link above and click <span className="font-semibold text-[#3A3F3A]">Embed link</span>.
                    </li>
                    <li>
                      Drag the corner handles of the widget to expand it full-width, and enable <span className="font-semibold text-[#3A3F3A]">Full width</span> in Notion page settings (top-right <code className="px-1 py-0.5 bg-[#F5F2ED] rounded">...</code> menu).
                    </li>
                  </ol>
                </div>
              </div>
            )}

            {/* TAB 2: Copy as Native Notion Blocks */}
            {activeTab === 'copy' && (
              <div className="space-y-3 pt-1">
                <p className="text-xs text-[#3A3F3A]/70 leading-relaxed">
                  Copying formatted content allows you to paste directly into an empty Notion page. Notion automatically converts it into native Notion Callouts, Checkboxes, and Tables!
                </p>

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={handleCopyCurrentPage}
                    className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-[#E3E8E1] hover:bg-[#F5F2ED] transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-[#7B8C7D]" />
                      <div>
                        <span className="text-xs font-semibold text-[#3A3F3A] block">
                          Copy Current View ({page.title})
                        </span>
                        <span className="text-[11px] text-[#3A3F3A]/60">
                          Formatted with checkboxes, tables & quotes
                        </span>
                      </div>
                    </div>
                    {copiedPage ? (
                      <span className="text-[11px] text-[#7B8C7D] font-medium flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Copied!
                      </span>
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-[#3A3F3A]/40" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyFullWorkspace}
                    className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-[#E3E8E1] hover:bg-[#F5F2ED] transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-3">
                      <LayoutGrid className="w-4 h-4 text-[#7B8C7D]" />
                      <div>
                        <span className="text-xs font-semibold text-[#3A3F3A] block">
                          Copy Entire Workspace Template
                        </span>
                        <span className="text-[11px] text-[#3A3F3A]/60">
                          Includes Flow, Tasks, Habits, Projects, Books & Journal
                        </span>
                      </div>
                    </div>
                    {copiedFullTemplate ? (
                      <span className="text-[11px] text-[#7B8C7D] font-medium flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Copied!
                      </span>
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-[#3A3F3A]/40" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={exportAsJSON}
                    className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-[#E3E8E1] hover:bg-[#F5F2ED] transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Download className="w-4 h-4 text-[#7B8C7D]" />
                      <div>
                        <span className="text-xs font-semibold text-[#3A3F3A] block">
                          Download JSON Backup
                        </span>
                        <span className="text-[11px] text-[#3A3F3A]/60">
                          Complete raw state file for import/export
                        </span>
                      </div>
                    </div>
                    <Download className="w-3.5 h-3.5 text-[#3A3F3A]/40" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: Step-by-Step Guide */}
            {activeTab === 'guide' && (
              <div className="space-y-3 pt-1 text-xs text-[#3A3F3A]/80 leading-relaxed">
                <div className="p-3.5 bg-[#F5F2ED] rounded-2xl border border-[#D9D1C7] space-y-1.5">
                  <span className="font-semibold text-[#3A3F3A] block">Aesthetic Notion Setup:</span>
                  <p>• <strong>Icon:</strong> Select an organic icon like 🍵 or 🌱.</p>
                  <p>• <strong>Cover:</strong> Choose an earthy tone or search Unsplash inside Notion for <em>"linen texture"</em> or <em>"sage green minimalist"</em>.</p>
                  <p>• <strong>Typography:</strong> In Notion page settings, select <strong>Serif</strong> font and toggle <strong>Full width</strong>.</p>
                </div>
                <div className="p-3.5 bg-white rounded-2xl border border-[#E3E8E1] space-y-1.5">
                  <span className="font-semibold text-[#3A3F3A] block">Recreating Databases natively:</span>
                  <p>• <strong>Tasks:</strong> Type <code className="bg-[#F5F2ED] px-1 py-0.5 rounded">/board</code> and group by status (To Do, In Progress, Done).</p>
                  <p>• <strong>Habits:</strong> Type <code className="bg-[#F5F2ED] px-1 py-0.5 rounded">/table</code> with 7 Checkbox properties (Mon-Sun).</p>
                  <p>• <strong>Bento Columns:</strong> Type <code className="bg-[#F5F2ED] px-1 py-0.5 rounded">/3 columns</code> and place Callouts inside each.</p>
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-[#E3E8E1] flex items-center justify-between">
              <span className="text-[11px] text-[#3A3F3A]/50 font-mono">
                Sanctuary Template • v2.0
              </span>
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="px-5 py-2 rounded-full bg-[#7B8C7D] text-[#F5F2ED] text-xs font-medium hover:bg-[#68786A] transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
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
  CheckCheck,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  X,
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
  const [copiedRawText, setCopiedRawText] = useState(false);
  const [downloadSuccessMsg, setDownloadSuccessMsg] = useState<string | null>(null);
  const [showRawMarkdown, setShowRawMarkdown] = useState(false);
  const [activeTab, setActiveTab] = useState<'copy' | 'embed' | 'guide'>('copy');

  const rawTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Universal clipboard copy helper with multi-tier iframe fallback
  const copyToClipboard = async (text: string): Promise<boolean> => {
    // 1. Try modern clipboard API
    if (navigator?.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        console.warn('navigator.clipboard.writeText blocked in iframe, using execCommand fallback', err);
      }
    }

    // 2. Reliable fallback for iframes using textarea and execCommand('copy')
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      textArea.style.top = '-9999px';
      textArea.style.width = '2em';
      textArea.style.height = '2em';
      textArea.style.padding = '0';
      textArea.style.border = 'none';
      textArea.style.outline = 'none';
      textArea.style.boxShadow = 'none';
      textArea.style.background = 'transparent';
      // Do NOT set readonly - it prevents execCommand('copy') in Safari/iOS and sandboxed iframes
      document.body.appendChild(textArea);
      textArea.focus({ preventScroll: true });
      textArea.select();
      textArea.setSelectionRange(0, text.length);
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      if (successful) return true;
    } catch (err) {
      console.warn('execCommand copy fallback failed', err);
    }

    return false;
  };

  // Safe file downloader that works in browser and iframes
  const triggerFileDownload = (content: string, filename: string, mimeType = 'text/markdown;charset=utf-8') => {
    let succeeded = false;

    // Method 1: Blob URL
    try {
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        try {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        } catch {
          // ignore
        }
      }, 10000);
      succeeded = true;
    } catch (e) {
      console.warn('Blob download failed, trying data URI fallback', e);
    }

    // Method 2: Data URI fallback
    if (!succeeded) {
      try {
        const dataUri = `data:${mimeType},` + encodeURIComponent(content);
        const a = document.createElement('a');
        a.href = dataUri;
        a.download = filename;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          try {
            document.body.removeChild(a);
          } catch {
            // ignore
          }
        }, 2000);
        succeeded = true;
      } catch (e) {
        console.warn('Data URI download failed', e);
      }
    }

    setDownloadSuccessMsg(`Downloaded ${filename}`);
    setTimeout(() => setDownloadSuccessMsg(null), 3500);
    return succeeded;
  };

  // Copy current live URL for Notion /embed
  const handleCopyEmbedUrl = async () => {
    const url = window.location.href;
    const ok = await copyToClipboard(url);
    if (ok) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
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

  const getFullWorkspaceMarkdown = () => {
    const sections = ['daily-flow', 'tasks', 'habits', 'projects', 'reading', 'reflection'];
    return sections.map((s) => generatePageMarkdown(s)).join('\n\n---\n\n');
  };

  const handleCopyCurrentPage = async () => {
    const md = generatePageMarkdown(page.type);
    const ok = await copyToClipboard(md);
    if (ok) {
      setCopiedPage(true);
      setTimeout(() => setCopiedPage(false), 2000);
    }
  };

  const handleCopyFullWorkspace = async () => {
    const fullMd = getFullWorkspaceMarkdown();
    const ok = await copyToClipboard(fullMd);
    if (ok) {
      setCopiedFullTemplate(true);
      setTimeout(() => setCopiedFullTemplate(false), 2000);
    }
  };

  const exportAsMarkdown = () => {
    const fullMd = getFullWorkspaceMarkdown();
    triggerFileDownload(fullMd, 'sanctuary-notion-template.md', 'text/markdown;charset=utf-8');
  };

  // Generate CSVs directly in code for guaranteed download & copy
  const handleDownloadTasksCSV = () => {
    let csv = 'Task,Status,Priority,Life Area,Estimate,Due Date\n';
    workspaceState.tasks.forEach((t) => {
      csv += `"${t.title.replace(/"/g, '""')}","${t.status}","${t.priority}","${t.area}","${t.estimate || ''}","${t.dueDate || ''}"\n`;
    });
    triggerFileDownload(csv, 'tasks-database.csv', 'text/csv;charset=utf-8');
  };

  const handleDownloadHabitsCSV = () => {
    let csv = 'Habit,Category,Mon,Tue,Wed,Thu,Fri,Sat,Sun,Streak (Days)\n';
    workspaceState.habits.forEach((h) => {
      const days = h.days.map((d) => (d ? 'Yes' : 'No')).join(',');
      csv += `"${h.name.replace(/"/g, '""')}","${h.category}",${days},${h.streak}\n`;
    });
    triggerFileDownload(csv, 'habits-database.csv', 'text/csv;charset=utf-8');
  };

  const handleDownloadReadingCSV = () => {
    let csv = 'Title,Author,Format,Status,Core Insight\n';
    workspaceState.reading.forEach((r) => {
      csv += `"${r.title.replace(/"/g, '""')}","${r.author}","${r.format}","${r.status}","${(r.takeaway || '').replace(/"/g, '""')}"\n`;
    });
    triggerFileDownload(csv, 'reading-database.csv', 'text/csv;charset=utf-8');
  };

  const handleSelectAllRawText = () => {
    if (rawTextareaRef.current) {
      rawTextareaRef.current.focus();
      rawTextareaRef.current.select();
    }
  };

  const handleCopyRawText = async () => {
    const fullMd = getFullWorkspaceMarkdown();
    const ok = await copyToClipboard(fullMd);
    if (ok) {
      setCopiedRawText(true);
      setTimeout(() => setCopiedRawText(false), 2000);
    }
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

      {/* Notion Integration & Export Modal (Portaled to document.body for guaranteed top-level anchoring) */}
      {showExportModal && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[99999] bg-[#3A3F3A]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-hidden"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowExportModal(false);
          }}
        >
          <div
            className="relative bg-white border border-[#D9D1C7] rounded-3xl shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden text-[#3A3F3A] animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* STICKY / FIXED MODAL HEADER - ALWAYS AT THE VERY TOP */}
            <div className="p-5 pb-3 border-b border-[#E3E8E1] bg-white shrink-0">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🍵</span>
                    <h3 className="font-serif text-xl font-medium text-[#3A3F3A]">
                      Use in Notion
                    </h3>
                  </div>
                  <p className="text-xs text-[#3A3F3A]/65 mt-1 leading-normal">
                    Copy native markdown blocks, download database files, or embed the live widget.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowExportModal(false)}
                  className="w-8 h-8 rounded-full border border-[#D9D1C7] text-[#3A3F3A]/60 hover:text-[#3A3F3A] hover:bg-[#F5F2ED] flex items-center justify-center transition-colors cursor-pointer shrink-0 ml-2"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Notification Toast Banner inside header if an action occurred */}
              {copiedFullTemplate && (
                <div className="mt-3 p-2.5 bg-[#7B8C7D]/15 border border-[#7B8C7D]/40 rounded-xl text-xs font-medium text-[#2E362F] flex items-center gap-2 animate-in fade-in">
                  <CheckCheck className="w-4 h-4 text-[#7B8C7D] shrink-0" />
                  <span>Entire template copied! In Notion, press <strong>Cmd+V / Ctrl+V</strong>.</span>
                </div>
              )}
              {copiedPage && (
                <div className="mt-3 p-2.5 bg-[#7B8C7D]/15 border border-[#7B8C7D]/40 rounded-xl text-xs font-medium text-[#2E362F] flex items-center gap-2 animate-in fade-in">
                  <CheckCheck className="w-4 h-4 text-[#7B8C7D] shrink-0" />
                  <span>{page.title} view copied! Ready to paste into Notion.</span>
                </div>
              )}
              {downloadSuccessMsg && (
                <div className="mt-3 p-2.5 bg-[#7B8C7D]/15 border border-[#7B8C7D]/40 rounded-xl text-xs font-medium text-[#2E362F] flex items-center gap-2 animate-in fade-in">
                  <Download className="w-4 h-4 text-[#7B8C7D] shrink-0" />
                  <span>{downloadSuccessMsg}! Import via <em>Settings → Import → Text & Markdown</em>.</span>
                </div>
              )}

              {/* Navigation Tabs (Fixed right under header) */}
              <div className="flex items-center gap-1.5 p-1 mt-3 bg-[#F5F2ED] rounded-full border border-[#D9D1C7]">
                <button
                  type="button"
                  onClick={() => setActiveTab('copy')}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer text-center ${
                    activeTab === 'copy'
                      ? 'bg-[#7B8C7D] text-[#F5F2ED] shadow-2xs font-semibold'
                      : 'text-[#3A3F3A]/70 hover:text-[#3A3F3A]'
                  }`}
                >
                  1. Native Notion
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('embed')}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer text-center ${
                    activeTab === 'embed'
                      ? 'bg-[#7B8C7D] text-[#F5F2ED] shadow-2xs font-semibold'
                      : 'text-[#3A3F3A]/70 hover:text-[#3A3F3A]'
                  }`}
                >
                  2. Embed Widget
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('guide')}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer text-center ${
                    activeTab === 'guide'
                      ? 'bg-[#7B8C7D] text-[#F5F2ED] shadow-2xs font-semibold'
                      : 'text-[#3A3F3A]/70 hover:text-[#3A3F3A]'
                  }`}
                >
                  3. Setup Guide
                </button>
              </div>
            </div>

            {/* SCROLLABLE MODAL BODY */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* TAB 1: Native Notion */}
              {activeTab === 'copy' && (
                <div className="space-y-3.5">
                  <p className="text-xs text-[#3A3F3A]/70 leading-relaxed">
                    Paste native Notion blocks directly into an empty Notion page, or download files to import into your workspace:
                  </p>

                  <div className="space-y-2.5">
                    {/* Primary Button: Copy Entire Notion Template */}
                    <button
                      type="button"
                      onClick={handleCopyFullWorkspace}
                      className="w-full flex items-center justify-between p-3.5 rounded-2xl border-2 border-[#7B8C7D]/50 bg-[#7B8C7D]/10 hover:bg-[#7B8C7D]/15 transition-all cursor-pointer text-left shadow-2xs"
                    >
                      <div className="flex items-center gap-3">
                        <LayoutGrid className="w-5 h-5 text-[#7B8C7D] shrink-0" />
                        <div>
                          <span className="text-xs font-semibold text-[#3A3F3A] block">
                            Copy Entire Notion Template (Markdown)
                          </span>
                          <span className="text-[11px] text-[#3A3F3A]/70">
                            Paste directly into Notion (Cmd+V / Ctrl+V) for instant native blocks
                          </span>
                        </div>
                      </div>
                      <div className="shrink-0 ml-2">
                        {copiedFullTemplate ? (
                          <span className="text-[11px] text-[#7B8C7D] font-semibold flex items-center gap-1 bg-white px-2.5 py-1 rounded-full border border-[#7B8C7D]/40 shadow-2xs">
                            <CheckCheck className="w-3.5 h-3.5" /> Copied!
                          </span>
                        ) : (
                          <span className="text-[11px] text-[#7B8C7D] font-semibold flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-[#D9D1C7] hover:border-[#7B8C7D]">
                            <Copy className="w-3.5 h-3.5" /> Copy
                          </span>
                        )}
                      </div>
                    </button>

                    {/* Download Markdown File Button + Direct link */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={exportAsMarkdown}
                        className="flex-1 flex items-center justify-between p-3 rounded-2xl border border-[#D9D1C7] hover:border-[#7B8C7D] hover:bg-[#F5F2ED] transition-colors cursor-pointer text-left"
                      >
                        <div className="flex items-center gap-2.5">
                          <Download className="w-4 h-4 text-[#7B8C7D] shrink-0" />
                          <div>
                            <span className="text-xs font-semibold text-[#3A3F3A] block">
                              Download Markdown (.md)
                            </span>
                            <span className="text-[10px] text-[#3A3F3A]/60">
                              Import via Settings → Import → Text & Markdown
                            </span>
                          </div>
                        </div>
                        <span className="text-[11px] text-[#3A3F3A]/70 font-medium flex items-center gap-1 bg-white px-2.5 py-1 rounded-full border border-[#D9D1C7] shrink-0 ml-2">
                          <Download className="w-3 h-3" /> Download
                        </span>
                      </button>

                      <a
                        href="/sanctuary-template.md"
                        download="sanctuary-template.md"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-2xl border border-[#D9D1C7] hover:border-[#7B8C7D] hover:bg-[#F5F2ED] text-[11px] text-[#7B8C7D] font-medium flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                        title="Direct link to template file"
                      >
                        <span>Raw</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    {/* Copy Current View Only */}
                    <button
                      type="button"
                      onClick={handleCopyCurrentPage}
                      className="w-full flex items-center justify-between p-2.5 rounded-2xl border border-[#E3E8E1] hover:bg-[#F5F2ED] transition-colors cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-[#7B8C7D] shrink-0" />
                        <div>
                          <span className="text-xs font-semibold text-[#3A3F3A] block">
                            Copy Current View Only ({page.title})
                          </span>
                          <span className="text-[10px] text-[#3A3F3A]/60">
                            Formatted with checkboxes, tables & quotes
                          </span>
                        </div>
                      </div>
                      <div className="shrink-0 ml-2">
                        {copiedPage ? (
                          <span className="text-[11px] text-[#7B8C7D] font-medium flex items-center gap-1 bg-white px-2 py-0.5 rounded-full border border-[#7B8C7D]">
                            <Check className="w-3 h-3" /> Copied!
                          </span>
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-[#3A3F3A]/40" />
                        )}
                      </div>
                    </button>

                    {/* Database CSV Direct Downloads */}
                    <div className="pt-2 border-t border-[#E3E8E1]">
                      <span className="text-[11px] font-semibold text-[#3A3F3A]/80 uppercase tracking-wider block mb-2">
                        Importable Notion Databases (CSV Files)
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        <a
                          href="/notion-csv/tasks.csv"
                          download="tasks.csv"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => {
                            handleDownloadTasksCSV();
                          }}
                          className="p-2.5 rounded-xl border border-[#D9D1C7] hover:border-[#7B8C7D] bg-white hover:bg-[#F5F2ED] text-center text-xs font-medium text-[#3A3F3A] transition-colors flex flex-col items-center gap-1 cursor-pointer"
                          title="Download Tasks database as CSV"
                        >
                          <span className="text-base">🗂️</span>
                          <span className="font-semibold text-[11px]">Tasks CSV</span>
                          <span className="text-[10px] text-[#7B8C7D]">Download 📥</span>
                        </a>
                        <a
                          href="/notion-csv/habits.csv"
                          download="habits.csv"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => {
                            handleDownloadHabitsCSV();
                          }}
                          className="p-2.5 rounded-xl border border-[#D9D1C7] hover:border-[#7B8C7D] bg-white hover:bg-[#F5F2ED] text-center text-xs font-medium text-[#3A3F3A] transition-colors flex flex-col items-center gap-1 cursor-pointer"
                          title="Download Habits database as CSV"
                        >
                          <span className="text-base">🍵</span>
                          <span className="font-semibold text-[11px]">Habits CSV</span>
                          <span className="text-[10px] text-[#7B8C7D]">Download 📥</span>
                        </a>
                        <a
                          href="/notion-csv/reading.csv"
                          download="reading.csv"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => {
                            handleDownloadReadingCSV();
                          }}
                          className="p-2.5 rounded-xl border border-[#D9D1C7] hover:border-[#7B8C7D] bg-white hover:bg-[#F5F2ED] text-center text-xs font-medium text-[#3A3F3A] transition-colors flex flex-col items-center gap-1 cursor-pointer"
                          title="Download Books database as CSV"
                        >
                          <span className="text-base">📖</span>
                          <span className="font-semibold text-[11px]">Books CSV</span>
                          <span className="text-[10px] text-[#7B8C7D]">Download 📥</span>
                        </a>
                      </div>
                    </div>

                    {/* View Raw Markdown directly */}
                    <div className="pt-2 border-t border-[#E3E8E1]">
                      <button
                        type="button"
                        onClick={() => setShowRawMarkdown(!showRawMarkdown)}
                        className="w-full flex items-center justify-between text-xs text-[#3A3F3A]/80 hover:text-[#3A3F3A] py-1 cursor-pointer font-medium"
                      >
                        <span className="flex items-center gap-1.5">
                          <span>📝</span>
                          <span>View & Copy Raw Markdown Text</span>
                        </span>
                        {showRawMarkdown ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>

                      {showRawMarkdown && (
                        <div className="mt-2 space-y-2 p-3 bg-[#F5F2ED] rounded-2xl border border-[#D9D1C7]">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] text-[#3A3F3A]/70 font-mono">
                              sanctuary-notion-template.md
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={handleSelectAllRawText}
                                className="px-2.5 py-1 bg-white border border-[#D9D1C7] rounded-lg text-[11px] font-medium text-[#3A3F3A] hover:bg-[#E3E8E1] transition-colors cursor-pointer"
                              >
                                Select All
                              </button>
                              <button
                                type="button"
                                onClick={handleCopyRawText}
                                className="px-2.5 py-1 bg-[#7B8C7D] hover:bg-[#68786A] text-white rounded-lg text-[11px] font-medium transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                {copiedRawText ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                <span>{copiedRawText ? 'Copied!' : 'Copy Text'}</span>
                              </button>
                            </div>
                          </div>
                          <textarea
                            ref={rawTextareaRef}
                            readOnly
                            value={getFullWorkspaceMarkdown()}
                            rows={6}
                            className="w-full p-2.5 text-[11px] font-mono bg-white border border-[#D9D1C7] rounded-xl text-[#3A3F3A] focus:outline-none focus:ring-1 focus:ring-[#7B8C7D] resize-y select-all"
                          />
                          <p className="text-[10px] text-[#3A3F3A]/60">
                            Tip: Click "Select All", press <strong>Cmd+C</strong> (Mac) or <strong>Ctrl+C</strong> (Windows), then paste into Notion.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Embed in Notion */}
              {activeTab === 'embed' && (
                <div className="space-y-4">
                  <div className="p-4 bg-[#F5F2ED] border border-[#E3E8E1] rounded-2xl space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#3A3F3A]">Your Live Embed Link:</span>
                      <span className="text-[10px] text-[#7B8C7D] font-mono font-medium">Interactive Widget</span>
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
                        Drag the corner handles of the widget to expand it full-width, and enable <span className="font-semibold text-[#3A3F3A]">Full width</span> in Notion page settings.
                      </li>
                    </ol>
                  </div>
                </div>
              )}

              {/* TAB 3: Step-by-Step Guide */}
              {activeTab === 'guide' && (
                <div className="space-y-3 text-xs text-[#3A3F3A]/80 leading-relaxed">
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
            </div>

            {/* STICKY / FIXED MODAL FOOTER */}
            <div className="p-3.5 sm:px-6 border-t border-[#E3E8E1] bg-[#FAF8F5] flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={() => window.open(window.location.href, '_blank')}
                className="text-xs text-[#7B8C7D] hover:text-[#5F6E61] flex items-center gap-1.5 font-medium transition-colors cursor-pointer"
                title="Open in new browser tab to bypass iframe sandbox download restrictions"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open App in New Tab</span>
              </button>
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="px-5 py-2 rounded-full bg-[#7B8C7D] text-[#F5F2ED] text-xs font-semibold hover:bg-[#68786A] transition-colors cursor-pointer shadow-2xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
};

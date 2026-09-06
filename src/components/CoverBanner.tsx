import React from 'react';
import { PageMetadata, CoverStyle } from '../types';
import { Sparkles, Palette, X, Smile } from 'lucide-react';

interface CoverBannerProps {
  page: PageMetadata;
  onUpdateIcon: (newIcon: string) => void;
  onUpdateCover: (newCover: CoverStyle) => void;
  onUpdateTitle?: (newTitle: string) => void;
  onUpdateSubtitle?: (newSubtitle: string) => void;
}

const COVER_STYLES: Record<CoverStyle, string> = {
  'sage-mist': 'bg-gradient-to-r from-[#E3E8E1] via-[#EAEFE8] to-[#F5F2ED] border-b border-[#D9D1C7]',
  'warm-linen': 'bg-gradient-to-r from-[#EAE7E0] via-[#F2ECE4] to-[#F5F2ED] border-b border-[#D9D1C7]',
  'morning-dew': 'bg-gradient-to-r from-[#7B8C7D]/25 via-[#E3E8E1] to-[#F5F2ED] border-b border-[#D9D1C7]',
  'sandstone': 'bg-gradient-to-r from-[#D9D1C7]/60 via-[#EAE7E0] to-[#F5F2ED] border-b border-[#D9D1C7]',
  'none': 'h-0 border-none',
};

const COVER_PREVIEWS: { id: CoverStyle; label: string; previewClass: string }[] = [
  {
    id: 'sage-mist',
    label: 'Sage Mist',
    previewClass: 'from-[#E3E8E1] via-[#EAEFE8] to-[#F5F2ED]',
  },
  {
    id: 'warm-linen',
    label: 'Warm Linen',
    previewClass: 'from-[#EAE7E0] via-[#F2ECE4] to-[#F5F2ED]',
  },
  {
    id: 'morning-dew',
    label: 'Morning Dew',
    previewClass: 'from-[#7B8C7D]/30 via-[#E3E8E1] to-[#F5F2ED]',
  },
  {
    id: 'sandstone',
    label: 'Sandstone',
    previewClass: 'from-[#D9D1C7]/70 via-[#EAE7E0] to-[#F5F2ED]',
  },
];

const EMOJI_OPTIONS = ['🌿', '🌱', '📋', '☕', '🍵', '🪵', '📖', '🕯️', '🕊️', '🧘', '☁️', '🌾', '🌸', '✨', '🌊', '🏔️'];

export const CoverBanner: React.FC<CoverBannerProps> = ({
  page,
  onUpdateIcon,
  onUpdateCover,
  onUpdateTitle,
  onUpdateSubtitle,
}) => {
  const [showIconPicker, setShowIconPicker] = React.useState(false);
  const [showCoverPicker, setShowCoverPicker] = React.useState(false);
  const [isEditingTitle, setIsEditingTitle] = React.useState(false);
  const [isEditingSubtitle, setIsEditingSubtitle] = React.useState(false);
  const [titleValue, setTitleValue] = React.useState(page.title);
  const [subtitleValue, setSubtitleValue] = React.useState(page.subtitle);

  React.useEffect(() => {
    setTitleValue(page.title);
    setSubtitleValue(page.subtitle);
  }, [page.title, page.subtitle]);

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    if (titleValue.trim() && onUpdateTitle) {
      onUpdateTitle(titleValue.trim());
    }
  };

  const handleSubtitleSubmit = () => {
    setIsEditingSubtitle(false);
    if (onUpdateSubtitle) {
      onUpdateSubtitle(subtitleValue.trim());
    }
  };

  const handleAddCoverClick = () => {
    if (page.cover === 'none') {
      onUpdateCover('sage-mist');
    }
    setShowCoverPicker(true);
  };

  return (
    <div className="relative w-full group/cover-container">
      {/* Cover Banner Area */}
      {page.cover !== 'none' && (
        <div className={`w-full h-44 sm:h-52 relative transition-all duration-300 ${COVER_STYLES[page.cover]}`}>
          {/* Subtle natural texture overlay */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#3A3F3A_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          {/* Hover controls for cover */}
          <div className="absolute top-3 right-4 flex items-center gap-2">
            <button
              id={`change-cover-${page.id}`}
              type="button"
              onClick={() => setShowCoverPicker(!showCoverPicker)}
              className="px-3 py-1.5 text-xs rounded-full bg-[#F5F2ED]/90 hover:bg-white text-[#3A3F3A] border border-[#D9D1C7] backdrop-blur-sm flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              title="Change banner style"
            >
              <Palette className="w-3.5 h-3.5 text-[#7B8C7D]" />
              <span>Change Cover</span>
            </button>
            <button
              type="button"
              onClick={() => onUpdateCover('none')}
              className="p-1.5 text-xs rounded-full bg-[#F5F2ED]/90 hover:bg-white text-[#3A3F3A]/70 hover:text-[#944D4D] border border-[#D9D1C7] backdrop-blur-sm transition-colors cursor-pointer shadow-xs"
              title="Remove banner cover"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Cover style palette dropdown */}
          {showCoverPicker && (
            <div className="absolute top-12 right-4 z-40 p-3 bg-white border border-[#D9D1C7] rounded-3xl shadow-xl space-y-2 w-64 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-1.5 border-b border-[#D9D1C7]/60">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#3A3F3A]/70">
                  Select Banner Style
                </span>
                <button
                  type="button"
                  onClick={() => setShowCoverPicker(false)}
                  className="text-[#3A3F3A]/40 hover:text-[#3A3F3A] cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {COVER_PREVIEWS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      onUpdateCover(preset.id);
                      setShowCoverPicker(false);
                    }}
                    className={`p-2 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-1.5 ${
                      page.cover === preset.id
                        ? 'border-[#7B8C7D] ring-2 ring-[#7B8C7D]/20 bg-[#E3E8E1]/30'
                        : 'border-[#D9D1C7] hover:border-[#7B8C7D]/60 hover:bg-[#F5F2ED]'
                    }`}
                  >
                    <div
                      className={`w-full h-8 rounded-xl bg-gradient-to-r ${preset.previewClass} border border-black/5`}
                    />
                    <span className="text-[11px] font-medium text-[#3A3F3A] truncate">
                      {preset.label}
                    </span>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  onUpdateCover('none');
                  setShowCoverPicker(false);
                }}
                className="w-full text-center py-1.5 text-xs text-[#944D4D] hover:bg-[#944D4D]/10 rounded-xl transition-colors cursor-pointer"
              >
                Remove Cover
              </button>
            </div>
          )}
        </div>
      )}

      {/* Notion Page Icon & Header */}
      <div className="max-w-4xl mx-auto px-6 sm:px-10">
        {/* Notion-style Page Action Bar */}
        <div className={`flex items-center gap-3 pt-4 pb-2 ${page.cover === 'none' ? 'opacity-80 hover:opacity-100' : 'opacity-0 group-hover/cover-container:opacity-100'} transition-opacity`}>
          {page.cover === 'none' ? (
            <button
              type="button"
              onClick={handleAddCoverClick}
              className="px-3 py-1 text-xs rounded-full bg-white/80 hover:bg-white text-[#3A3F3A] border border-[#D9D1C7] hover:border-[#7B8C7D] transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <Sparkles className="w-3 h-3 text-[#7B8C7D]" />
              <span>Add Cover</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowCoverPicker(!showCoverPicker)}
              className="px-3 py-1 text-xs rounded-full bg-white/80 hover:bg-white text-[#3A3F3A] border border-[#D9D1C7] hover:border-[#7B8C7D] transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <Palette className="w-3 h-3 text-[#7B8C7D]" />
              <span>Change Cover</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowIconPicker(!showIconPicker)}
            className="px-3 py-1 text-xs rounded-full bg-white/80 hover:bg-white text-[#3A3F3A] border border-[#D9D1C7] hover:border-[#7B8C7D] transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <Smile className="w-3 h-3 text-[#7B8C7D]" />
            <span>Change Icon</span>
          </button>
        </div>

        {/* Cover picker when opened from 'Add Cover' button with no cover */}
        {showCoverPicker && page.cover === 'none' && (
          <div className="mb-4 p-3 bg-white border border-[#D9D1C7] rounded-3xl shadow-xl space-y-2 w-72 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-1.5 border-b border-[#D9D1C7]/60">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#3A3F3A]/70">
                Choose Cover Banner
              </span>
              <button
                type="button"
                onClick={() => setShowCoverPicker(false)}
                className="text-[#3A3F3A]/40 hover:text-[#3A3F3A] cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {COVER_PREVIEWS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    onUpdateCover(preset.id);
                    setShowCoverPicker(false);
                  }}
                  className="p-2 rounded-2xl border border-[#D9D1C7] hover:border-[#7B8C7D] hover:bg-[#F5F2ED] text-left transition-all cursor-pointer flex flex-col gap-1.5"
                >
                  <div
                    className={`w-full h-8 rounded-xl bg-gradient-to-r ${preset.previewClass} border border-black/5`}
                  />
                  <span className="text-[11px] font-medium text-[#3A3F3A] truncate">
                    {preset.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Icon */}
        <div className={`relative ${page.cover !== 'none' ? '-mt-10 sm:-mt-12' : 'mt-1'} mb-4`}>
          <div className="inline-block relative">
            <button
              id={`icon-picker-btn-${page.id}`}
              type="button"
              onClick={() => setShowIconPicker(!showIconPicker)}
              title="Change icon"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white border border-[#D9D1C7] shadow-sm flex items-center justify-center text-3xl sm:text-4xl hover:bg-[#F5F2ED] transition-colors cursor-pointer"
            >
              {page.icon}
            </button>

            {showIconPicker && (
              <div className="absolute left-0 top-full mt-2 z-40 p-3 bg-white border border-[#D9D1C7] rounded-3xl shadow-xl grid grid-cols-4 gap-2 w-56 animate-in fade-in zoom-in-95">
                {EMOJI_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      onUpdateIcon(emoji);
                      setShowIconPicker(false);
                    }}
                    className="w-11 h-11 rounded-2xl hover:bg-[#E3E8E1] text-2xl flex items-center justify-center transition-colors cursor-pointer"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Page Title & Subtitle */}
        <div className="mb-6 group/title">
          {isEditingTitle ? (
            <input
              type="text"
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleTitleSubmit();
                if (e.key === 'Escape') {
                  setTitleValue(page.title);
                  setIsEditingTitle(false);
                }
              }}
              autoFocus
              className="text-3xl sm:text-4xl font-serif text-[#3A3F3A] leading-tight bg-transparent border-b border-[#7B8C7D] focus:outline-none w-full py-0.5"
            />
          ) : (
            <h1
              onClick={() => setIsEditingTitle(true)}
              className="text-3xl sm:text-4xl font-serif text-[#3A3F3A] leading-tight cursor-text hover:text-[#7B8C7D] transition-colors inline-block"
              title="Click to rename page"
            >
              {page.title}
            </h1>
          )}

          {isEditingSubtitle ? (
            <input
              type="text"
              value={subtitleValue}
              onChange={(e) => setSubtitleValue(e.target.value)}
              onBlur={handleSubtitleSubmit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSubtitleSubmit();
                if (e.key === 'Escape') {
                  setSubtitleValue(page.subtitle);
                  setIsEditingSubtitle(false);
                }
              }}
              autoFocus
              className="text-sm text-[#3A3F3A]/80 mt-1.5 leading-relaxed max-w-2xl bg-transparent border-b border-[#7B8C7D] focus:outline-none w-full py-0.5"
            />
          ) : (
            <p
              onClick={() => setIsEditingSubtitle(true)}
              className="text-sm text-[#3A3F3A]/70 mt-1.5 leading-relaxed max-w-2xl cursor-text hover:text-[#3A3F3A] transition-colors"
              title="Click to edit subtitle"
            >
              {page.subtitle || 'Add a subtitle...'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};


import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

interface NotionToggleProps {
  title: string;
  defaultOpen?: boolean;
  count?: number;
  icon?: string;
  children: React.ReactNode;
  className?: string;
}

export const NotionToggle: React.FC<NotionToggleProps> = ({
  title,
  defaultOpen = false,
  count,
  icon,
  children,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`py-1 ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 py-2 px-2.5 -mx-2.5 rounded-2xl hover:bg-[#EAE7E0]/60 text-left transition-colors cursor-pointer group"
      >
        <span className="text-[#3A3F3A]/60 group-hover:text-[#7B8C7D] transition-transform duration-200 inline-block">
          <ChevronRight
            className={`w-4 h-4 transform transition-transform duration-200 ${
              isOpen ? 'rotate-90 text-[#7B8C7D]' : ''
            }`}
          />
        </span>
        {icon && <span className="text-base select-none">{icon}</span>}
        <span className="font-medium text-sm text-[#3A3F3A]">
          {title}
        </span>
        {count !== undefined && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-[#E3E8E1] text-[#3A3F3A] font-medium ml-auto">
            {count}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="pl-6 pt-2 pb-1 border-l-2 border-[#D9D1C7] ml-2 mt-1 space-y-2 text-sm text-[#3A3F3A]">
          {children}
        </div>
      )}
    </div>
  );
};

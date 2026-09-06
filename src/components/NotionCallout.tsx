import React from 'react';

interface NotionCalloutProps {
  icon?: string | React.ReactNode;
  variant?: 'sage' | 'beige' | 'bone';
  children: React.ReactNode;
  className?: string;
}

export const NotionCallout: React.FC<NotionCalloutProps> = ({
  icon = '💡',
  variant = 'sage',
  children,
  className = '',
}) => {
  const variantStyles = {
    sage: 'bg-[#E3E8E1] border-[#D9D1C7]/70 text-[#3A3F3A]',
    beige: 'bg-[#EAE7E0] border-[#D9D1C7] text-[#3A3F3A]',
    bone: 'bg-[#F5F2ED] border-[#D9D1C7] text-[#3A3F3A]',
  };

  return (
    <div
      className={`rounded-3xl border px-5 py-4 flex items-start gap-3.5 transition-colors ${variantStyles[variant]} ${className}`}
    >
      <div className="text-xl select-none shrink-0 mt-0.5">{icon}</div>
      <div className="text-sm leading-relaxed grow">{children}</div>
    </div>
  );
};

import React from 'react';

const statusColorMap = {
  // Success (Muted Olive Green #6B7B4C)
  ACQUIRED: 'bg-[#6B7B4C]/15 text-[#4D5A34] border-[#6B7B4C]/30',
  RESOLVED: 'bg-[#6B7B4C]/15 text-[#4D5A34] border-[#6B7B4C]/30',
  PAID: 'bg-[#6B7B4C]/15 text-[#4D5A34] border-[#6B7B4C]/30',
  APPROVED: 'bg-[#6B7B4C]/15 text-[#4D5A34] border-[#6B7B4C]/30',
  VERIFIED: 'bg-[#6B7B4C]/15 text-[#4D5A34] border-[#6B7B4C]/30',
  COMPLETED: 'bg-[#6B7B4C]/15 text-[#4D5A34] border-[#6B7B4C]/30',
  SANCTIONED: 'bg-[#6B7B4C]/15 text-[#4D5A34] border-[#6B7B4C]/30',
  AWARD_PRONOUNCED: 'bg-[#6B7B4C]/15 text-[#4D5A34] border-[#6B7B4C]/30',
  VALUATION_COMPLETED: 'bg-[#6B7B4C]/15 text-[#4D5A34] border-[#6B7B4C]/30',
  LOW: 'bg-[#6B7B4C]/15 text-[#4D5A34] border-[#6B7B4C]/30',
  ONLINE: 'bg-[#6B7B4C]/15 text-[#4D5A34] border-[#6B7B4C]/30',

  // Warning (Muted Amber #C99A3F)
  PENDING: 'bg-[#C99A3F]/15 text-[#8F6A22] border-[#C99A3F]/30',
  IN_PROGRESS: 'bg-[#C99A3F]/15 text-[#8F6A22] border-[#C99A3F]/30',
  VALUATION_IN_PROGRESS: 'bg-[#C99A3F]/15 text-[#8F6A22] border-[#C99A3F]/30',
  UNDER_INVESTIGATION: 'bg-[#C99A3F]/15 text-[#8F6A22] border-[#C99A3F]/30',
  HEARING_SCHEDULED: 'bg-[#C99A3F]/15 text-[#8F6A22] border-[#C99A3F]/30',
  MEDIUM: 'bg-[#C99A3F]/15 text-[#8F6A22] border-[#C99A3F]/30',
  MODERATE: 'bg-[#C99A3F]/15 text-[#8F6A22] border-[#C99A3F]/30',
  PARTIALLY_DELIVERED: 'bg-[#C99A3F]/15 text-[#8F6A22] border-[#C99A3F]/30',

  // Danger (Muted Brick Red #A24A3F)
  DELAYED: 'bg-[#A24A3F]/15 text-[#7E332A] border-[#A24A3F]/30',
  DISPUTED: 'bg-[#A24A3F]/15 text-[#7E332A] border-[#A24A3F]/30',
  REJECTED: 'bg-[#A24A3F]/15 text-[#7E332A] border-[#A24A3F]/30',
  REJECTED_MISMATCH: 'bg-[#A24A3F]/15 text-[#7E332A] border-[#A24A3F]/30',
  HIGH: 'bg-[#A24A3F]/15 text-[#7E332A] border-[#A24A3F]/30',
  CRITICAL: 'bg-[#A24A3F]/15 text-[#7E332A] border-[#A24A3F]/30 font-bold',
  DISPUTE_FLAGGED: 'bg-[#A24A3F]/15 text-[#7E332A] border-[#A24A3F]/30',
  LITIGATION_STAYED: 'bg-[#A24A3F]/15 text-[#7E332A] border-[#A24A3F]/30',

  // Info (Muted Slate Blue #5B7A8C)
  NOTIFIED: 'bg-[#5B7A8C]/15 text-[#3D5665] border-[#5B7A8C]/30',
  SECTION_11_PUBLISHED: 'bg-[#5B7A8C]/15 text-[#3D5665] border-[#5B7A8C]/30',
  SECTION_19_DECLARED: 'bg-[#5B7A8C]/15 text-[#3D5665] border-[#5B7A8C]/30',
  PROPOSAL_SUBMITTED: 'bg-[#5B7A8C]/15 text-[#3D5665] border-[#5B7A8C]/30',
  SUBMITTED: 'bg-[#5B7A8C]/15 text-[#3D5665] border-[#5B7A8C]/30',
  DRAFT_PLAN: 'bg-[#5B7A8C]/15 text-[#3D5665] border-[#5B7A8C]/30',
  UNDER_REVIEW: 'bg-[#5B7A8C]/15 text-[#3D5665] border-[#5B7A8C]/30',
};

const variantClasses = {
  success: 'bg-[#6B7B4C]/15 text-[#4D5A34] border-[#6B7B4C]/30',
  warning: 'bg-[#C99A3F]/15 text-[#8F6A22] border-[#C99A3F]/30',
  danger: 'bg-[#A24A3F]/15 text-[#7E332A] border-[#A24A3F]/30',
  info: 'bg-[#5B7A8C]/15 text-[#3D5665] border-[#5B7A8C]/30',
  buff: 'bg-buff/30 text-bistre border-chamoisee/40',
  taupe: 'bg-taupe/10 text-taupe border-taupe/30',
  kobicha: 'bg-kobicha/15 text-kobicha border-kobicha/30',
  default: 'bg-slate-100 text-slate-700 border-slate-300'
};

export const Badge = ({
  children,
  variant,
  status,
  size = 'md',
  dot = false,
  className = ''
}) => {
  const normalizedKey = status ? String(status).toUpperCase().replace(/\s+/g, '_') : (typeof children === 'string' ? children.toUpperCase().replace(/\s+/g, '_') : '');
  
  let resolvedStyle = variantClasses[variant];
  if (!resolvedStyle && statusColorMap[normalizedKey]) {
    resolvedStyle = statusColorMap[normalizedKey];
  } else if (!resolvedStyle) {
    resolvedStyle = variantClasses.default;
  }

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-md border tracking-tight ${resolvedStyle} ${sizeClasses} ${className}`}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />}
      {children || status}
    </span>
  );
};

export default Badge;

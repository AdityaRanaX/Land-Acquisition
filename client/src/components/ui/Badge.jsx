import React from 'react';

const badgeVariants = {
  default: 'bg-slate-800 text-slate-300 border-slate-700',
  primary: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
  success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  danger: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  purple: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
};

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  dot = false
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${badgeVariants[variant] || badgeVariants.default} ${sizeClasses} ${className}`}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
};

export default Badge;

import React from 'react';

export const Card = ({
  children,
  title,
  subtitle,
  action,
  className = '',
  headerClassName = '',
  bodyClassName = ''
}) => {
  return (
    <div className={`glass-card rounded-xl overflow-hidden border border-slate-800/80 bg-slate-900/60 transition-all duration-200 ${className}`}>
      {(title || action) && (
        <div className={`px-5 py-4 border-b border-slate-800/80 flex items-center justify-between gap-4 ${headerClassName}`}>
          <div>
            {title && <h3 className="font-semibold text-slate-100 text-base">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div className="flex items-center gap-2">{action}</div>}
        </div>
      )}
      <div className={`p-5 ${bodyClassName}`}>{children}</div>
    </div>
  );
};

export default Card;

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
    <div className={`bg-surface rounded-xl border border-chamoisee/25 shadow-card transition-all ${className}`}>
      {(title || action) && (
        <div className={`px-5 py-4 border-b border-chamoisee/15 flex items-center justify-between gap-4 bg-surface ${headerClassName}`}>
          <div>
            {title && <h3 className="font-bold text-bistre text-base tracking-tight">{title}</h3>}
            {subtitle && <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>}
          </div>
          {action && <div className="flex items-center gap-2 shrink-0">{action}</div>}
        </div>
      )}
      <div className={`p-5 ${bodyClassName}`}>{children}</div>
    </div>
  );
};

export default Card;

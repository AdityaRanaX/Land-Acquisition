import React from 'react';

export const KPICard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'kobicha',
  className = ''
}) => {
  const colorStyles = {
    kobicha: 'border-l-4 border-l-kobicha bg-surface',
    success: 'border-l-4 border-l-status-success bg-surface',
    warning: 'border-l-4 border-l-status-warning bg-surface',
    danger: 'border-l-4 border-l-status-danger bg-surface',
    info: 'border-l-4 border-l-status-info bg-surface',
    taupe: 'border-l-4 border-l-taupe bg-surface',
  };

  const iconBgStyles = {
    kobicha: 'bg-kobicha/10 text-kobicha',
    success: 'bg-[#6B7B4C]/15 text-[#4D5A34]',
    warning: 'bg-[#C99A3F]/15 text-[#8F6A22]',
    danger: 'bg-[#A24A3F]/15 text-[#7E332A]',
    info: 'bg-[#5B7A8C]/15 text-[#3D5665]',
    taupe: 'bg-taupe/10 text-taupe',
  };

  const activeBorder = colorStyles[color] || colorStyles.kobicha;
  const activeIconBg = iconBgStyles[color] || iconBgStyles.kobicha;

  return (
    <div className={`p-5 rounded-xl border border-chamoisee/25 shadow-card ${activeBorder} ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">{title}</p>
          <h4 className="text-2xl font-bold text-bistre mt-1.5 tracking-tight">{value}</h4>
          {subtitle && <p className="text-xs text-text-muted mt-1 leading-relaxed">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl shrink-0 ${activeIconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-3 pt-3 border-t border-chamoisee/15 flex items-center gap-1.5 text-xs">
          <span className={`font-semibold ${trend.isPositive ? 'text-[#4D5A34]' : 'text-[#7E332A]'}`}>
            {trend.isPositive ? '↑' : '↓'} {trend.text}
          </span>
          {trend.label && <span className="text-text-muted">{trend.label}</span>}
        </div>
      )}
    </div>
  );
};

export default KPICard;

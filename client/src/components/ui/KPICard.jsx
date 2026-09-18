import React from 'react';

export const KPICard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'sky',
  className = ''
}) => {
  const colorMap = {
    sky: 'from-sky-500/10 to-transparent border-sky-500/20 text-sky-400 bg-sky-500/10',
    emerald: 'from-emerald-500/10 to-transparent border-emerald-500/20 text-emerald-400 bg-emerald-500/10',
    amber: 'from-amber-500/10 to-transparent border-amber-500/20 text-amber-400 bg-amber-500/10',
    purple: 'from-purple-500/10 to-transparent border-purple-500/20 text-purple-400 bg-purple-500/10',
    rose: 'from-rose-500/10 to-transparent border-rose-500/20 text-rose-400 bg-rose-500/10'
  };

  const activeColor = colorMap[color] || colorMap.sky;

  return (
    <div className={`glass-card p-5 rounded-xl border border-slate-800 bg-gradient-to-b ${activeColor} relative overflow-hidden ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</p>
          <h4 className="text-2xl font-bold text-white mt-1.5">{value}</h4>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${activeColor} border flex items-center justify-center`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center gap-1.5 text-xs">
          <span className={trend.isPositive ? 'text-emerald-400' : 'text-rose-400'}>
            {trend.isPositive ? '↑' : '↓'} {trend.text}
          </span>
          {trend.label && <span className="text-slate-500">{trend.label}</span>}
        </div>
      )}
    </div>
  );
};

export default KPICard;

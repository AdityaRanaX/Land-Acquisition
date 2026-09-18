import React from 'react';

export const GISLegend = ({ stats }) => {
  const items = [
    { label: 'Valuation / Verified', color: '#10B981', border: '#059669', count: stats?.verifiedParcels ?? 2 },
    { label: 'Notified / Pending Check', color: '#38BDF8', border: '#0284C7', count: 1 },
    { label: 'Disputed / Objection', color: '#EF4444', border: '#DC2626', count: stats?.disputedParcels ?? 1 },
    { label: 'Award Pronounced', color: '#F59E0B', border: '#D97706', count: stats?.awardedParcels ?? 1 }
  ];

  return (
    <div className="absolute bottom-4 right-4 z-[400] glass-panel bg-slate-900/90 border border-slate-700/80 p-3.5 rounded-xl shadow-2xl text-xs space-y-2">
      <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-1.5">
        <span className="font-semibold text-slate-200">GIS Cadastral Layers</span>
        <span className="text-[10px] text-slate-400">EPSG:4326</span>
      </div>
      <div className="space-y-1.5">
        {items.map((it) => (
          <div key={it.label} className="flex items-center justify-between gap-3 text-slate-300">
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-sm border inline-block"
                style={{ backgroundColor: it.color, borderColor: it.border }}
              />
              <span>{it.label}</span>
            </div>
            <span className="font-semibold text-slate-400 text-[11px]">{it.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GISLegend;

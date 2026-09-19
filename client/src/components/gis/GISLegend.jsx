import React from 'react';

export const GISLegend = ({ stats }) => {
  const items = [
    { label: 'Valuation / Verified', color: '#6B7B4C', border: '#4D5A34', count: stats?.verifiedParcels ?? 2 },
    { label: 'Notified (Sec 11)', color: '#5B7A8C', border: '#3D5665', count: 1 },
    { label: 'Disputed / Objection', color: '#A24A3F', border: '#7E332A', count: stats?.disputedParcels ?? 1 },
    { label: 'Award Pronounced', color: '#C99A3F', border: '#8F6A22', count: stats?.awardedParcels ?? 1 }
  ];

  return (
    <div className="absolute bottom-4 right-4 z-[400] bg-surface/95 border border-chamoisee/30 p-3.5 rounded-xl shadow-xl text-xs space-y-2 max-w-xs">
      <div className="flex items-center justify-between gap-4 border-b border-chamoisee/15 pb-1.5">
        <span className="font-bold text-bistre">Cadastral GIS Layers</span>
        <span className="text-[10px] text-text-muted font-mono">EPSG:4326</span>
      </div>
      <div className="space-y-1.5">
        {items.map((it) => (
          <div key={it.label} className="flex items-center justify-between gap-3 text-text-primary text-[11px]">
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-sm border inline-block shrink-0"
                style={{ backgroundColor: it.color, borderColor: it.border }}
              />
              <span className="font-medium">{it.label}</span>
            </div>
            <span className="font-bold text-bistre text-[11px]">{it.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GISLegend;

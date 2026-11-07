import React from 'react';
import { KPICard } from '../../components/ui/KPICard';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { GISMap } from '../../components/gis/GISMap';
import { useGIS } from '../../hooks/useGIS';
import { Activity, AlertTriangle, ArrowUpRight, Building2, CheckCircle2, CircleDollarSign, ClipboardList, MapPin, Users } from 'lucide-react';

export const StateDashboard = () => {
  const { geoJsonData, stats } = useGIS();
  const districtSummary = [
    { district: 'Pune', projects: 8, required: '2,840 ha', acquired: '1,968 ha', progress: 69, compensation: '₹184 Cr', rr: '72%', delayed: 1 },
    { district: 'Satara', projects: 5, required: '1,420 ha', acquired: '914 ha', progress: 64, compensation: '₹96 Cr', rr: '61%', delayed: 2 },
    { district: 'Nashik', projects: 7, required: '2,115 ha', acquired: '1,183 ha', progress: 56, compensation: '₹142 Cr', rr: '48%', delayed: 3 },
    { district: 'Ahmednagar', projects: 4, required: '860 ha', acquired: '688 ha', progress: 80, compensation: '₹71 Cr', rr: '84%', delayed: 0 }
  ];

  const projects = [
    { id: 'NHAI-PUN-04', name: 'Pune-Bengaluru Green Expressway', district: 'Pune', progress: 69, stage: 'Compensation', risk: 'High', updated: '12 min ago' },
    { id: 'MRIDC-SAT-02', name: 'Western Freight Rail Corridor', district: 'Satara', progress: 64, stage: 'Verification', risk: 'Medium', updated: '34 min ago' },
    { id: 'MSIDC-NSK-07', name: 'Nashik Industrial Growth Zone', district: 'Nashik', progress: 56, stage: 'Notification', risk: 'High', updated: '1 hr ago' },
    { id: 'PWD-AHM-01', name: 'Ahmednagar Water Grid', district: 'Ahmednagar', progress: 80, stage: 'Possession', risk: 'Low', updated: '2 hrs ago' }
  ];

  const columns = [
    { title: 'District', key: 'district', className: 'font-semibold text-white' },
    { title: 'Projects', key: 'projects' },
    { title: 'Land required', key: 'required' },
    { title: 'Land acquired', key: 'acquired' },
    { title: 'Acquisition', key: 'progress', render: (value) => <div className="min-w-28"><div className="flex justify-between text-xs mb-1"><span>{value}%</span><span className="text-slate-500">target</span></div><div className="h-1.5 rounded-full bg-slate-800"><div className="h-1.5 rounded-full bg-emerald-400" style={{ width: `${value}%` }} /></div></div> },
    { title: 'Compensation paid', key: 'compensation' },
    { title: 'R&R progress', key: 'rr' },
    { title: 'Delayed', key: 'delayed', render: (value) => <span className={value ? 'text-amber-300 font-semibold' : 'text-emerald-300'}>{value || 'None'}</span> }
  ];

  const projectColumns = [
    { title: 'Project', key: 'name', render: (value, row) => <div><p className="font-medium text-white">{value}</p><p className="text-[11px] text-slate-500 font-mono mt-0.5">{row.id}</p></div> },
    { title: 'District', key: 'district' },
    { title: 'Progress', key: 'progress', render: (value) => <span className="text-emerald-300">{value}%</span> },
    { title: 'Current stage', key: 'stage' },
    { title: 'Risk', key: 'risk', render: (value) => <Badge variant={value === 'High' ? 'danger' : value === 'Medium' ? 'warning' : 'success'} dot>{value}</Badge> },
    { title: 'Updated', key: 'updated', className: 'text-slate-500' }
  ];

  const pulseColors = {
    sky: 'bg-sky-500/10 text-sky-400',
    emerald: 'bg-emerald-500/10 text-emerald-400',
    amber: 'bg-amber-500/10 text-amber-400',
    purple: 'bg-purple-500/10 text-purple-400'
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-sky-400 font-semibold uppercase tracking-[0.18em]"><Activity className="w-3.5 h-3.5" /> State command center</div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mt-2">Good morning, Shourya</h1>
          <p className="text-sm text-slate-400 mt-1">Maharashtra state overview · Last synchronized just now</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Backend data synchronized <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" /></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard title="Active projects" value="24" subtitle="Across 4 districts" icon={Building2} color="sky" trend={{ isPositive: true, text: '3 new', label: 'this quarter' }} />
        <KPICard title="Land acquired" value="4,753 ha" subtitle="65.8% of 7,235 ha required" icon={MapPin} color="emerald" trend={{ isPositive: true, text: '4.2%', label: 'since last month' }} />
        <KPICard title="Compensation paid" value="₹493 Cr" subtitle="₹118 Cr still pending" icon={CircleDollarSign} color="purple" />
        <KPICard title="Delayed projects" value="6" subtitle="2 require escalation" icon={AlertTriangle} color="amber" trend={{ isPositive: false, text: '2', label: 'since last week' }} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[['Families affected', '3,842', Users, 'sky'], ['R&R progress', '66%', CheckCircle2, 'emerald'], ['Pending escalations', '9', ClipboardList, 'amber'], ['Districts reporting', '4 / 4', Building2, 'purple']].map(([label, value, Icon, color]) => (
          <div key={label} className="glass-card rounded-xl border border-slate-800/80 p-4 flex items-center gap-3"><div className={`p-2 rounded-lg ${pulseColors[color]}`}><Icon className="w-4 h-4" /></div><div><p className="text-lg font-bold text-white">{value}</p><p className="text-[11px] text-slate-500">{label}</p></div></div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <Card title="Maharashtra acquisition map" subtitle="District → project → parcel visibility" className="xl:col-span-3" action={<Badge variant="success" dot>Live layer</Badge>}>
          <GISMap features={geoJsonData?.features || []} stats={stats} height="385px" />
          <div className="flex flex-wrap gap-4 mt-4 text-xs text-slate-400"><span><i className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 mr-1.5" />Acquired</span><span><i className="inline-block w-2.5 h-2.5 rounded-full bg-sky-400 mr-1.5" />In progress</span><span><i className="inline-block w-2.5 h-2.5 rounded-full bg-amber-400 mr-1.5" />Delayed</span><span><i className="inline-block w-2.5 h-2.5 rounded-full bg-rose-400 mr-1.5" />Disputed</span></div>
        </Card>
        <Card title="State pulse" subtitle="Signals needing attention" className="xl:col-span-2">
          <div className="space-y-3">
            <div className="p-3 rounded-lg border border-rose-500/20 bg-rose-500/5"><div className="flex justify-between items-start gap-3"><div><p className="text-sm font-medium text-white">Nashik Industrial Growth Zone</p><p className="text-xs text-slate-400 mt-1">18 parcels pending verification · milestone in 6 days</p></div><Badge variant="danger">High</Badge></div></div>
            <div className="p-3 rounded-lg border border-amber-500/20 bg-amber-500/5"><div className="flex justify-between items-start gap-3"><div><p className="text-sm font-medium text-white">Western Freight Rail Corridor</p><p className="text-xs text-slate-400 mt-1">7 compensation cases pending district action</p></div><Badge variant="warning">Review</Badge></div></div>
            <div className="p-3 rounded-lg border border-sky-500/20 bg-sky-500/5"><div className="flex justify-between items-start gap-3"><div><p className="text-sm font-medium text-white">District reports received</p><p className="text-xs text-slate-400 mt-1">All 4 districts synchronized today</p></div><Badge variant="success">On track</Badge></div></div>
          </div>
          <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between"><span className="text-xs text-slate-500">Next state review</span><span className="text-xs font-medium text-slate-200">18 Sep 2026 · 11:00</span></div>
        </Card>
      </div>

      <Card title="District performance" subtitle="Aggregated progress across Shourya's assigned state" action={<button className="text-xs text-sky-400 hover:text-sky-300">View all districts</button>}>
        <Table columns={columns} data={districtSummary} />
      </Card>

      <Card title="Project monitoring" subtitle="The latest state-wide acquisition workflow" action={<button className="text-xs text-sky-400 hover:text-sky-300">Open project register</button>}>
        <Table columns={projectColumns} data={projects} />
      </Card>
    </div>
  );
};

export default StateDashboard;

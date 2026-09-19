import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../constants/roles';
import {
  LayoutDashboard,
  Map,
  BarChart3,
  Building2,
  AlertTriangle,
  FileText,
  MapPin,
  TrendingUp,
  FolderPlus,
  Compass,
  Upload,
  History,
  FileCheck2,
  Users,
  Coins,
  Scale,
  MessageSquare,
  HelpCircle,
  LandPlot,
  CheckCircle,
  Navigation,
  FileSearch,
  UserCheck
} from 'lucide-react';

export const RoleSidebar = () => {
  const { user } = useAuth();
  const role = user?.role;

  const roleNavItems = {
    [ROLES.CENTRAL_ADMIN]: [
      { label: 'National Overview', to: '/central', icon: LayoutDashboard, exact: true },
      { label: 'National GIS Map', to: '/central/map', icon: Map },
      { label: 'State Performance', to: '/central/state-comparison', icon: BarChart3 },
      { label: 'Project Monitoring', to: '/central/projects', icon: Building2 },
      { label: 'Statutory Delay Radar', to: '/central/delay-radar', icon: AlertTriangle },
      { label: 'National Reports', to: '/central/reports', icon: FileText }
    ],
    [ROLES.STATE_OFFICER]: [
      { label: 'State Overview', to: '/state', icon: LayoutDashboard, exact: true },
      { label: 'State Cadastral Map', to: '/state/map', icon: Map },
      { label: 'District Performance', to: '/state/districts', icon: TrendingUp },
      { label: 'Project Monitoring', to: '/state/projects', icon: Building2 },
      { label: 'State Escalations', to: '/state/escalations', icon: AlertTriangle },
      { label: 'State Reports & Funds', to: '/state/reports', icon: FileText }
    ],
    [ROLES.DISTRICT_COLLECTOR]: [
      { label: 'District Overview', to: '/district', icon: LayoutDashboard, exact: true },
      { label: 'Projects List', to: '/district/projects', icon: Building2 },
      { label: 'Project Approvals', to: '/district/approvals', icon: FileCheck2 },
      { label: 'District GIS Map', to: '/district/map', icon: Map },
      { label: 'Land Parcels', to: '/district/parcels', icon: LandPlot },
      { label: 'Affected Families', to: '/district/families', icon: Users },
      { label: 'Officer Assignment', to: '/district/officers', icon: UserCheck },
      { label: 'Doc Verification', to: '/district/doc-verify', icon: FileSearch },
      { label: 'Compensation (Sec 23)', to: '/district/compensation', icon: Coins },
      { label: 'R&R Management', to: '/district/rr', icon: Scale },
      { label: 'Delay Radar', to: '/district/delay-radar', icon: AlertTriangle }
    ],
    [ROLES.REQUIRING_AGENCY]: [
      { label: 'Agency Dashboard', to: '/agency', icon: LayoutDashboard, exact: true },
      { label: 'My Project List', to: '/agency/projects', icon: Building2 },
      { label: 'Create Requisition Wizard', to: '/agency/new-requisition', icon: FolderPlus },
      { label: 'Project Tracking', to: '/agency/tracking', icon: TrendingUp },
      { label: 'Corridor Parcels', to: '/agency/parcels', icon: LandPlot },
      { label: 'Gazettes & Documents', to: '/agency/documents', icon: FileText },
      { label: 'Collector Communication', to: '/agency/communication', icon: MessageSquare }
    ],
    [ROLES.FIELD_SURVEYOR]: [
      { label: "Today's Tasks", to: '/field', icon: LayoutDashboard, exact: true },
      { label: 'Assigned Parcels', to: '/field/parcels', icon: LandPlot },
      { label: 'GPS Navigation Map', to: '/field/navigation', icon: Navigation },
      { label: 'Field Verification Form', to: '/field/verification', icon: Compass },
      { label: 'Spot Photo Upload', to: '/field/photos', icon: Upload },
      { label: 'Mobile Doc Check', to: '/field/doc-verify', icon: FileSearch },
      { label: 'Verification History', to: '/field/history', icon: History }
    ],
    [ROLES.CITIZEN]: [
      { label: 'Citizen Home', to: '/citizen', icon: LayoutDashboard, exact: true },
      { label: 'My Land Parcel', to: '/citizen/my-land', icon: LandPlot },
      { label: 'Acquisition Timeline', to: '/citizen/timeline', icon: History },
      { label: 'Compensation (100% Solatium)', to: '/citizen/compensation', icon: Coins },
      { label: 'R&R Benefits Package', to: '/citizen/rr-benefits', icon: Scale },
      { label: 'Notice & Documents', to: '/citizen/documents', icon: FileText },
      { label: 'Submit Grievance', to: '/citizen/grievance-submit', icon: HelpCircle },
      { label: 'Grievance Tracker', to: '/citizen/grievances', icon: CheckCircle }
    ]
  };

  const navItems = roleNavItems[role] || roleNavItems[ROLES.CENTRAL_ADMIN];

  return (
    <aside className="w-64 shrink-0 min-h-[calc(100vh-53px)] bg-bistre text-white p-3.5 flex flex-col justify-between border-r border-chamoisee/20 select-none">
      <div>
        <div className="px-3 py-2 mb-2 bg-[#23140C] rounded-lg border border-chamoisee/15">
          <p className="text-[10px] font-bold tracking-widest text-chamoisee uppercase">Workspace</p>
          <p className="text-xs font-semibold text-buff truncate mt-0.5">
            {role?.replace(/_/g, ' ')}
          </p>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-kobicha text-white font-bold shadow-sm border-l-3 border-l-buff'
                      : 'text-buff/80 hover:text-white hover:bg-taupe/60'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Jurisdiction Active Pin */}
      <div className="p-3 rounded-lg bg-[#23140C] border border-chamoisee/15 text-xs text-buff/90 mt-4">
        <p className="text-[9px] uppercase font-bold tracking-wider text-chamoisee">Active Jurisdiction</p>
        <p className="font-bold text-white text-xs mt-0.5 truncate">
          {user?.jurisdiction?.state || 'National Oversight (DoLR)'}
        </p>
        {user?.jurisdiction?.district && (
          <p className="text-[11px] text-buff/80 truncate">{user.jurisdiction.district} District</p>
        )}
      </div>
    </aside>
  );
};

export default RoleSidebar;

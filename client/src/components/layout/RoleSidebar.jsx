import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../constants/roles';
import {
  LayoutDashboard,
  Building2,
  MapPin,
  FileSpreadsheet,
  AlertTriangle,
  FolderGit2,
  Coins,
  Scale,
  Users,
  CheckCircle2,
  FileCheck2,
  Calculator,
  Compass,
  FileText,
  HelpCircle,
  TrendingUp,
  RefreshCw,
  LandPlot,
  Bell,
  User
} from 'lucide-react';

export const RoleSidebar = () => {
  const { user } = useAuth();
  const role = user?.role;

  const roleNavItems = {
    [ROLES.CENTRAL_ADMIN]: [
      { label: 'National Dashboard', to: '/central', icon: LayoutDashboard, exact: true },
      { label: 'All National Projects', to: '/central/projects', icon: Building2 },
      { label: 'State Comparisons', to: '/central/state-comparison', icon: TrendingUp },
      { label: 'Statutory Delay Radar', to: '/central/delay-radar', icon: AlertTriangle },
      { label: 'Policy & Audit Logs', to: '/central/policy', icon: Scale }
    ],
    [ROLES.STATE_OFFICER]: [
      { label: 'State Dashboard', to: '/state', icon: LayoutDashboard, exact: true },
      { label: 'District Acquisition Matrix', to: '/state/districts', icon: MapPin },
      { label: 'Escrow & Fund Allocations', to: '/state/funds', icon: Coins },
      { label: 'State Level Escalations', to: '/state/escalations', icon: AlertTriangle }
    ],
    [ROLES.DISTRICT_COLLECTOR]: [
      { label: 'Collector Dashboard', to: '/district', icon: LayoutDashboard, exact: true },
      { label: 'Projects', to: '/district/projects', icon: Building2 },
      { label: 'GIS Cadastral Map', to: '/district/gis', icon: MapPin },
      { label: 'Parcels', to: '/district/parcels', icon: LandPlot },
      { label: 'Families', to: '/district/families', icon: Users },
      { label: 'Documents', to: '/district/documents', icon: FileCheck2 },
      { label: 'Compensation & Awards', to: '/district/compensation', icon: Coins },
      { label: 'R&R Packages', to: '/district/rr', icon: Building2 },
      { label: 'Field Officers', to: '/district/field-officers', icon: Users },
      { label: 'Delay Radar', to: '/district/delay-radar', icon: AlertTriangle },
      { label: 'Notifications', to: '/district/notifications', icon: Bell },
      { label: 'Officer Profile', to: '/district/profile', icon: User },
      { label: 'SIA Workflow (Sec 4-6)', to: '/district/sia', icon: Users },
      { label: 'Section Tracker (4, 11, 19)', to: '/district/tracker', icon: FileSpreadsheet },
      { label: 'Land Valuation Engine', to: '/district/valuation', icon: Calculator },
      { label: 'Award Pronouncement (Sec 23)', to: '/district/awards', icon: Scale }
    ],
    [ROLES.REQUIRING_AGENCY]: [
      { label: 'Agency Dashboard', to: '/agency', icon: LayoutDashboard, exact: true },
      { label: 'New Requisition Proposal', to: '/agency/new-requisition', icon: FolderGit2 },
      { label: 'Acquisition Pipeline', to: '/agency/proposals', icon: FileCheck2 },
      { label: 'Statutory Cost Estimator', to: '/agency/cost-estimation', icon: Calculator }
    ],
    [ROLES.FIELD_SURVEYOR]: [
      { label: 'Field Dashboard', to: '/field', icon: LayoutDashboard, exact: true },
      { label: 'Assigned Survey Parcels', to: '/field/parcels', icon: LandPlot },
      { label: 'Ground Truth & Inspection', to: '/field/inspection', icon: Compass },
      { label: 'Offline Sync Queue', to: '/field/sync', icon: RefreshCw }
    ],
    [ROLES.CITIZEN]: [
      { label: 'Citizen Portal Home', to: '/citizen', icon: LayoutDashboard, exact: true },
      { label: 'My Land Claim Status', to: '/citizen/claim-status', icon: LandPlot },
      { label: 'Compensation & Solatium', to: '/citizen/compensation', icon: Coins },
      { label: 'R&R Benefits Package', to: '/citizen/rr-benefits', icon: Building2 },
      { label: 'Grievance Redressal', to: '/citizen/grievances', icon: HelpCircle }
    ]
  };

  const navItems = roleNavItems[role] || roleNavItems[ROLES.CENTRAL_ADMIN];

  return (
    <aside className="w-64 flex-shrink-0 min-h-[calc(100vh-57px)] bg-[#F8F4ED] border-r border-[#DDD3C7] p-4 flex flex-col justify-between">
      <div>
        <div className="px-3 py-2 mb-3">
          <p className="text-[11px] font-semibold tracking-wider text-[#6C625B] uppercase">Navigation Menu</p>
          <p className="text-xs font-medium text-[#4A2E1B] capitalize">{role?.toLowerCase().replace('_', ' ')} Workspace</p>
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
                  `flex items-center gap-3 px-3 py-3 rounded-none text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-[#EAD8CE] text-[#B84D28] border-l-2 border-[#B84D28] font-semibold'
                      : 'text-[#6C625B] hover:text-[#4A2E1B] hover:bg-[#EFE7DC]'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Jurisdiction Footer info */}
      <div className="p-3 border-t border-[#DDD3C7] text-xs">
        <p className="text-[10px] uppercase font-semibold text-[#6C625B]">Jurisdiction Active</p>
        <p className="font-semibold text-[#4A2E1B] mt-0.5">
          {user?.jurisdiction?.state || 'National (All India)'}
        </p>
        {user?.jurisdiction?.district && (
          <p className="text-[11px] text-[#6C625B]">{user.jurisdiction.district} District</p>
        )}
      </div>
    </aside>
  );
};

export default RoleSidebar;

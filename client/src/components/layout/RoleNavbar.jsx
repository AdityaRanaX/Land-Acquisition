import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROLES, ROLE_LABELS, ROLE_BADGE_COLORS } from '../../constants/roles';
import { NotificationBell } from '../shared/NotificationBell';
import { ShieldCheck, ChevronDown, UserCheck, LogOut, Layers } from 'lucide-react';

export const RoleNavbar = () => {
  const { user, switchRole, logout } = useAuth();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSwitchRole = (roleKey) => {
    switchRole(roleKey);
    setRoleMenuOpen(false);
    // Route to appropriate root dashboard
    const roleRoutes = {
      CENTRAL_ADMIN: '/central',
      STATE_OFFICER: '/state',
      DISTRICT_COLLECTOR: '/district',
      REQUIRING_AGENCY: '/agency',
      FIELD_SURVEYOR: '/field',
      CITIZEN: '/citizen'
    };
    navigate(roleRoutes[roleKey] || '/');
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-header px-6 py-3 flex items-center justify-between border-b border-slate-800">
      {/* Brand & Emblem */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 via-sky-500 to-emerald-600 p-0.5 flex items-center justify-center shadow-lg">
          <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold tracking-tight text-white">NLAMS</h1>
            <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
              RFCTLARR 2013
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">National Land Acquisition & Management System</p>
        </div>
      </div>

      {/* Right Controls: Role Switcher, Notifications, Profile */}
      <div className="flex items-center gap-4">
        {/* Quick Role Switcher for Hackathon Demo */}
        <div className="relative">
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-600 text-xs font-medium text-slate-200 transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            <span>Switch Role</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {roleMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 glass-panel bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1 z-50">
              <div className="px-3 py-2 border-b border-slate-800 text-[10px] font-semibold text-slate-400 uppercase">
                Select Active Hackathon Persona
              </div>
              {Object.entries(ROLES).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => handleSwitchRole(key)}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800 transition-colors ${
                    user?.role === value ? 'bg-sky-500/10 text-sky-300 font-semibold' : 'text-slate-300'
                  }`}
                >
                  <span>{ROLE_LABELS[key]}</span>
                  {user?.role === value && <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Live Notifications */}
        <NotificationBell />

        {/* User Card & Logout */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
          <div className="text-right hidden md:block">
            <p className="text-xs font-semibold text-slate-200">{user?.name || 'Authorized Official'}</p>
            <p className="text-[11px] text-slate-400">{user?.designation || user?.email}</p>
          </div>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${ROLE_BADGE_COLORS[user?.role] || 'bg-slate-800 text-slate-300'}`}>
            {user?.role}
          </span>
          <button
            onClick={logout}
            title="Logout"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default RoleNavbar;

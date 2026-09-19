import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROLES, ROLE_LABELS } from '../../constants/roles';
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
    <header className="sticky top-0 z-40 w-full bg-[#F8F4ED] px-6 py-3 flex items-center justify-between border-b border-[#DDD3C7]">
      {/* Brand & Emblem */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 border border-[#B84D28] flex items-center justify-center">
          <div className="w-full h-full flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-[#B84D28]" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold tracking-tight text-[#4A2E1B]">NLAMS</h1>
            <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 text-[#B84D28] border border-[#D9B8A8]">
              RFCTLARR 2013
            </span>
          </div>
          <p className="text-[11px] text-[#6C625B] leading-tight">National Land Acquisition & Management System</p>
        </div>
      </div>

      {/* Right Controls: Role Switcher, Notifications, Profile */}
      <div className="flex items-center gap-4">
        {/* Quick Role Switcher for Hackathon Demo */}
        <div className="relative">
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 border border-[#DDD3C7] hover:border-[#B84D28] text-xs font-medium text-[#4A2E1B] transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-[#B84D28]" />
            <span>Switch Role</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#6C625B]" />
          </button>

          {roleMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-[#F8F4ED] border border-[#DDD3C7] py-1 z-50">
              <div className="px-3 py-2 border-b border-[#DDD3C7] text-[10px] font-semibold text-[#6C625B] uppercase">
                Select Active Hackathon Persona
              </div>
              {Object.entries(ROLES).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => handleSwitchRole(key)}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#EFE7DC] transition-colors ${
                    user?.role === value ? 'bg-[#EAD8CE] text-[#B84D28] font-semibold' : 'text-[#6C625B]'
                  }`}
                >
                  <span>{ROLE_LABELS[key]}</span>
                  {user?.role === value && <span className="w-1.5 h-1.5 rounded-full bg-[#B84D28]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Live Notifications */}
        <NotificationBell />

        {/* User Card & Logout */}
        <div className="flex items-center gap-3 pl-3 border-l border-[#DDD3C7]">
          <div className="text-right hidden md:block">
            <p className="text-xs font-semibold text-[#4A2E1B]">{user?.name || 'Authorized Official'}</p>
            <p className="text-[11px] text-[#6C625B]">{user?.designation || user?.email}</p>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 border border-[#D9B8A8] text-[#B84D28]">
            {user?.role}
          </span>
          <button
            onClick={logout}
            title="Logout"
            className="p-1.5 text-[#6C625B] hover:text-[#B84D28] transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default RoleNavbar;

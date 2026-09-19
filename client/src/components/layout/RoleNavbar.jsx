import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROLES, ROLE_LABELS } from '../../constants/roles';
import { NotificationBell } from '../shared/NotificationBell';
import { ShieldCheck, ChevronDown, LogOut, Layers, User, Bell } from 'lucide-react';

export const RoleNavbar = () => {
  const { user, switchRole, logout } = useAuth();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSwitchRole = (roleKey) => {
    switchRole(roleKey);
    setRoleMenuOpen(false);
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
    <header className="sticky top-0 z-40 w-full bg-taupe text-white px-6 py-2.5 flex items-center justify-between border-b border-chamoisee/30 shadow-md">
      {/* Brand & Emblem */}
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-kobicha p-0.5 flex items-center justify-center shadow-md">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black tracking-wider text-white">NLAMS</h1>
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-buff/20 text-buff border border-buff/30">
                RFCTLARR 2013
              </span>
            </div>
            <p className="text-[10px] text-buff/80 leading-none">National Land Acquisition & Management System</p>
          </div>
        </Link>
      </div>

      {/* Right Controls: Role Switcher, Notifications, Profile */}
      <div className="flex items-center gap-3">
        {/* Quick Role Switcher for Hackathon / Evaluator Persona Switching */}
        <div className="relative">
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bistre/70 border border-chamoisee/40 hover:border-buff text-xs font-semibold text-buff transition-colors cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-buff" />
            <span>Switch Role</span>
            <ChevronDown className="w-3.5 h-3.5 text-buff/70" />
          </button>

          {roleMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-surface border border-chamoisee/30 rounded-xl shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3.5 py-2 border-b border-chamoisee/15 text-[11px] font-bold text-bistre uppercase tracking-wider">
                Select Active User Persona
              </div>
              {Object.entries(ROLES).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => handleSwitchRole(key)}
                  className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between hover:bg-buff/20 transition-colors cursor-pointer ${
                    user?.role === value ? 'bg-buff/30 text-bistre font-bold' : 'text-text-primary'
                  }`}
                >
                  <div>
                    <p className="font-semibold">{ROLE_LABELS[key]}</p>
                    <p className="text-[10px] text-text-muted">{key}</p>
                  </div>
                  {user?.role === value && <span className="w-2 h-2 rounded-full bg-kobicha" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Live Notifications */}
        <NotificationBell />

        {/* User Card & Profile Link */}
        <div className="flex items-center gap-3 pl-3 border-l border-chamoisee/30">
          <Link to="/profile" className="flex items-center gap-2.5 text-right hidden sm:flex hover:opacity-90">
            <div className="w-7 h-7 rounded-full bg-kobicha flex items-center justify-center text-white text-xs font-bold border border-buff/40">
              {user?.name ? user.name[0] : 'U'}
            </div>
            <div>
              <p className="text-xs font-bold text-white leading-tight">{user?.name || 'Officer'}</p>
              <p className="text-[10px] text-buff/80 leading-none mt-0.5">{user?.designation || user?.role}</p>
            </div>
          </Link>

          <button
            onClick={logout}
            title="Logout"
            className="p-1.5 rounded-lg text-buff/80 hover:text-white hover:bg-bistre/50 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default RoleNavbar;

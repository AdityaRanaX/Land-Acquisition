import React from 'react';
import { Outlet } from 'react-router-dom';
import RoleNavbar from './RoleNavbar';
import RoleSidebar from './RoleSidebar';
import { useAuth } from '../../hooks/useAuth';

export const AppLayout = () => {
  const { user } = useAuth();
  const isCitizen = user?.role === 'CITIZEN';

  return (
    <div className={`min-h-screen flex flex-col font-sans ${isCitizen ? 'citizen-theme' : 'bg-slate-950 text-slate-100'}`}>
      <RoleNavbar />
      <div className="flex flex-1 overflow-hidden">
        <RoleSidebar />
        <main className={`flex-1 overflow-y-auto ${isCitizen ? 'citizen-main' : 'p-6 bg-gradient-to-b from-slate-950 via-slate-900/30 to-slate-950'}`}>
          <div className={isCitizen ? 'citizen-content' : 'max-w-7xl mx-auto space-y-6'}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;

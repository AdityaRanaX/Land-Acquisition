import React from 'react';
import { Outlet } from 'react-router-dom';
import RoleNavbar from './RoleNavbar';
import RoleSidebar from './RoleSidebar';

export const AppLayout = () => {
  return (
    <div className="min-h-screen bg-page text-text-primary flex flex-col font-sans">
      <RoleNavbar />
      <div className="flex flex-1 overflow-hidden">
        <RoleSidebar />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-page">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;

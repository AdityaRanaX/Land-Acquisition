import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen bg-page flex flex-col justify-center items-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-status-danger/10 border border-status-danger/20 text-status-danger flex items-center justify-center mb-4">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-black text-bistre">403 - Restricted Jurisdiction / Role</h2>
      <p className="text-xs text-text-muted max-w-md mt-2">
        Your current role does not possess statutory clearance to view this module. Use the role switcher in the top navbar to switch personas.
      </p>
      <Link to="/" className="mt-6">
        <Button variant="primary" size="sm" className="gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Return to Dashboard
        </Button>
      </Link>
    </div>
  );
};

export default UnauthorizedPage;

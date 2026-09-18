import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-6 text-center">
      <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-bold text-white">403 - Restricted Jurisdiction / Role</h2>
      <p className="text-sm text-slate-400 max-w-md mt-2">
        Your current role does not possess statutory clearance to view this module. Use the role switcher in the navbar to switch personas.
      </p>
      <Link to="/" className="mt-6">
        <Button variant="secondary" icon={ArrowLeft}>
          Return to Dashboard
        </Button>
      </Link>
    </div>
  );
};

export const ForgotPasswordPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-6 text-center">
      <div className="w-full max-w-md glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-4">
        <h3 className="text-lg font-bold text-white">Reset Official Password</h3>
        <p className="text-xs text-slate-400">
          Statutory officer accounts must be reset via NIC / DoLR Nodal Administrator.
        </p>
        <Link to="/login">
          <Button variant="primary" className="w-full" icon={ArrowLeft}>
            Back to Sign In
          </Button>
        </Link>
      </div>
    </div>
  );
};

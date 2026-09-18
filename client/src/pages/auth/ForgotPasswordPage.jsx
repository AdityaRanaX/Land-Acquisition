import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, KeyRound } from 'lucide-react';

export const ForgotPasswordPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-6 text-center">
      <div className="w-full max-w-md glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-4">
        <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 text-amber-400">
          <KeyRound className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-white">Reset Official Password</h3>
        <p className="text-xs text-slate-400">
          Official statutory officer accounts must be reset via State NIC / DoLR Nodal Administrator credentials.
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

export default ForgotPasswordPage;

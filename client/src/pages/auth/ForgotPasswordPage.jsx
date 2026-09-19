import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, KeyRound } from 'lucide-react';

export const ForgotPasswordPage = () => {
  return (
    <div className="min-h-screen bg-page flex flex-col justify-center items-center p-6 text-center">
      <Card bodyClassName="w-full max-w-md p-6 space-y-4">
        <div className="inline-flex p-3 rounded-2xl bg-kobicha/10 text-kobicha border border-chamoisee/30">
          <KeyRound className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-black text-bistre">Reset Official Password</h2>
        <p className="text-xs text-text-muted leading-relaxed">
          Official statutory officer accounts must be reset via State NIC / DoLR Nodal Administrator credentials.
        </p>
        <Link to="/login" className="block pt-2">
          <Button variant="primary" className="w-full gap-1.5" size="sm">
            <ArrowLeft className="w-4 h-4" /> Back to Sign In
          </Button>
        </Link>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;

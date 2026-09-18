import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROLES, ROLE_LABELS } from '../../constants/roles';
import { ShieldCheck, Lock, Mail, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const LoginPage = () => {
  const [email, setEmail] = useState('central.admin@nlams.gov.in');
  const [password, setPassword] = useState('Password@123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { loginWithCredentials, switchRole } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await loginWithCredentials(email, password);
      if (res.requires2FA) {
        navigate('/verify-otp', { state: { email } });
      } else {
        redirectToRole(res.user?.role);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Verify email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (roleKey) => {
    const roleCredentials = {
      CENTRAL_ADMIN: 'central.admin@nlams.gov.in',
      STATE_OFFICER: 'state.maharashtra@nlams.gov.in',
      DISTRICT_COLLECTOR: 'collector.pune@nlams.gov.in',
      REQUIRING_AGENCY: 'nhai.director@nhai.gov.in',
      FIELD_SURVEYOR: 'surveyor.haveli@nlams.gov.in',
      CITIZEN: 'ramesh.patil@citizen.in'
    };
    setEmail(roleCredentials[roleKey]);
    setPassword('Password@123');
    switchRole(roleKey);
    redirectToRole(roleKey);
  };

  const redirectToRole = (role) => {
    const roleMap = {
      CENTRAL_ADMIN: '/central',
      STATE_OFFICER: '/state',
      DISTRICT_COLLECTOR: '/district',
      REQUIRING_AGENCY: '/agency',
      FIELD_SURVEYOR: '/field',
      CITIZEN: '/citizen'
    };
    navigate(roleMap[role] || '/');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-sky-500 to-emerald-500 p-0.5 shadow-xl">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <ShieldCheck className="w-7 h-7 text-amber-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">NLAMS Portal Sign In</h2>
          <p className="text-xs text-slate-400">
            National Land Acquisition & Management System (RFCTLARR Act, 2013)
          </p>
        </div>

        {/* Login Form */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl bg-slate-900/80 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Official Email / Username"
              type="email"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. collector.pune@nlams.gov.in"
              required
            />

            <Input
              label="Secure Password"
              type="password"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <Button type="submit" variant="primary" className="w-full" loading={loading} icon={ArrowRight}>
              Authenticate Session
            </Button>
          </form>

          {/* Hackathon Quick Role Switcher */}
          <div className="pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" /> Quick Demo Role Login
              </span>
              <span className="text-[10px] text-slate-500">1-Click Access</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {Object.entries(ROLES).map(([key, value]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleQuickLogin(key)}
                  className="px-2.5 py-1.5 text-left rounded-lg bg-slate-950 border border-slate-800 hover:border-sky-500/50 hover:bg-slate-800/80 transition-all text-[11px] text-slate-300 truncate"
                >
                  {ROLE_LABELS[key].split('/')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-[11px] text-slate-500">
          Statutory Compliance Portal • Ministry of Rural Development (DoLR), Govt. of India
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

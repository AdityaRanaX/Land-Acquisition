import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { ShieldAlert, ArrowRight, KeyRound } from 'lucide-react';
import apiClient from '../../services/api/apiClient';

export const OtpVerifyPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || 'user@nlams.gov.in';
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { switchRole } = useAuth();

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await apiClient.post('/auth/verify-otp', { email, otp });
      if (res.data?.data?.user) {
        localStorage.setItem('nlams_token', res.data.data.token);
        localStorage.setItem('nlams_user', JSON.stringify(res.data.data.user));
        navigate('/central');
      }
    } catch (err) {
      if (otp === '123456') {
        navigate('/central');
      } else {
        setError('Invalid or expired 6-digit OTP code.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">Two-Factor Authentication</h2>
          <p className="text-xs text-slate-400">
            Enter the 6-digit verification code sent to <strong className="text-slate-200">{email}</strong>
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-4">
          {error && <div className="p-3 rounded-lg bg-rose-500/10 text-rose-300 text-xs">{error}</div>}

          <form onSubmit={handleVerify} className="space-y-4">
            <Input
              label="6-Digit Verification Code"
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
              required
              className="text-center text-lg tracking-widest font-mono"
            />

            <Button type="submit" variant="primary" className="w-full" loading={loading} icon={ArrowRight}>
              Verify & Enter System
            </Button>
          </form>

          <p className="text-[11px] text-slate-500 text-center">
            Demo Hint: Use <span className="text-sky-400 font-mono">123456</span> or check server terminal console.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OtpVerifyPage;

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { ShieldCheck, ArrowRight, KeyRound } from 'lucide-react';
import apiClient from '../../services/api/apiClient';

export const OtpVerifyPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || 'user@nlams.gov.in';
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    <div className="min-h-screen bg-page flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-kobicha/10 text-kobicha border border-chamoisee/30">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-black text-bistre">Two-Factor Authentication</h1>
          <p className="text-xs text-text-muted">
            Enter the 6-digit verification code sent to <strong className="text-bistre">{email}</strong>
          </p>
        </div>

        <Card bodyClassName="p-6 space-y-4">
          {error && <div className="p-3 rounded-lg bg-status-danger/10 text-status-danger text-xs font-semibold">{error}</div>}

          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-bistre mb-1">6-Digit Verification Code</label>
              <Input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                required
                className="text-center text-lg tracking-widest font-mono"
              />
            </div>

            <Button type="submit" variant="primary" className="w-full gap-1.5" loading={loading}>
              Verify & Enter System <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <p className="text-[11px] text-text-muted text-center">
            Demo Hint: Use <span className="text-kobicha font-mono font-bold">123456</span> or default seed login.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default OtpVerifyPage;

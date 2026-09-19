import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { User, ShieldCheck, Mail, Phone, MapPin, Building2, KeyRound } from 'lucide-react';

export const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-bistre">Officer User Profile</h2>
        <p className="text-xs text-text-muted">Account credentials, statutory jurisdiction clearances & active session parameters</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="text-center md:col-span-1">
          <div className="w-20 h-20 rounded-full bg-taupe text-buff font-bold text-2xl flex items-center justify-center mx-auto border-2 border-buff/40">
            {user?.name ? user.name[0] : 'U'}
          </div>
          <h3 className="text-base font-bold text-bistre mt-3">{user?.name || 'Officer'}</h3>
          <p className="text-xs text-text-muted mt-0.5">{user?.designation || user?.role}</p>
          <div className="mt-3">
            <Badge variant="kobicha">{user?.role}</Badge>
          </div>
        </Card>

        {/* Details Card */}
        <Card title="Official Credentials & Jurisdiction" className="md:col-span-2">
          <div className="space-y-3.5 text-xs text-text-primary">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-[#FDFBF7] border border-chamoisee/20">
              <Mail className="w-4 h-4 text-kobicha shrink-0" />
              <div>
                <span className="text-[10px] text-text-muted uppercase font-bold block">Official Email</span>
                <span className="font-semibold text-bistre">{user?.email || 'N/A'}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-[#FDFBF7] border border-chamoisee/20">
              <Phone className="w-4 h-4 text-kobicha shrink-0" />
              <div>
                <span className="text-[10px] text-text-muted uppercase font-bold block">Contact Number</span>
                <span className="font-semibold text-bistre">{user?.phone || '+91 9811001122'}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-[#FDFBF7] border border-chamoisee/20">
              <MapPin className="w-4 h-4 text-kobicha shrink-0" />
              <div>
                <span className="text-[10px] text-text-muted uppercase font-bold block">Authorized Jurisdiction</span>
                <span className="font-semibold text-bistre">
                  {user?.jurisdiction?.state || 'All India (National Scope)'}
                  {user?.jurisdiction?.district ? ` • ${user.jurisdiction.district} District` : ''}
                  {user?.jurisdiction?.taluka ? ` (${user.jurisdiction.taluka} Taluka)` : ''}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-[#FDFBF7] border border-chamoisee/20">
              <ShieldCheck className="w-4 h-4 text-status-success shrink-0" />
              <div>
                <span className="text-[10px] text-text-muted uppercase font-bold block">2FA Security Status</span>
                <span className="font-bold text-[#4D5A34]">Active (NIC OTP Cleared)</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;

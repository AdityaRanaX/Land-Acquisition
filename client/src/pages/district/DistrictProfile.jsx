import React, { useState, useEffect } from 'react';
import { userApi } from '../../services/api/userApi';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { User, ShieldCheck, Save, RefreshCw, Lock, MapPin, Mail, Phone, Briefcase } from 'lucide-react';

export const DistrictProfile = () => {
  const { user: authUser, refetchUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    designation: '',
    jurisdiction: {
      state: '',
      district: '',
      taluka: ''
    }
  });

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await userApi.getMe();
      const userData = res.data?.data || authUser;
      setProfile(userData);
      if (userData) {
        setForm({
          name: userData.name || '',
          phone: userData.phone || '',
          designation: userData.designation || '',
          jurisdiction: {
            state: userData.jurisdiction?.state || '',
            district: userData.jurisdiction?.district || '',
            taluka: userData.jurisdiction?.taluka || ''
          }
        });
      }
    } catch (e) {
      setError(e.response?.data?.message || 'Unable to load profile data from server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const res = await userApi.updateMe({
        name: form.name,
        phone: form.phone,
        designation: form.designation,
        jurisdiction: form.jurisdiction
      });
      setSuccessMsg('Profile updated successfully');
      setProfile(res.data?.data);
      if (refetchUser) refetchUser();
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DDD3C7] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#4A2E1B]">District Officer Profile</h1>
          <p className="text-xs text-[#6C625B]">Authenticated District Collector workspace profile and administrative credentials</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchProfile}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#4A2E1B] bg-[#F8F4ED] border border-[#DDD3C7] hover:bg-[#EAD8CE] transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Backend Security Notice */}
      <div className="p-3 bg-[#F8F4ED] border-l-4 border-[#C07D38] text-xs text-[#4A2E1B] flex items-start gap-2">
        <Lock className="w-4 h-4 text-[#C07D38] flex-shrink-0 mt-0.5" />
        <div>
          <strong>RBAC Security Scoping:</strong> Profile edits are restricted to name, contact phone, designation, and jurisdiction details per backend <code>PATCH /api/users/me</code> rules. Role, security permissions, and email identity remain administrative read-only fields.
        </div>
      </div>

      {error && (
        <div className="p-4 bg-[#FAF3E0] border border-[#DDD3C7] text-xs text-[#B84D28]">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-[#EAD8CE] border border-[#B84D28]/30 text-xs text-[#4A2E1B]">
          {successMsg}
        </div>
      )}

      {loading ? (
        <div className="p-8 text-center text-xs text-[#6C625B]">Loading profile records...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Read-Only Summary Card */}
          <Card title="Account Overview" subtitle="System Credentials & Scope">
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-[#F8F4ED] border border-[#DDD3C7] text-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-[#EAD8CE] text-[#B84D28] flex items-center justify-center font-bold text-xl mx-auto">
                  {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <h3 className="font-bold text-[#4A2E1B] text-sm">{profile?.name}</h3>
                <Badge variant="primary" dot>{profile?.role || 'DISTRICT_COLLECTOR'}</Badge>
              </div>

              <div className="space-y-2 pt-2 border-t border-[#DDD3C7] text-[#4A2E1B]">
                <div className="flex items-center justify-between py-1 border-b border-[#DDD3C7]">
                  <span className="text-[#6C625B] flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Email:</span>
                  <span className="font-mono font-semibold">{profile?.email || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-[#DDD3C7]">
                  <span className="text-[#6C625B] flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" /> Designation:</span>
                  <span className="font-semibold">{profile?.designation || 'District Collector'}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-[#DDD3C7]">
                  <span className="text-[#6C625B] flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> State / District:</span>
                  <span className="font-semibold">{profile?.jurisdiction?.district || 'Pune'}, {profile?.jurisdiction?.state || 'Maharashtra'}</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-[#6C625B] flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> 2FA Status:</span>
                  <span className="font-semibold text-[#C07D38]">{profile?.twoFactorEnabled ? 'Enabled' : 'Standard'}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Edit Profile Form */}
          <div className="lg:col-span-2">
            <Card title="Edit Officer Profile" subtitle="Permitted Profile Modifications">
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name *"
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                  <Input
                    label="Contact Phone"
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 9876543210"
                  />
                </div>

                <Input
                  label="Official Designation"
                  type="text"
                  value={form.designation}
                  onChange={(e) => setForm({ ...form, designation: e.target.value })}
                  placeholder="e.g. District Collector & Magistrate"
                />

                <div className="p-3 bg-[#F8F4ED] border border-[#DDD3C7] space-y-3">
                  <span className="font-semibold text-[#4A2E1B] block">Jurisdiction Scope</span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Input
                      label="State"
                      type="text"
                      value={form.jurisdiction.state}
                      onChange={(e) => setForm({ ...form, jurisdiction: { ...form.jurisdiction, state: e.target.value } })}
                    />
                    <Input
                      label="District"
                      type="text"
                      value={form.jurisdiction.district}
                      onChange={(e) => setForm({ ...form, jurisdiction: { ...form.jurisdiction, district: e.target.value } })}
                    />
                    <Input
                      label="Sub-Division / Taluka"
                      type="text"
                      value={form.jurisdiction.taluka}
                      onChange={(e) => setForm({ ...form, jurisdiction: { ...form.jurisdiction, taluka: e.target.value } })}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button type="submit" variant="primary" loading={updating} icon={Save}>
                    Save Profile Changes
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default DistrictProfile;

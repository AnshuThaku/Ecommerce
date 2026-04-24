import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/axiosInstance';
import Toast from '../../components/Toast';

function Section({ title, children }) {
  return (
    <div className="rounded-xl border border-[#C8A253]/10 bg-[#111] p-6 mb-6">
      <h3 className="text-sm font-semibold text-[#C8A253] uppercase tracking-wider mb-5">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', full = false, disabled = false }) {
  return (
    <div className={`relative ${full ? 'md:col-span-2' : ''}`}>
      <input
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder=" "
        disabled={disabled}
        className={`peer w-full bg-[#1A1A1A] border border-[#C8A253]/20 rounded-lg px-4 pt-5 pb-2 text-white text-sm outline-none focus:border-[#C8A253]/60 transition-colors ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      />
      <label className="absolute left-4 top-1 text-[10px] text-[#C8A253] uppercase tracking-widest pointer-events-none">
        {label}
      </label>
    </div>
  );
}

export default function AdminProfile() {
  const { user } = useAuth();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/profile');
      setForm(res.data.admin);
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to load profile.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!form.name || !form.email) {
      showToast('Name and email are required.', 'error');
      return;
    }

    try {
      setSaving(true);
      const res = await api.put('/admin/profile', {
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
      });
      showToast(res.data.message || 'Profile updated successfully.');
      setForm(res.data.admin);
    } catch (err) {
      showToast(err.response?.data?.error || 'Save failed.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-gray-500 text-sm">Loading profile...</p>;
  if (!form) return <p className="text-gray-500 text-sm">Profile not found.</p>;

  return (
    <div>
      {toast && <Toast toast={toast} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif text-[#C8A253]">My Profile</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your admin account information</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-lg bg-[#C8A253] text-black text-sm font-semibold hover:bg-[#d4af65] disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <Section title="Account Information">
        <Field label="Name" value={form.name} onChange={(v) => handleInputChange('name', v)} />
        <Field label="Email" value={form.email} onChange={(v) => handleInputChange('email', v)} type="email" />
      </Section>

      <Section title="Account Status">
        <Field label="Role" value={form.role} disabled={true} />
        <Field label="Status" value={form.isActive ? 'Active' : 'Suspended'} disabled={true} />
      </Section>

      <Section title="Account Created">
        <Field
          label="Created Date"
          value={new Date(form.createdAt).toLocaleDateString()}
          disabled={true}
        />
      </Section>
    </div>
  );
}

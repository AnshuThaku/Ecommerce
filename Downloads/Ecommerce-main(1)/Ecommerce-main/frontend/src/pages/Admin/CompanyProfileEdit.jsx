import { useState, useEffect } from 'react';
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

function Field({ label, value, onChange, type = 'text', full = false }) {
  return (
    <div className={`relative ${full ? 'md:col-span-2' : ''}`}>
      <input
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder=" "
        className="peer w-full bg-[#1A1A1A] border border-[#C8A253]/20 rounded-lg px-4 pt-5 pb-2 text-white text-sm outline-none focus:border-[#C8A253]/60 transition-colors"
      />
      <label className="absolute left-4 top-1 text-[10px] text-[#C8A253] uppercase tracking-widest pointer-events-none">
        {label}
      </label>
    </div>
  );
}

export default function CompanyProfileEdit() {
  const [form, setForm]     = useState(null);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [toast, setToast]       = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });

  useEffect(() => {
    api.get('/Superadmin/company-profile')
      .then((res) => setForm(res.data.data))
      .catch((err) => showToast(err.response?.data?.error || 'Failed to load profile.', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const set = (path, value) => {
    const keys = path.split('.');
    setForm((prev) => {
      const next = { ...prev };
      let cur = next;
      for (let i = 0; i < keys.length - 1; i++) {
        cur[keys[i]] = { ...cur[keys[i]] };
        cur = cur[keys[i]];
      }
      cur[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/Superadmin/company-profile', form);
      showToast('Company profile updated successfully.');
    } catch (err) {
      showToast(err.response?.data?.error || 'Save failed.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-gray-500 text-sm">Loading...</p>;
  if (!form)   return <p className="text-gray-500 text-sm">Profile not found.</p>;

  return (
    <div>
      {toast && <Toast toast={toast} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif text-[#C8A253]">Company Profile</h1>
          <p className="text-gray-500 text-sm mt-1">Update your company's registered information</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-lg bg-[#C8A253] text-black text-sm font-semibold hover:bg-[#d4af65] disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <Section title="Core Details">
        <Field label="Company Name"   value={form.companyName}   onChange={(v) => set('companyName', v)} />
        <Field label="Brand Name"     value={form.brandName}     onChange={(v) => set('brandName', v)} />
        <Field label="Contact Email"  value={form.contactEmail}  onChange={(v) => set('contactEmail', v)}  type="email" />
        <Field label="Contact Phone"  value={form.contactPhone}  onChange={(v) => set('contactPhone', v)} />
      </Section>

      <Section title="Tax Details">
        <Field label="GST Number" value={form.taxDetails?.gstNumber} onChange={(v) => set('taxDetails.gstNumber', v)} />
        <Field label="PAN Number" value={form.taxDetails?.panNumber} onChange={(v) => set('taxDetails.panNumber', v)} />
      </Section>

      <Section title="Registered Address">
        <Field label="Street"  value={form.registeredAddress?.street}  onChange={(v) => set('registeredAddress.street', v)}  full />
        <Field label="City"    value={form.registeredAddress?.city}    onChange={(v) => set('registeredAddress.city', v)} />
        <Field label="State"   value={form.registeredAddress?.state}   onChange={(v) => set('registeredAddress.state', v)} />
        <Field label="Pincode" value={form.registeredAddress?.pincode} onChange={(v) => set('registeredAddress.pincode', v)} />
        <Field label="Country" value={form.registeredAddress?.country} onChange={(v) => set('registeredAddress.country', v)} />
      </Section>

      <Section title="Bank Details">
        <Field label="Account Holder" value={form.bankDetails?.accountHolderName} onChange={(v) => set('bankDetails.accountHolderName', v)} />
        <Field label="Account Number" value={form.bankDetails?.accountNumber}      onChange={(v) => set('bankDetails.accountNumber', v)} />
        <Field label="IFSC Code"      value={form.bankDetails?.ifscCode}           onChange={(v) => set('bankDetails.ifscCode', v)} />
        <Field label="Bank Name"      value={form.bankDetails?.bankName}           onChange={(v) => set('bankDetails.bankName', v)} />
        <Field label="Branch"         value={form.bankDetails?.branch}             onChange={(v) => set('bankDetails.branch', v)} />
      </Section>
    </div>
  );
}

import { useState, useEffect, useCallback } from 'react';
import api from '../../utils/axiosInstance';
import Toast from '../../components/Toast';

function CreateAdminModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/Superadmin/create-admin', form);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#111] border border-[#C8A253]/20 rounded-2xl w-full max-w-md p-8">
        <h2 className="text-xl font-serif text-[#C8A253] mb-6">Create Admin Account</h2>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { key: 'name', label: 'Full Name', type: 'text' },
            { key: 'email', label: 'Email Address', type: 'email' },
          ].map(({ key, label, type }) => (
            <div key={key} className="relative">
              <input
                type={type}
                value={form[key]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                placeholder=" "
                required
                className="peer w-full bg-[#1A1A1A] border border-[#C8A253]/20 rounded-lg px-4 pt-5 pb-2 text-white text-sm outline-none focus:border-[#C8A253]/60 transition-colors"
              />
              <label className="absolute left-4 top-1 text-[10px] text-[#C8A253] uppercase tracking-widest pointer-events-none">
                {label}
              </label>
            </div>
          ))}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-lg border border-white/10 text-gray-400 hover:text-white text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-lg bg-[#C8A253] text-black font-semibold text-sm hover:bg-[#d4af65] disabled:opacity-50 transition-colors"
            >
              {loading ? 'Creating...' : 'Create & Send Email'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminManagement() {
  const [admins, setAdmins]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast]       = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });

  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/Superadmin/all-admins');
      setAdmins(res.data.data);
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to load admins.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAdmins(); }, [fetchAdmins]);

  const handleToggle = async (id, isActive) => {
    try {
      const res = await api.put(`/Superadmin/${id}/toggle-status`);
      showToast(res.data.message);
      setAdmins((prev) =>
        prev.map((a) => (a._id === id ? { ...a, isActive: !isActive } : a))
      );
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to update status.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Permanently delete this admin? This cannot be undone.')) return;
    try {
      await api.delete(`/Superadmin/${id}`);
      showToast('Admin deleted.');
      setAdmins((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to delete admin.', 'error');
    }
  };

  return (
    <div>
      {toast && <Toast toast={toast} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif text-[#C8A253]">Manage Admins</h1>
          <p className="text-gray-500 text-sm mt-1">{admins.length} admin account{admins.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 rounded-lg bg-[#C8A253] text-black text-sm font-semibold hover:bg-[#d4af65] transition-colors"
        >
          + New Admin
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : admins.length === 0 ? (
        <div className="rounded-xl border border-[#C8A253]/10 bg-[#111] p-10 text-center">
          <p className="text-gray-500 text-sm">No admins yet. Create the first one.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-[#C8A253]/10 bg-[#111] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#C8A253]/10">
                {['Name', 'Email', 'Status', 'Joined', 'Actions'].map((h) => (
                  <th key={h} className="px-6 py-4 text-left text-xs text-[#C8A253] uppercase tracking-wider font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {admins.map((admin, idx) => (
                <tr
                  key={admin._id}
                  className={`border-b border-white/5 ${idx % 2 === 0 ? '' : 'bg-white/2'}`}
                >
                  <td className="px-6 py-4 text-white font-medium">{admin.name}</td>
                  <td className="px-6 py-4 text-gray-400">{admin.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      admin.isActive
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {admin.isActive ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(admin.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleToggle(admin._id, admin.isActive)}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                          admin.isActive
                            ? 'border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10'
                            : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                        }`}
                      >
                        {admin.isActive ? 'Suspend' : 'Reactivate'}
                      </button>
                      <button
                        onClick={() => handleDelete(admin._id)}
                        className="text-xs px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create admin modal */}
      {showModal && (
        <CreateAdminModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            showToast('Admin created! Credentials sent via email.');
            fetchAdmins();
          }}
        />
      )}
    </div>
  );
}

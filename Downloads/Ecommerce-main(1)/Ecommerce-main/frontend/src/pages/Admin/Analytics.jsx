import { useState, useEffect } from 'react';
import api from '../../utils/axiosInstance';
import Toast from '../../components/Toast';

function StatCard({ label, value, sub }) {
  return (
    <div className="rounded-xl border border-[#C8A253]/20 bg-[#111] p-6">
      <p className="text-xs text-[#C8A253] uppercase tracking-widest mb-3">{label}</p>
      <p className="text-3xl font-bold text-white">{value ?? '—'}</p>
      {sub && <p className="text-xs text-gray-500 mt-2">{sub}</p>}
    </div>
  );
}

export default function Analytics() {
  const [data, setData]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    api.get('/Superadmin/analytics')
      .then((res) => setData(res.data.data))
      .catch((err) => setToast({ message: err.response?.data?.error || 'Failed to load analytics.', type: 'error' }))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {toast && <Toast toast={toast} onClose={() => setToast(null)} />}

      <h1 className="text-2xl font-serif text-[#C8A253] mb-2">Analytics</h1>
      <p className="text-gray-500 text-sm mb-8">Platform overview — orders & revenue stats will appear as those modules are built.</p>

      {loading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : data ? (
        <div className="space-y-8">
          {/* Users */}
          <section>
            <p className="text-xs uppercase tracking-widest text-gray-600 mb-4">Users</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              <StatCard label="Total Admins"      value={data.users.totalAdmins} />
              <StatCard label="Active Admins"     value={data.users.activeAdmins} />
              <StatCard label="Suspended Admins"  value={data.users.suspendedAdmins} />
              <StatCard label="Total Customers"   value={data.users.totalCustomers} />
              <StatCard label="Active Customers"  value={data.users.activeCustomers} />
            </div>
          </section>

          {/* Company */}
          {data.company && (
            <section>
              <p className="text-xs uppercase tracking-widest text-gray-600 mb-4">Company</p>
              <div className="rounded-xl border border-[#C8A253]/10 bg-[#111] p-6 space-y-2">
                <p className="text-white font-semibold text-lg">{data.company.companyName}</p>
                <p className="text-[#C8A253] text-sm">{data.company.brandName}</p>
                <p className="text-gray-500 text-sm">{data.company.contactEmail}</p>
                <p className="text-gray-600 text-xs mt-2">
                  Registered on {new Date(data.company.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </section>
          )}

          {/* Orders (placeholder) */}
          <section>
            <p className="text-xs uppercase tracking-widest text-gray-600 mb-4">Orders & Revenue</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
              <StatCard label="Total Orders"   value={data.orders.total}     sub="Orders module pending" />
              <StatCard label="Pending"        value={data.orders.pending}   />
              <StatCard label="Delivered"      value={data.orders.delivered} />
              <StatCard label="Revenue (₹)"    value={data.orders.revenue}   sub="Payments module pending" />
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}

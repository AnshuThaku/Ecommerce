import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'super-admin';

  // Base cards that everyone sees
  let dashboardCards = [
    { label: 'Customers', hint: 'Registered customer accounts' },
    { label: 'Orders',    hint: 'Orders module coming soon' }
  ];

  // Super-Admin exclusive cards
  if (isSuperAdmin) {
    dashboardCards = [
      { label: 'Admins',    hint: 'Use Manage Admins to view' },
      ...dashboardCards,
      { label: 'Revenue',   hint: 'Payments module coming soon' }
    ];
  }

  return (
    <div>
      <h1 className="text-2xl font-serif text-[#C8A253] mb-2">Welcome back, {user?.name}</h1>
      <p className="text-gray-400 text-sm mb-8">Here's what's happening on your platform today.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {dashboardCards.map(({ label, hint }) => (
          <div
            key={label}
            className="rounded-xl border border-[#C8A253]/20 bg-[#111] p-6"
          >
            <p className="text-xs text-[#C8A253] uppercase tracking-widest mb-3">{label}</p>
            <p className="text-3xl font-bold text-white">—</p>
            <p className="text-xs text-gray-600 mt-2">{hint}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-[#C8A253]/10 bg-[#111] p-6">
        <p className="text-sm text-gray-500">
          Navigate using the sidebar to manage admins, view analytics, or update the company profile.
        </p>
      </div>
    </div>
  );
}

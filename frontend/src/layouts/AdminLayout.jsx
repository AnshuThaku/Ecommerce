import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const nav = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/products',  label: 'Products' },
  { to: '/admin/orders',    label: 'Orders' },
  { to: '/admin/users',     label: 'Users' },
];

function Sidebar({ user, onLogout, onClose }) {
  return (
    <aside className="w-64 h-full bg-[#111] border-r border-[#C8A253]/20 flex flex-col">
      {/* Brand + close btn (mobile only) */}
      <div className="px-8 py-7 border-b border-[#C8A253]/20 flex items-center justify-between">
        <div>
          <p className="text-[#C8A253] font-serif text-xl tracking-widest">TRUEE</p>
          <p className="text-xs text-gray-500 tracking-wider mt-0.5">ADMIN PANEL</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-gray-500 hover:text-white p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* User info */}
      <div className="px-6 py-5 border-b border-[#C8A253]/10">
        <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
        <span className="inline-block mt-1 text-[10px] tracking-widest uppercase bg-white/5 text-gray-400 border border-white/10 px-2 py-0.5 rounded-full">
          Admin
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {nav.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `block px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-[#C8A253]/15 text-[#C8A253] font-semibold border border-[#C8A253]/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-4 pb-6">
        <button
          onClick={onLogout}
          className="w-full px-4 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 text-left"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="min-h-screen flex bg-[#0A0A0A] text-white">

      {/* ── Desktop sidebar (always visible ≥lg) ── */}
      <div className="hidden lg:flex lg:shrink-0">
        <Sidebar user={user} onLogout={handleLogout} />
      </div>

      {/* ── Mobile drawer ── */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          {/* Drawer */}
          <div className="relative z-50 flex h-full w-64 animate-[slideIn_0.22s_ease-out]">
            <Sidebar user={user} onLogout={handleLogout} onClose={() => setOpen(false)} />
          </div>
        </div>
      )}

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Mobile top bar */}
        <header className="lg:hidden flex items-center gap-4 px-4 py-3 bg-[#111] border-b border-[#C8A253]/20 shrink-0">
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-lg text-gray-400 hover:text-[#C8A253] hover:bg-[#C8A253]/10 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <p className="text-[#C8A253] font-serif tracking-widest text-base">TRUEE</p>
          <span className="ml-auto text-[10px] tracking-widest uppercase bg-white/5 text-gray-400 border border-white/10 px-2 py-0.5 rounded-full">
            Admin
          </span>
        </header>

        <main className="flex-1 overflow-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

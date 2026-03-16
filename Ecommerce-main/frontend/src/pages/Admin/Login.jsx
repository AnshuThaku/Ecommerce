import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Toast from '../../components/Toast';
import { useAuth } from '../../context/AuthContext';

const Field = ({ label, ...props }) => (
  <div className="relative">
    <input
      {...props}
      id={props.name}
      placeholder=" "
      className="peer w-full bg-transparent border border-zinc-700 rounded-lg px-4 pt-5 pb-2 text-white text-sm focus:outline-none focus:border-[#C8A253] transition-all duration-300 placeholder-transparent"
    />
    <label
      htmlFor={props.name}
      className="absolute left-4 top-2 text-[10px] font-semibold tracking-widest text-[#C8A253] uppercase transition-all duration-300 cursor-text peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-zinc-500 peer-placeholder-shown:font-normal peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-[10px] peer-focus:font-semibold peer-focus:tracking-widest peer-focus:text-[#C8A253]"
    >
      {label}
    </label>
  </div>
);

const PasswordField = ({ label, ...props }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        {...props}
        id={props.name}
        type={show ? 'text' : 'password'}
        placeholder=" "
        className="peer w-full bg-transparent border border-zinc-700 rounded-lg px-4 pt-5 pb-2 pr-11 text-white text-sm focus:outline-none focus:border-[#C8A253] transition-all duration-300 placeholder-transparent"
      />
      <label
        htmlFor={props.name}
        className="absolute left-4 top-2 text-[10px] font-semibold tracking-widest text-[#C8A253] uppercase transition-all duration-300 cursor-text peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-zinc-500 peer-placeholder-shown:font-normal peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-[10px] peer-focus:font-semibold peer-focus:tracking-widest peer-focus:text-[#C8A253]"
      >
        {label}
      </label>
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-[#C8A253] transition-colors duration-200 focus:outline-none"
        tabIndex={-1}
      >
        {show ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        )}
      </button>
    </div>
  );
};

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Role-based redirect logic
  const redirectByRole = (user) => {
    const { role, isFirstLogin } = user;
    if (role === 'super-admin') {
      navigate(isFirstLogin ? '/update-password' : '/superadmin/dashboard');
    } else if (role === 'admin') {
      navigate(isFirstLogin ? '/update-password' : '/admin/dashboard');
    } else {
      navigate('/shop');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/login', formData);
      if (response.data.success) {
        login(response.data.token, response.data.user); // updates AuthContext + localStorage
        setToast({ type: 'success', message: 'Login successful! Redirecting...' });
        setTimeout(() => redirectByRole(response.data.user), 1200);
      }
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.error || 'Login failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-[#C8A253] text-xs tracking-[0.4em] uppercase mb-3">Admin Portal</p>
          <h1 className="text-4xl font-serif text-white">Truee <span className="text-[#C8A253]">Luxury</span></h1>
          <p className="text-zinc-500 text-sm mt-2">Sign in to your admin account</p>
        </div>

        {/* Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Field label="Admin Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
            <PasswordField label="Password" name="password" value={formData.password} onChange={handleChange} required />

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl bg-[#C8A253] text-[#0A0A0A] text-sm font-bold tracking-widest uppercase hover:bg-[#d4af6b] active:scale-95 transition-all duration-300 shadow-[0_4px_24px_rgba(200,162,83,0.25)] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Authenticating...
                </span>
              ) : 'Secure Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
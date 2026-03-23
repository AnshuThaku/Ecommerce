import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance'; 
import Toast from '../../components/Toast';
import { useAuth } from '../../context/AuthContext';
import ReCAPTCHA from 'react-google-recaptcha';
import { Eye, EyeOff, Lock, Mail, ArrowRight, User } from 'lucide-react';

const Field = ({ label, icon: Icon, ...props }) => (
  <div className="relative group">
    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#C8A253] transition-colors duration-300">
      {Icon && <Icon size={18} />}
    </div>
    <input
      {...props}
      id={props.name}
      placeholder=" "
      className="peer w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-12 pt-6 pb-2 text-white text-sm focus:outline-none focus:border-[#C8A253]/50 focus:bg-zinc-900 transition-all duration-300 placeholder-transparent"
    />
    <label
      htmlFor={props.name}
      className="absolute left-12 top-2 text-[10px] font-bold tracking-[0.2em] text-[#C8A253] uppercase transition-all duration-300 cursor-text peer-placeholder-shown:top-[18px] peer-placeholder-shown:text-sm peer-placeholder-shown:text-zinc-500 peer-placeholder-shown:font-medium peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-[10px] peer-focus:font-bold peer-focus:tracking-[0.2em] peer-focus:text-[#C8A253]"
    >
      {label}
    </label>
  </div>
);

const PasswordField = ({ label, ...props }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#C8A253] transition-colors duration-300">
        <Lock size={18} />
      </div>
      <input
        {...props}
        id={props.name}
        type={show ? 'text' : 'password'}
        placeholder=" "
        className="peer w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-12 pt-6 pb-2 pr-12 text-white text-sm focus:outline-none focus:border-[#C8A253]/50 focus:bg-zinc-900 transition-all duration-300 placeholder-transparent"
      />
      <label
        htmlFor={props.name}
        className="absolute left-12 top-2 text-[10px] font-bold tracking-[0.2em] text-[#C8A253] uppercase transition-all duration-300 cursor-text peer-placeholder-shown:top-[18px] peer-placeholder-shown:text-sm peer-placeholder-shown:text-zinc-500 peer-placeholder-shown:font-medium peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-[10px] peer-focus:font-bold peer-focus:tracking-[0.2em] peer-focus:text-[#C8A253]"
      >
        {label}
      </label>
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-[#C8A253] transition-colors"
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
};

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [captchaToken, setCaptchaToken] = useState('');
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const recaptchaRef = useRef(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const redirectByRole = (user) => {
    const { role, isFirstLogin } = user;
    if (role === 'super-admin') {
      navigate(isFirstLogin ? '/update-password' : '/superadmin/dashboard');
    } else if (role === 'admin') {
      navigate(isFirstLogin ? '/update-password' : '/admin/dashboard');
    } else {
      navigate('/'); // Customers go to Home
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!captchaToken) {
      setToast({ type: 'error', message: 'Verification required. Please check the reCAPTCHA.' });
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post('/auth/login', { ...formData, captchaToken });
      if (response.data.success) {
        login(response.data.token, response.data.user);
        setToast({ type: 'success', message: 'Success! Redirecting to your account...' });
        setTimeout(() => redirectByRole(response.data.user), 1500);
      }
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.error || 'Authentication failed.' });
      recaptchaRef.current?.reset();
      setCaptchaToken('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Decorative Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#C8A253]/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#C8A253]/5 blur-[120px] rounded-full" />

      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="w-full max-w-[440px] z-10">
        {/* Logo Section */}
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1.5 border border-[#C8A253]/20 rounded-full mb-6 bg-[#C8A253]/5">
            <p className="text-[#C8A253] text-[9px] font-black tracking-[0.5em] uppercase">Secure Access</p>
          </div>
          <h1 className="text-5xl font-serif italic text-white mb-2">Truee <span className="text-[#C8A253]">Luxury</span></h1>
          <p className="text-zinc-500 text-sm font-medium tracking-wide">Sign in to manage your collection & account</p>
        </div>

        {/* Login Form Container */}
        <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/50 rounded-[2rem] p-10 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Field 
              label="Email Address" 
              name="email" 
              type="email" 
              icon={Mail}
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
            
            <PasswordField 
              label="Password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              required 
            />

            {/* ReCAPTCHA */}
            <div className="flex justify-center py-2 rounded-xl bg-black/20 border border-zinc-800/30 overflow-hidden scale-90 sm:scale-100">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={import.meta.env.VITE_GOOGLE_SITE_KEY}
                onChange={(token) => setCaptchaToken(token)}
                theme="dark"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full overflow-hidden py-4 rounded-xl bg-[#C8A253] text-[#0A0A0A] text-xs font-black tracking-[0.2em] uppercase transition-all duration-500 hover:shadow-[0_0_30px_rgba(200,162,83,0.4)] disabled:opacity-50 active:scale-[0.98]"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {loading ? 'Processing...' : 'Sign In'}
                {!loading && <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />}
              </span>
            </button>
          </form>

          {/* Signup Link */}
          <div className="mt-10 pt-8 border-t border-zinc-800/50 text-center">
            <p className="text-zinc-500 text-xs font-medium">
              New to Truee Luxury?
            </p>
            <Link 
              to="/register" 
              className="inline-block mt-3 text-[#C8A253] text-xs font-bold uppercase tracking-widest hover:text-white transition-colors border-b border-[#C8A253]/30 hover:border-white pb-1"
            >
              Create An Account
            </Link>
          </div>
        </div>

        <p className="mt-8 text-center text-zinc-600 text-[10px] font-bold uppercase tracking-[0.3em]">
          &copy; 2026 Truee Luxury Operations
        </p>
      </div>
    </div>
  );
};

export default Login;
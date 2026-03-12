import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Toast from '../../components/Toast';
import { useAuth } from '../../context/AuthContext';

const Field = ({ label, ...props }) => (
  <div className="relative mb-5">
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

export default function CustomerRegister() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // We can automatically log them in using context

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/register', formData);
      if (response.data.success) {
        // Auto log in after successful signup
        login(response.data.token, response.data.user);
        setToast({ type: 'success', message: 'Registration successful! Welcome.' });
        setTimeout(() => navigate('/shop'), 1200); // Redirect to shop dashboard
      }
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.error || 'Registration failed.' });
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
          <p className="text-[#C8A253] text-xs tracking-[0.4em] uppercase mb-3">Join Us</p>
          <h1 className="text-4xl font-serif text-white">Truee <span className="text-[#C8A253]">Luxury</span></h1>
          <p className="text-zinc-500 text-sm mt-2">Create your customer account</p>
        </div>

        {/* Form */}
        <div className="bg-[#111] border border-zinc-800 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit}>
            <Field label="Full Name" name="name" type="text" required value={formData.name} onChange={handleChange} />
            <Field label="Email Address" name="email" type="email" required value={formData.email} onChange={handleChange} />
            <Field label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
            <Field label="Password" name="password" type="password" required value={formData.password} onChange={handleChange} />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C8A253] hover:bg-[#b08d44] text-[#0A0A0A] font-bold py-3.5 rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 mt-2"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <p className="text-center text-sm text-zinc-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-[#C8A253] hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

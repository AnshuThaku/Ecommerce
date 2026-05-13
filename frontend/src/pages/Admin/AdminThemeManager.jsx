// src/pages/Admin/AdminThemeManager.jsx
import React, { useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { Calendar, Tag, Save, PartyPopper, Clock, Sparkles, ChevronDown } from 'lucide-react';

const FESTIVAL_PREVIEWS = {
  'Diwali': { bg: '#1A0F00', primary: '#FF9933' },
  'Christmas': { bg: '#050D0A', primary: '#D32F2F' },
  'Holi': { bg: '#14081c', primary: '#E1306C' },
  'Eid': { bg: '#06160C', primary: '#2E7D32' },
  'Default': { bg: '#0A0A0A', primary: '#C8A253' }
};

const FESTIVALS = Object.keys(FESTIVAL_PREVIEWS);

export default function AdminThemeManager() {
  const [formData, setFormData] = useState({
    campaignName: '',
    festivalName: 'Diwali',
    startDate: '',
    endDate: '',
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: 'loading', message: 'Configuring theme across the platform...' });
    
    try {
      const token = localStorage.getItem('token'); 
      const response = await axiosInstance.post('/theme/create', formData);
      
      if(response.data.success) {
        setStatus({ type: 'success', message: '✨ Magic applied! Theme successfully scheduled.' });
        setFormData({ campaignName: '', festivalName: 'Default', startDate: '', endDate: '' });
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to connect to the theme engine.';
      setStatus({ type: 'error', message: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const activePreview = FESTIVAL_PREVIEWS[formData.festivalName] || FESTIVAL_PREVIEWS['Default'];

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto w-full text-white">
      
      {/* ── HEADER SECTION ── */}
      <div className="mb-10 flex items-center justify-between">
        <div>
          {/* ⚡ THEME UPDATE: text-[var(--theme-text)] used for heading */}
          <h1 className="text-3xl md:text-4xl font-serif mb-2 flex items-center gap-3 text-[var(--theme-text)] transition-colors duration-500">
            <Sparkles className="w-8 h-8" /> Smart Theme Engine
          </h1>
          <p className="text-zinc-400 text-sm md:text-base max-w-xl">
            Schedule upcoming festivals. The system will automatically shift the brand's atmosphere and colors at the exact moment.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ── FORM SECTION ── */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-zinc-950/80 border border-zinc-800 p-6 md:p-8 rounded-2xl shadow-2xl space-y-6 relative overflow-hidden">
          
          {/* Campaign Title */}
          <div>
            <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-400 mb-3">
              {/* ⚡ THEME UPDATE: text-[var(--theme-text)] used for icon */}
              <Tag className="w-4 h-4 text-[var(--theme-text)] transition-colors" /> Campaign Name
            </label>
            <input 
              type="text" 
              name="campaignName"
              value={formData.campaignName}
              onChange={handleChange}
              required
              placeholder="e.g., The Great Diwali Sale 2026"
              // ⚡ THEME UPDATE: focus:border-[var(--theme-btn)] and focus:ring-theme-btn
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:outline-none focus:ring-1 focus:border-[var(--theme-btn)] focus:ring-theme-btn transition-all placeholder:text-zinc-600"
            />
          </div>

          {/* Festival Dropdown */}
          <div>
            <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-400 mb-3">
              <PartyPopper className="w-4 h-4 text-[var(--theme-text)] transition-colors" /> Select Theme
            </label>
            <div className="relative">
              <select
                name="festivalName"
                value={formData.festivalName}
                onChange={handleChange}
                // ⚡ THEME UPDATE: focus styling
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 pr-12 text-white focus:outline-none focus:ring-1 focus:border-[var(--theme-btn)] focus:ring-theme-btn appearance-none cursor-pointer transition-all relative z-10"
              >
                {FESTIVALS.map(fest => (
                  <option key={fest} value={fest} className="bg-zinc-900 text-white">{fest} Edition</option>
                ))}
              </select>
              
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 z-0 pointer-events-none">
                <ChevronDown className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div>
              <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-400 mb-3">
                <Calendar className="w-4 h-4 text-[var(--theme-text)] transition-colors" /> Start Date & Time
              </label>
              <input 
                type="datetime-local" 
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                style={{ colorScheme: 'dark' }}
                // ⚡ THEME UPDATE: focus styling
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:outline-none focus:ring-1 focus:border-[var(--theme-btn)] focus:ring-theme-btn transition-all cursor-pointer"
              />
              <p className="text-[10px] text-zinc-500 mt-2 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Click icon inside input to pick time
              </p>
            </div>
            
            <div>
              <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-400 mb-3">
                <Calendar className="w-4 h-4 text-[var(--theme-text)] transition-colors" /> End Date & Time
              </label>
              <input 
                type="datetime-local" 
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                style={{ colorScheme: 'dark' }}
                // ⚡ THEME UPDATE: focus styling
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:outline-none focus:ring-1 focus:border-[var(--theme-btn)] focus:ring-theme-btn transition-all cursor-pointer"
              />
            </div>
          </div>

          {/* Status Message */}
          {status.message && (
            <div className={`p-4 rounded-xl text-sm font-medium flex items-center gap-3 ${
              status.type === 'error' ? 'bg-red-900/30 text-red-400 border border-red-800' : 
              status.type === 'loading' ? 'bg-blue-900/30 text-blue-400 border border-blue-800' : 
              'bg-green-900/30 text-green-400 border border-green-800'
            }`}>
              {status.message}
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={loading}
            // ⚡ THEME UPDATE: bg-[var(--theme-btn)] used directly via Tailwind class
            className="w-full mt-6 bg-[var(--theme-btn)] hover:opacity-90 text-black font-black py-4 rounded-xl text-xs uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <><Save className="w-4 h-4" /> Initialize Automations</>
            )}
          </button>
        </form>

        {/* ── LIVE PREVIEW WIDGET (No Changes needed here, it uses internal state) ── */}
        <div className="lg:col-span-1 hidden lg:block">
          <div className="sticky top-8">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">Live Theme Preview</h3>
            
            <div 
              className="rounded-2xl border border-zinc-800 overflow-hidden shadow-2xl transition-colors duration-700 ease-in-out h-80 flex flex-col"
              style={{ backgroundColor: activePreview.bg }}
            >
              <div className="h-12 border-b border-white/5 flex items-center px-4 justify-between">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20"></div>
                </div>
                <div className="w-16 h-2 rounded bg-white/10"></div>
              </div>

              <div className="flex-1 p-6 flex flex-col justify-center items-center text-center">
                <PartyPopper 
                  className="w-12 h-12 mb-4 transition-colors duration-700" 
                  style={{ color: activePreview.primary }} 
                />
                <h4 
                  className="text-xl font-serif mb-2 transition-colors duration-700"
                  style={{ color: activePreview.primary }}
                >
                  {formData.festivalName} Edition
                </h4>
                <p className="text-xs text-white/50 max-w-[200px] leading-relaxed">
                  This is how the background and accent colors will appear across the luxury storefront.
                </p>
                
                <div 
                  className="mt-6 px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider text-black transition-colors duration-700"
                  style={{ backgroundColor: activePreview.primary }}
                >
                  Shop Collection
                </div>
              </div>
            </div>
            <p className="text-center text-[10px] text-zinc-600 mt-4 uppercase tracking-widest">
              Automated Hex Generation
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { ArrowRight, Mail } from 'lucide-react';
// ⚡ DONO FILES KA INTEGRATION YAHAN HAI
import { useServerTheme } from '../hooks/useServerTheme'; 

export default function Newsletter() {
  // 1. Hook call: Ye server se data layega aur CSS variables set karega
  useServerTheme();

  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail('');
      }, 4000);
    }
  };

  return (
    /* 2. CSS Variables Integration: bg-[var(--theme-bg-dark)] etc. */
    <section className="w-full overflow-x-hidden bg-white px-4 sm:px-6 lg:px-8 selection:bg-[var(--theme-primary)] selection:text-[var(--theme-text-light)] flex flex-col justify-center items-center py-16 md:py-24 transition-colors duration-500">

      <div className="w-full max-w-[92%] md:max-w-[85%] bg-white border border-zinc-200 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-[0_8px_30px_rgb(0,0,0,0.05)] md:max-h-[80vh] transition-colors duration-500">

        {/* Left Side - Image */}
        <div className="w-full md:w-1/2 h-[200px] sm:h-[300px] md:h-auto md:min-h-[400px] relative overflow-hidden group">
          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all duration-700 z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=800&q=80" 
            alt="Premium Audio" 
            className="w-full h-full object-cover transform transition-transform duration-[10s] group-hover:scale-110"
          />
        </div>

        {/* Right Side - Content */}
        <div className="w-full md:w-1/2 p-6 sm:p-10 md:p-12 lg:p-16 flex flex-col justify-center relative overflow-y-auto">
          
          {/* Glow Effect */}
          <div 
            className="absolute top-0 right-0 w-64 h-64 opacity-10 blur-[100px] pointer-events-none transition-colors duration-500"
            style={{ backgroundColor: 'var(--theme-primary)' }}
          ></div>

          <div className="relative z-10 w-full">
            <div className="flex items-center gap-3 mb-3 sm:mb-6">
              <Mail className="w-4 h-4 text-[var(--theme-primary)]" />
              <span className="text-[10px] uppercase tracking-[0.3em] sm:tracking-[0.4em] font-bold text-[var(--theme-primary)]">
                The Inner Circle
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#111] mb-2 sm:mb-4 leading-tight">
              Elevate Your <br />
              <span className="italic text-[var(--theme-primary)]">Everyday.</span>
            </h2>

            <p className="text-zinc-600 text-[11px] sm:text-sm leading-relaxed mb-6 max-w-sm">
              Become a Truee insider. Gain early access to limited releases and curated tech stories.
            </p>

            {isSubmitted ? (
              <div className="bg-zinc-50 border border-[var(--theme-primary)]/30 rounded-lg p-6 text-center animate-in fade-in transition-all">
                <p className="text-[var(--theme-primary)] font-serif italic text-xl mb-2">Welcome to the Club.</p>
                <p className="text-zinc-500 text-xs uppercase tracking-widest">Your premium journey begins now.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-6">
                <div className="relative">
                  <input
                    type="email"
                    id="newsletter-email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder=" "
                    className="peer w-full bg-transparent border-b border-zinc-300 py-2 sm:py-3 text-[#111] text-sm focus:outline-none focus:border-[var(--theme-primary)] transition-colors duration-300 placeholder-transparent"
                  />
                  <label
                    htmlFor="newsletter-email"
                    className="absolute left-0 top-3 text-[10px] sm:text-xs font-medium tracking-wider text-zinc-500 uppercase transition-all duration-300 peer-focus:-top-3 peer-focus:text-[10px] peer-focus:text-[var(--theme-primary)] peer-[&:not(:placeholder-shown)]:-top-3 peer-[&:not(:placeholder-shown)]:text-[var(--theme-primary)]"
                  >
                    Email Address
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[var(--theme-primary)] hover:bg-white text-black font-black py-3.5 sm:py-4 text-[11px] uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-3 group rounded-sm"
                >
                  Subscribe Now
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
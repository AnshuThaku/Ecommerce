import React, { useState } from 'react';
import { ArrowRight, Mail } from 'lucide-react';
import { useServerTheme } from '../hooks/useServerTheme'; 

export default function Newsletter() {
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
    /* Fix 1: min-h-screen ko hata kar auto kiya aur padding adjust ki */
    <section className="w-full h-auto overflow-x-hidden bg-white px-4 sm:px-8 md:px-12 lg:px-16 flex flex-col justify-center items-center py-12 md:py-16 lg:py-24 transition-colors duration-500">

      {/* Main Container: md:min-h ko thoda kam kiya taaki iPad par box stretch na ho */}
      <div className="w-full max-w-[1200px] bg-white border border-zinc-200 rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-[0_20px_50px_rgba(0,0,0,0.05)] md:min-h-[480px] lg:min-h-[550px] transition-colors duration-500">

        {/* Left Side - Image */}
        <div className="w-full md:w-1/2 h-[350px] sm:h-[450px] md:h-auto relative overflow-hidden group">
          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all duration-700 z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=1200&q=80" 
            alt="Premium Audio" 
            className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-[10s] group-hover:scale-105"
          />
        </div>

        {/* Right Side - Content */}
        <div className="w-full md:w-1/2 p-8 sm:p-14 md:p-10 lg:p-20 flex flex-col justify-center relative bg-white">
          
          {/* Decorative Glow */}
          <div 
            className="absolute top-0 right-0 w-72 h-72 opacity-[0.08] blur-[120px] pointer-events-none"
            style={{ backgroundColor: 'var(--theme-primary)' }}
          ></div>

          <div className="relative z-10 w-full max-w-md mx-auto md:mx-0">
            <div className="flex items-center gap-3 mb-6">
              <Mail className="w-4 h-4 text-[var(--theme-primary)]" />
              <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[var(--theme-primary)]">
                The Inner Circle
              </span>
            </div>

            {/* Fix 2: Font size ko md screens (iPad) par thoda control kiya */}
            <h2 className="text-3xl sm:text-4xl md:text-3xl lg:text-5xl font-serif text-[#111] mb-4 leading-[1.1]">
              Elevate Your <br />
              <span className="italic text-[var(--theme-primary)]">Everyday.</span>
            </h2>

            <p className="text-zinc-500 text-sm sm:text-base md:text-sm lg:text-base leading-relaxed mb-10">
              Become a Truee insider. Gain early access to limited releases and curated tech stories.
            </p>

            {isSubmitted ? (
              <div className="bg-zinc-50 border border-[var(--theme-primary)]/20 rounded-xl p-8 text-center animate-in fade-in zoom-in duration-500">
                <p className="text-[var(--theme-primary)] font-serif italic text-2xl mb-2">Welcome to the Club.</p>
                <p className="text-zinc-400 text-xs uppercase tracking-[0.2em]">Your premium journey begins now.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                <div className="relative">
                  <input
                    type="email"
                    id="newsletter-email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder=" "
                    className="peer w-full bg-transparent border-b-2 border-zinc-100 py-3 text-[#111] text-base focus:outline-none focus:border-[var(--theme-primary)] transition-colors duration-500 placeholder-transparent"
                  />
                  <label
                    htmlFor="newsletter-email"
                    className="absolute left-0 top-3 text-xs font-bold tracking-widest text-zinc-400 uppercase transition-all duration-300 peer-focus:-top-5 peer-focus:text-[10px] peer-focus:text-[var(--theme-primary)] peer-[&:not(:placeholder-shown)]:-top-5 peer-[&:not(:placeholder-shown)]:text-[var(--theme-primary)]"
                  >
                    Email Address
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[var(--theme-primary)] text-black hover:bg-black hover:text-white font-bold py-5 text-[11px] uppercase tracking-[0.3em] transition-all duration-500 flex items-center justify-center gap-3 group rounded-full shadow-lg shadow-[var(--theme-primary)]/10"
                >
                  Subscribe Now
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
// src/components/Newsletter.jsx
import React, { useState } from 'react';
import { ArrowRight, Mail } from 'lucide-react';

export default function Newsletter() {
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
    // ⚡ ADDED min-h-screen to make it full screen height, with items-center to keep the card in the middle ⚡
    <section className="bg-[#0A0A0A] min-h-screen px-4 sm:px-6 lg:px-8 selection:bg-[#C8A253] selection:text-black flex flex-col justify-center items-center py-10">
      
      {/* Premium Editorial Card - Set a max height so it doesn't break out of the screen on desktop */}
      <div className="w-full max-w-[1100px] w-full bg-[#111] border border-zinc-800 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl md:max-h-[80vh]">
        
        {/* Left Side - Dark Aesthetic Image */}
        {/* Mobile pe height fixed (250px), desktop pe flex-1 (aadhi jagah) lega */}
        <div className="w-full md:w-1/2 h-[250px] sm:h-[300px] md:h-auto relative overflow-hidden group">
          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all duration-700 z-10"></div>
          <img 
            // Aap yahan koi premium speaker texture ya model ki photo laga sakte hain
            src="https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=800&q=80" 
            alt="Premium Audio Texture" 
            className="w-full h-full object-cover transform transition-transform duration-[10s] group-hover:scale-110"
          />
        </div>

        {/* Right Side - Content & Form */}
        {/* Isme overflow-y-auto lagaya hai incase desktop screen bohot chhoti ho */}
        <div className="w-full md:w-1/2 p-6 sm:p-10 md:p-12 lg:p-16 flex flex-col justify-center relative overflow-y-auto">
          
          {/* Subtle glow effect behind text */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C8A253] opacity-5 blur-[100px] pointer-events-none"></div>

          <div className="relative z-10 w-full">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <Mail className="w-4 h-4 text-[#C8A253]" />
              <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#C8A253]">
                The Inner Circle
              </span>
            </div>

            {/* Typography scale for different screens */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-white mb-3 sm:mb-4 leading-tight">
              Elevate Your <br />
              <span className="italic text-[#C8A253]">Everyday.</span>
            </h2>
            
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-8 max-w-sm">
              Become a Truee insider. Gain early access to limited releases, private sales, and curated tech stories delivered straight to your inbox.
            </p>

            {isSubmitted ? (
              <div className="bg-[#1a1a1a] border border-[#C8A253]/30 rounded-lg p-6 text-center animate-in fade-in slide-in-from-bottom-4">
                <p className="text-[#C8A253] font-serif italic text-xl mb-2">Welcome to the Club.</p>
                <p className="text-zinc-500 text-xs uppercase tracking-widest">Your premium journey begins now.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5 sm:gap-6">
                
                {/* Floating Label Input */}
                <div className="relative">
                  <input
                    type="email"
                    id="newsletter-email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder=" "
                    className="peer w-full bg-transparent border-b border-zinc-700 py-3 text-white text-sm focus:outline-none focus:border-[#C8A253] transition-colors duration-300 placeholder-transparent"
                  />
                  <label
                    htmlFor="newsletter-email"
                    className="absolute left-0 top-3 text-xs font-medium tracking-wider text-zinc-500 uppercase transition-all duration-300 cursor-text peer-placeholder-shown:top-3 peer-placeholder-shown:text-xs peer-placeholder-shown:text-zinc-600 peer-focus:-top-3 peer-focus:text-[10px] peer-focus:text-[#C8A253] peer-[&:not(:placeholder-shown)]:-top-3 peer-[&:not(:placeholder-shown)]:text-[10px] peer-[&:not(:placeholder-shown)]:text-[#C8A253]"
                  >
                    Email Address
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#C8A253] hover:bg-white text-black font-black py-3.5 sm:py-4 text-[11px] uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-3 group rounded-sm shadow-[0_0_20px_rgba(200,162,83,0.15)] hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                >
                  Subscribe Now
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

              </form>
            )}
            
            <p className="text-[9px] sm:text-[10px] text-zinc-600 mt-5 sm:mt-6 text-center md:text-left">
              By subscribing, you agree to our Privacy Policy and Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
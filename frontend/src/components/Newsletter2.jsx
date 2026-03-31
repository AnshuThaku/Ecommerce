// import React, { useState } from 'react';
// import { ArrowRight, Mail, X } from 'lucide-react';

// export default function Newsletter() {
//   const [email, setEmail] = useState('');
//   const [isSubmitted, setIsSubmitted] = useState(false);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (email) {
//       setIsSubmitted(true);
//       setTimeout(() => {
//         setIsSubmitted(false);
//         setEmail('');
//       }, 4000);
//     }
//   };

//   return (
//     // ⚡ THEME UPDATE: bg-theme-bg-dark and selection colors
//     <section className="w-full overflow-x-hidden bg-theme-bg-dark min-h-screen px-4 sm:px-6 lg:px-8 selection:bg-theme-primary selection:text-theme-text-light flex flex-col justify-center items-center py-10 transition-colors duration-500">      
      
//       {/* Premium Editorial Card */}
//       <div className="w-full max-w-[1100px] bg-theme-bg-dark border border-zinc-800 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl md:max-h-[80vh] transition-colors duration-500">
        
//         {/* Left Side - Image (Layout Intact) */}
//         <div className="w-full md:w-1/2 h-[250px] sm:h-[300px] md:h-auto relative overflow-hidden group">
//           <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all duration-700 z-10"></div>
//           <img 
//             src="https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=800&q=80" 
//             alt="Premium Audio Texture" 
//             className="w-full h-full object-cover transform transition-transform duration-[10s] group-hover:scale-110"
//           />
//         </div>

//         {/* Right Side - Content & Form */}
//         <div className="w-full md:w-1/2 p-6 sm:p-10 md:p-12 lg:p-16 flex flex-col justify-center relative overflow-y-auto">
          
//           {/* Subtle glow effect ⚡ THEME UPDATE: color matches theme-primary */}
//           <div 
//             className="absolute top-0 right-0 w-64 h-64 opacity-5 blur-[100px] pointer-events-none transition-colors duration-500"
//             style={{ backgroundColor: 'var(--theme-primary)' }}
//           ></div>

//           <div className="relative z-10 w-full">
//             <div className="flex items-center gap-3 mb-4 sm:mb-6">
//               {/* ⚡ THEME UPDATE: text-theme-primary */}
//               <Mail className="w-4 h-4 text-theme-primary" />
//               <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-theme-primary">
//                 The Inner Circle
//               </span>
//             </div>

//             <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-theme-text-light mb-3 sm:mb-4 leading-tight">
//               Elevate Your <br />
//               {/* ⚡ THEME UPDATE: italic accent color */}
//               <span className="italic text-theme-primary">Everyday.</span>
//             </h2>
            
//             <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-8 max-w-sm">
//               Become a Truee insider. Gain early access to limited releases, private sales, and curated tech stories delivered straight to your inbox.
//             </p>

//             {isSubmitted ? (
//               // Success Message ⚡ THEME UPDATE: colors synced
//               <div className="bg-zinc-900/50 border border-theme-primary/30 rounded-lg p-6 text-center animate-in fade-in slide-in-from-bottom-4 transition-all duration-500">
//                 <p className="text-theme-primary font-serif italic text-xl mb-2">Welcome to the Club.</p>
//                 <p className="text-zinc-500 text-xs uppercase tracking-widest">Your premium journey begins now.</p>
//               </div>
//             ) : (
//               <form onSubmit={handleSubmit} className="flex flex-col gap-5 sm:gap-6">
                
//                 {/* Floating Label Input */}
//                 <div className="relative">
//                   <input
//                     type="email"
//                     id="newsletter-email"
//                     required
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     placeholder=" "
//                     // ⚡ THEME UPDATE: focus border color
//                     className="peer w-full bg-transparent border-b border-zinc-700 py-3 text-white text-sm focus:outline-none focus:border-theme-primary transition-colors duration-300 placeholder-transparent"
//                   />
//                   <label
//                     htmlFor="newsletter-email"
//                     // ⚡ THEME UPDATE: floating label focus color
//                     className="absolute left-0 top-3 text-xs font-medium tracking-wider text-zinc-500 uppercase transition-all duration-300 cursor-text peer-placeholder-shown:top-3 peer-placeholder-shown:text-xs peer-placeholder-shown:text-zinc-600 peer-focus:-top-3 peer-focus:text-[10px] peer-focus:text-theme-primary peer-[&:not(:placeholder-shown)]:-top-3 peer-[&:not(:placeholder-shown)]:text-[10px] peer-[&:not(:placeholder-shown)]:text-theme-primary"
//                   >
//                     Email Address
//                   </label>
//                 </div>

//                 <button
//                   type="submit"
//                   // ⚡ THEME UPDATE: Button colors synced with theme-primary
//                   className="w-full bg-theme-primary hover:bg-white text-black font-black py-3.5 sm:py-4 text-[11px] uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-3 group rounded-sm shadow-[0_0_20px_rgba(var(--theme-primary-rgb),0.15)] hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
//                 >
//                   Subscribe Now
//                   <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
//                 </button>

//               </form>
//             )}
            
//             <p className="text-[9px] sm:text-[10px] text-zinc-600 mt-5 sm:mt-6 text-center md:text-left">
//               By subscribing, you agree to our Privacy Policy and Terms of Service.
//             </p>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }


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
    <section className="w-full overflow-x-hidden bg-[var(--theme-bg-dark)] min-h-screen px-4 sm:px-6 lg:px-8 selection:bg-[var(--theme-primary)] selection:text-[var(--theme-text-light)] flex flex-col justify-center items-center py-10 transition-colors duration-500">      
      
      <div className="w-full max-w-[1100px] bg-[var(--theme-bg-dark)] border border-zinc-800 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl md:max-h-[80vh] transition-colors duration-500">
        
        {/* Left Side - Image */}
        <div className="w-full md:w-1/2 h-[250px] sm:h-[300px] md:h-auto relative overflow-hidden group">
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
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <Mail className="w-4 h-4 text-[var(--theme-primary)]" />
              <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[var(--theme-primary)]">
                The Inner Circle
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[var(--theme-text-light)] mb-3 sm:mb-4 leading-tight">
              Elevate Your <br />
              <span className="italic text-[var(--theme-primary)]">Everyday.</span>
            </h2>
            
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-8 max-w-sm">
              Become a Truee insider. Gain early access to limited releases and curated tech stories.
            </p>

            {isSubmitted ? (
              <div className="bg-zinc-900/50 border border-[var(--theme-primary)]/30 rounded-lg p-6 text-center animate-in fade-in transition-all">
                <p className="text-[var(--theme-primary)] font-serif italic text-xl mb-2">Welcome to the Club.</p>
                <p className="text-zinc-500 text-xs uppercase tracking-widest">Your premium journey begins now.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5 sm:gap-6">
                <div className="relative">
                  <input
                    type="email"
                    id="newsletter-email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder=" "
                    className="peer w-full bg-transparent border-b border-zinc-700 py-3 text-white text-sm focus:outline-none focus:border-[var(--theme-primary)] transition-colors duration-300 placeholder-transparent"
                  />
                  <label
                    htmlFor="newsletter-email"
                    className="absolute left-0 top-3 text-xs font-medium tracking-wider text-zinc-500 uppercase transition-all duration-300 peer-focus:-top-3 peer-focus:text-[10px] peer-focus:text-[var(--theme-primary)] peer-[&:not(:placeholder-shown)]:-top-3 peer-[&:not(:placeholder-shown)]:text-[var(--theme-primary)]"
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
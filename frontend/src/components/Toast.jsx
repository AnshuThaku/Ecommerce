import React, { useEffect, useState } from 'react';

const ICONS = {
  error: (
    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  success: (
    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    </svg>
  )
};

const STYLES = {
  error:   'border-red-500/40 bg-red-500/10 text-red-400',
  success: 'border-[#C8A253]/40 bg-[#C8A253]/10 text-[#C8A253]',
  warning: 'border-yellow-500/40 bg-yellow-500/10 text-yellow-400'
};

const BAR_STYLES = {
  error:   'bg-red-500',
  success: 'bg-[#C8A253]',
  warning: 'bg-yellow-500'
};

/**
 * Usage:
 *   const [toast, setToast] = useState(null);
 *   setToast({ type: 'error'|'success'|'warning', message: 'Your message' });
 *   <Toast toast={toast} onClose={() => setToast(null)} />
 */
const Toast = ({ toast, onClose, duration = 4000 }) => {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!toast) return;
    setLeaving(false);
    setVisible(true);

    const hide = setTimeout(() => {
      setLeaving(true);
      setTimeout(() => { setVisible(false); onClose?.(); }, 400);
    }, duration);

    return () => clearTimeout(hide);
  }, [toast]);

  if (!visible || !toast) return null;

  return (
    <div className="fixed top-5 right-5 z-50 w-full max-w-sm">
      <div
        className={`relative flex items-start gap-3 px-4 py-3.5 rounded-xl border shadow-2xl overflow-hidden
          transition-all duration-400
          ${STYLES[toast.type] || STYLES.error}
          ${leaving ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}
        `}
        style={{ transition: 'opacity 0.4s ease, transform 0.4s ease' }}
      >
        {/* Icon */}
        <span className="mt-0.5">{ICONS[toast.type] || ICONS.error}</span>

        {/* Message */}
        <p className="text-sm leading-snug flex-1">{toast.message}</p>

        {/* Close button */}
        <button
          onClick={() => { setLeaving(true); setTimeout(() => { setVisible(false); onClose?.(); }, 400); }}
          className="ml-auto opacity-60 hover:opacity-100 transition-opacity"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Auto-dismiss progress bar */}
        <div
          className={`absolute bottom-0 left-0 h-0.5 ${BAR_STYLES[toast.type] || BAR_STYLES.error}`}
          style={{ animation: `shrink ${duration}ms linear forwards` }}
        />
      </div>

      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default Toast;

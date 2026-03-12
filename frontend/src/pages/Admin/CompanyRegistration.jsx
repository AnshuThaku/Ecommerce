import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Toast from '../../components/Toast';

const STEPS = ['Core Details', 'Tax Info', 'Address', 'Bank Details', 'Founder'];

const Field = ({ label, ...props }) => (
  <div className="relative group cursor-text">
    <input
      {...props}
      id={props.name}
      placeholder=" "
      className="peer w-full bg-transparent border border-zinc-700 rounded-lg px-4 pt-5 pb-2 text-white text-sm focus:outline-none focus:border-[#C8A253] transition-all duration-300 placeholder-transparent cursor-text"
    />
    <label htmlFor={props.name} className="absolute left-4 top-2 text-[10px] font-semibold tracking-widest text-[#C8A253] uppercase transition-all duration-300 cursor-text peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-zinc-500 peer-placeholder-shown:font-normal peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-[10px] peer-focus:font-semibold peer-focus:tracking-widest peer-focus:text-[#C8A253]">
      {label}
    </label>
  </div>
);

const CompanySetup = () => {
  const [step, setStep] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState('forward');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const navigateTo = useNavigate();

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => navigateTo('/login'), 2000);
      return () => clearTimeout(timer);
    }
  }, [submitted]);

  const [formData, setFormData] = useState({
    companyName: '',
    brandName: 'Truee Luxury',
    contactEmail: '',
    contactPhone: '',
    taxDetails: { gstNumber: '', panNumber: '' },
    registeredAddress: { street: '', city: '', state: '', pincode: '', country: 'India' },
    bankDetails: { accountHolderName: '', accountNumber: '', ifscCode: '', bankName: '', branch: '' },
    founders: [{ name: '', email: '', phone: '', designation: 'Founder' }]
  });

  const handleBasicChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleNestedChange = (e, section) =>
    setFormData({ ...formData, [section]: { ...formData[section], [e.target.name]: e.target.value } });

  const handleFounderChange = (e) => {
    const updated = [...formData.founders];
    updated[0] = { ...updated[0], [e.target.name]: e.target.value };
    setFormData({ ...formData, founders: updated });
  };

  const navigate = (dir) => {
    if (animating) return;
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => {
      setStep((s) => (dir === 'forward' ? s + 1 : s - 1));
      setAnimating(false);
    }, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('/api/company/register', formData);
      if (response.data.success) setSubmitted(true);
    } catch (error) {
      console.error('Error saving company:', error.response?.data || error.message);
      setToast({ type: 'error', message: error.response?.data?.error || 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "peer w-full bg-transparent border border-zinc-700 rounded-lg px-4 pt-5 pb-2 text-white text-sm focus:outline-none focus:border-[#C8A253] transition-all duration-300";

  const stepContent = [
    /* Step 0: Core Details */
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Field label="Registered Company Name *" name="companyName" type="text" value={formData.companyName} onChange={handleBasicChange} required />
      <Field label="Brand Name" name="brandName" type="text" value={formData.brandName} onChange={handleBasicChange} />
      <Field label="Official Email *" name="contactEmail" type="email" value={formData.contactEmail} onChange={handleBasicChange} required />
      <Field label="Contact Phone *" name="contactPhone" type="text" value={formData.contactPhone} onChange={handleBasicChange} required />
    </div>,

    /* Step 1: Tax Info */
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Field label="GST Number *" name="gstNumber" type="text" value={formData.taxDetails.gstNumber} onChange={(e) => handleNestedChange(e, 'taxDetails')} required />
      <Field label="PAN Number *" name="panNumber" type="text" value={formData.taxDetails.panNumber} onChange={(e) => handleNestedChange(e, 'taxDetails')} required />
    </div>,

    /* Step 2: Address */
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div className="md:col-span-2">
        <Field label="Street Address *" name="street" type="text" value={formData.registeredAddress.street} onChange={(e) => handleNestedChange(e, 'registeredAddress')} required />
      </div>
      <Field label="City *" name="city" type="text" value={formData.registeredAddress.city} onChange={(e) => handleNestedChange(e, 'registeredAddress')} required />
      <Field label="State *" name="state" type="text" value={formData.registeredAddress.state} onChange={(e) => handleNestedChange(e, 'registeredAddress')} required />
      <Field label="Pincode *" name="pincode" type="text" value={formData.registeredAddress.pincode} onChange={(e) => handleNestedChange(e, 'registeredAddress')} required />
      <div className="relative">
        <input name="country" value={formData.registeredAddress.country} readOnly className={`${inputClass} cursor-not-allowed opacity-50`} placeholder=" " />
        <label className="absolute left-4 top-2 text-[10px] font-semibold tracking-widest text-[#C8A253] uppercase">Country</label>
      </div>
    </div>,

    /* Step 3: Bank Details */
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Field label="Account Holder Name *" name="accountHolderName" type="text" value={formData.bankDetails.accountHolderName} onChange={(e) => handleNestedChange(e, 'bankDetails')} required />
      <Field label="Account Number *" name="accountNumber" type="text" value={formData.bankDetails.accountNumber} onChange={(e) => handleNestedChange(e, 'bankDetails')} required />
      <Field label="IFSC Code *" name="ifscCode" type="text" value={formData.bankDetails.ifscCode} onChange={(e) => handleNestedChange(e, 'bankDetails')} required />
      <Field label="Bank Name *" name="bankName" type="text" value={formData.bankDetails.bankName} onChange={(e) => handleNestedChange(e, 'bankDetails')} required />
      <div className="md:col-span-2">
        <Field label="Branch Name" name="branch" type="text" value={formData.bankDetails.branch} onChange={(e) => handleNestedChange(e, 'bankDetails')} />
      </div>
    </div>,

    /* Step 4: Founder */
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <Field label="Full Name *" name="name" type="text" value={formData.founders[0].name} onChange={handleFounderChange} required />
      <Field label="Email Address" name="email" type="email" value={formData.founders[0].email} onChange={handleFounderChange} />
      <Field label="Phone Number" name="phone" type="text" value={formData.founders[0].phone} onChange={handleFounderChange} />
    </div>
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
        <div className="text-center animate-fade-in">
          <div className="w-20 h-20 rounded-full border-2 border-[#C8A253] flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-[#C8A253]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-serif text-white mb-2">Profile Created</h2>
          <p className="text-zinc-400 text-sm tracking-widest uppercase">Company successfully registered</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4 py-12">
      <Toast toast={toast} onClose={() => setToast(null)} />
      <div className="w-full max-w-2xl">

        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-[#C8A253] text-xs tracking-[0.4em] uppercase mb-3">Super Admin</p>
          <h1 className="text-4xl font-serif text-white">Initialize <span className="text-[#C8A253]">Company Profile</span></h1>
          <p className="text-zinc-500 text-sm mt-2">Complete all steps to register your organization</p>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-center gap-0 mb-10">
          {STEPS.map((label, i) => (
            <React.Fragment key={i}>
              <div className="flex flex-col items-center gap-1.5">
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                  i < step ? 'bg-[#C8A253] border-[#C8A253] text-[#0A0A0A]'
                  : i === step ? 'border-[#C8A253] text-[#C8A253] shadow-[0_0_12px_rgba(200,162,83,0.4)]'
                  : 'border-zinc-700 text-zinc-600'
                }`}>
                  {i < step ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : i + 1}
                </div>
                <span className={`text-[9px] tracking-widest uppercase hidden sm:block transition-colors duration-300 ${i === step ? 'text-[#C8A253]' : i < step ? 'text-zinc-400' : 'text-zinc-700'}`}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-px w-10 sm:w-14 mx-1 mb-5 transition-all duration-500 ${i < step ? 'bg-[#C8A253]' : 'bg-zinc-800'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Card */}
        <form onSubmit={step === STEPS.length - 1 ? handleSubmit : (e) => { e.preventDefault(); navigate('forward'); }}>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl overflow-hidden">

            {/* Step Title */}
            <div className="mb-7">
              <h2 className="text-lg font-semibold text-white">{STEPS[step]}</h2>
              <div className="h-px bg-zinc-800 mt-3 relative">
                <div
                  className="absolute top-0 left-0 h-px bg-[#C8A253] transition-all duration-500"
                  style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Animated Step Content */}
            <div
              className="transition-all duration-300"
              style={{
                opacity: animating ? 0 : 1,
                transform: animating
                  ? direction === 'forward' ? 'translateX(-24px)' : 'translateX(24px)'
                  : 'translateX(0)'
              }}
            >
              {stepContent[step]}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6 gap-4">
            <button
              type="button"
              onClick={() => navigate('back')}
              disabled={step === 0}
              className="flex-1 py-3 rounded-xl border border-zinc-700 text-zinc-400 text-sm font-medium tracking-wide hover:border-zinc-500 hover:text-white transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed"
            >
              Back
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-[#C8A253] text-[#0A0A0A] text-sm font-bold tracking-widest uppercase hover:bg-[#d4af6b] active:scale-95 transition-all duration-300 shadow-[0_4px_24px_rgba(200,162,83,0.25)] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Saving...
                </span>
              ) : step === STEPS.length - 1 ? 'Register Company' : 'Continue'}
            </button>
          </div>

          {/* Step Counter */}
          <p className="text-center text-zinc-700 text-xs mt-4 tracking-widest">
            STEP {step + 1} OF {STEPS.length}
          </p>
        </form>
      </div>
    </div>
  );
};

export default CompanySetup;
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DhanRajLogo } from './DhanRajLogo';
import { Headphones, Phone, ShieldCheck } from 'lucide-react';

export const PhoneLoginScreen: React.FC = () => {
  const { loginWithPhone, setActiveScreen, tempPhone, setTempPhone } = useApp();
  const [phone, setPhone] = useState(tempPhone || '7231001800');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }
    setIsLoading(true);
    setTempPhone(phone);
    setTimeout(() => {
      setIsLoading(false);
      loginWithPhone(phone);
    }, 600);
  };

  return (
    <div className="min-h-full flex flex-col justify-between bg-gradient-to-b from-[#6b0028] via-[#850533] to-[#50001e] text-white">
      {/* Top Header with Support Button */}
      <div className="pt-6 px-6 flex justify-end items-center">
        <button
          onClick={() => setActiveScreen('support')}
          className="flex items-center gap-1.5 bg-white text-neutral-900 px-4 py-1.5 rounded-full text-sm font-semibold shadow-md active:scale-95 transition-transform"
        >
          <Headphones size={18} className="text-[#6b0028]" />
          <span>Support</span>
        </button>
      </div>

      {/* Main Content Card Container */}
      <div className="mt-8 px-4 flex-1 flex flex-col justify-center">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl text-neutral-800 border border-neutral-100 max-w-md mx-auto w-full">
          {/* Logo */}
          <div className="flex justify-center -mt-2 mb-4">
            <DhanRajLogo size={100} />
          </div>

          <h2 className="text-xl font-bold text-center text-neutral-800 mb-6 tracking-wide">
            Setup your Account
          </h2>

          <form onSubmit={handleSignIn} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-2">
                Phone Number
              </label>
              <div className="flex items-center border border-neutral-300 rounded-xl px-3 py-3 bg-white focus-within:border-[#6b0028] focus-within:ring-2 focus-within:ring-[#6b0028]/20 transition-all">
                {/* Phone icon inside green circle */}
                <div className="w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center mr-2.5 text-emerald-600">
                  <Phone size={17} className="stroke-[2.5]" />
                </div>
                <span className="font-semibold text-neutral-800 mr-2 text-base">+91</span>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 10-digit number"
                  className="w-full bg-transparent outline-none font-semibold text-neutral-900 text-lg tracking-wider"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || phone.length < 10}
              className="w-full bg-[#6b0028] hover:bg-[#580021] text-white py-3.5 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Preset switch for testing existing vs new user */}
          <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
            <span>Demo: Girish (7231001800)</span>
            <button
              type="button"
              onClick={() => {
                const randomPhone = '98' + Math.floor(10000000 + Math.random() * 90000000);
                setPhone(randomPhone);
              }}
              className="text-[#6b0028] font-semibold underline"
            >
              Use New Number
            </button>
          </div>
        </div>
      </div>

      {/* Footer: Trusted by 1 Lakh Users */}
      <div className="py-8 flex items-center justify-center gap-2 text-white/90 text-sm font-medium">
        <ShieldCheck size={18} className="text-emerald-400" />
        <span>Trusted by more than 1 Lakh Users</span>
      </div>
    </div>
  );
};

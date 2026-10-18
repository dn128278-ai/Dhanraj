import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, ShieldCheck } from 'lucide-react';

export const ProfileSetupScreen: React.FC = () => {
  const { setActiveScreen, tempName, setTempName } = useApp();
  const [name, setName] = useState(tempName || 'Girish');
  const [error, setError] = useState('');

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }
    setTempName(name.trim());
    setActiveScreen('create_mpin');
  };

  return (
    <div className="min-h-full flex flex-col justify-between bg-gradient-to-b from-[#6b0028] via-[#850533] to-[#50001e] text-white">
      {/* Top Banner Header */}
      <div className="pt-12 px-6">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Welcome To <span className="italic font-serif font-black underline decoration-amber-400">Dhan Raj</span>
        </h1>
        <p className="mt-2 text-white/85 text-sm font-medium">
          India's best Satta Matka Application welcomes you!!!
        </p>
      </div>

      {/* Main Card Container */}
      <div className="mt-8 px-4 flex-1 flex flex-col justify-center">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl text-neutral-800 border border-neutral-100 max-w-md mx-auto w-full">
          <form onSubmit={handleNext} className="space-y-6">
            <div>
              <div className="flex items-center border border-neutral-300 rounded-xl px-4 py-3.5 bg-white focus-within:border-[#6b0028] focus-within:ring-2 focus-within:ring-[#6b0028]/20 transition-all">
                <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center mr-3 text-neutral-700">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Enter Full Name."
                  className="w-full bg-transparent outline-none font-semibold text-neutral-900 text-base"
                  autoFocus
                  required
                />
              </div>
              {error && <p className="text-xs text-rose-600 mt-1.5 ml-1 font-medium">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-[#6b0028] hover:bg-[#580021] text-white py-3.5 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl active:scale-[0.98] transition-all"
            >
              Next
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="py-8 flex items-center justify-center gap-2 text-white/90 text-sm font-medium">
        <ShieldCheck size={18} className="text-emerald-400" />
        <span>Trusted by more than 1 Lakh Users</span>
      </div>
    </div>
  );
};

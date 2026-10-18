import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Delete, ArrowLeft } from 'lucide-react';

export const MpinLoginScreen: React.FC = () => {
  const { loginWithMpin, setActiveScreen, user } = useApp();
  const [mpin, setMpin] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleKeyPress = (num: string) => {
    setError('');
    if (mpin.length < 4) {
      const next = mpin + num;
      setMpin(next);
      if (next.length === 4) {
        // Auto-validate on 4th digit
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
          const ok = loginWithMpin(next);
          if (!ok) {
            setError('Invalid mPIN. Please check and try again.');
            setMpin('');
          }
        }, 300);
      }
    }
  };

  const handleDelete = () => {
    setError('');
    setMpin(mpin.slice(0, -1));
  };

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (mpin.length !== 4) return;
    setError('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const ok = loginWithMpin(mpin);
      if (!ok) {
        setError('Invalid mPIN. Please check and try again.');
        setMpin('');
      }
    }, 300);
  };

  return (
    <div className="min-h-full flex flex-col justify-between bg-gradient-to-b from-[#6b0028] via-[#850533] to-[#50001e] text-white">
      {/* Top Header with Back button */}
      <div className="pt-8 px-6 flex items-center justify-between">
        <button
          onClick={() => setActiveScreen('phone_login')}
          className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-3xl font-extrabold italic tracking-wider font-serif pr-7">
          Dhan Raj
        </h1>
        <div />
      </div>

      {/* Main White Card */}
      <div className="mt-4 px-4 flex-1 flex flex-col justify-center">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl text-neutral-800 border border-neutral-100 max-w-md mx-auto w-full">
          <h2 className="text-center text-lg font-bold text-neutral-800 mb-6">
            Enter your mPIN
          </h2>

          {/* 4 Digit Boxes */}
          <div className="flex justify-center gap-3.5 mb-6">
            {[0, 1, 2, 3].map((idx) => {
              const char = mpin[idx];
              const isCurrent = idx === mpin.length;
              return (
                <div
                  key={`box-${idx}`}
                  className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center font-bold text-2xl transition-all ${
                    isCurrent
                      ? 'border-[#6b0028] bg-rose-50/50 shadow-md ring-2 ring-[#6b0028]/20'
                      : char
                      ? 'border-neutral-700 bg-neutral-50 text-neutral-900'
                      : 'border-neutral-300 bg-white'
                  }`}
                >
                  {char ? (
                    <span className="text-neutral-900 font-bold">{char}</span>
                  ) : isCurrent ? (
                    <span className="w-0.5 h-6 bg-[#6b0028] animate-pulse" />
                  ) : null}
                </div>
              );
            })}
          </div>

          {error && (
            <p className="text-center text-xs text-rose-600 font-semibold mb-4 bg-rose-50 py-2 rounded-lg border border-rose-200">
              {error}
            </p>
          )}

          <button
            onClick={() => handleLogin()}
            disabled={isLoading || mpin.length < 4}
            className="w-full bg-[#6b0028] hover:bg-[#580021] text-white py-3.5 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Login'
            )}
          </button>

          <div className="text-center mt-5">
            <button
              onClick={() => {
                alert(`Your mPIN is ${user?.mpin || '1234'} for phone ${user?.phone || '7231001800'}`);
              }}
              className="text-xs text-neutral-600 font-semibold hover:text-[#6b0028] hover:underline"
            >
              Forgot MPIN?
            </button>
          </div>
        </div>
      </div>

      {/* Numeric Keypad */}
      <div className="bg-neutral-900/90 backdrop-blur-md px-6 pt-4 pb-6 border-t border-neutral-800">
        <div className="max-w-xs mx-auto grid grid-cols-3 gap-y-3 gap-x-6 text-center">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleKeyPress(digit)}
              className="h-14 flex items-center justify-center rounded-2xl bg-neutral-800/80 active:bg-neutral-700 text-white font-medium text-2xl active:scale-95 transition"
            >
              {digit}
            </button>
          ))}
          <div />
          <button
            type="button"
            onClick={() => handleKeyPress('0')}
            className="h-14 flex items-center justify-center rounded-2xl bg-neutral-800/80 active:bg-neutral-700 text-white font-medium text-2xl active:scale-95 transition"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="h-14 flex items-center justify-center rounded-2xl bg-neutral-800/80 active:bg-neutral-700 text-neutral-300 active:scale-95 transition"
          >
            <Delete size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

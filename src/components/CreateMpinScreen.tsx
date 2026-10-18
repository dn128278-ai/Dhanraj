import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Delete } from 'lucide-react';

export const CreateMpinScreen: React.FC = () => {
  const { completeRegistration, tempName } = useApp();
  const [mpin, setMpin] = useState<string>('');
  const [confirmMpin, setConfirmMpin] = useState<string>('');
  const [activeTarget, setActiveTarget] = useState<'mpin' | 'confirm'>('mpin');
  const [error, setError] = useState<string>('');

  const handleKeyPress = (num: string) => {
    setError('');
    if (activeTarget === 'mpin') {
      if (mpin.length < 4) {
        const next = mpin + num;
        setMpin(next);
        if (next.length === 4) {
          setActiveTarget('confirm');
        }
      }
    } else {
      if (confirmMpin.length < 4) {
        const next = confirmMpin + num;
        setConfirmMpin(next);
        if (next.length === 4) {
          // Check if match
          if (mpin === next) {
            completeRegistration(tempName, mpin);
          } else {
            setError('mPIN does not match! Please try again.');
          }
        }
      }
    }
  };

  const handleDelete = () => {
    setError('');
    if (activeTarget === 'confirm') {
      if (confirmMpin.length > 0) {
        setConfirmMpin(confirmMpin.slice(0, -1));
      } else {
        setActiveTarget('mpin');
        setMpin(mpin.slice(0, -1));
      }
    } else {
      setMpin(mpin.slice(0, -1));
    }
  };

  const handleManualSubmit = () => {
    if (mpin.length !== 4) {
      setError('Please enter a 4-digit mPIN');
      return;
    }
    if (confirmMpin.length !== 4) {
      setError('Please confirm your 4-digit mPIN');
      return;
    }
    if (mpin !== confirmMpin) {
      setError('mPIN does not match! Please try again.');
      return;
    }
    completeRegistration(tempName, mpin);
  };

  return (
    <div className="min-h-full flex flex-col justify-between bg-gradient-to-b from-[#6b0028] via-[#850533] to-[#50001e] text-white">
      {/* Top Header */}
      <div className="pt-10 px-6 text-center">
        <h1 className="text-3xl font-extrabold italic tracking-wider font-serif">
          Dhan Raj
        </h1>
      </div>

      {/* Main White Card */}
      <div className="mt-4 px-4 flex-1 flex flex-col justify-center">
        <div className="bg-white rounded-3xl p-6 shadow-2xl text-neutral-800 border border-neutral-100 max-w-md mx-auto w-full">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-neutral-900">Create your mPIN</h2>
            <p className="text-xs text-neutral-500 mt-1">
              You can login using this mPIN for next time
            </p>
          </div>

          {/* Enter your mPin */}
          <div className="mb-5">
            <label
              onClick={() => setActiveTarget('mpin')}
              className={`block text-center text-sm font-semibold mb-2.5 cursor-pointer ${
                activeTarget === 'mpin' ? 'text-[#6b0028]' : 'text-neutral-600'
              }`}
            >
              Enter your mPin
            </label>
            <div
              onClick={() => setActiveTarget('mpin')}
              className="flex justify-center gap-3 cursor-pointer"
            >
              {[0, 1, 2, 3].map((idx) => {
                const filled = idx < mpin.length;
                const isCurrent = activeTarget === 'mpin' && idx === mpin.length;
                return (
                  <div
                    key={`mpin-${idx}`}
                    className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all ${
                      isCurrent
                        ? 'border-[#6b0028] bg-rose-50/50 shadow-sm'
                        : filled
                        ? 'border-neutral-700 bg-neutral-900 text-white'
                        : 'border-neutral-300 bg-white'
                    }`}
                  >
                    {filled ? (
                      <div className="w-4 h-4 rounded-full bg-white" />
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Confirm mPin */}
          <div className="mb-4">
            <label
              onClick={() => setActiveTarget('confirm')}
              className={`block text-center text-sm font-semibold mb-2.5 cursor-pointer ${
                activeTarget === 'confirm' ? 'text-[#6b0028]' : 'text-neutral-600'
              }`}
            >
              Confirm mPin
            </label>
            <div
              onClick={() => setActiveTarget('confirm')}
              className="flex justify-center gap-3 cursor-pointer"
            >
              {[0, 1, 2, 3].map((idx) => {
                const filled = idx < confirmMpin.length;
                const isCurrent = activeTarget === 'confirm' && idx === confirmMpin.length;
                return (
                  <div
                    key={`confirm-${idx}`}
                    className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all ${
                      isCurrent
                        ? 'border-[#6b0028] bg-rose-50/50 shadow-sm'
                        : filled
                        ? 'border-neutral-700 bg-neutral-900 text-white'
                        : 'border-neutral-300 bg-white'
                    }`}
                  >
                    {filled ? (
                      <div className="w-4 h-4 rounded-full bg-white" />
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>

          {error && (
            <p className="text-center text-xs text-rose-600 font-semibold mb-3">
              {error}
            </p>
          )}

          {/* Submit button if needed */}
          {mpin.length === 4 && confirmMpin.length === 4 && (
            <button
              onClick={handleManualSubmit}
              className="w-full mt-2 bg-[#6b0028] text-white py-3 rounded-xl font-semibold text-sm shadow active:scale-98 transition"
            >
              Create mPIN & Continue
            </button>
          )}
        </div>
      </div>

      {/* Modern Numeric Keypad */}
      <div className="bg-neutral-900/90 backdrop-blur-md px-6 pt-4 pb-6 border-t border-neutral-800">
        <div className="max-w-xs mx-auto grid grid-cols-3 gap-y-3 gap-x-6 text-center">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleKeyPress(digit)}
              className="h-14 flex flex-col items-center justify-center rounded-2xl bg-neutral-800/80 active:bg-neutral-700 text-white font-medium text-2xl active:scale-95 transition"
            >
              <span>{digit}</span>
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

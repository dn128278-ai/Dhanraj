import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Market, Bid } from '../types';
import { X, CheckCircle, AlertCircle, Coins } from 'lucide-react';
import confetti from 'canvas-confetti';

export const BiddingModal: React.FC<{
  market: Market | null;
  onClose: () => void;
}> = ({ market, onClose }) => {
  const { user, placeBid, setActiveScreen } = useApp();
  const [gameType, setGameType] = useState<Bid['gameType']>('Single Digit');
  const [session, setSession] = useState<'Open' | 'Close'>('Open');
  const [digit, setDigit] = useState<string>('7');
  const [amount, setAmount] = useState<number>(100);
  const [error, setError] = useState<string>('');

  if (!market) return null;

  const gameRates: Partial<Record<Bid['gameType'], { rate: string; factor: number; placeholder: string; maxLen: number }>> = {
    'Single Digit': { rate: '10 Ka 95', factor: 9.5, placeholder: 'Enter Digit (0-9)', maxLen: 1 },
    'Jodi Digit': { rate: '10 Ka 950', factor: 95, placeholder: 'Enter Jodi (00-99)', maxLen: 2 },
    'Single Pana': { rate: '10 Ka 1,500', factor: 150, placeholder: 'Enter 3-digit Pana', maxLen: 3 },
    'Double Pana': { rate: '10 Ka 3,000', factor: 300, placeholder: 'Enter 3-digit Double Pana', maxLen: 3 },
    'Triple Pana': { rate: '10 Ka 7,000', factor: 700, placeholder: 'Enter 3-digit Triple Pana', maxLen: 3 },
    'Half Sangam': { rate: '10 Ka 10,000', factor: 1000, placeholder: 'Enter Digit + Pana', maxLen: 4 },
    'Full Sangam': { rate: '10 Ka 100,000', factor: 10000, placeholder: 'Open Pana + Close Pana', maxLen: 6 },
  };

  const handlePlaceBid = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!digit.trim()) {
      setError('Please enter your chosen bid number');
      return;
    }

    if (amount < 10) {
      setError('Minimum bid amount is ₹10');
      return;
    }

    if ((user?.balance || 0) < amount) {
      setError('Insufficient balance! Please add money to your wallet.');
      return;
    }

    const res = placeBid({
      marketId: market.id,
      marketName: market.name,
      gameType: gameType,
      session: gameType === 'Jodi Digit' || gameType === 'Full Sangam' ? 'Open' : session,
      number: digit.trim(),
      amount: amount,
      typeCategory: market.type,
    });

    if (res.success) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
      onClose();
    } else if (res.error) {
      setError(res.error);
    }
  };

  const currentRate = gameRates[gameType] || { rate: '10 Ka 95', factor: 9.5, placeholder: 'Enter Number', maxLen: 3 };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-neutral-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#6b0028] text-white px-5 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg">{market.name}</h3>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                Running
              </span>
            </div>
            <p className="text-xs text-rose-200">Close Bids: {market.closeBidsText}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Game Type Pills */}
          <div>
            <label className="block text-xs font-bold text-neutral-600 mb-2 uppercase tracking-wider">
              Select Game Type
            </label>
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {(Object.keys(gameRates) as Bid['gameType'][]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setGameType(type);
                    setDigit('');
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    gameType === type
                      ? 'bg-[#6b0028] text-white shadow-md'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Session (Open / Close) */}
          {gameType !== 'Jodi Digit' && gameType !== 'Full Sangam' && (
            <div>
              <label className="block text-xs font-bold text-neutral-600 mb-2 uppercase tracking-wider">
                Select Session
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSession('Open')}
                  className={`py-2 rounded-xl text-xs font-bold transition border ${
                    session === 'Open'
                      ? 'border-[#6b0028] bg-rose-50 text-[#6b0028]'
                      : 'border-neutral-200 text-neutral-600'
                  }`}
                >
                  Open Session
                </button>
                <button
                  type="button"
                  onClick={() => setSession('Close')}
                  className={`py-2 rounded-xl text-xs font-bold transition border ${
                    session === 'Close'
                      ? 'border-[#6b0028] bg-rose-50 text-[#6b0028]'
                      : 'border-neutral-200 text-neutral-600'
                  }`}
                >
                  Close Session
                </button>
              </div>
            </div>
          )}

          {/* Digit Selection Grid for Single Digit */}
          {gameType === 'Single Digit' ? (
            <div>
              <label className="block text-xs font-bold text-neutral-600 mb-2 uppercase tracking-wider">
                Choose Digit
              </label>
              <div className="grid grid-cols-5 gap-2.5">
                {['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDigit(d)}
                    className={`h-11 rounded-xl text-base font-bold transition-all border ${
                      digit === d
                        ? 'border-[#6b0028] bg-[#6b0028] text-white shadow-md scale-105'
                        : 'border-neutral-200 bg-neutral-50 text-neutral-800 hover:bg-neutral-100'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-neutral-600 mb-2 uppercase tracking-wider">
                Enter Number
              </label>
              <input
                type="text"
                maxLength={currentRate.maxLen}
                value={digit}
                onChange={(e) => setDigit(e.target.value.replace(/\D/g, ''))}
                placeholder={currentRate.placeholder}
                className="w-full border border-neutral-300 rounded-xl px-4 py-3 font-bold text-xl text-neutral-900 text-center tracking-widest focus:border-[#6b0028] focus:ring-2 focus:ring-[#6b0028]/20 outline-none"
              />
            </div>
          )}

          {/* Amount Input & Chips */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-neutral-600 uppercase tracking-wider">
                Bid Amount (₹)
              </label>
              <span className="text-xs text-[#6b0028] font-bold">
                Win Rate: {currentRate.rate}
              </span>
            </div>

            <div className="relative mb-2.5">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-neutral-500">₹</span>
              <input
                type="number"
                min={10}
                value={amount || ''}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="Enter amount"
                className="w-full border border-neutral-300 rounded-xl pl-9 pr-4 py-3 font-bold text-xl text-neutral-900 focus:border-[#6b0028] focus:ring-2 focus:ring-[#6b0028]/20 outline-none"
              />
            </div>

            {/* Quick chips */}
            <div className="flex gap-2">
              {[50, 100, 200, 500, 1000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAmount(preset)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition ${
                    amount === preset
                      ? 'bg-[#6b0028] text-white border-[#6b0028]'
                      : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  +{preset}
                </button>
              ))}
            </div>
          </div>

          {/* Potential Win Box */}
          <div className="bg-amber-50 rounded-xl p-3 border border-amber-200/80 flex items-center justify-between text-xs">
            <span className="text-amber-900 font-medium">Potential Payout:</span>
            <span className="text-[#6b0028] font-bold text-base">
              ₹{(amount * currentRate.factor).toLocaleString('en-IN')}
            </span>
          </div>

          {error && (
            <div className="flex items-center gap-1.5 p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Footer with Submit Button */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex items-center gap-3">
          <div className="flex-1">
            <div className="text-[11px] text-neutral-500">Wallet Balance</div>
            <div className="text-sm font-bold text-neutral-900">
              ₹{user?.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}
            </div>
          </div>

          {(user?.balance || 0) < amount ? (
            <button
              onClick={() => {
                onClose();
                setActiveScreen('add_fund');
              }}
              className="bg-emerald-600 text-white px-5 py-3 rounded-xl font-bold text-xs shadow hover:bg-emerald-700 transition"
            >
              Add Money
            </button>
          ) : (
            <button
              onClick={handlePlaceBid}
              disabled={!digit || amount <= 0}
              className="bg-[#6b0028] hover:bg-[#580021] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg active:scale-98 transition flex items-center gap-1.5 disabled:opacity-50"
            >
              <Coins size={16} />
              <span>Confirm Bid</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

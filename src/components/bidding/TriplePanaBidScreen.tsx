import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Market, BidItemEntry } from '../../types';
import { ArrowLeft, XCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

const TRIPLE_PANAS = ['000', '111', '222', '333', '444', '555', '666', '777', '888', '999'];

export const TriplePanaBidScreen: React.FC<{
  market: Market;
  onBack: () => void;
}> = ({ market, onBack }) => {
  const { biddingSession, placeBulkBid } = useApp();

  // Mode: Fix Number Mode vs Fix Amount Mode
  const [mode, setMode] = useState<'fix_number' | 'fix_amount'>('fix_number');

  // Fix Number inputs
  const [pointInputs, setPointInputs] = useState<Record<string, string>>({});

  // Fix Amount input
  const [fixPoints, setFixPoints] = useState<string>('10');

  // Summary table entries
  const [bidEntries, setBidEntries] = useState<BidItemEntry[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const leftPanas = ['000', '222', '444', '666', '888'];
  const rightPanas = ['111', '333', '555', '777', '999'];

  const handleAddFixNumber = () => {
    setErrorMsg('');
    const newItems: BidItemEntry[] = [];
    Object.entries(pointInputs).forEach(([pana, pts]) => {
      const p = parseInt(pts);
      if (p > 0) {
        newItems.push({ number: pana, points: p });
      }
    });

    if (newItems.length === 0) {
      setErrorMsg('Please enter points for at least one Triple Pana');
      return;
    }

    const updated = [...bidEntries];
    newItems.forEach((item) => {
      const existingIdx = updated.findIndex((b) => b.number === item.number);
      if (existingIdx >= 0) {
        updated[existingIdx].points = item.points;
      } else {
        updated.push(item);
      }
    });

    setBidEntries(updated);
    setPointInputs({});
  };

  // Fix Amount Mode button tap with inline duplicate warning
  const handlePanaClickFixAmount = (pana: string) => {
    setErrorMsg('');
    const pts = parseInt(fixPoints);
    if (!pts || pts <= 0) {
      setErrorMsg('Please enter points first');
      return;
    }

    const exists = bidEntries.some((b) => b.number === pana);
    if (exists) {
      setErrorMsg(`Number ${pana} already added!`);
      return;
    }

    setErrorMsg('');
    setBidEntries([...bidEntries, { number: pana, points: pts }]);
  };

  const handleDeleteItem = (index: number) => {
    setErrorMsg('');
    const updated = [...bidEntries];
    updated.splice(index, 1);
    setBidEntries(updated);
  };

  const handleDeleteAll = () => {
    setErrorMsg('');
    setBidEntries([]);
  };

  const totalPoints = bidEntries.reduce((sum, item) => sum + item.points, 0);

  const handleConfirm = () => {
    setErrorMsg('');
    if (bidEntries.length === 0) {
      setErrorMsg('Please add at least one bid number');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const res = placeBulkBid(market, 'Triple Pana', biddingSession, bidEntries);

      if (res.success) {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
        });
        setBidEntries([]);
        onBack();
      } else if (res.error) {
        setErrorMsg(res.error);
      }
    }, 400);
  };

  return (
    <div className="min-h-full flex flex-col bg-gradient-to-b from-[#6b0028] via-[#850533] to-[#50001e] text-white pb-6 select-none">
      {/* Top Header */}
      <div className="px-4 py-3.5 flex items-center gap-3 border-b border-rose-900/40">
        <button
          onClick={onBack}
          className="p-1 rounded-full hover:bg-white/10 active:scale-95 transition"
        >
          <ArrowLeft size={22} />
        </button>
        <h2 className="text-sm sm:text-base font-bold tracking-wide truncate">
          {market.name} - {biddingSession} - Triple Pana
        </h2>
      </div>

      <div className="p-4 flex-1 flex flex-col max-w-md mx-auto w-full space-y-4">
        {/* Two Mode Toggles: Fix Number Mode | Fix Amount Mode */}
        <div className="grid grid-cols-2 gap-2 bg-[#50001e]/60 p-1.5 rounded-2xl border border-rose-400/30">
          <button
            onClick={() => {
              setErrorMsg('');
              setMode('fix_number');
            }}
            className={`py-3 rounded-xl font-black text-xs sm:text-sm transition-all ${
              mode === 'fix_number'
                ? 'bg-white text-[#6b0028] shadow-md'
                : 'text-white/80 hover:text-white'
            }`}
          >
            Fix Number Mode
          </button>
          <button
            onClick={() => {
              setErrorMsg('');
              setMode('fix_amount');
            }}
            className={`py-3 rounded-xl font-black text-xs sm:text-sm transition-all ${
              mode === 'fix_amount'
                ? 'bg-white text-[#6b0028] shadow-md'
                : 'text-white/80 hover:text-white'
            }`}
          >
            Fix Amount Mode
          </button>
        </div>

        {mode === 'fix_number' ? (
          /* FIX NUMBER MODE with large bold boxes */
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3.5">
              {/* Left Column (000, 222, 444, 666, 888) */}
              <div className="space-y-3">
                {leftPanas.map((pana) => (
                  <div
                    key={pana}
                    className="flex items-center rounded-2xl overflow-hidden border-2 border-rose-300/70 shadow-lg bg-white h-16 sm:h-18"
                  >
                    <div className="w-22 sm:w-26 h-full bg-[#6b0028] text-white flex items-center justify-center font-black text-2xl sm:text-3xl tracking-wider shrink-0 px-1">
                      {pana}
                    </div>
                    <input
                      type="number"
                      inputMode="numeric"
                      value={pointInputs[pana] || ''}
                      onChange={(e) => {
                        setErrorMsg('');
                        setPointInputs({ ...pointInputs, [pana]: e.target.value });
                      }}
                      placeholder=""
                      className="flex-1 h-full px-3 text-neutral-900 font-black text-center outline-none bg-white text-2xl sm:text-3xl"
                    />
                  </div>
                ))}
              </div>

              {/* Right Column (111, 333, 555, 777, 999) */}
              <div className="space-y-3">
                {rightPanas.map((pana) => (
                  <div
                    key={pana}
                    className="flex items-center rounded-2xl overflow-hidden border-2 border-rose-300/70 shadow-lg bg-white h-16 sm:h-18"
                  >
                    <div className="w-22 sm:w-26 h-full bg-[#6b0028] text-white flex items-center justify-center font-black text-2xl sm:text-3xl tracking-wider shrink-0 px-1">
                      {pana}
                    </div>
                    <input
                      type="number"
                      inputMode="numeric"
                      value={pointInputs[pana] || ''}
                      onChange={(e) => {
                        setErrorMsg('');
                        setPointInputs({ ...pointInputs, [pana]: e.target.value });
                      }}
                      placeholder=""
                      className="flex-1 h-full px-3 text-neutral-900 font-black text-center outline-none bg-white text-2xl sm:text-3xl"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Add Button */}
            <button
              onClick={handleAddFixNumber}
              className="w-full bg-white hover:bg-neutral-100 text-[#6b0028] font-black py-3.5 rounded-2xl shadow-xl active:scale-98 transition text-lg"
            >
              Add
            </button>
          </div>
        ) : (
          /* FIX AMOUNT MODE with bold buttons */
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3 bg-[#50001e]/60 p-3.5 rounded-2xl border border-rose-400/30">
              <span className="font-extrabold text-sm sm:text-base text-white">Enter Points :</span>
              <input
                type="number"
                inputMode="numeric"
                value={fixPoints}
                onChange={(e) => {
                  setErrorMsg('');
                  setFixPoints(e.target.value);
                }}
                placeholder="Points"
                className="w-32 bg-white text-neutral-900 rounded-xl px-3 py-2 font-black text-center text-xl outline-none shadow-inner"
              />
            </div>

            {/* Grid of 10 Triple Pana buttons with large, bold text */}
            <div className="grid grid-cols-4 gap-2.5">
              {TRIPLE_PANAS.slice(0, 8).map((pana) => (
                <button
                  key={pana}
                  onClick={() => handlePanaClickFixAmount(pana)}
                  className="bg-white hover:bg-rose-50 text-neutral-900 font-black text-2xl sm:text-3xl py-5 sm:py-6 rounded-2xl shadow-xl hover:shadow-2xl active:scale-95 transition-all border-2 border-white/90 flex items-center justify-center tracking-wider"
                >
                  {pana}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2.5 max-w-[50%] mx-auto">
              {TRIPLE_PANAS.slice(8).map((pana) => (
                <button
                  key={pana}
                  onClick={() => handlePanaClickFixAmount(pana)}
                  className="bg-white hover:bg-rose-50 text-neutral-900 font-black text-2xl sm:text-3xl py-5 sm:py-6 rounded-2xl shadow-xl hover:shadow-2xl active:scale-95 transition-all border-2 border-white/90 flex items-center justify-center tracking-wider"
                >
                  {pana}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Summary Table matching video 03:57 & 04:13 */}
        <div className="bg-white rounded-2xl p-4 text-neutral-900 shadow-xl border border-neutral-200 mt-2">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-neutral-200 text-xs font-bold text-neutral-600">
            <span className="w-1/3">Number</span>
            <span className="w-1/3 text-center">Points</span>
            <button
              onClick={handleDeleteAll}
              disabled={bidEntries.length === 0}
              className="w-1/3 text-right text-rose-600 hover:text-rose-800 disabled:opacity-40"
            >
              Delete All
            </button>
          </div>

          {/* Table Items */}
          <div className="max-h-44 overflow-y-auto divide-y divide-neutral-100 py-1">
            {bidEntries.length > 0 ? (
              bidEntries.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-2 text-sm font-semibold"
                >
                  <span className="w-1/3 text-neutral-800 font-bold">{item.number}</span>
                  <span className="w-1/3 text-center text-neutral-700">{item.points}</span>
                  <div className="w-1/3 flex justify-end">
                    <button
                      onClick={() => handleDeleteItem(idx)}
                      className="text-rose-500 hover:text-rose-700 p-0.5 active:scale-95 transition"
                    >
                      <XCircle size={18} className="fill-rose-50 text-rose-600" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-4 text-center text-xs text-neutral-400 font-medium">
                No Triple Panas added yet.
              </div>
            )}
          </div>

          {/* Total Footer */}
          <div className="pt-3 border-t border-neutral-200 flex justify-between items-center text-sm font-black text-neutral-900">
            <span>Total :</span>
            <span className="text-[#6b0028] text-base">{totalPoints}</span>
          </div>
        </div>

        {/* Inline Error Banner */}
        {errorMsg && (
          <div className="bg-red-500/95 text-white text-xs font-bold px-4 py-2.5 rounded-xl text-center shadow-md">
            {errorMsg}
          </div>
        )}

        {/* Confirm Button matching video 04:16 */}
        <div className="pt-1">
          <button
            onClick={handleConfirm}
            disabled={isSubmitting || bidEntries.length === 0}
            className="w-full bg-white hover:bg-neutral-100 text-[#6b0028] font-black py-3 rounded-2xl shadow-xl active:scale-98 transition text-base disabled:opacity-50 flex items-center justify-center"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-[#6b0028] border-t-transparent rounded-full animate-spin" />
            ) : (
              'Confirm'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

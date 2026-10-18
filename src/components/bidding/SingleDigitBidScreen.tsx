import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Market, BidItemEntry } from '../../types';
import { ArrowLeft, XCircle, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export const SingleDigitBidScreen: React.FC<{
  market: Market;
  isBulk?: boolean;
  onBack: () => void;
}> = ({ market, isBulk = false, onBack }) => {
  const { biddingSession, placeBulkBid } = useApp();

  // Inputs for standard mode (10 boxes)
  const [pointInputs, setPointInputs] = useState<Record<string, string>>({
    '1': '', '2': '', '3': '', '4': '', '5': '',
    '6': '', '7': '', '8': '', '9': '', '0': '',
  });

  // Input for bulk mode
  const [bulkPoints, setBulkPoints] = useState<string>('10');

  // Bid entries list in summary table
  const [bidEntries, setBidEntries] = useState<BidItemEntry[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Standard mode "Add" handler
  const handleAddStandard = () => {
    setErrorMsg('');
    const newItems: BidItemEntry[] = [];
    Object.entries(pointInputs).forEach(([digit, pts]) => {
      const p = parseInt(pts);
      if (p > 0) {
        newItems.push({ number: digit, points: p });
      }
    });

    if (newItems.length === 0) {
      setErrorMsg('Please enter points for at least one number');
      return;
    }

    // Merge or append to bidEntries
    const updated = [...bidEntries];
    newItems.forEach((item) => {
      const existingIdx = updated.findIndex((b) => b.number === item.number);
      if (existingIdx >= 0) {
        updated[existingIdx].points = item.points; // update
      } else {
        updated.push(item);
      }
    });

    setBidEntries(updated);
    // Clear inputs
    setPointInputs({
      '1': '', '2': '', '3': '', '4': '', '5': '',
      '6': '', '7': '', '8': '', '9': '', '0': '',
    });
  };

  // Bulk mode: clicking digit adds immediately to table
  const handleDigitClickBulk = (digit: string) => {
    setErrorMsg('');
    const pts = parseInt(bulkPoints);
    if (!pts || pts <= 0) {
      setErrorMsg('Please enter points first');
      return;
    }

    const updated = [...bidEntries];
    const existingIdx = updated.findIndex((b) => b.number === digit);
    if (existingIdx >= 0) {
      setErrorMsg(`Number ${digit} already added!`);
      return;
    } else {
      updated.push({ number: digit, points: pts });
    }
    setBidEntries(updated);
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
      const res = placeBulkBid(
        market,
        isBulk ? 'Single Digit Bulk' : 'Single Digit',
        biddingSession,
        bidEntries
      );

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

  const leftDigits = ['1', '3', '5', '7', '9'];
  const rightDigits = ['2', '4', '6', '8', '0'];

  return (
    <div className="min-h-full flex flex-col bg-gradient-to-b from-[#6b0028] via-[#850533] to-[#50001e] text-white pb-6 select-none">
      {/* Header matching video: <- SRIDEVI NIGHT - Open - Single... */}
      <div className="px-4 py-3.5 flex items-center gap-3 border-b border-rose-900/40">
        <button
          onClick={onBack}
          className="p-1 rounded-full hover:bg-white/10 active:scale-95 transition"
        >
          <ArrowLeft size={22} />
        </button>
        <h2 className="text-sm sm:text-base font-bold tracking-wide truncate">
          {market.name} - {biddingSession} - {isBulk ? 'Single Digit Bulk' : 'Single Digit'}
        </h2>
      </div>

      <div className="p-4 flex-1 flex flex-col max-w-md mx-auto w-full space-y-4">
        {isBulk ? (
          /* BULK MODE with large, bold numbers */
          <div className="space-y-4">
            {/* Enter Points field */}
            <div className="flex items-center justify-center gap-3 bg-[#50001e]/60 p-3.5 rounded-2xl border border-rose-400/30">
              <span className="font-extrabold text-sm sm:text-base text-white">Enter Points :</span>
              <input
                type="number"
                inputMode="numeric"
                value={bulkPoints}
                onChange={(e) => {
                  setErrorMsg('');
                  setBulkPoints(e.target.value);
                }}
                placeholder="Points"
                className="w-32 bg-white text-neutral-900 rounded-xl px-3 py-2 font-black text-center text-xl outline-none shadow-inner"
              />
            </div>

            {/* 10 Large & Bold Number buttons */}
            <div className="grid grid-cols-4 gap-3">
              {['1', '2', '3', '4', '5', '6', '7', '8'].map((d) => (
                <button
                  key={d}
                  onClick={() => handleDigitClickBulk(d)}
                  className="bg-white hover:bg-rose-50 text-neutral-900 font-black text-3xl sm:text-4xl py-5 sm:py-6 rounded-2xl shadow-xl hover:shadow-2xl active:scale-95 transition-all border-2 border-white/90 flex items-center justify-center"
                >
                  {d}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 max-w-[50%] mx-auto">
              {['9', '0'].map((d) => (
                <button
                  key={d}
                  onClick={() => handleDigitClickBulk(d)}
                  className="bg-white hover:bg-rose-50 text-neutral-900 font-black text-3xl sm:text-4xl py-5 sm:py-6 rounded-2xl shadow-xl hover:shadow-2xl active:scale-95 transition-all border-2 border-white/90 flex items-center justify-center"
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* STANDARD MODE: 2 columns of inputs with bold, large badges */
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3.5">
              {/* Left Column (1, 3, 5, 7, 9) */}
              <div className="space-y-3">
                {leftDigits.map((d) => (
                  <div
                    key={d}
                    className="flex items-center rounded-2xl overflow-hidden border-2 border-rose-300/70 shadow-lg bg-white h-16 sm:h-18"
                  >
                    <div className="w-18 sm:w-20 h-full bg-[#6b0028] text-white flex items-center justify-center font-black text-3xl sm:text-4xl shrink-0">
                      {d}
                    </div>
                    <input
                      type="number"
                      inputMode="numeric"
                      value={pointInputs[d]}
                      onChange={(e) => {
                        setErrorMsg('');
                        setPointInputs({ ...pointInputs, [d]: e.target.value });
                      }}
                      placeholder=""
                      className="flex-1 h-full px-3 text-neutral-900 font-black text-center outline-none bg-white text-2xl sm:text-3xl"
                    />
                  </div>
                ))}
              </div>

              {/* Right Column (2, 4, 6, 8, 0) */}
              <div className="space-y-3">
                {rightDigits.map((d) => (
                  <div
                    key={d}
                    className="flex items-center rounded-2xl overflow-hidden border-2 border-rose-300/70 shadow-lg bg-white h-16 sm:h-18"
                  >
                    <div className="w-18 sm:w-20 h-full bg-[#6b0028] text-white flex items-center justify-center font-black text-3xl sm:text-4xl shrink-0">
                      {d}
                    </div>
                    <input
                      type="number"
                      inputMode="numeric"
                      value={pointInputs[d]}
                      onChange={(e) => {
                        setErrorMsg('');
                        setPointInputs({ ...pointInputs, [d]: e.target.value });
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
              onClick={handleAddStandard}
              className="w-full bg-white hover:bg-neutral-100 text-[#6b0028] font-black py-3.5 rounded-2xl shadow-xl active:scale-98 transition text-lg"
            >
              Add
            </button>
          </div>
        )}

        {/* Dynamic Summary Table matching video 00:07, 00:16, 00:32 */}
        <div className="bg-white rounded-2xl p-4 text-neutral-900 shadow-xl border border-neutral-200 mt-2">
          {/* Table Header */}
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
                No numbers added yet. Add points above.
              </div>
            )}
          </div>

          {/* Total Footer */}
          <div className="pt-3 border-t border-neutral-200 flex justify-between items-center text-sm font-black text-neutral-900">
            <span>Total :</span>
            <span className="text-[#6b0028] text-base">{totalPoints}</span>
          </div>
        </div>

        {/* Inline Error Banner without blocking screen */}
        {errorMsg && (
          <div className="bg-red-500/95 text-white text-xs font-bold px-4 py-2.5 rounded-xl text-center shadow-md">
            {errorMsg}
          </div>
        )}

        {/* Confirm Button matching video 00:07 & 00:16 */}
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

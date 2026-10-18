import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Market, BidItemEntry, GameModeType } from '../../types';
import { ArrowLeft, XCircle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const MotorBidScreen: React.FC<{
  market: Market;
  gameType: GameModeType;
  onBack: () => void;
}> = ({ market, gameType, onBack }) => {
  const { biddingSession, placeBulkBid } = useApp();

  const [digitsInput, setDigitsInput] = useState<string>('');
  const [pointsInput, setPointsInput] = useState<string>('10');
  const [bidEntries, setBidEntries] = useState<BidItemEntry[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Generate permutations / combinations
  const handleGenerate = () => {
    setErrorMsg('');
    const pts = parseInt(pointsInput);
    if (!pts || pts <= 0) {
      setErrorMsg('Please enter valid points');
      return;
    }

    const cleanDigits = digitsInput.replace(/\D/g, '');
    if (!cleanDigits) {
      setErrorMsg('Please enter digits');
      return;
    }

    const generated: BidItemEntry[] = [];

    if (gameType === 'SP Motor' || gameType === 'DP Motor') {
      if (cleanDigits.length < 3) {
        setErrorMsg('Motor requires at least 3 unique digits');
        return;
      }
      const unique = Array.from(new Set(cleanDigits.split('')));
      // Generate 3-digit combinations
      for (let i = 0; i < unique.length; i++) {
        for (let j = i + 1; j < unique.length; j++) {
          for (let k = j + 1; k < unique.length; k++) {
            const num = `${unique[i]}${unique[j]}${unique[k]}`;
            generated.push({ number: num, points: pts });
          }
        }
      }
    } else if (gameType === 'Group Jodi') {
      if (cleanDigits.length !== 2) {
        setErrorMsg('Enter a 2-digit Jodi (e.g. 12)');
        return;
      }
      const a = parseInt(cleanDigits[0]);
      const b = parseInt(cleanDigits[1]);
      const cutA = (a + 5) % 10;
      const cutB = (b + 5) % 10;
      const jodis = [
        `${a}${b}`, `${b}${a}`,
        `${a}${cutB}`, `${cutB}${a}`,
        `${cutA}${b}`, `${b}${cutA}`,
        `${cutA}${cutB}`, `${cutB}${cutA}`,
      ];
      const uniqueJodis = Array.from(new Set(jodis));
      uniqueJodis.forEach((j) => generated.push({ number: j, points: pts }));
    } else if (gameType === 'Red Bracket') {
      const redList = ['00', '11', '22', '33', '44', '55', '66', '77', '88', '99', '05', '50', '16', '61', '27', '72', '38', '83', '49', '94'];
      redList.forEach((r) => generated.push({ number: r, points: pts }));
    } else {
      // SP DP TP
      const d = cleanDigits[0] || '1';
      generated.push({ number: `${d}${d}${d}`, points: pts });
      generated.push({ number: `${d}00`, points: pts });
      generated.push({ number: `12${d}`, points: pts });
    }

    // Append to existing
    const updated = [...bidEntries];
    generated.forEach((g) => {
      if (!updated.some((b) => b.number === g.number)) {
        updated.push(g);
      }
    });

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
      setErrorMsg('Please add at least one bid');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const res = placeBulkBid(market, gameType, biddingSession, bidEntries);

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
          {market.name} - {biddingSession} - {gameType}
        </h2>
      </div>

      <div className="p-4 flex-1 flex flex-col max-w-md mx-auto w-full space-y-4">
        {/* Generator Controls */}
        <div className="bg-white rounded-2xl p-4 text-neutral-900 space-y-3 shadow-md">
          <div>
            <label className="block text-xs font-bold text-neutral-600 mb-1">
              {gameType.includes('Motor')
                ? 'Enter 3 to 8 Digits (e.g. 12345)'
                : gameType === 'Group Jodi'
                ? 'Enter 2-digit Base Jodi (e.g. 12)'
                : 'Enter Digits'}
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={digitsInput}
              onChange={(e) => setDigitsInput(e.target.value.replace(/\D/g, ''))}
              placeholder="e.g. 12345"
              className="w-full border border-neutral-300 rounded-xl px-3 py-2 text-base font-bold outline-none focus:border-[#6b0028]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-600 mb-1">
              Points Per Combination
            </label>
            <input
              type="number"
              inputMode="numeric"
              value={pointsInput}
              onChange={(e) => setPointsInput(e.target.value)}
              placeholder="Points"
              className="w-full border border-neutral-300 rounded-xl px-3 py-2 text-base font-bold outline-none focus:border-[#6b0028]"
            />
          </div>

          <button
            onClick={handleGenerate}
            className="w-full bg-[#6b0028] hover:bg-[#580021] text-white font-bold py-2.5 rounded-xl shadow-md active:scale-98 transition text-sm flex items-center justify-center gap-2"
          >
            <Sparkles size={16} />
            <span>Generate & Add to Table</span>
          </button>
        </div>

        {/* Dynamic Summary Table */}
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
                No numbers generated yet.
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

        {/* Confirm Button */}
        <div className="pt-2">
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

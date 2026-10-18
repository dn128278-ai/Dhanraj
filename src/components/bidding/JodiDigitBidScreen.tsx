import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Market, BidItemEntry } from '../../types';
import { ArrowLeft, XCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export const JodiDigitBidScreen: React.FC<{
  market: Market;
  isBulk?: boolean;
  onBack: () => void;
}> = ({ market, isBulk = false, onBack }) => {
  const { biddingSession, placeBulkBid } = useApp();

  // Active top filter tab (1, 2, 3, 4, 5, 6, 7, 8, 9, 0)
  const [activeDigitTab, setActiveDigitTab] = useState<string>('1');

  // Standard point inputs map
  const [pointInputs, setPointInputs] = useState<Record<string, string>>({});

  // Bulk mode point input
  const [bulkPoints, setBulkPoints] = useState<string>('20');

  // Summary table entries
  const [bidEntries, setBidEntries] = useState<BidItemEntry[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Generate 10 jodi numbers for the selected digit tab
  const getJodisForTab = (tab: string): string[] => {
    const list: string[] = [];
    const prefix = tab === '0' ? '0' : tab;
    for (let i = 0; i <= 9; i++) {
      list.push(`${prefix}${i}`);
    }
    return list;
  };

  const currentJodis = getJodisForTab(activeDigitTab);
  // Split into 2 columns of 5 rows each
  const leftColJodis = currentJodis.filter((_, idx) => idx % 2 === 0);
  const rightColJodis = currentJodis.filter((_, idx) => idx % 2 !== 0);

  const handleAddStandard = () => {
    setErrorMsg('');
    const newItems: BidItemEntry[] = [];
    Object.entries(pointInputs).forEach(([jodi, pts]) => {
      const p = parseInt(pts);
      if (p > 0) {
        newItems.push({ number: jodi, points: p });
      }
    });

    if (newItems.length === 0) {
      setErrorMsg('Please enter points for at least one Jodi');
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

  const handleJodiClickBulk = (jodi: string) => {
    setErrorMsg('');
    const pts = parseInt(bulkPoints);
    if (!pts || pts <= 0) {
      setErrorMsg('Please enter points first');
      return;
    }

    const updated = [...bidEntries];
    const existingIdx = updated.findIndex((b) => b.number === jodi);
    if (existingIdx >= 0) {
      setErrorMsg(`Number ${jodi} already added!`);
      return;
    } else {
      updated.push({ number: jodi, points: pts });
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
        isBulk ? 'Jodi Digit Bulk' : 'Jodi Digit',
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

  const digitTabs = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

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
          {market.name} - {biddingSession} - {isBulk ? 'Jodi Digit Bulk' : 'Jodi Digit'}
        </h2>
      </div>

      <div className="p-4 flex-1 flex flex-col max-w-md mx-auto w-full space-y-4">
        {/* Top Horizontal Digit Selector Tabs with larger size */}
        <div className="flex items-center justify-between gap-1.5 overflow-x-auto no-scrollbar py-1.5">
          {digitTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setErrorMsg('');
                setActiveDigitTab(tab);
              }}
              className={`w-10 sm:w-12 h-10 sm:h-12 rounded-full font-black text-lg sm:text-xl flex items-center justify-center transition-all ${
                activeDigitTab === tab
                  ? 'bg-amber-400 text-neutral-950 shadow-lg scale-110 ring-2 ring-white'
                  : 'bg-white text-neutral-800 hover:bg-neutral-100 shadow-sm'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {isBulk ? (
          /* BULK JODI MODE with large font & padding */
          <div className="space-y-4">
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

            {/* 10 Large Jodi buttons for active tab */}
            <div className="grid grid-cols-4 gap-3">
              {currentJodis.slice(0, 8).map((jodi) => (
                <button
                  key={jodi}
                  onClick={() => handleJodiClickBulk(jodi)}
                  className="bg-white hover:bg-rose-50 text-neutral-900 font-black text-2xl sm:text-3xl py-5 sm:py-6 rounded-2xl shadow-xl hover:shadow-2xl active:scale-95 transition-all border-2 border-white/90 flex items-center justify-center"
                >
                  {jodi}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 max-w-[50%] mx-auto">
              {currentJodis.slice(8).map((jodi) => (
                <button
                  key={jodi}
                  onClick={() => handleJodiClickBulk(jodi)}
                  className="bg-white hover:bg-rose-50 text-neutral-900 font-black text-2xl sm:text-3xl py-5 sm:py-6 rounded-2xl shadow-xl hover:shadow-2xl active:scale-95 transition-all border-2 border-white/90 flex items-center justify-center"
                >
                  {jodi}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* STANDARD JODI MODE with large font boxes */
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3.5">
              {/* Left Column */}
              <div className="space-y-3">
                {leftColJodis.map((jodi) => (
                  <div
                    key={jodi}
                    className="flex items-center rounded-2xl overflow-hidden border-2 border-rose-300/70 shadow-lg bg-white h-16 sm:h-18"
                  >
                    <div className="w-20 sm:w-22 h-full bg-[#6b0028] text-white flex items-center justify-center font-black text-2xl sm:text-3xl shrink-0">
                      {jodi}
                    </div>
                    <input
                      type="number"
                      inputMode="numeric"
                      value={pointInputs[jodi] || ''}
                      onChange={(e) => {
                        setErrorMsg('');
                        setPointInputs({ ...pointInputs, [jodi]: e.target.value });
                      }}
                      placeholder=""
                      className="flex-1 h-full px-3 text-neutral-900 font-black text-center outline-none bg-white text-2xl sm:text-3xl"
                    />
                  </div>
                ))}
              </div>

              {/* Right Column */}
              <div className="space-y-3">
                {rightColJodis.map((jodi) => (
                  <div
                    key={jodi}
                    className="flex items-center rounded-2xl overflow-hidden border-2 border-rose-300/70 shadow-lg bg-white h-16 sm:h-18"
                  >
                    <div className="w-20 sm:w-22 h-full bg-[#6b0028] text-white flex items-center justify-center font-black text-2xl sm:text-3xl shrink-0">
                      {jodi}
                    </div>
                    <input
                      type="number"
                      inputMode="numeric"
                      value={pointInputs[jodi] || ''}
                      onChange={(e) => {
                        setErrorMsg('');
                        setPointInputs({ ...pointInputs, [jodi]: e.target.value });
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

        {/* Dynamic Summary Table matching video 00:59, 01:05, 01:37 */}
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
                No Jodis added yet.
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

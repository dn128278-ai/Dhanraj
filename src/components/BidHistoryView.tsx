import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, ChevronLeft, ChevronRight, Calendar, Search } from 'lucide-react';

export const BidHistoryView: React.FC<{
  title: string;
  category: 'regular' | 'starline' | 'jackpot';
  onBack: () => void;
}> = ({ title, category, onBack }) => {
  const { bids } = useApp();
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-17');

  // Filter bids by date and category
  const filteredBids = bids.filter(
    (b) => (b.typeCategory === category || (!b.typeCategory && category === 'regular')) && b.date === selectedDate
  );

  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  return (
    <div className="min-h-full flex flex-col bg-neutral-100 text-neutral-900 pb-20 select-none">
      {/* Top Header */}
      <div className="bg-[#6b0028] text-white px-4 py-3.5 flex items-center gap-3 shadow-md sticky top-0 z-30">
        <button
          onClick={onBack}
          className="p-1 rounded-full hover:bg-white/10 active:scale-95 transition"
        >
          <ArrowLeft size={22} />
        </button>
        <h2 className="text-lg font-bold tracking-wide">{title}</h2>
      </div>

      {/* Date Selector Navigation Pill matching video 00:34 */}
      <div className="p-3">
        <div className="bg-rose-100/90 border border-rose-200 rounded-full px-2 py-1.5 flex items-center justify-between shadow-xs">
          <button
            onClick={handlePrevDay}
            className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:bg-neutral-800 active:scale-95 transition"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800">
            <Calendar size={14} className="text-[#6b0028]" />
            <span>Select Date : {selectedDate}</span>
          </div>

          <button
            onClick={handleNextDay}
            className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:bg-neutral-800 active:scale-95 transition"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-3 flex-1 flex flex-col">
        {filteredBids.length > 0 ? (
          <div className="space-y-2.5">
            {filteredBids.map((bid) => (
              <div
                key={bid.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-200/80 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-neutral-900 text-sm">{bid.marketName}</span>
                    <span className="text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-md font-semibold">
                      {bid.gameType}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-500 mt-1">
                    Digit / Number: <span className="font-bold text-[#6b0028]">{bid.number}</span> | Session: {bid.session}
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">
                    Time: {bid.time}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-bold text-neutral-900">₹{bid.amount}</div>
                  <div className="mt-1">
                    {bid.status === 'Won' ? (
                      <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Won ₹{bid.winAmount}
                      </span>
                    ) : bid.status === 'Lost' ? (
                      <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                        Lost
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State Illustration matching video 00:34 */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center my-auto">
            {/* Magnifying glass with sad face */}
            <div className="relative w-28 h-28 mb-4 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full text-teal-600/70" fill="none" stroke="currentColor">
                {/* Circle */}
                <circle cx="45" cy="45" r="30" strokeWidth="4.5" />
                {/* Handle */}
                <line x1="68" y1="68" x2="90" y2="90" strokeWidth="6" strokeLinecap="round" />
                {/* Sad Face Eyes */}
                <circle cx="36" cy="40" r="3" fill="currentColor" />
                <circle cx="54" cy="40" r="3" fill="currentColor" />
                {/* Sad Mouth Curve */}
                <path d="M35 56 Q45 46 55 56" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-sm text-neutral-500 font-medium">
              You dont have any bids for this date.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

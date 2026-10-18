import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, ChevronLeft, ChevronRight, Calendar, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

export const PassbookScreen: React.FC = () => {
  const { transactions, setActiveScreen } = useApp();
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-17');

  const filteredTxns = transactions.filter((t) => t.date === selectedDate);

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
      {/* Top Header matching video 00:49 */}
      <div className="bg-[#6b0028] text-white px-4 py-3.5 flex items-center gap-3 shadow-md sticky top-0 z-30">
        <button
          onClick={() => setActiveScreen('home')}
          className="p-1 rounded-full hover:bg-white/10 active:scale-95 transition"
        >
          <ArrowLeft size={22} />
        </button>
        <h2 className="text-lg font-bold tracking-wide">My Ledger</h2>
      </div>

      {/* Date Pill Navigator matching video 00:49-00:51: < 2026-10-17 > */}
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
            <span>{selectedDate}</span>
          </div>

          <button
            onClick={handleNextDay}
            className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:bg-neutral-800 active:scale-95 transition"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Main Ledger Content */}
      <div className="px-3 flex-1 flex flex-col">
        {filteredTxns.length > 0 ? (
          <div className="space-y-2.5">
            {filteredTxns.map((txn) => {
              const isCredit = txn.type === 'deposit' || txn.type === 'win';
              return (
                <div
                  key={txn.id}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-200/90 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isCredit
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {isCredit ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                    </div>
                    <div>
                      <h4 className="font-bold text-neutral-900 text-sm">{txn.title}</h4>
                      <p className="text-[11px] text-neutral-500">{txn.time} • Ref: {txn.refId}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`font-black text-base ${
                        isCredit ? 'text-emerald-600' : 'text-neutral-900'
                      }`}
                    >
                      {isCredit ? `+₹${txn.amount}` : `-₹${txn.amount}`}
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        txn.status === 'Success'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {txn.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State matching video 00:50 */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center my-auto">
            <div className="relative w-28 h-28 mb-4 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full text-teal-600/70" fill="none" stroke="currentColor">
                <circle cx="45" cy="45" r="30" strokeWidth="4.5" />
                <line x1="68" y1="68" x2="90" y2="90" strokeWidth="6" strokeLinecap="round" />
                <circle cx="36" cy="40" r="3" fill="currentColor" />
                <circle cx="54" cy="40" r="3" fill="currentColor" />
                <path d="M35 56 Q45 46 55 56" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-sm text-neutral-500 font-medium">
              No transaction found for this date.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

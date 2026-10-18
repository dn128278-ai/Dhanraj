import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Calendar } from 'lucide-react';

export const GameResultHistoryView: React.FC<{
  title: string;
  category: 'regular' | 'starline' | 'jackpot';
  onBack: () => void;
}> = ({ title, category, onBack }) => {
  const { markets } = useApp();
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-17');

  const formattedDateDisplay = '17/10/2026';

  const starlineResults = [
    { name: '10:00 AM', result: '139-3' },
    { name: '11:00 AM', result: '345-2' },
    { name: '12:00 PM', result: '789-4' },
    { name: '01:00 PM', result: '147-2' },
    { name: '02:00 PM', result: '368-7' },
    { name: '03:00 PM', result: '249-5' },
    { name: '04:00 PM', result: '589-2' },
    { name: '05:00 PM', result: '158-4' },
    { name: '06:00 PM', result: '***-*' },
    { name: '07:00 PM', result: '***-*' },
    { name: '08:00 PM', result: '***-*' },
    { name: '09:00 PM', result: '***-*' },
  ];

  const jackpotResults = [
    { name: 'DHAN JACKPOT 10 AM', result: '47' },
    { name: 'DHAN JACKPOT 01 PM', result: '92' },
    { name: 'DHAN JACKPOT 04 PM', result: '18' },
    { name: 'DHAN JACKPOT 07 PM', result: '**' },
    { name: 'DHAN JACKPOT 10 PM', result: '**' },
  ];

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

      {/* Date Bar matching video 00:40: Select Date : [ 17/10/2026 ] */}
      <div className="p-3">
        <div className="bg-white border border-neutral-200 rounded-2xl px-4 py-2.5 flex items-center justify-between shadow-xs">
          <span className="font-bold text-neutral-800 text-sm">Select Date :</span>
          <div className="flex items-center gap-2 bg-[#6b0028] text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-xs">
            <Calendar size={13} />
            <span>{formattedDateDisplay}</span>
          </div>
        </div>
      </div>

      {/* Result Cards List matching video 00:40 - 00:46 */}
      <div className="px-3 flex-1 space-y-2">
        {category === 'regular' ? (
          markets.map((m) => (
            <div
              key={m.id}
              className="bg-white rounded-xl px-4 py-3 shadow-xs border border-neutral-200/90 flex items-center justify-between"
            >
              <span className="font-extrabold text-neutral-900 text-xs sm:text-sm tracking-wide">
                {m.name}
              </span>
              <span className="font-extrabold text-[#6b0028] text-sm sm:text-base tracking-widest font-mono">
                {m.result}
              </span>
            </div>
          ))
        ) : category === 'starline' ? (
          starlineResults.map((sr) => (
            <div
              key={sr.name}
              className="bg-white rounded-xl px-4 py-3 shadow-xs border border-neutral-200 flex items-center justify-between"
            >
              <span className="font-bold text-neutral-900 text-xs tracking-wide">
                DHAN STARLINE {sr.name}
              </span>
              <span className="font-bold text-[#6b0028] text-sm tracking-widest font-mono">
                {sr.result}
              </span>
            </div>
          ))
        ) : (
          jackpotResults.map((jr) => (
            <div
              key={jr.name}
              className="bg-white rounded-xl px-4 py-3 shadow-xs border border-neutral-200 flex items-center justify-between"
            >
              <span className="font-bold text-neutral-900 text-xs tracking-wide">
                {jr.name}
              </span>
              <span className="font-bold text-[#6b0028] text-sm tracking-widest font-mono">
                {jr.result}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

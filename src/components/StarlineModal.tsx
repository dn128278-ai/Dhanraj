import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Play, Clock, Sparkles } from 'lucide-react';
import { Market } from '../types';

export const StarlineModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { setSelectedMarketForBid } = useApp();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  if (!isOpen) return null;

  const starlineSlots = [
    { time: '10:00 AM', result: '139-3', status: 'closed' },
    { time: '11:00 AM', result: '345-2', status: 'closed' },
    { time: '12:00 PM', result: '789-4', status: 'closed' },
    { time: '01:00 PM', result: '147-2', status: 'closed' },
    { time: '02:00 PM', result: '368-7', status: 'closed' },
    { time: '03:00 PM', result: '249-5', status: 'closed' },
    { time: '04:00 PM', result: '589-2', status: 'closed' },
    { time: '05:00 PM', result: '158-4', status: 'running' },
    { time: '06:00 PM', result: '***-*', status: 'running' },
    { time: '07:00 PM', result: '***-*', status: 'running' },
    { time: '08:00 PM', result: '***-*', status: 'running' },
    { time: '09:00 PM', result: '***-*', status: 'running' },
  ];

  const handlePlayStarline = (slotTime: string) => {
    const starlineMarket: Market = {
      id: `starline_${slotTime.replace(/\s+/g, '')}`,
      name: `DHAN STARLINE (${slotTime})`,
      openTime: slotTime,
      closeTime: slotTime,
      result: '***-*',
      status: 'running',
      openBidsText: slotTime,
      closeBidsText: slotTime,
      type: 'starline',
    };
    setSelectedMarketForBid(starlineMarket);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-[#6b0028] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-amber-300" />
            <h3 className="font-bold text-lg">Dhan Starline</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-2.5">
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-2.5 text-xs text-rose-950 font-medium">
            Hourly Starline Games • Best Rates: Single Pana 1:150 | Single Digit 1:10
          </div>

          <div className="grid grid-cols-1 gap-2">
            {starlineSlots.map((slot) => {
              const isRunning = slot.status === 'running';
              return (
                <div
                  key={slot.time}
                  className={`flex items-center justify-between p-3 rounded-xl border transition ${
                    isRunning
                      ? 'border-emerald-300 bg-emerald-50/40 shadow-sm'
                      : 'border-neutral-200 bg-neutral-50/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-neutral-100 text-neutral-700">
                      <Clock size={16} />
                    </div>
                    <div>
                      <div className="font-bold text-neutral-800 text-sm">{slot.time}</div>
                      <div className="text-xs font-semibold text-[#6b0028] tracking-widest">{slot.result}</div>
                    </div>
                  </div>

                  <div>
                    {isRunning ? (
                      <button
                        onClick={() => handlePlayStarline(slot.time)}
                        className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-full text-xs font-bold shadow-md active:scale-95 transition"
                      >
                        <Play size={14} className="fill-white" />
                        <span>Play</span>
                      </button>
                    ) : (
                      <span className="text-xs font-semibold text-rose-600 bg-rose-100/60 px-2.5 py-1 rounded-full">
                        Closed
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

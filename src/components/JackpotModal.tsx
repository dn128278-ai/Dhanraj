import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Play, Zap } from 'lucide-react';
import { Market } from '../types';

export const JackpotModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { setSelectedMarketForBid } = useApp();

  if (!isOpen) return null;

  const jackpotMarkets = [
    { name: 'DHAN JACKPOT 10 AM', open: '10:00 AM', result: '47', status: 'closed' },
    { name: 'DHAN JACKPOT 01 PM', open: '01:00 PM', result: '92', status: 'closed' },
    { name: 'DHAN JACKPOT 04 PM', open: '04:00 PM', result: '18', status: 'closed' },
    { name: 'DHAN JACKPOT 07 PM', open: '07:00 PM', result: '**', status: 'running' },
    { name: 'DHAN JACKPOT 10 PM', open: '10:00 PM', result: '**', status: 'running' },
  ];

  const handlePlayJackpot = (jpName: string, time: string) => {
    const jpMarket: Market = {
      id: `jackpot_${time.replace(/\s+/g, '')}`,
      name: jpName,
      openTime: time,
      closeTime: time,
      result: '**',
      status: 'running',
      openBidsText: time,
      closeBidsText: time,
      type: 'jackpot',
    };
    setSelectedMarketForBid(jpMarket);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-[#6b0028] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap size={18} className="text-amber-300" />
            <h3 className="font-bold text-lg">Dhan Jackpot</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-3">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-xs text-amber-950 font-medium">
            Fast Jackpot Jodi Games • Win Rate 10 Ka 950 Instant Payout!
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {jackpotMarkets.map((jp) => {
              const isRunning = jp.status === 'running';
              return (
                <div
                  key={jp.name}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition ${
                    isRunning
                      ? 'border-emerald-300 bg-emerald-50/40 shadow-sm'
                      : 'border-neutral-200 bg-neutral-50/70'
                  }`}
                >
                  <div>
                    <div className="font-bold text-neutral-800 text-sm">{jp.name}</div>
                    <div className="text-xs text-neutral-500">Timing: {jp.open}</div>
                    <div className="text-sm font-black text-[#6b0028] mt-0.5 tracking-wider">
                      Result: {jp.result}
                    </div>
                  </div>

                  <div>
                    {isRunning ? (
                      <button
                        onClick={() => handlePlayJackpot(jp.name, jp.open)}
                        className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full text-xs font-bold shadow-md active:scale-95 transition"
                      >
                        <Play size={14} className="fill-white" />
                        <span>Play</span>
                      </button>
                    ) : (
                      <span className="text-xs font-semibold text-rose-600 bg-rose-100/60 px-3 py-1.5 rounded-full">
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

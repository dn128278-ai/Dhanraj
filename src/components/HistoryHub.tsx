import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TopAppBar } from './TopAppBar';
import { Gavel, FileText } from 'lucide-react';
import { BidHistoryView } from './BidHistoryView';
import { GameResultHistoryView } from './GameResultHistoryView';

export const HistoryHub: React.FC<{
  onOpenDrawer: () => void;
  onOpenNotifications: () => void;
}> = ({ onOpenDrawer, onOpenNotifications }) => {
  const [subView, setSubView] = useState<string | null>(null);

  const historyOptions = [
    {
      id: 'game_bid_history',
      title: 'Game Bid History',
      icon: Gavel,
      type: 'bid',
      category: 'regular' as const,
    },
    {
      id: 'starline_bid_history',
      title: 'Starline Bid History',
      icon: Gavel,
      type: 'bid',
      category: 'starline' as const,
    },
    {
      id: 'jackpot_bid_history',
      title: 'Jackpot Bid History',
      icon: Gavel,
      type: 'bid',
      category: 'jackpot' as const,
    },
    {
      id: 'game_result_history',
      title: 'Game Result History',
      icon: FileText,
      type: 'result',
      category: 'regular' as const,
    },
    {
      id: 'starline_result_history',
      title: 'Starline Result History',
      icon: FileText,
      type: 'result',
      category: 'starline' as const,
    },
    {
      id: 'jackpot_result_history',
      title: 'Jackpot Result History',
      icon: FileText,
      type: 'result',
      category: 'jackpot' as const,
    },
  ];

  if (subView) {
    const selected = historyOptions.find((opt) => opt.id === subView);
    if (selected?.type === 'bid') {
      return (
        <BidHistoryView
          title={selected.title}
          category={selected.category}
          onBack={() => setSubView(null)}
        />
      );
    } else if (selected?.type === 'result') {
      return (
        <GameResultHistoryView
          title={selected.title}
          category={selected.category}
          onBack={() => setSubView(null)}
        />
      );
    }
  }

  return (
    <div className="min-h-full flex flex-col bg-neutral-100 text-neutral-900 pb-20 select-none">
      {/* Top App Bar */}
      <TopAppBar
        onOpenDrawer={onOpenDrawer}
        onOpenNotifications={onOpenNotifications}
      />

      <div className="p-4 flex-1">
        <h2 className="text-xl font-bold text-neutral-900 mb-4 px-1">
          History
        </h2>

        {/* 6 Action Option Cards matching video 00:32 */}
        <div className="space-y-3">
          {historyOptions.map((opt) => {
            const Icon = opt.icon;
            return (
              <button
                key={opt.id}
                onClick={() => setSubView(opt.id)}
                className="w-full bg-white rounded-2xl p-4 shadow-sm border border-neutral-200/90 flex items-center gap-4 text-left hover:bg-neutral-50 active:scale-[0.99] transition shadow-xs"
              >
                {/* Maroon Circular Icon Container */}
                <div className="w-11 h-11 rounded-full bg-[#6b0028] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Icon size={20} />
                </div>

                <span className="font-bold text-neutral-800 text-base">
                  {opt.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

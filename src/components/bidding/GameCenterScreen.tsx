import React from 'react';
import { useApp } from '../../context/AppContext';
import { Market, GameModeType } from '../../types';
import {
  ArrowLeft,
  CircleDot,
  Layers,
  PlusSquare,
  Copy,
  Sparkles,
  Compass,
  Code,
  Users,
} from 'lucide-react';

export const GameCenterScreen: React.FC<{
  market: Market;
  onBack: () => void;
  onSelectGame: (game: GameModeType) => void;
}> = ({ market, onBack, onSelectGame }) => {
  const { biddingSession, setBiddingSession } = useApp();

  const gameList: Array<{
    id: GameModeType;
    title: string;
    icon: React.ComponentType<{ size: number; className?: string }>;
    onlyOpen?: boolean;
  }> = [
    { id: 'Single Digit', title: 'Single Digit', icon: CircleDot },
    { id: 'Single Digit Bulk', title: 'Single Digit Bulk', icon: CircleDot },
    { id: 'Jodi Digit', title: 'Jodi Digit', icon: CircleDot, onlyOpen: true },
    { id: 'Jodi Digit Bulk', title: 'Jodi Digit Bulk', icon: CircleDot, onlyOpen: true },
    { id: 'Single Pana', title: 'Single Pana', icon: PlusSquare },
    { id: 'Single Pana Bulk', title: 'Single Pana Bulk', icon: PlusSquare },
    { id: 'Double Pana', title: 'Double Pana', icon: Copy },
    { id: 'Double Pana Bulk', title: 'Double Pana Bulk', icon: Copy },
    { id: 'Triple Pana', title: 'Triple Pana', icon: Sparkles },
    { id: 'SP Motor', title: 'SP Motor', icon: Compass },
    { id: 'DP Motor', title: 'DP Motor', icon: Compass },
    { id: 'Red Bracket', title: 'Red Bracket', icon: Code, onlyOpen: true },
    { id: 'Group Jodi', title: 'Group Jodi', icon: Users, onlyOpen: true },
    { id: 'SP DP TP', title: 'SP DP TP', icon: Layers },
  ];

  const visibleGames = gameList.filter((g) => {
    if (biddingSession === 'Close' && g.onlyOpen) return false;
    return true;
  });

  return (
    <div className="min-h-full flex flex-col bg-gradient-to-b from-[#6b0028] via-[#850533] to-[#50001e] text-white pb-6 select-none">
      {/* Top Header matching video 00:05 */}
      <div className="px-4 py-3.5 flex items-center gap-3 border-b border-rose-900/40">
        <button
          onClick={onBack}
          className="p-1 rounded-full hover:bg-white/10 active:scale-95 transition"
        >
          <ArrowLeft size={22} />
        </button>
        <h2 className="text-lg font-bold tracking-wide uppercase">{market.name}</h2>
      </div>

      {/* Session Switcher matching video 00:05 & 00:22: Open | Close */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
          <button
            onClick={() => setBiddingSession('Open')}
            className={`py-3 rounded-2xl font-bold text-sm transition-all shadow-md ${
              biddingSession === 'Open'
                ? 'bg-[#50001e] text-white border-2 border-rose-400'
                : 'bg-white text-neutral-800 hover:bg-neutral-100'
            }`}
          >
            Open
          </button>
          <button
            onClick={() => setBiddingSession('Close')}
            className={`py-3 rounded-2xl font-bold text-sm transition-all shadow-md ${
              biddingSession === 'Close'
                ? 'bg-[#50001e] text-white border-2 border-rose-400'
                : 'bg-white text-neutral-800 hover:bg-neutral-100'
            }`}
          >
            Close
          </button>
        </div>
      </div>

      {/* 2-Column Game Selection Grid matching video 00:05 */}
      <div className="px-4 flex-1">
        <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
          {visibleGames.map((game) => {
            const Icon = game.icon;
            return (
              <button
                key={game.id}
                onClick={() => onSelectGame(game.id)}
                className="bg-white rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-md hover:shadow-lg active:scale-95 transition-all group border border-neutral-100"
              >
                {/* Maroon circle icon container */}
                <div className="w-12 h-12 rounded-full bg-[#6b0028] text-white flex items-center justify-center mb-2.5 shadow-sm group-hover:scale-105 transition-transform">
                  <Icon size={22} className="stroke-[2.2]" />
                </div>
                <span className="font-bold text-neutral-900 text-xs sm:text-sm tracking-tight leading-snug">
                  {game.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

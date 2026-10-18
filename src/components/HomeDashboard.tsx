import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TopAppBar } from './TopAppBar';
import { Market } from '../types';
import {
  Info,
  Play,
  Wallet,
  ArrowDownToLine,
  Sparkles,
  Zap,
  Clock,
  Timer,
  ChevronDown,
  Lock,
} from 'lucide-react';
import { PanelChartModal } from './PanelChartModal';
import { StarlineModal } from './StarlineModal';
import { JackpotModal } from './JackpotModal';

export const HomeDashboard: React.FC<{
  onOpenDrawer: () => void;
  onOpenNotifications: () => void;
}> = ({ onOpenDrawer, onOpenNotifications }) => {
  const {
    markets,
    setActiveScreen,
    setSelectedMarketForBid,
    currentTime,
    simulatedTimePreset,
    setSimulatedTimePreset,
    getMarketLiveStatus,
  } = useApp();

  const [chartMarket, setChartMarket] = useState<Market | null>(null);
  const [showStarline, setShowStarline] = useState(false);
  const [showJackpot, setShowJackpot] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Format current live system time
  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  // Calculate market live statistics
  const marketStatuses = markets.map((m) => getMarketLiveStatus(m));
  const runningCount = marketStatuses.filter((s) => s.status === 'running').length;
  const closedCount = marketStatuses.filter((s) => s.status === 'closed').length;

  return (
    <div className="h-full flex flex-col bg-neutral-100 text-neutral-900 select-none overflow-hidden min-h-0">
      {/* 
        PINNED & FIXED TOP SECTION
        Contains: Top App Bar, Live Wallet Balance, Promotional Banner, 
        and Quick Action Buttons (Starline, Jackpot, Add Money, Withdraw Money)
      */}
      <div className="shrink-0 z-20 bg-neutral-100 shadow-sm border-b border-neutral-200/80">
        {/* Top App Bar & Scrolling Marquee Banner */}
        <TopAppBar
          onOpenDrawer={onOpenDrawer}
          onOpenNotifications={onOpenNotifications}
        />

        {/* Pinned Quick Action Buttons Card */}
        <div className="px-3 pt-2.5 pb-2 space-y-2">
          <div className="bg-white rounded-2xl p-2.5 shadow-xs border border-neutral-200/80 space-y-2">
            {/* Top Row: Starline & Jackpot */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowStarline(true)}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-full border border-neutral-300 hover:border-[#6b0028] bg-neutral-50 hover:bg-rose-50 text-neutral-800 text-xs font-bold shadow-2xs active:scale-95 transition"
              >
                <Sparkles size={15} className="text-[#6b0028]" />
                <span>Dhan Starline</span>
              </button>

              <button
                onClick={() => setShowJackpot(true)}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-full border border-neutral-300 hover:border-[#6b0028] bg-neutral-50 hover:bg-rose-50 text-neutral-800 text-xs font-bold shadow-2xs active:scale-95 transition"
              >
                <Zap size={15} className="text-amber-500" />
                <span>Dhan Jackpot</span>
              </button>
            </div>

            {/* Second Row: Add Money & Withdraw Money */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setActiveScreen('add_fund')}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-full bg-[#6b0028] text-white hover:bg-[#570020] text-xs font-bold shadow-sm active:scale-95 transition"
              >
                <Wallet size={16} />
                <span>Add Money</span>
              </button>

              <button
                onClick={() => setActiveScreen('withdraw_fund')}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-full border border-[#6b0028] bg-white text-[#6b0028] hover:bg-rose-50 text-xs font-bold shadow-2xs active:scale-95 transition"
              >
                <ArrowDownToLine size={16} />
                <span>Withdraw Money</span>
              </button>
            </div>
          </div>

          {/* Real-Time Live Clock & Market Status Sub-Bar */}
          <div className="bg-white/90 backdrop-blur-xs rounded-xl px-3 py-1.5 border border-neutral-200/70 flex items-center justify-between text-[11px]">
            {/* Live Time Display with pulsing indicator */}
            <div className="flex items-center gap-2 font-bold text-neutral-800">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <div className="flex items-center gap-1 font-mono tracking-tight text-neutral-900">
                <Clock size={13} className="text-[#6b0028]" />
                <span>{formattedTime}</span>
              </div>
              <span className="text-neutral-300">|</span>
              <span className="text-emerald-700 font-semibold text-[10px]">
                {runningCount} Live
              </span>
              <span className="text-neutral-400 font-normal text-[10px]">
                • {closedCount} Closed
              </span>
            </div>

            {/* Dynamic Time Mode / Testing Presets Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowTimePicker(!showTimePicker)}
                className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[10px] font-semibold border border-neutral-300 transition"
                title="Change or test system time"
              >
                <Timer size={11} className="text-[#6b0028]" />
                <span className="capitalize">
                  {simulatedTimePreset === 'live' ? 'Live Device' : simulatedTimePreset}
                </span>
                <ChevronDown size={10} />
              </button>

              {showTimePicker && (
                <div className="absolute right-0 top-6 w-44 bg-white rounded-xl shadow-xl border border-neutral-200 py-1 z-50 text-xs font-medium">
                  <div className="px-3 py-1 text-[10px] uppercase font-bold text-neutral-400 border-b border-neutral-100">
                    Clock Simulator
                  </div>
                  {[
                    { id: 'live', label: '⚡ Device Clock (Live)' },
                    { id: 'morning', label: '🌅 Morning (10:30 AM)' },
                    { id: 'afternoon', label: '☀️ Afternoon (04:30 PM)' },
                    { id: 'evening', label: '🌙 Evening (07:30 PM)' },
                    { id: 'night', label: '🌃 Night (10:00 PM)' },
                    { id: 'closed', label: '🔒 Midnight (12:30 AM)' },
                  ].map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => {
                        setSimulatedTimePreset(preset.id as any);
                        setShowTimePicker(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 hover:bg-rose-50 flex items-center justify-between text-xs transition ${
                        simulatedTimePreset === preset.id
                          ? 'text-[#6b0028] font-bold bg-rose-50/60'
                          : 'text-neutral-700'
                      }`}
                    >
                      <span>{preset.label}</span>
                      {simulatedTimePreset === preset.id && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6b0028]" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 
        SMOOTH SCROLLING MARKET LIST CONTAINER
        Only this vertical list scrolls, while Top Bar, Promotional Banner, 
        and Quick Action Buttons remain rigidly pinned at top!
      */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2.5 pb-24 overscroll-contain">
        {markets.map((market) => {
          // Real-time evaluation based on current system time
          const liveStatus = getMarketLiveStatus(market);
          const isRunning = liveStatus.status === 'running';
          const isHoliday = liveStatus.status === 'holiday';

          return (
            <div
              key={market.id}
              className={`bg-white rounded-2xl p-4 shadow-2xs border transition-all relative overflow-hidden ${
                isRunning
                  ? 'border-neutral-200/90 hover:shadow-md'
                  : 'border-neutral-200/60 opacity-90'
              }`}
            >
              {/* Active running pulse ribbon on left */}
              {isRunning && (
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500 shadow-sm" />
              )}
              {isHoliday && (
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-500 shadow-sm" />
              )}

              <div className="flex items-center justify-between gap-2">
                {/* Market Details */}
                <div className="space-y-1 flex-1">
                  {/* Name + Info Button */}
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-extrabold text-neutral-900 text-sm tracking-wide">
                      {market.name}
                    </h3>
                    <button
                      onClick={() => setChartMarket(market)}
                      className="text-neutral-400 hover:text-[#6b0028] p-0.5 rounded-full hover:bg-neutral-100 transition"
                      title="View Panel Chart"
                    >
                      <Info size={16} />
                    </button>
                  </div>

                  {/* Result Number */}
                  <div className="text-base font-black tracking-wider text-neutral-800">
                    {market.result}
                  </div>

                  {/* Dynamic Status Badge & Live Timer */}
                  <div className="flex items-center flex-wrap gap-2 pt-0.5">
                    {isRunning ? (
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        <span className="text-xs font-bold text-emerald-600">
                          Bet is Running
                        </span>
                        {/* Real-time countdown timer */}
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-100/70 text-emerald-800">
                          ⏳ {liveStatus.timeRemainingText} left
                        </span>
                      </div>
                    ) : isHoliday ? (
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        <span className="text-xs font-bold text-amber-600">
                          Holiday
                        </span>
                        <span className="text-[10px] font-medium text-amber-700">
                          (Market Closed Today)
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                        <span className="text-xs font-semibold text-rose-600">
                          Closed for today
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Timings */}
                  <div className="flex items-center gap-4 text-[11px] text-neutral-500 pt-0.5 font-medium">
                    <span>Open Bids : {market.openBidsText}</span>
                    <span>Close Bids : {market.closeBidsText}</span>
                  </div>
                </div>

                {/* Real-time Interactive Play Button */}
                <div className="pl-1 shrink-0">
                  {isRunning ? (
                    <button
                      onClick={() => {
                        setSelectedMarketForBid(market);
                        setActiveScreen('game_center');
                      }}
                      className="w-13 h-13 sm:w-14 sm:h-14 rounded-full border-2 border-emerald-500 bg-emerald-50 hover:bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-md active:scale-95 transition-transform group"
                      title="Play Market"
                    >
                      <Play
                        size={28}
                        className="fill-emerald-600 ml-1 group-hover:scale-110 transition-transform"
                      />
                    </button>
                  ) : (
                    <div
                      className="w-13 h-13 sm:w-14 sm:h-14 rounded-full border-2 border-neutral-300 bg-neutral-100 flex flex-col items-center justify-center text-neutral-400 cursor-not-allowed opacity-75"
                      title={isHoliday ? 'Holiday - Market Closed' : 'Closed for today'}
                    >
                      <Lock size={18} className="text-neutral-400" />
                      <span className="text-[8px] font-bold uppercase tracking-tight text-neutral-400 mt-0.5">
                        Closed
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      <PanelChartModal
        market={chartMarket}
        onClose={() => setChartMarket(null)}
      />

      <StarlineModal
        isOpen={showStarline}
        onClose={() => setShowStarline(false)}
      />

      <JackpotModal
        isOpen={showJackpot}
        onClose={() => setShowJackpot(false)}
      />
    </div>
  );
};

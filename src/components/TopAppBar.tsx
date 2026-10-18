import React from 'react';
import { useApp } from '../context/AppContext';
import { Menu, Bell, Wallet } from 'lucide-react';

export const TopAppBar: React.FC<{
  onOpenDrawer: () => void;
  onOpenNotifications: () => void;
}> = ({ onOpenDrawer, onOpenNotifications }) => {
  const { user, setActiveScreen, unreadNotificationsCount } = useApp();

  return (
    <header className="sticky top-0 z-30 bg-[#6b0028] text-white shadow-md">
      {/* Top Navbar */}
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left: Drawer Hamburger & Brand Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenDrawer}
            className="p-1.5 rounded-lg hover:bg-white/10 active:scale-95 transition"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-bold tracking-tight font-serif italic drop-shadow-sm">
            Dhan Raj
          </h1>
        </div>

        {/* Right: Notifications & Live Wallet Balance */}
        <div className="flex items-center gap-2.5">
          {/* Notification Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-full hover:bg-white/10 active:scale-95 transition"
            aria-label="Notifications"
          >
            <Bell size={20} />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-amber-400 rounded-full ring-2 ring-[#6b0028] animate-pulse" />
            )}
          </button>

          {/* Wallet Balance Pill */}
          <button
            onClick={() => setActiveScreen('add_fund')}
            className="flex items-center gap-1.5 bg-white text-neutral-900 px-3 py-1.5 rounded-full font-bold text-xs shadow-md active:scale-95 transition hover:bg-neutral-50"
          >
            <Wallet size={15} className="text-[#6b0028]" />
            <span>₹{user?.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}</span>
          </button>
        </div>
      </div>

      {/* Marquee Banner */}
      <div className="bg-[#52001e] py-1.5 px-3 overflow-hidden border-t border-rose-950/50 flex items-center">
        <div className="w-full overflow-hidden whitespace-nowrap">
          <span className="animate-marquee inline-block text-[12px] font-medium text-amber-300 tracking-wide">
            भरोसा, क्वालिटी और बेहतरीन सर्विस — यही पहचान है DhanRaj Games की ⭐ India's Fastest Gaming & Matka Platform ⭐ 24x7 Instant Deposit & Instant Withdrawal ⭐ Best Game Rates Single: 10 Ka 95, Jodi: 10 Ka 950 ⭐
          </span>
        </div>
      </div>
    </header>
  );
};

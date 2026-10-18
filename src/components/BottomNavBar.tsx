import React from 'react';
import { useApp } from '../context/AppContext';
import { Gavel, BookOpen, Home, Wallet, Headphones } from 'lucide-react';

export const BottomNavBar: React.FC = () => {
  const { activeScreen, setActiveScreen } = useApp();

  const navItems = [
    { id: 'history', label: 'My Bids', icon: Gavel },
    { id: 'passbook', label: 'Passbook', icon: BookOpen },
    { id: 'home', label: 'Home', icon: Home },
    { id: 'funds', label: 'Funds', icon: Wallet },
    { id: 'support', label: 'Support', icon: Headphones },
  ];

  return (
    <div className="bg-[#6b0028] text-white py-2 px-3 border-t border-rose-950/40 shadow-2xl flex items-center justify-around z-40 select-none">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeScreen === item.id || 
          (item.id === 'funds' && ['funds', 'add_fund', 'withdraw_fund', 'bank_details', 'deposit_history', 'withdrawal_history'].includes(activeScreen)) ||
          (item.id === 'history' && ['history', 'bid_history', 'result_history', 'starline_bid_history', 'jackpot_bid_history'].includes(activeScreen));

        return (
          <button
            key={item.id}
            onClick={() => setActiveScreen(item.id)}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              isActive ? 'text-amber-300 font-bold scale-105' : 'text-white/70 hover:text-white'
            }`}
          >
            <div className={`p-1 rounded-full ${isActive ? 'bg-white/15' : ''}`}>
              <Icon size={20} className={isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'} />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

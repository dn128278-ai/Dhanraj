import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  User,
  Home,
  Wallet,
  History,
  Shield,
  HelpCircle,
  KeyRound,
  LogOut,
  Share2,
  Percent,
  FileCode2,
} from 'lucide-react';
import { DhanRajLogo } from './DhanRajLogo';

export const SidebarDrawer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onOpenCodeCenter: () => void;
}> = ({ isOpen, onClose, onOpenCodeCenter }) => {
  const { user, logout, setActiveScreen } = useApp();
  const [showGameRates, setShowGameRates] = useState(false);
  const [showNotice, setShowNotice] = useState(false);

  if (!isOpen) return null;

  const navigateTo = (screen: string) => {
    setActiveScreen(screen);
    onClose();
  };

  const gameRates = [
    { name: 'Single Digit', rate: '10 Ka 95' },
    { name: 'Jodi Digit', rate: '10 Ka 950' },
    { name: 'Single Pana', rate: '10 Ka 1,500' },
    { name: 'Double Pana', rate: '10 Ka 3,000' },
    { name: 'Triple Pana', rate: '10 Ka 7,000' },
    { name: 'Half Sangam', rate: '10 Ka 10,000' },
    { name: 'Full Sangam', rate: '10 Ka 1,00,000' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 overflow-hidden">
        {/* Header Profile Card */}
        <div className="bg-gradient-to-br from-[#6b0028] to-[#8c0838] text-white p-5">
          <div className="flex items-center justify-between mb-3">
            <DhanRajLogo size={52} className="border-none shadow-md" />
            <button
              onClick={onClose}
              className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition text-white"
            >
              <X size={20} />
            </button>
          </div>

          <h3 className="font-extrabold text-base tracking-wide">{user?.name || 'Girish'}</h3>
          <p className="text-xs text-rose-200 font-semibold">{user?.phone || '7231001800'}</p>

          <div className="mt-3 pt-2 border-t border-rose-900/50 flex items-center justify-between">
            <span className="text-[11px] text-rose-200">Wallet Balance:</span>
            <span className="font-bold text-amber-300 text-sm">
              ₹{user?.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}
            </span>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto py-2 px-3 space-y-1 text-sm font-semibold text-neutral-700">
          <button
            onClick={() => navigateTo('home')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-neutral-100 transition text-left"
          >
            <Home size={18} className="text-[#6b0028]" />
            <span>Home</span>
          </button>

          <button
            onClick={() => navigateTo('funds')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-neutral-100 transition text-left"
          >
            <Wallet size={18} className="text-[#6b0028]" />
            <span>Funds & Wallet</span>
          </button>

          <button
            onClick={() => navigateTo('history')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-neutral-100 transition text-left"
          >
            <History size={18} className="text-[#6b0028]" />
            <span>History & Bids</span>
          </button>

          <button
            onClick={() => setShowGameRates(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-neutral-100 transition text-left"
          >
            <Percent size={18} className="text-[#6b0028]" />
            <span>Game Rates</span>
          </button>

          <button
            onClick={() => setShowNotice(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-neutral-100 transition text-left"
          >
            <Shield size={18} className="text-[#6b0028]" />
            <span>Rules & Notice</span>
          </button>

          <button
            onClick={() => navigateTo('support')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-neutral-100 transition text-left"
          >
            <HelpCircle size={18} className="text-[#6b0028]" />
            <span>Support & Helpdesk</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenCodeCenter();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-amber-50 text-amber-900 hover:bg-amber-100 transition text-left border border-amber-200/80 font-bold"
          >
            <FileCode2 size={18} className="text-amber-700" />
            <span>Flutter & APK Code</span>
          </button>

          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'Dhan Raj Games',
                  text: 'Download Dhan Raj Games - Best Satta Matka & Gaming App!',
                  url: window.location.href,
                }).catch(() => {});
              } else {
                alert('Share link copied to clipboard!');
              }
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-neutral-100 transition text-left"
          >
            <Share2 size={18} className="text-[#6b0028]" />
            <span>Share App</span>
          </button>

          <button
            onClick={() => {
              alert(`Your current mPIN is: ${user?.mpin || '1234'}`);
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-neutral-100 transition text-left"
          >
            <KeyRound size={18} className="text-[#6b0028]" />
            <span>Change mPIN</span>
          </button>
        </div>

        {/* Footer Logout */}
        <div className="p-3 border-t border-neutral-100">
          <button
            onClick={() => {
              onClose();
              logout();
            }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-sm transition"
          >
            <LogOut size={16} />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Game Rates Modal */}
      {showGameRates && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/75">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-base text-neutral-900">Official Game Rates</h3>
              <button onClick={() => setShowGameRates(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="divide-y text-xs">
              {gameRates.map((r) => (
                <div key={r.name} className="py-2.5 flex justify-between font-medium">
                  <span className="text-neutral-700">{r.name}</span>
                  <span className="font-bold text-[#6b0028]">{r.rate}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowGameRates(false)}
              className="w-full bg-[#6b0028] text-white py-2.5 rounded-xl font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Notice & Rules Modal */}
      {showNotice && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/75">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-base text-neutral-900">Rules & Notices</h3>
              <button onClick={() => setShowNotice(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="text-xs text-neutral-600 space-y-2 leading-relaxed">
              <p>• Results are declared directly as per official board timing.</p>
              <p>• Minimum withdrawal is ₹1,000/- with 24x7 instant processing.</p>
              <p>• Only 18+ individuals are permitted to participate.</p>
              <p>• Never share your 4-digit mPIN with anyone.</p>
            </div>
            <button
              onClick={() => setShowNotice(false)}
              className="w-full bg-[#6b0028] text-white py-2.5 rounded-xl font-bold text-xs"
            >
              I Understand
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

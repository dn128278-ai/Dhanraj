import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TopAppBar } from '../TopAppBar';
import { Wallet, ArrowDownToLine, Landmark, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { AddFundView } from './AddFundView';
import { WithdrawFundView } from './WithdrawFundView';
import { BankDetailsView } from './BankDetailsView';
import { TransactionHistoryView } from './TransactionHistoryView';

export const FundsHub: React.FC<{
  onOpenDrawer: () => void;
  onOpenNotifications: () => void;
}> = ({ onOpenDrawer, onOpenNotifications }) => {
  const { activeScreen, setActiveScreen } = useApp();
  const [localView, setLocalView] = useState<string | null>(null);

  const effectiveView = ['add_fund', 'withdraw_fund', 'bank_details', 'deposit_history', 'withdrawal_history'].includes(activeScreen)
    ? activeScreen
    : localView;

  const fundsOptions = [
    {
      id: 'add_fund',
      title: 'Add Fund',
      icon: Wallet,
    },
    {
      id: 'withdraw_fund',
      title: 'Withdraw Fund',
      icon: ArrowDownToLine,
    },
    {
      id: 'bank_details',
      title: 'Bank Details',
      icon: Landmark,
    },
    {
      id: 'deposit_history',
      title: 'Deposit History',
      icon: ArrowDownLeft,
    },
    {
      id: 'withdrawal_history',
      title: 'Withdrawal History',
      icon: ArrowUpRight,
    },
  ];

  const handleBack = () => {
    setLocalView(null);
    setActiveScreen('funds');
  };

  if (effectiveView === 'add_fund') {
    return <AddFundView onBack={handleBack} />;
  }
  if (effectiveView === 'withdraw_fund') {
    return <WithdrawFundView onBack={handleBack} />;
  }
  if (effectiveView === 'bank_details') {
    return <BankDetailsView onBack={handleBack} />;
  }
  if (effectiveView === 'deposit_history') {
    return <TransactionHistoryView title="Deposit History" type="deposit" onBack={handleBack} />;
  }
  if (effectiveView === 'withdrawal_history') {
    return <TransactionHistoryView title="Withdrawal History" type="withdrawal" onBack={handleBack} />;
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
          Funds
        </h2>

        {/* 5 Action Option Cards matching video 00:53 */}
        <div className="space-y-3">
          {fundsOptions.map((opt) => {
            const Icon = opt.icon;
            return (
              <button
                key={opt.id}
                onClick={() => {
                  setLocalView(opt.id);
                  setActiveScreen(opt.id);
                }}
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

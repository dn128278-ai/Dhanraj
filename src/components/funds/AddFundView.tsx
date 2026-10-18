import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, CheckCircle2, QrCode } from 'lucide-react';
import confetti from 'canvas-confetti';

export const AddFundView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { user, addFunds } = useApp();
  const [amount, setAmount] = useState<string>('500');
  const [showPaymentSheet, setShowPaymentSheet] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState<'gpay' | 'phonepe' | 'paytm' | 'qr'>('phonepe');
  const [isProcessing, setIsProcessing] = useState(false);

  const presets = [500, 1000, 1500, 2000];

  const handlePayNow = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(amount);
    if (!val || val <= 0) {
      alert('Please enter a valid deposit amount');
      return;
    }
    setShowPaymentSheet(true);
  };

  const confirmDeposit = () => {
    const val = parseInt(amount);
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowPaymentSheet(false);
      addFunds(val, selectedGateway.toUpperCase());
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
      onBack();
    }, 900);
  };

  return (
    <div className="min-h-full flex flex-col bg-neutral-100 text-neutral-900 pb-20 select-none">
      {/* Top Header matching video 00:55 */}
      <div className="bg-[#6b0028] text-white px-4 py-3.5 flex items-center gap-3 shadow-md sticky top-0 z-30">
        <button
          onClick={onBack}
          className="p-1 rounded-full hover:bg-white/10 active:scale-95 transition"
        >
          <ArrowLeft size={22} />
        </button>
        <h2 className="text-lg font-bold tracking-wide">Add Fund</h2>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        {/* Maroon Profile & Available Balance Card matching video 00:55 */}
        <div className="bg-[#6b0028] text-white rounded-2xl p-5 shadow-lg text-center space-y-1 mb-6">
          <h3 className="text-lg font-bold tracking-wide">{user?.name || 'Girish'}</h3>
          <p className="text-sm font-semibold tracking-wider text-rose-200">
            {user?.phone || '7231001800'}
          </p>
          <div className="pt-2">
            <span className="text-xs text-rose-200 font-medium">Available Balance</span>
            <div className="text-2xl font-black tracking-tight text-white mt-0.5">
              ₹{user?.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}
            </div>
          </div>
        </div>

        {/* Amount Input with Large Rupee Symbol */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200/80 mb-6">
          <div className="flex items-center justify-center border-b-2 border-neutral-300 pb-3 mb-6 focus-within:border-[#6b0028] transition-colors">
            <span className="text-3xl font-bold text-neutral-800 mr-2">₹</span>
            <input
              type="number"
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter Amount"
              className="w-full text-center text-3xl font-extrabold text-neutral-900 outline-none bg-transparent placeholder-neutral-300"
              autoFocus
            />
          </div>

          {/* 4 Preset Amount Buttons matching video 00:55: 500, 1000, 1500, 2000 */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {presets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setAmount(preset.toString())}
                className={`py-3 rounded-xl font-bold text-base border transition-all ${
                  amount === preset.toString()
                    ? 'border-[#6b0028] bg-rose-50 text-[#6b0028] shadow-xs'
                    : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Pay Now Button matching video 00:56 */}
          <button
            onClick={handlePayNow}
            disabled={!amount || parseInt(amount) <= 0}
            className="w-full bg-[#6b0028] hover:bg-[#580021] text-white py-3.5 rounded-xl font-bold text-base shadow-lg hover:shadow-xl active:scale-[0.98] transition-all disabled:opacity-50"
          >
            Pay Now
          </button>
        </div>

        {/* Security badges */}
        <div className="mt-auto py-2 text-center text-xs text-neutral-400 font-medium">
          Instant Auto Credit • 100% Safe & Encrypted UPI Gateway
        </div>
      </div>

      {/* Payment Gateway Bottom Sheet Simulation */}
      {showPaymentSheet && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-0 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-t-3xl max-w-md w-full p-6 shadow-2xl border-t border-neutral-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <h3 className="font-bold text-base text-neutral-900">Select UPI App</h3>
              <span className="text-xs font-bold text-[#6b0028]">Paying ₹{amount}</span>
            </div>

            <div className="space-y-2.5">
              {[
                { id: 'phonepe', name: 'PhonePe UPI', tag: 'Fastest' },
                { id: 'gpay', name: 'Google Pay UPI', tag: 'Popular' },
                { id: 'paytm', name: 'Paytm UPI', tag: 'Instant' },
                { id: 'qr', name: 'Scan Any UPI QR', tag: 'All Apps' },
              ].map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => setSelectedGateway(opt.id as any)}
                  className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition ${
                    selectedGateway === opt.id
                      ? 'border-[#6b0028] bg-rose-50/60'
                      : 'border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center font-bold text-xs text-[#6b0028]">
                      {opt.id === 'qr' ? <QrCode size={18} /> : opt.name[0]}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-neutral-800">{opt.name}</div>
                      <div className="text-[10px] text-neutral-500">Zero Transaction Charges</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full font-semibold">
                      {opt.tag}
                    </span>
                    <input
                      type="radio"
                      checked={selectedGateway === opt.id}
                      onChange={() => setSelectedGateway(opt.id as any)}
                      className="accent-[#6b0028]"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowPaymentSheet(false)}
                className="flex-1 py-3 rounded-xl border border-neutral-200 font-bold text-sm text-neutral-600 hover:bg-neutral-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeposit}
                disabled={isProcessing}
                className="flex-1 py-3 rounded-xl bg-[#6b0028] text-white font-bold text-sm shadow-md hover:bg-[#580021] flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    <span>Pay ₹{amount}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, X, AlertTriangle } from 'lucide-react';

export const WithdrawFundView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { user, withdrawFunds } = useApp();
  const [showTermsModal, setShowTermsModal] = useState<boolean>(true);
  const [amount, setAmount] = useState<string>('1000');
  const [paymentMethod, setPaymentMethod] = useState<'Gpay' | 'PhonePe' | 'Paytm' | 'Bank Transfer'>('Gpay');
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const val = parseInt(amount);

    if (!val || val < 1000) {
      setError('Minimum withdrawal amount is ₹1,000/-');
      return;
    }

    if ((user?.balance || 0) < val) {
      setError('Insufficient wallet balance!');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const res = withdrawFunds(val, paymentMethod);
      if (res.success) {
        onBack();
      } else if (res.error) {
        setError(res.error);
      }
    }, 700);
  };

  return (
    <div className="min-h-full flex flex-col bg-neutral-100 text-neutral-900 pb-20 select-none relative">
      {/* Top Header matching video 01:00 */}
      <div className="bg-[#6b0028] text-white px-4 py-3.5 flex items-center gap-3 shadow-md sticky top-0 z-30">
        <button
          onClick={onBack}
          className="p-1 rounded-full hover:bg-white/10 active:scale-95 transition"
        >
          <ArrowLeft size={22} />
        </button>
        <h2 className="text-lg font-bold tracking-wide">Withdraw Funds</h2>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        {/* Maroon Profile Card matching video 01:00 */}
        <div className="bg-[#6b0028] text-white rounded-2xl p-5 shadow-lg text-center space-y-1 mb-6">
          <h3 className="text-lg font-bold tracking-wide">{user?.name || 'Girish'}</h3>
          <div className="pt-2">
            <span className="text-xs text-rose-200 font-medium">Available Balance</span>
            <div className="text-2xl font-black tracking-tight text-white mt-0.5">
              ₹{user?.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200/80 mb-4">
          <label className="block text-center text-sm font-bold text-neutral-800 mb-4">
            Enter Amount
          </label>

          {/* Amount input */}
          <div className="flex items-center justify-center border-b-2 border-neutral-300 pb-3 mb-6 focus-within:border-[#6b0028] transition-colors">
            <span className="text-3xl font-bold text-neutral-800 mr-2">₹</span>
            <input
              type="number"
              inputMode="numeric"
              min={1000}
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (error) setError('');
              }}
              placeholder="Enter Amount"
              className="w-full text-center text-3xl font-extrabold text-neutral-900 outline-none bg-transparent placeholder-neutral-300"
            />
          </div>

          {/* Payment Method Radio Options matching video 01:00 */}
          <div className="mb-6">
            <div className="flex items-center justify-around gap-2 py-2 overflow-x-auto no-scrollbar">
              {(['Gpay', 'PhonePe', 'Paytm', 'Bank Transfer'] as const).map((method) => (
                <label
                  key={method}
                  className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-neutral-800 whitespace-nowrap"
                >
                  <input
                    type="radio"
                    name="withdrawMethod"
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)}
                    className="accent-[#6b0028] w-4 h-4"
                  />
                  <span>{method}</span>
                </label>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-1.5 p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
              <AlertTriangle size={15} />
              <span>{error}</span>
            </div>
          )}

          {/* Send Request Button matching video 01:00 */}
          <button
            onClick={handleSendRequest}
            disabled={isSubmitting || !amount || parseInt(amount) < 1000}
            className="w-full bg-[#6b0028] hover:bg-[#580021] text-white py-3.5 rounded-xl font-bold text-base shadow-lg hover:shadow-xl active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Send Request'
            )}
          </button>
        </div>

        {/* View terms again button */}
        <div className="text-center mt-2">
          <button
            type="button"
            onClick={() => setShowTermsModal(true)}
            className="text-xs text-[#6b0028] font-bold underline"
          >
            View Withdrawal Terms & Conditions
          </button>
        </div>
      </div>

      {/* Terms & Conditions Modal matching video 00:59 */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-neutral-200 flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="bg-[#6b0028] text-white px-5 py-4 flex items-center justify-between">
              <h3 className="font-bold text-lg">Terms & Conditions</h3>
              <button
                onClick={() => setShowTermsModal(false)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Terms List exactly from video 00:59 */}
            <div className="p-5 overflow-y-auto text-xs leading-relaxed text-neutral-800 space-y-3 font-medium">
              <div className="flex gap-2">
                <span className="font-bold text-[#6b0028]">1</span>
                <span><strong>Minimum Withdrawal:</strong> ₹1000/-</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold text-[#6b0028]">2</span>
                <span><strong>Maximum Withdrawal:</strong> ₹25,00,000 per day</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold text-[#6b0028]">3</span>
                <span><strong>Processing Time:</strong> ⏳ 1-72 hours (depends on bank server & working days)</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold text-[#6b0028]">4</span>
                <span><strong>Withdrawal Timing:</strong> 🕐 10:00 AM - 09:00 PM (daily)</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold text-[#6b0028]">5</span>
                <span><strong>Availability:</strong> ✅ Withdrawals available on all days of the week</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold text-[#6b0028]">6</span>
                <span><strong>Bank Details:</strong> 🚨 Please ensure your bank details are correct. Wrong details will be the user's responsibility.</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold text-[#6b0028]">7</span>
                <span>
                  <strong>Please avoid adding the following banks to get fast withdrawals:</strong> 🚫 India Post Payments Bank, Fino Payments Bank, NSDL Payments Bank, Airtel Payments Bank, Jio Payments Bank, Equitas Small Finance Bank, Andhra Bank.
                </span>
              </div>
            </div>

            {/* Ok Button */}
            <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex justify-center">
              <button
                onClick={() => setShowTermsModal(false)}
                className="w-full bg-[#6b0028] hover:bg-[#580021] text-white py-3 rounded-xl font-bold text-sm shadow-md active:scale-98 transition"
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

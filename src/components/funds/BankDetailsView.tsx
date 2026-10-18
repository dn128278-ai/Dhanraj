import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { BankDetails } from '../../types';

export const BankDetailsView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { user, updateBankDetails } = useApp();

  const [formData, setFormData] = useState<BankDetails>(() => {
    return user?.bankDetails || {
      accountHolderName: 'Girish Meena',
      accountNumber: '9182371900129',
      ifscCode: 'SBIN0004521',
      bankName: 'State Bank of India',
      branchName: 'Main Branch Jaipur',
      gpayNumber: '7231001800',
      phonePeNumber: '7231001800',
      paytmNumber: '7231001800',
    };
  });

  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      updateBankDetails(formData);
      onBack();
    }, 600);
  };

  return (
    <div className="min-h-full flex flex-col bg-neutral-100 text-neutral-900 pb-20 select-none">
      {/* Top Header matching video 01:05 */}
      <div className="bg-[#6b0028] text-white px-4 py-3.5 flex items-center gap-3 shadow-md sticky top-0 z-30">
        <button
          onClick={onBack}
          className="p-1 rounded-full hover:bg-white/10 active:scale-95 transition"
        >
          <ArrowLeft size={22} />
        </button>
        <h2 className="text-lg font-bold tracking-wide">Update Payment Details</h2>
      </div>

      {/* Form matching video 01:05-01:07 */}
      <div className="p-4 flex-1">
        <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-3xl p-5 shadow-sm border border-neutral-200/80">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-neutral-600 mb-1">Name</label>
            <input
              type="text"
              value={formData.accountHolderName}
              onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })}
              placeholder="Enter Account Holder Name"
              className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 text-sm font-semibold text-neutral-800 outline-none focus:border-[#6b0028]"
              required
            />
          </div>

          {/* Account Number */}
          <div>
            <label className="block text-xs font-semibold text-neutral-600 mb-1">Account Number</label>
            <input
              type="text"
              value={formData.accountNumber}
              onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
              placeholder="Enter Account Number"
              className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 text-sm font-semibold text-neutral-800 outline-none focus:border-[#6b0028]"
              required
            />
          </div>

          {/* IFSC Code */}
          <div>
            <label className="block text-xs font-semibold text-neutral-600 mb-1">IFSC Code</label>
            <input
              type="text"
              value={formData.ifscCode}
              onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })}
              placeholder="Enter IFSC Code"
              className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 text-sm font-semibold text-neutral-800 uppercase outline-none focus:border-[#6b0028]"
              required
            />
          </div>

          {/* Bank Name */}
          <div>
            <label className="block text-xs font-semibold text-neutral-600 mb-1">Bank Name</label>
            <input
              type="text"
              value={formData.bankName}
              onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
              placeholder="Enter Bank Name"
              className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 text-sm font-semibold text-neutral-800 outline-none focus:border-[#6b0028]"
              required
            />
          </div>

          {/* Branch Name */}
          <div>
            <label className="block text-xs font-semibold text-neutral-600 mb-1">Branch Name</label>
            <input
              type="text"
              value={formData.branchName}
              onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}
              placeholder="Enter Branch Name"
              className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 text-sm font-semibold text-neutral-800 outline-none focus:border-[#6b0028]"
              required
            />
          </div>

          {/* Gpay Number */}
          <div>
            <label className="block text-xs font-semibold text-neutral-600 mb-1">Gpay Number</label>
            <input
              type="tel"
              inputMode="numeric"
              value={formData.gpayNumber}
              onChange={(e) => setFormData({ ...formData, gpayNumber: e.target.value.replace(/\D/g, '') })}
              placeholder="Enter Gpay Number"
              className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 text-sm font-semibold text-neutral-800 outline-none focus:border-[#6b0028]"
            />
          </div>

          {/* PhonePe Number */}
          <div>
            <label className="block text-xs font-semibold text-neutral-600 mb-1">PhonePe Number</label>
            <input
              type="tel"
              inputMode="numeric"
              value={formData.phonePeNumber}
              onChange={(e) => setFormData({ ...formData, phonePeNumber: e.target.value.replace(/\D/g, '') })}
              placeholder="Enter PhonePe Number"
              className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 text-sm font-semibold text-neutral-800 outline-none focus:border-[#6b0028]"
            />
          </div>

          {/* Paytm Number */}
          <div>
            <label className="block text-xs font-semibold text-neutral-600 mb-1">Paytm Number</label>
            <input
              type="tel"
              inputMode="numeric"
              value={formData.paytmNumber}
              onChange={(e) => setFormData({ ...formData, paytmNumber: e.target.value.replace(/\D/g, '') })}
              placeholder="Enter Paytm Number"
              className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 text-sm font-semibold text-neutral-800 outline-none focus:border-[#6b0028]"
            />
          </div>

          {/* Update Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isUpdating}
              className="w-full bg-[#6b0028] hover:bg-[#580021] text-white py-3.5 rounded-xl font-bold text-base shadow-lg active:scale-98 transition flex items-center justify-center gap-2"
            >
              {isUpdating ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Update'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

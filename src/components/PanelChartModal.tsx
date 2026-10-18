import React from 'react';
import { Market } from '../types';
import { X, Calendar } from 'lucide-react';

export const PanelChartModal: React.FC<{
  market: Market | null;
  onClose: () => void;
}> = ({ market, onClose }) => {
  if (!market) return null;

  // Mock historical week records for this market panel chart
  const historicalRecords = [
    { day: 'Mon', date: '12/10/26', openPana: '125', jodi: '81', closePana: '100' },
    { day: 'Tue', date: '13/10/26', openPana: '249', jodi: '54', closePana: '248' },
    { day: 'Wed', date: '14/10/26', openPana: '378', jodi: '89', closePana: '469' },
    { day: 'Thu', date: '15/10/26', openPana: '139', jodi: '32', closePana: '345' },
    { day: 'Fri', date: '16/10/26', openPana: '158', jodi: '47', closePana: '269' },
    { day: 'Sat', date: '17/10/26', openPana: market.result.split('-')[0] || '250', jodi: market.result.split('-')[1] || '7*', closePana: market.result.split('-')[2] || '***' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-neutral-200">
        {/* Header */}
        <div className="bg-[#6b0028] text-white px-5 py-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg">{market.name}</h3>
            <p className="text-xs text-rose-200">Official Panel Chart Record</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[70vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-3 text-xs font-semibold text-neutral-500 px-1">
            <span className="flex items-center gap-1"><Calendar size={13} /> Current Week Record</span>
            <span className="text-[#6b0028]">Live Updates</span>
          </div>

          <div className="border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-center text-xs">
              <thead className="bg-[#6b0028]/10 font-bold text-neutral-800">
                <tr className="border-b border-neutral-200">
                  <th className="py-2.5 px-2">Date / Day</th>
                  <th className="py-2.5 px-2">Open Patti</th>
                  <th className="py-2.5 px-2">Jodi</th>
                  <th className="py-2.5 px-2">Close Patti</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-medium">
                {historicalRecords.map((item, i) => (
                  <tr
                    key={i}
                    className={i === historicalRecords.length - 1 ? 'bg-amber-50/70 font-bold' : 'hover:bg-neutral-50'}
                  >
                    <td className="py-2.5 px-2 text-neutral-600">
                      <div>{item.date}</div>
                      <div className="text-[10px] text-neutral-400">{item.day}</div>
                    </td>
                    <td className="py-2.5 px-2 text-[#6b0028] font-bold tracking-wider">{item.openPana}</td>
                    <td className="py-2.5 px-2 font-black text-rose-950 text-sm tracking-wider">{item.jodi}</td>
                    <td className="py-2.5 px-2 text-[#6b0028] font-bold tracking-wider">{item.closePana}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex flex-col gap-1">
            <p className="font-semibold">Market Timings:</p>
            <div className="flex justify-between">
              <span>Open Bids: {market.openBidsText}</span>
              <span>Close Bids: {market.closeBidsText}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex justify-end">
          <button
            onClick={onClose}
            className="w-full bg-[#6b0028] text-white py-2.5 rounded-xl font-semibold text-sm shadow hover:bg-[#580021] transition active:scale-98"
          >
            Close Chart
          </button>
        </div>
      </div>
    </div>
  );
};

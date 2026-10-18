import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Bell, CheckCheck } from 'lucide-react';

export const NotificationsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationsAsRead } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-neutral-200 flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="bg-[#6b0028] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell size={20} />
            <h3 className="font-bold text-base">Notifications</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={markNotificationsAsRead}
              className="text-xs text-rose-200 hover:text-white flex items-center gap-1 font-semibold"
            >
              <CheckCheck size={14} />
              <span>Mark all read</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white ml-2"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {notifications.map((item) => (
            <div
              key={item.id}
              className={`p-3.5 rounded-2xl border transition ${
                item.read
                  ? 'bg-neutral-50/70 border-neutral-200 text-neutral-600'
                  : 'bg-rose-50/60 border-rose-200 text-neutral-900 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-bold text-xs sm:text-sm text-neutral-900">{item.title}</h4>
                <span className="text-[10px] text-neutral-400 font-medium">{item.time}</span>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">{item.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

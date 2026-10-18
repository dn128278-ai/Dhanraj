import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Phone, MessageSquare, Send, X, Bot, User, CheckCircle2 } from 'lucide-react';

export const SupportScreen: React.FC = () => {
  const { setActiveScreen, user } = useApp();
  const [showLiveChat, setShowLiveChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'agent'; text: string; time: string }>>([
    {
      sender: 'agent',
      text: 'Namaste! Welcome to Dhan Raj Games Official 24x7 Helpdesk. How can we help you today with your account, deposit, or withdrawal?',
      time: 'Just now',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const supportPhone = '+917231001800';
  const whatsappNumber = '917231001800';

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage.trim();
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setChatMessages((prev) => [
      ...prev,
      { sender: 'user', text: userText, time: nowTime },
    ]);
    setInputMessage('');

    // Automated smart agent response
    setTimeout(() => {
      let reply = 'Thank you for reaching out. Our support agent is reviewing your request. For urgent issues with deposits or withdrawals, you can also reach us directly via WhatsApp at +91 7231001800.';
      const lower = userText.toLowerCase();
      if (lower.includes('deposit') || lower.includes('add')) {
        reply = 'Deposits are credited automatically via UPI within 30-60 seconds. If your money was deducted but not shown in wallet, please send the 12-digit UTR/Ref ID here or on WhatsApp.';
      } else if (lower.includes('withdraw')) {
        reply = 'Withdrawals are processed daily between 10:00 AM - 09:00 PM. Minimum withdrawal is ₹1,000. Funds are credited directly to your registered bank account or UPI.';
      } else if (lower.includes('mpin') || lower.includes('password')) {
        reply = `Your default mPIN is 1234. You can reset or update your mPIN anytime from the sidebar menu under "Change mPIN".`;
      }

      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'agent',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 700);
  };

  return (
    <div className="min-h-full flex flex-col bg-neutral-100 text-neutral-900 pb-20 select-none">
      {/* Top Header matching video 01:15 */}
      <div className="bg-[#6b0028] text-white px-4 py-3.5 flex items-center gap-3 shadow-md sticky top-0 z-30">
        <button
          onClick={() => setActiveScreen('home')}
          className="p-1 rounded-full hover:bg-white/10 active:scale-95 transition"
        >
          <ArrowLeft size={22} />
        </button>
        <h2 className="text-lg font-bold tracking-wide">Contact Us</h2>
      </div>

      <div className="p-4 flex-1 flex flex-col max-w-md mx-auto w-full">
        {/* Subheader */}
        <div className="text-center py-6 px-4">
          <h3 className="text-xl font-bold text-neutral-900 mb-2">Need Help?</h3>
          <p className="text-xs text-neutral-500 font-medium leading-relaxed">
            Contact our support team for any assistance or inquiries.
          </p>
        </div>

        {/* 3 Support Cards matching video 01:15 */}
        <div className="space-y-4">
          {/* Top Row: Call and WhatsApp side-by-side */}
          <div className="grid grid-cols-2 gap-4">
            {/* Call */}
            <a
              href={`tel:${supportPhone}`}
              className="bg-white rounded-3xl p-5 shadow-sm border border-neutral-200/80 flex flex-col items-center justify-center text-center hover:shadow-md transition active:scale-98"
            >
              <div className="w-14 h-14 rounded-full bg-rose-100/80 text-[#6b0028] flex items-center justify-center mb-3 shadow-xs">
                <Phone size={24} />
              </div>
              <h4 className="font-bold text-neutral-900 text-sm">Call</h4>
              <p className="text-xs text-neutral-400 mt-0.5">Call Us</p>
            </a>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/${whatsappNumber}?text=Hello%20DhanRaj%20Support`}
              target="_blank"
              rel="noreferrer"
              className="bg-white rounded-3xl p-5 shadow-sm border border-neutral-200/80 flex flex-col items-center justify-center text-center hover:shadow-md transition active:scale-98"
            >
              <div className="w-14 h-14 rounded-full bg-emerald-100/80 text-emerald-600 flex items-center justify-center mb-3 shadow-xs">
                {/* Custom WhatsApp Icon */}
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm5.78 14.07c-.24.68-1.2 1.25-1.68 1.3-.46.06-1.04.09-3.23-.8-2.8-1.15-4.6-4.01-4.74-4.2-.14-.19-1.14-1.52-1.14-2.9 0-1.38.72-2.06.98-2.35.25-.29.56-.36.75-.36.19 0 .38 0 .54.01.17.01.4.07.61.57.22.53.75 1.83.82 1.97.07.14.11.31.02.49-.09.19-.14.3-.27.46-.14.16-.29.35-.42.48-.14.14-.28.29-.12.57.16.28.72 1.18 1.54 1.91 1.05.94 1.94 1.23 2.22 1.37.28.14.44.12.61-.07.17-.19.72-.84.91-1.13.19-.29.38-.24.64-.14.26.09 1.66.78 1.95.93.28.14.47.22.54.34.07.12.07.72-.17 1.4z" />
                </svg>
              </div>
              <h4 className="font-bold text-neutral-900 text-sm">WhatsApp</h4>
              <p className="text-xs text-neutral-400 mt-0.5">Chat on WhatsApp</p>
            </a>
          </div>

          {/* Chat Support full card */}
          <button
            onClick={() => setShowLiveChat(true)}
            className="w-full bg-white rounded-3xl p-5 shadow-sm border border-neutral-200/80 flex items-center gap-4 text-left hover:shadow-md transition active:scale-98"
          >
            <div className="w-14 h-14 rounded-full bg-rose-100/80 text-[#6b0028] flex items-center justify-center shrink-0 shadow-xs">
              <MessageSquare size={24} />
            </div>
            <div>
              <h4 className="font-bold text-neutral-900 text-base">Chat Support</h4>
              <p className="text-xs text-neutral-500 mt-0.5">Get help from our support team</p>
            </div>
          </button>
        </div>

        {/* Support hours card */}
        <div className="mt-8 bg-amber-50 border border-amber-200/80 rounded-2xl p-4 text-xs text-amber-900">
          <div className="font-bold mb-1 flex items-center gap-1.5">
            <CheckCircle2 size={15} className="text-amber-700" />
            <span>24x7 Customer Helpline</span>
          </div>
          <p>
            Our dedicated support officers are available around the clock to assist you with withdrawals, deposits, and game rules.
          </p>
        </div>
      </div>

      {/* Live Chat Modal */}
      {showLiveChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-neutral-200 flex flex-col h-[80vh]">
            {/* Header */}
            <div className="bg-[#6b0028] text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Dhan Raj Live Support</h3>
                  <span className="text-[10px] text-emerald-300 flex items-center gap-1 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online • Typically replies instantly
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowLiveChat(false)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages Body */}
            <div className="p-4 flex-1 overflow-y-auto space-y-3 bg-neutral-50 text-xs">
              {chatMessages.map((msg, index) => {
                const isAgent = msg.sender === 'agent';
                return (
                  <div
                    key={index}
                    className={`flex gap-2 ${isAgent ? 'justify-start' : 'justify-end'}`}
                  >
                    {isAgent && (
                      <div className="w-7 h-7 rounded-full bg-[#6b0028] text-white flex items-center justify-center shrink-0">
                        <Bot size={15} />
                      </div>
                    )}
                    <div
                      className={`max-w-[75%] p-3 rounded-2xl shadow-xs font-medium leading-relaxed ${
                        isAgent
                          ? 'bg-white text-neutral-800 border border-neutral-200'
                          : 'bg-[#6b0028] text-white rounded-br-none'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <span
                        className={`block text-[9px] mt-1 text-right ${
                          isAgent ? 'text-neutral-400' : 'text-rose-200'
                        }`}
                      >
                        {msg.time}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-neutral-200 flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message here..."
                className="flex-1 bg-neutral-100 rounded-xl px-4 py-2.5 text-xs text-neutral-900 outline-none focus:ring-1 focus:ring-[#6b0028]"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="p-2.5 rounded-xl bg-[#6b0028] text-white hover:bg-[#580021] disabled:opacity-50 transition"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

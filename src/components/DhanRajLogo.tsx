import React from 'react';

export const DhanRajLogo: React.FC<{ size?: number; className?: string }> = ({ size = 96, className = '' }) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative rounded-full border-2 border-[#800020] bg-white p-2 shadow-md flex items-center justify-center ${className}`}
    >
      {/* Outer circle with gradient / maroon border */}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Money pouch shape in maroon */}
        <path
          d="M30 40 C30 30, 42 22, 50 22 C58 22, 70 30, 70 40 C70 44, 66 46, 68 50 C74 58, 80 70, 75 80 C70 90, 30 90, 25 80 C20 70, 26 58, 32 50 C34 46, 30 44, 30 40 Z"
          fill="#6b0028"
        />
        {/* Pouch Tie String */}
        <path
          d="M32 44 Q50 50 68 44"
          stroke="#fcd34d"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <circle cx="50" cy="46" r="3" fill="#fcd34d" />
        <path
          d="M48 46 L42 54"
          stroke="#fcd34d"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M52 46 L58 54"
          stroke="#fcd34d"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Rupee Symbol inside pouch */}
        <text
          x="50"
          y="72"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="24"
          fontWeight="bold"
          fontFamily="Poppins, sans-serif"
        >
          ₹
        </text>
      </svg>
    </div>
  );
};

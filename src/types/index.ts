export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  mpin: string;
  balance: number;
  bankDetails: BankDetails;
  createdAt: string;
}

export interface BankDetails {
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  branchName: string;
  gpayNumber: string;
  phonePeNumber: string;
  paytmNumber: string;
}

export interface Market {
  id: string;
  name: string;
  openTime: string;
  closeTime: string;
  result: string; // e.g. "125-81-100" or "250-7*-***" or "***-**-***"
  status: 'running' | 'closed' | 'holiday';
  openBidsText: string;
  closeBidsText: string;
  type: 'regular' | 'starline' | 'jackpot';
  starlineTime?: string;
  isHoliday?: boolean;
}

export type GameModeType =
  | 'Single Digit'
  | 'Single Digit Bulk'
  | 'Jodi Digit'
  | 'Jodi Digit Bulk'
  | 'Single Pana'
  | 'Single Pana Bulk'
  | 'Double Pana'
  | 'Double Pana Bulk'
  | 'Triple Pana'
  | 'SP Motor'
  | 'DP Motor'
  | 'Red Bracket'
  | 'Group Jodi'
  | 'SP DP TP'
  | 'Half Sangam'
  | 'Full Sangam';

export interface BidItemEntry {
  number: string;
  points: number;
}

export interface Bid {
  id: string;
  marketId: string;
  marketName: string;
  gameType: GameModeType;
  session: 'Open' | 'Close';
  number: string;
  amount: number;
  date: string; // YYYY-MM-DD
  time: string;
  status: 'Pending' | 'Won' | 'Lost';
  winAmount?: number;
  typeCategory: 'regular' | 'starline' | 'jackpot';
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'bid' | 'win';
  amount: number;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  status: 'Success' | 'Processing' | 'Failed';
  method: string;
  refId: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export interface GameRate {
  gameType: string;
  rate: string;
  description: string;
}

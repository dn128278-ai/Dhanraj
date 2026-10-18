import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, Market, Bid, Transaction, BankDetails, NotificationItem } from '../types';
import { evaluateMarketStatus, MarketTimeStatus } from '../utils/marketTimer';

interface AppContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  activeScreen: string;
  setActiveScreen: (screen: string) => void;
  markets: Market[];
  bids: Bid[];
  transactions: Transaction[];
  notifications: NotificationItem[];
  toastMessage: string | null;
  toastType: 'success' | 'error' | 'info';
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  loginWithPhone: (phone: string) => boolean; // returns true if mpin needed, false if new profile needed
  completeRegistration: (name: string, mpin: string) => void;
  loginWithMpin: (mpin: string) => boolean;
  logout: () => void;
  updateBankDetails: (details: BankDetails) => void;
  addFunds: (amount: number, method: string) => void;
  withdrawFunds: (amount: number, method: string) => { success: boolean; error?: string };
  placeBid: (bidData: Omit<Bid, 'id' | 'date' | 'time' | 'status'>) => { success: boolean; error?: string };
  placeBulkBid: (
    market: Market,
    gameType: import('../types').GameModeType,
    session: 'Open' | 'Close',
    entries: import('../types').BidItemEntry[]
  ) => { success: boolean; error?: string };
  selectedMarketForBid: Market | null;
  setSelectedMarketForBid: (market: Market | null) => void;
  selectedGameMode: import('../types').GameModeType | null;
  setSelectedGameMode: (mode: import('../types').GameModeType | null) => void;
  biddingSession: 'Open' | 'Close';
  setBiddingSession: (session: 'Open' | 'Close') => void;
  showWithdrawTerms: boolean;
  setShowWithdrawTerms: (show: boolean) => void;
  unreadNotificationsCount: number;
  markNotificationsAsRead: () => void;
  tempPhone: string;
  setTempPhone: (phone: string) => void;
  tempName: string;
  setTempName: (name: string) => void;
  currentTime: Date;
  simulatedTimePreset: 'live' | 'morning' | 'afternoon' | 'evening' | 'night' | 'closed';
  setSimulatedTimePreset: (preset: 'live' | 'morning' | 'afternoon' | 'evening' | 'night' | 'closed') => void;
  getMarketLiveStatus: (market: Market) => MarketTimeStatus;
}

const INITIAL_MARKETS: Market[] = [
  {
    id: 'm1',
    name: 'DHANRAJ MORNING',
    openTime: '09:10 AM',
    closeTime: '10:10 AM',
    result: '125-81-100',
    status: 'closed',
    openBidsText: '09:10 AM',
    closeBidsText: '10:10 AM',
    type: 'regular',
  },
  {
    id: 'm2',
    name: 'MILAN MORNING',
    openTime: '10:20 AM',
    closeTime: '11:20 AM',
    result: '159-56-330',
    status: 'closed',
    openBidsText: '10:20 AM',
    closeBidsText: '11:20 AM',
    type: 'regular',
  },
  {
    id: 'm3',
    name: 'KALYAN MORNING',
    openTime: '11:30 AM',
    closeTime: '12:30 PM',
    result: '790-60-136',
    status: 'closed',
    openBidsText: '11:30 AM',
    closeBidsText: '12:30 PM',
    type: 'regular',
  },
  {
    id: 'm4',
    name: 'MADHUR MORNING',
    openTime: '11:30 AM',
    closeTime: '12:30 PM',
    result: '223-78-279',
    status: 'closed',
    openBidsText: '11:30 AM',
    closeBidsText: '12:30 PM',
    type: 'regular',
  },
  {
    id: 'm5',
    name: 'SRIDEVI',
    openTime: '11:35 AM',
    closeTime: '12:35 PM',
    result: '900-97-458',
    status: 'closed',
    openBidsText: '11:35 AM',
    closeBidsText: '12:35 PM',
    type: 'regular',
  },
  {
    id: 'm6',
    name: 'TIME BAZAR',
    openTime: '01:00 PM',
    closeTime: '02:00 PM',
    result: '126-95-159',
    status: 'closed',
    openBidsText: '01:00 PM',
    closeBidsText: '02:00 PM',
    type: 'regular',
  },
  {
    id: 'm7',
    name: 'MADHUR DAY',
    openTime: '01:30 PM',
    closeTime: '02:30 PM',
    result: '790-60-118',
    status: 'closed',
    openBidsText: '01:30 PM',
    closeBidsText: '02:30 PM',
    type: 'regular',
  },
  {
    id: 'm8',
    name: 'MILAN DAY',
    openTime: '03:00 PM',
    closeTime: '05:00 PM',
    result: '579-11-146',
    status: 'closed',
    openBidsText: '03:00 PM',
    closeBidsText: '05:00 PM',
    type: 'regular',
  },
  {
    id: 'm9',
    name: 'RAJDHANI DAY',
    openTime: '03:05 PM',
    closeTime: '05:05 PM',
    result: '147-23-139',
    status: 'closed',
    openBidsText: '03:05 PM',
    closeBidsText: '05:05 PM',
    type: 'regular',
  },
  {
    id: 'm10',
    name: 'SUPREME DAY',
    openTime: '03:25 PM',
    closeTime: '05:20 PM',
    result: '160-7*-***',
    status: 'closed',
    openBidsText: '03:25 PM',
    closeBidsText: '05:20 PM',
    type: 'regular',
  },
  {
    id: 'm11',
    name: 'DHANRAJ DAY',
    openTime: '03:20 PM',
    closeTime: '05:20 PM',
    result: '224-87-269',
    status: 'closed',
    openBidsText: '03:20 PM',
    closeBidsText: '05:20 PM',
    type: 'regular',
  },
  {
    id: 'm12',
    name: 'KALYAN',
    openTime: '04:15 PM',
    closeTime: '06:15 PM',
    result: '250-7*-***',
    status: 'running',
    openBidsText: '04:15 PM',
    closeBidsText: '06:15 PM',
    type: 'regular',
  },
  {
    id: 'm13',
    name: 'DHANRAJ NIGHT',
    openTime: '06:50 PM',
    closeTime: '07:50 PM',
    result: '***-**-***',
    status: 'running',
    openBidsText: '06:50 PM',
    closeBidsText: '07:50 PM',
    type: 'regular',
  },
  {
    id: 'm14',
    name: 'SRIDEVI NIGHT',
    openTime: '07:15 PM',
    closeTime: '08:15 PM',
    result: '***-**-***',
    status: 'running',
    openBidsText: '07:15 PM',
    closeBidsText: '08:15 PM',
    type: 'regular',
  },
  {
    id: 'm15',
    name: 'MADHUR NIGHT',
    openTime: '08:25 PM',
    closeTime: '10:25 PM',
    result: '***-**-***',
    status: 'running',
    openBidsText: '08:25 PM',
    closeBidsText: '10:25 PM',
    type: 'regular',
  },
  {
    id: 'm16',
    name: 'SUPREME NIGHT',
    openTime: '08:35 PM',
    closeTime: '10:35 PM',
    result: '***-**-***',
    status: 'running',
    openBidsText: '08:35 PM',
    closeBidsText: '10:35 PM',
    type: 'regular',
  },
  {
    id: 'm17',
    name: 'MILAN NIGHT',
    openTime: '09:00 PM',
    closeTime: '11:00 PM',
    result: '***-**-***',
    status: 'running',
    openBidsText: '09:00 PM',
    closeBidsText: '11:00 PM',
    type: 'regular',
  },
  {
    id: 'm18',
    name: 'KALYAN NIGHT',
    openTime: '09:20 PM',
    closeTime: '11:35 PM',
    result: '***-**-***',
    status: 'running',
    openBidsText: '09:20 PM',
    closeBidsText: '11:35 PM',
    type: 'regular',
  },
  {
    id: 'm19',
    name: 'RAJDHANI NIGHT',
    openTime: '09:30 PM',
    closeTime: '11:45 PM',
    result: '***-**-***',
    status: 'running',
    openBidsText: '09:30 PM',
    closeBidsText: '11:45 PM',
    type: 'regular',
  },
  {
    id: 'm20',
    name: 'MAIN BAZAR',
    openTime: '09:40 PM',
    closeTime: '12:05 AM',
    result: '***-**-***',
    status: 'running',
    openBidsText: '09:40 PM',
    closeBidsText: '12:05 AM',
    type: 'regular',
  },
  {
    id: 'm21',
    name: 'KUBER SPECIAL',
    openTime: '10:00 AM',
    closeTime: '11:00 AM',
    result: '***-**-***',
    status: 'holiday',
    openBidsText: '10:00 AM',
    closeBidsText: '11:00 AM',
    type: 'regular',
    isHoliday: true,
  },
];

const DEFAULT_BANK_DETAILS: BankDetails = {
  accountHolderName: 'Girish Meena',
  accountNumber: '9182371900129',
  ifscCode: 'SBIN0004521',
  bankName: 'State Bank of India',
  branchName: 'Main Branch Jaipur',
  gpayNumber: '7231001800',
  phonePeNumber: '7231001800',
  paytmNumber: '7231001800',
};

const DEFAULT_USER: UserProfile = {
  id: 'usr_7231001800',
  name: 'Girish',
  phone: '7231001800',
  mpin: '1234',
  balance: 2500,
  bankDetails: DEFAULT_BANK_DETAILS,
  createdAt: '2026-10-17',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load saved user or start in phone-login state
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('dhanraj_user');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('dhanraj_auth') === 'true';
  });

  const [activeScreen, setActiveScreen] = useState<string>(() => {
    // If authenticated, go to 'home'; otherwise, 'phone_login'
    return localStorage.getItem('dhanraj_auth') === 'true' ? 'home' : 'phone_login';
  });

  const [tempPhone, setTempPhone] = useState<string>('7231001800');
  const [tempName, setTempName] = useState<string>('Girish');

  const [markets] = useState<Market[]>(INITIAL_MARKETS);

  const [bids, setBids] = useState<Bid[]>(() => {
    const saved = localStorage.getItem('dhanraj_bids');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'bid_101',
        marketId: 'm12',
        marketName: 'KALYAN',
        gameType: 'Single Digit',
        session: 'Open',
        number: '7',
        amount: 100,
        date: '2026-10-17',
        time: '04:30 PM',
        status: 'Pending',
        typeCategory: 'regular',
      },
      {
        id: 'bid_102',
        marketId: 'm8',
        marketName: 'MILAN DAY',
        gameType: 'Jodi Digit',
        session: 'Open',
        number: '11',
        amount: 50,
        date: '2026-10-17',
        time: '03:15 PM',
        status: 'Won',
        winAmount: 4750,
        typeCategory: 'regular',
      },
    ];
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('dhanraj_txns');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'TXN-984210',
        type: 'deposit',
        amount: 2000,
        title: 'Money Added via UPI',
        date: '2026-10-17',
        time: '12:45 PM',
        status: 'Success',
        method: 'Google Pay',
        refId: 'UPI-78219034',
      },
      {
        id: 'TXN-984211',
        type: 'bid',
        amount: 100,
        title: 'Bid Placed on Kalyan (Single Digit: 7)',
        date: '2026-10-17',
        time: '04:30 PM',
        status: 'Success',
        method: 'Wallet',
        refId: 'BID-101',
      },
    ];
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif_1',
      title: 'Welcome to Dhan Raj Games!',
      message: 'Experience India\'s best and fastest gaming platform with 24x7 instant withdrawals.',
      time: 'Just now',
      read: false,
    },
    {
      id: 'notif_2',
      title: 'Kalyan Market is Live',
      message: 'Kalyan open bidding is active now. Place your bids before 06:15 PM.',
      time: '15 mins ago',
      read: false,
    },
  ]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');
  const [selectedMarketForBid, setSelectedMarketForBid] = useState<Market | null>(null);
  const [selectedGameMode, setSelectedGameMode] = useState<import('../types').GameModeType | null>(null);
  const [biddingSession, setBiddingSession] = useState<'Open' | 'Close'>('Open');
  const [showWithdrawTerms, setShowWithdrawTerms] = useState<boolean>(false);

  // Real-time Clock & Timer Logic
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [simulatedTimePreset, setSimulatedTimePresetState] = useState<
    'live' | 'morning' | 'afternoon' | 'evening' | 'night' | 'closed'
  >('live');

  // Real-time 1-second interval timer to auto-evaluate market statuses dynamically without manual reload
  useEffect(() => {
    const timer = setInterval(() => {
      if (simulatedTimePreset === 'live') {
        setCurrentTime(new Date());
      } else {
        // Increment ticking second even in simulation mode so countdowns tick smoothly
        setCurrentTime((prev) => new Date(prev.getTime() + 1000));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [simulatedTimePreset]);

  const setSimulatedTimePreset = (
    preset: 'live' | 'morning' | 'afternoon' | 'evening' | 'night' | 'closed'
  ) => {
    setSimulatedTimePresetState(preset);
    const now = new Date();
    if (preset === 'live') {
      setCurrentTime(new Date());
    } else if (preset === 'morning') {
      // 10:30 AM -> Morning markets running
      setCurrentTime(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 30, 0));
    } else if (preset === 'afternoon') {
      // 04:30 PM (16:30) -> Kalyan & Day markets running
      setCurrentTime(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 16, 30, 0));
    } else if (preset === 'evening') {
      // 07:30 PM (19:30) -> Sridevi Night & Dhanraj Night running
      setCurrentTime(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 19, 30, 0));
    } else if (preset === 'night') {
      // 10:00 PM (22:00) -> Milan Night, Kalyan Night, Main Bazar running
      setCurrentTime(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 22, 0, 0));
    } else if (preset === 'closed') {
      // 12:30 AM (00:30) -> Closed for today
      setCurrentTime(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 30, 0));
    }
  };

  const getMarketLiveStatus = (market: Market) => {
    return evaluateMarketStatus(
      market.openTime,
      market.closeTime,
      currentTime,
      market.isHoliday
    );
  };

  // Dynamically evaluate all markets in real-time according to system/simulated clock
  const evaluatedMarkets: Market[] = markets.map((m) => {
    const live = evaluateMarketStatus(m.openTime, m.closeTime, currentTime, m.isHoliday);
    return {
      ...m,
      status: live.status,
    };
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('dhanraj_user', JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('dhanraj_auth', isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('dhanraj_bids', JSON.stringify(bids));
  }, [bids]);

  useEffect(() => {
    localStorage.setItem('dhanraj_txns', JSON.stringify(transactions));
  }, [transactions]);

  const showToast = (_msg: string, _type: 'success' | 'error' | 'info' = 'success') => {
    // Disabled floating toast notifications to prevent blocking the screen UI
  };

  const loginWithPhone = (phone: string): boolean => {
    setTempPhone(phone);
    // If phone matches existing user
    if (user && user.phone === phone) {
      setActiveScreen('mpin_login');
      return true;
    } else {
      // New profile setup
      setActiveScreen('profile_setup');
      return false;
    }
  };

  const completeRegistration = (name: string, mpin: string) => {
    const newUser: UserProfile = {
      id: `usr_${tempPhone || 'user'}`,
      name: name || 'User',
      phone: tempPhone || '7231001800',
      mpin: mpin,
      balance: 1000, // Welcome bonus
      bankDetails: DEFAULT_BANK_DETAILS,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setUser(newUser);
    setIsAuthenticated(true);
    // Directly navigate without blocking toast or modal popup overlays
    setActiveScreen('home');
  };

  const loginWithMpin = (mpin: string): boolean => {
    if (user && user.mpin === mpin) {
      setIsAuthenticated(true);
      setActiveScreen('home');
      return true;
    } else {
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setActiveScreen('phone_login');
  };

  const updateBankDetails = (details: BankDetails) => {
    if (!user) return;
    const updated = { ...user, bankDetails: details };
    setUser(updated);
    showToast('Bank details updated successfully!', 'success');
  };

  const addFunds = (amount: number, method: string) => {
    if (!user) return;
    const updatedBalance = user.balance + amount;
    setUser({ ...user, balance: updatedBalance });

    const newTxn: Transaction = {
      id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      type: 'deposit',
      amount: amount,
      title: `Deposit via ${method}`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Success',
      method: method,
      refId: `UPI-${Math.floor(10000000 + Math.random() * 90000000)}`,
    };

    setTransactions([newTxn, ...transactions]);
    showToast(`₹${amount} Added to Wallet Successfully!`, 'success');
  };

  const withdrawFunds = (amount: number, method: string): { success: boolean; error?: string } => {
    if (!user) return { success: false, error: 'User not logged in' };
    if (amount < 1000) {
      return { success: false, error: 'Minimum withdrawal amount is ₹1,000' };
    }
    if (amount > user.balance) {
      return { success: false, error: 'Insufficient wallet balance' };
    }

    const updatedBalance = user.balance - amount;
    setUser({ ...user, balance: updatedBalance });

    const newTxn: Transaction = {
      id: `WTH-${Math.floor(100000 + Math.random() * 900000)}`,
      type: 'withdrawal',
      amount: amount,
      title: `Withdrawal to ${method}`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Processing',
      method: method,
      refId: `REQ-${Math.floor(10000000 + Math.random() * 90000000)}`,
    };

    setTransactions([newTxn, ...transactions]);
    showToast(`Withdrawal request of ₹${amount} submitted!`, 'success');
    return { success: true };
  };

  const placeBid = (bidData: Omit<Bid, 'id' | 'date' | 'time' | 'status'>): { success: boolean; error?: string } => {
    if (!user) return { success: false, error: 'User not logged in' };
    if (bidData.amount <= 0) {
      return { success: false, error: 'Enter a valid bid amount' };
    }
    if (bidData.amount > user.balance) {
      return { success: false, error: 'Insufficient balance! Please add funds.' };
    }

    const updatedBalance = user.balance - bidData.amount;
    setUser({ ...user, balance: updatedBalance });

    const newBid: Bid = {
      ...bidData,
      id: `bid_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Pending',
    };

    setBids([newBid, ...bids]);

    const newTxn: Transaction = {
      id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      type: 'bid',
      amount: bidData.amount,
      title: `Bid on ${bidData.marketName} (${bidData.gameType}: ${bidData.number})`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Success',
      method: 'Wallet',
      refId: newBid.id,
    };

    setTransactions([newTxn, ...transactions]);
    showToast('Bid placed successfully!', 'success');
    return { success: true };
  };

  const placeBulkBid = (
    market: Market,
    gameType: import('../types').GameModeType,
    session: 'Open' | 'Close',
    entries: import('../types').BidItemEntry[]
  ): { success: boolean; error?: string } => {
    if (!user) return { success: false, error: 'User not logged in' };
    if (entries.length === 0) {
      showToast('Please add at least one bid number.', 'info');
      return { success: false, error: 'Empty bids' };
    }

    const totalPoints = entries.reduce((sum, item) => sum + item.points, 0);

    // Exact video validation: Insufficient balance in wallet.
    if (user.balance < totalPoints) {
      showToast('Insufficient balance in wallet.', 'error');
      return { success: false, error: 'Insufficient balance in wallet.' };
    }

    const updatedBalance = user.balance - totalPoints;
    setUser({ ...user, balance: updatedBalance });

    const currentDate = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newBids: Bid[] = entries.map((entry, idx) => ({
      id: `bid_${Date.now()}_${idx}`,
      marketId: market.id,
      marketName: market.name,
      gameType: gameType,
      session: session,
      number: entry.number,
      amount: entry.points,
      date: currentDate,
      time: currentTime,
      status: 'Pending',
      typeCategory: market.type,
    }));

    setBids([...newBids, ...bids]);

    const newTxn: Transaction = {
      id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      type: 'bid',
      amount: totalPoints,
      title: `Bid on ${market.name} (${gameType}) - ${entries.length} numbers`,
      date: currentDate,
      time: currentTime,
      status: 'Success',
      method: 'Wallet',
      refId: newBids[0].id,
    };

    setTransactions([newTxn, ...transactions]);
    showToast('Bids placed successfully!', 'success');
    return { success: true };
  };

  const markNotificationsAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated,
        activeScreen,
        setActiveScreen,
        markets: evaluatedMarkets,
        bids,
        transactions,
        notifications,
        toastMessage,
        toastType,
        showToast,
        loginWithPhone,
        completeRegistration,
        loginWithMpin,
        logout,
        updateBankDetails,
        addFunds,
        withdrawFunds,
        placeBid,
        placeBulkBid,
        selectedMarketForBid,
        setSelectedMarketForBid,
        selectedGameMode,
        setSelectedGameMode,
        biddingSession,
        setBiddingSession,
        showWithdrawTerms,
        setShowWithdrawTerms,
        unreadNotificationsCount,
        markNotificationsAsRead,
        tempPhone,
        setTempPhone,
        tempName,
        setTempName,
        currentTime,
        simulatedTimePreset,
        setSimulatedTimePreset,
        getMarketLiveStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

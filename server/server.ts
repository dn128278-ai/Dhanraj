import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-Memory Database Store for User, Markets, Transactions, and Bids
interface DBUser {
  id: string;
  name: string;
  phone: string;
  mpin: string;
  balance: number;
  bankDetails: any;
}

const users: Record<string, DBUser> = {
  '7231001800': {
    id: 'usr_7231001800',
    name: 'Girish',
    phone: '7231001800',
    mpin: '1234',
    balance: 2500,
    bankDetails: {
      accountHolderName: 'Girish Meena',
      accountNumber: '9182371900129',
      ifscCode: 'SBIN0004521',
      bankName: 'State Bank of India',
      branchName: 'Main Branch Jaipur',
      gpayNumber: '7231001800',
      phonePeNumber: '7231001800',
      paytmNumber: '7231001800',
    },
  },
};

const transactions: any[] = [];
const bids: any[] = [];

// 1. Phone check endpoint
app.post('/api/auth/check-phone', (req: Request, res: Response) => {
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  const user = users[phone];
  return res.json({
    exists: !!user,
    user: user ? { id: user.id, name: user.name, phone: user.phone } : null,
  });
});

// 2. Profile Setup & mPIN Registration
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, phone, mpin } = req.body;
  if (!name || !phone || !mpin) {
    return res.status(400).json({ error: 'Name, phone, and mPIN are required' });
  }

  const newUser: DBUser = {
    id: `usr_${phone}`,
    name,
    phone,
    mpin,
    balance: 1000, // Welcome bonus
    bankDetails: {},
  };

  users[phone] = newUser;
  return res.json({
    success: true,
    message: 'Registered Successfully!',
    user: newUser,
  });
});

// 3. mPIN Login
app.post('/api/auth/login-mpin', (req: Request, res: Response) => {
  const { phone, mpin } = req.body;
  const user = users[phone];

  if (!user || user.mpin !== mpin) {
    return res.status(401).json({
      success: false,
      message: 'Invalid mpin.',
    });
  }

  return res.json({
    success: true,
    message: 'Login successful',
    user,
  });
});

// 4. Wallet - Add Fund
app.post('/api/wallet/add-fund', (req: Request, res: Response) => {
  const { phone, amount, method } = req.body;
  const user = users[phone];

  if (!user) return res.status(404).json({ error: 'User not found' });
  if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });

  user.balance += Number(amount);

  const txn = {
    id: `TXN-${Date.now()}`,
    type: 'deposit',
    amount: Number(amount),
    title: `Money Added via ${method}`,
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString(),
    status: 'Success',
    method: method || 'UPI',
    refId: `UPI-${Math.floor(10000000 + Math.random() * 90000000)}`,
  };

  transactions.unshift(txn);
  return res.json({ success: true, balance: user.balance, transaction: txn });
});

// 5. Wallet - Withdraw Fund
app.post('/api/wallet/withdraw-fund', (req: Request, res: Response) => {
  const { phone, amount, method } = req.body;
  const user = users[phone];

  if (!user) return res.status(404).json({ error: 'User not found' });
  if (amount < 1000) return res.status(400).json({ error: 'Minimum withdrawal amount is ₹1000' });
  if (user.balance < amount) return res.status(400).json({ error: 'Insufficient wallet balance' });

  user.balance -= Number(amount);

  const txn = {
    id: `WTH-${Date.now()}`,
    type: 'withdrawal',
    amount: Number(amount),
    title: `Withdrawal to ${method}`,
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString(),
    status: 'Processing',
    method: method || 'Bank Transfer',
    refId: `REQ-${Math.floor(10000000 + Math.random() * 90000000)}`,
  };

  transactions.unshift(txn);
  return res.json({ success: true, balance: user.balance, transaction: txn });
});

// 6. Update Bank Details
app.post('/api/wallet/bank-details', (req: Request, res: Response) => {
  const { phone, bankDetails } = req.body;
  const user = users[phone];
  if (!user) return res.status(404).json({ error: 'User not found' });

  user.bankDetails = bankDetails;
  return res.json({ success: true, message: 'Bank details updated successfully', bankDetails });
});

// 7. Place Bid
app.post('/api/bids/place', (req: Request, res: Response) => {
  const { phone, marketId, marketName, gameType, number, amount } = req.body;
  const user = users[phone];

  if (!user) return res.status(404).json({ error: 'User not found' });
  if (user.balance < amount) return res.status(400).json({ error: 'Insufficient balance' });

  user.balance -= Number(amount);

  const newBid = {
    id: `BID-${Date.now()}`,
    marketId,
    marketName,
    gameType,
    number,
    amount: Number(amount),
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString(),
    status: 'Pending',
  };

  bids.unshift(newBid);
  return res.json({ success: true, bid: newBid, balance: user.balance });
});

app.listen(PORT, () => {
  console.log(`Dhan Raj Games Backend running at http://localhost:${PORT}`);
});

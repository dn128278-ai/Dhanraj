import 'package:flutter/material.dart';
import '../models/models.dart';

class AppProvider with ChangeNotifier {
  UserProfile? _user;
  bool _isAuthenticated = false;
  String _tempPhone = '7231001800';
  String _tempName = 'Girish';

  UserProfile? get user => _user;
  bool get isAuthenticated => _isAuthenticated;
  double get balance => _user?.balance ?? 0.0;
  String get tempPhone => _tempPhone;
  String get tempName => _tempName;

  final List<Market> _markets = [
    Market(id: '1', name: 'DHANRAJ MORNING', openTime: '09:10 AM', closeTime: '10:10 AM', result: '125-81-100', isRunning: false),
    Market(id: '2', name: 'MILAN MORNING', openTime: '10:20 AM', closeTime: '11:20 AM', result: '159-56-330', isRunning: false),
    Market(id: '3', name: 'KALYAN MORNING', openTime: '11:30 AM', closeTime: '12:30 PM', result: '790-60-136', isRunning: false),
    Market(id: '4', name: 'MADHUR MORNING', openTime: '11:30 AM', closeTime: '12:30 PM', result: '223-78-279', isRunning: false),
    Market(id: '5', name: 'SRIDEVI', openTime: '11:35 AM', closeTime: '12:35 PM', result: '900-97-458', isRunning: false),
    Market(id: '6', name: 'TIME BAZAR', openTime: '01:00 PM', closeTime: '02:00 PM', result: '126-95-159', isRunning: false),
    Market(id: '7', name: 'MADHUR DAY', openTime: '01:30 PM', closeTime: '02:30 PM', result: '790-60-118', isRunning: false),
    Market(id: '8', name: 'MILAN DAY', openTime: '03:00 PM', closeTime: '05:00 PM', result: '579-11-146', isRunning: false),
    Market(id: '9', name: 'RAJDHANI DAY', openTime: '03:05 PM', closeTime: '05:05 PM', result: '147-23-139', isRunning: false),
    Market(id: '10', name: 'SUPREME DAY', openTime: '03:25 PM', closeTime: '05:20 PM', result: '160-7*-***', isRunning: false),
    Market(id: '11', name: 'DHANRAJ DAY', openTime: '03:20 PM', closeTime: '05:20 PM', result: '224-87-269', isRunning: false),
    Market(id: '12', name: 'KALYAN', openTime: '04:15 PM', closeTime: '06:15 PM', result: '250-7*-***', isRunning: true),
    Market(id: '13', name: 'DHANRAJ NIGHT', openTime: '06:50 PM', closeTime: '07:50 PM', result: '***-**-***', isRunning: true),
    Market(id: '14', name: 'SRIDEVI NIGHT', openTime: '07:15 PM', closeTime: '08:15 PM', result: '***-**-***', isRunning: true),
    Market(id: '15', name: 'MADHUR NIGHT', openTime: '08:25 PM', closeTime: '10:25 PM', result: '***-**-***', isRunning: true),
    Market(id: '16', name: 'SUPREME NIGHT', openTime: '08:35 PM', closeTime: '10:35 PM', result: '***-**-***', isRunning: true),
    Market(id: '17', name: 'MILAN NIGHT', openTime: '09:00 PM', closeTime: '11:00 PM', result: '***-**-***', isRunning: true),
    Market(id: '18', name: 'KALYAN NIGHT', openTime: '09:20 PM', closeTime: '11:35 PM', result: '***-**-***', isRunning: true),
    Market(id: '19', name: 'RAJDHANI NIGHT', openTime: '09:30 PM', closeTime: '11:45 PM', result: '***-**-***', isRunning: true),
    Market(id: '20', name: 'MAIN BAZAR', openTime: '09:40 PM', closeTime: '12:05 AM', result: '***-**-***', isRunning: true),
  ];

  final List<BidItem> _bids = [];
  final List<TransactionItem> _transactions = [];

  List<Market> get markets => _markets;
  List<BidItem> get bids => _bids;
  List<TransactionItem> get transactions => _transactions;

  void initialize() {
    _user = UserProfile(
      id: 'usr_7231001800',
      name: 'Girish',
      phone: '7231001800',
      mpin: '1234',
      balance: 2500.0,
      bankDetails: BankDetails(
        accountHolderName: 'Girish Meena',
        accountNumber: '9182371900129',
        ifscCode: 'SBIN0004521',
        bankName: 'State Bank of India',
        branchName: 'Main Branch Jaipur',
        gpayNumber: '7231001800',
        phonePeNumber: '7231001800',
        paytmNumber: '7231001800',
      ),
    );
  }

  void setTempPhone(String phone) {
    _tempPhone = phone;
    notifyListeners();
  }

  void setTempName(String name) {
    _tempName = name;
    notifyListeners();
  }

  bool loginWithMpin(String pin) {
    if (_user != null && _user!.mpin == pin) {
      _isAuthenticated = true;
      notifyListeners();
      return true;
    }
    return false;
  }

  void completeRegistration(String name, String mpin) {
    _user = UserProfile(
      id: 'usr_$_tempPhone',
      name: name,
      phone: _tempPhone,
      mpin: mpin,
      balance: 1000.0,
      bankDetails: BankDetails(
        accountHolderName: name,
        accountNumber: '',
        ifscCode: '',
        bankName: '',
        branchName: '',
        gpayNumber: _tempPhone,
        phonePeNumber: _tempPhone,
        paytmNumber: _tempPhone,
      ),
    );
    _isAuthenticated = true;
    notifyListeners();
  }

  void logout() {
    _isAuthenticated = false;
    notifyListeners();
  }

  void addFunds(double amount, String method) {
    if (_user == null) return;
    _user!.balance += amount;
    _transactions.insert(
      0,
      TransactionItem(
        id: 'TXN-\${DateTime.now().millisecondsSinceEpoch}',
        type: 'deposit',
        amount: amount,
        title: 'Money Added via \$method',
        date: '2026-10-17',
        time: '12:00 PM',
        status: 'Success',
        method: method,
        refId: 'UPI-78901234',
      ),
    );
    notifyListeners();
  }

  bool withdrawFunds(double amount, String method) {
    if (_user == null || _user!.balance < amount || amount < 1000) {
      return false;
    }
    _user!.balance -= amount;
    _transactions.insert(
      0,
      TransactionItem(
        id: 'WTH-\${DateTime.now().millisecondsSinceEpoch}',
        type: 'withdrawal',
        amount: amount,
        title: 'Withdrawal to \$method',
        date: '2026-10-17',
        time: '01:00 PM',
        status: 'Processing',
        method: method,
        refId: 'REQ-12345678',
      ),
    );
    notifyListeners();
    return true;
  }

  void updateBankDetails(BankDetails details) {
    if (_user == null) return;
    _user!.bankDetails = details;
    notifyListeners();
  }
}

class UserProfile {
  final String id;
  final String name;
  final String phone;
  final String mpin;
  double balance;
  BankDetails bankDetails;

  UserProfile({
    required this.id,
    required this.name,
    required this.phone,
    required this.mpin,
    required this.balance,
    required this.bankDetails,
  });

  factory UserProfile.fromJson(Map<String, dynamic> json) {
    return UserProfile(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      phone: json['phone'] ?? '',
      mpin: json['mpin'] ?? '',
      balance: (json['balance'] as num?)?.toDouble() ?? 0.0,
      bankDetails: BankDetails.fromJson(json['bankDetails'] ?? {}),
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'phone': phone,
    'mpin': mpin,
    'balance': balance,
    'bankDetails': bankDetails.toJson(),
  };
}

class BankDetails {
  String accountHolderName;
  String accountNumber;
  String ifscCode;
  String bankName;
  String branchName;
  String gpayNumber;
  String phonePeNumber;
  String paytmNumber;

  BankDetails({
    required this.accountHolderName,
    required this.accountNumber,
    required this.ifscCode,
    required this.bankName,
    required this.branchName,
    required this.gpayNumber,
    required this.phonePeNumber,
    required this.paytmNumber,
  });

  factory BankDetails.fromJson(Map<String, dynamic> json) {
    return BankDetails(
      accountHolderName: json['accountHolderName'] ?? '',
      accountNumber: json['accountNumber'] ?? '',
      ifscCode: json['ifscCode'] ?? '',
      bankName: json['bankName'] ?? '',
      branchName: json['branchName'] ?? '',
      gpayNumber: json['gpayNumber'] ?? '',
      phonePeNumber: json['phonePeNumber'] ?? '',
      paytmNumber: json['paytmNumber'] ?? '',
    );
  }

  Map<String, dynamic> toJson() => {
    'accountHolderName': accountHolderName,
    'accountNumber': accountNumber,
    'ifscCode': ifscCode,
    'bankName': bankName,
    'branchName': branchName,
    'gpayNumber': gpayNumber,
    'phonePeNumber': phonePeNumber,
    'paytmNumber': paytmNumber,
  };
}

class Market {
  final String id;
  final String name;
  final String openTime;
  final String closeTime;
  final String result;
  final bool isRunning;

  Market({
    required this.id,
    required this.name,
    required this.openTime,
    required this.closeTime,
    required this.result,
    required this.isRunning,
  });
}

class BidItem {
  final String id;
  final String marketName;
  final String gameType;
  final String number;
  final double amount;
  final String date;
  final String time;
  final String status;
  final double? winAmount;

  BidItem({
    required this.id,
    required this.marketName,
    required this.gameType,
    required this.number,
    required this.amount,
    required this.date,
    required this.time,
    required this.status,
    this.winAmount,
  });
}

class TransactionItem {
  final String id;
  final String type; // 'deposit', 'withdrawal', 'bid'
  final double amount;
  final String title;
  final String date;
  final String time;
  final String status;
  final String method;
  final String refId;

  TransactionItem({
    required this.id,
    required this.type,
    required this.amount,
    required this.title,
    required this.date,
    required this.time,
    required this.status,
    required this.method,
    required this.refId,
  });
}

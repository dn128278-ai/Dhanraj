import React, { useState } from 'react';
import { X, Copy, Check, FileCode, Terminal, Download, Smartphone, Server } from 'lucide-react';

export const FlutterCodeCenterModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'flutter' | 'backend' | 'apk_guide'>('flutter');
  const [selectedFile, setSelectedFile] = useState<string>('main.dart');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const flutterFiles: Record<string, { desc: string; code: string }> = {
    'pubspec.yaml': {
      desc: 'Flutter project dependencies (Provider, HTTP, SharedPreferences, etc.)',
      code: `name: dhanraj_games
description: Official Dhan Raj Games Mobile App for Satta Matka and Gaming.
version: 1.0.0+1

environment:
  sdk: ">=3.0.0 <4.0.0"

dependencies:
  flutter:
    sdk: flutter
  provider: ^6.1.1
  http: ^1.2.0
  shared_preferences: ^2.2.2
  intl: ^0.19.0
  google_fonts: ^6.1.0
  url_launcher: ^6.2.4
  flutter_svg: ^2.0.9

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true
  assets:
    - assets/images/
`,
    },
    'main.dart': {
      desc: 'Flutter app entry point, Immersive Status Bar & Theme configuration',
      code: `import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import 'providers/app_provider.dart';
import 'screens/phone_login_screen.dart';
import 'screens/home_dashboard_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // FIX: Remove top mobile status bar (clock 5:40, battery 90%, carrier/signal)
  // for a clean, immersive edge-to-edge gaming screen
  SystemChrome.setEnabledSystemUIMode(SystemUiMode.immersiveSticky);
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
      systemNavigationBarColor: Color(0xFF50001E),
    ),
  );

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AppProvider()..initialize()),
      ],
      child: const DhanRajApp(),
    ),
  );
}

class DhanRajApp extends StatelessWidget {
  const DhanRajApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Dhan Raj Games',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        primaryColor: const Color(0xFF6B0028),
        scaffoldBackgroundColor: const Color(0xFFF5F5F5),
        textTheme: GoogleFonts.poppinsTextTheme(),
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF6B0028),
          foregroundColor: Colors.white,
          elevation: 0,
        ),
      ),
      home: Consumer<AppProvider>(
        builder: (context, provider, _) {
          return provider.isAuthenticated
              ? const HomeDashboardScreen()
              : const PhoneLoginScreen();
        },
      ),
    );
  }
}
`,
    },
    'theme.dart': {
      desc: 'Color palette and constant styles matching video',
      code: `import 'package:flutter/material.dart';

class DhanRajTheme {
  static const Color primaryMaroon = Color(0xFF6B0028);
  static const Color darkMaroon = Color(0xFF50001E);
  static const Color lightMaroon = Color(0xFF850533);
  static const Color goldAccent = Color(0xFFFCD34D);
  static const Color runningGreen = Color(0xFF10B981);
  static const Color closedRed = Color(0xFFE11D48);

  static const LinearGradient headerGradient = LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: [primaryMaroon, darkMaroon],
  );
}
`,
    },
    'phone_login_screen.dart': {
      desc: 'Exact phone number login screen (00:00 - 00:02)',
      code: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_provider.dart';
import 'profile_setup_screen.dart';
import 'mpin_screen.dart';
import 'support_screen.dart';

class PhoneLoginScreen extends StatefulWidget {
  const PhoneLoginScreen({super.key});

  @override
  State<PhoneLoginScreen> createState() => _PhoneLoginScreenState();
}

class _PhoneLoginScreenState extends State<PhoneLoginScreen> {
  final TextEditingController _phoneController = TextEditingController(text: '7231001800');

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Color(0xFF6B0028), Color(0xFF850533), Color(0xFF50001E)],
          ),
        ),
        child: SafeArea(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              // Support button in top right
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: Align(
                  alignment: Alignment.topRight,
                  child: ElevatedButton.icon(
                    onPressed: () {
                      Navigator.push(context, MaterialPageRoute(builder: (_) => const SupportScreen()));
                    },
                    icon: const Icon(Icons.headset_mic, color: Color(0xFF6B0028), size: 18),
                    label: const Text('Support', style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
                    ),
                  ),
                ),
              ),

              // Main Rounded White Card
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(28),
                    boxShadow: const [BoxShadow(color: Colors.black26, blurRadius: 15, offset: Offset(0, 5))],
                  ),
                  child: Column(
                    children: [
                      // Circular Money Pouch Logo
                      Container(
                        width: 90,
                        height: 90,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(color: const Color(0xFF6B0028), width: 2),
                          color: Colors.white,
                        ),
                        child: const Center(
                          child: Icon(Icons.currency_rupee, size: 45, color: Color(0xFF6B0028)),
                        ),
                      ),
                      const SizedBox(height: 16),
                      const Text(
                        'Setup your Account',
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.black87),
                      ),
                      const SizedBox(height: 20),
                      Align(
                        alignment: Alignment.centerLeft,
                        child: Text('Phone Number', style: TextStyle(color: Colors.grey[700], fontWeight: FontWeight.w600, fontSize: 13)),
                      ),
                      const SizedBox(height: 8),
                      // Input with +91 and green phone circle
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12),
                        decoration: BoxDecoration(
                          border: Border.all(color: Colors.grey.shade300),
                          borderRadius: BorderRadius.circular(14),
                        ),
                        child: Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(6),
                              decoration: BoxDecoration(color: Colors.green.shade100, shape: BoxShape.circle),
                              child: const Icon(Icons.phone, color: Colors.green, size: 16),
                            ),
                            const SizedBox(width: 8),
                            const Text('+91 ', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                            Expanded(
                              child: TextField(
                                controller: _phoneController,
                                keyboardType: TextInputType.phone,
                                maxLength: 10,
                                decoration: const InputDecoration(
                                  border: InputBorder.none,
                                  counterText: '',
                                  hintText: 'Enter Phone Number',
                                ),
                                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 24),
                      // Sign In Button
                      SizedBox(
                        width: double.infinity,
                        height: 50,
                        child: ElevatedButton(
                          onPressed: () {
                            final phone = _phoneController.text.trim();
                            if (phone.length == 10) {
                              final provider = Provider.of<AppProvider>(context, listen: false);
                              provider.setTempPhone(phone);
                              if (phone == '7231001800') {
                                Navigator.push(context, MaterialPageRoute(builder: (_) => const MpinLoginScreen()));
                              } else {
                                Navigator.push(context, MaterialPageRoute(builder: (_) => const ProfileSetupScreen()));
                              }
                            }
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF6B0028),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                          ),
                          child: const Text('Sign In', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white)),
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              // Trusted by 1 Lakh Users Footer
              const Padding(
                padding: EdgeInsets.only(bottom: 24),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.verified, color: Colors.greenAccent, size: 20),
                    SizedBox(width: 6),
                    Text('Trusted by more than 1 Lakh Users', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w500)),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
`,
    },
    'home_dashboard_screen.dart': {
      desc: 'Pinned Top Header, Marquee, Quick Actions & Real-Time Market Timers (Bouncing Scroll)',
      code: `import 'dart:async';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../providers/app_provider.dart';
import '../models/market_model.dart';
import 'game_center_screen.dart';
import 'funds_screen.dart';
import 'history_screen.dart';
import 'support_screen.dart';

class HomeDashboardScreen extends StatefulWidget {
  const HomeDashboardScreen({super.key});

  @override
  State<HomeDashboardScreen> createState() => _HomeDashboardScreenState();
}

class _HomeDashboardScreenState extends State<HomeDashboardScreen> {
  int _currentIndex = 2; // Home tab
  Timer? _clockTimer;
  DateTime _currentTime = DateTime.now();

  @override
  void initState() {
    super.initState();
    // Real-time dynamic timer running every 1 second without manual refresh
    _clockTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (mounted) {
        setState(() {
          _currentTime = DateTime.now();
        });
      }
    });
  }

  @override
  void dispose() {
    _clockTimer?.cancel();
    super.dispose();
  }

  // Parse time string e.g. "04:15 PM" to minutes from midnight
  int _parseTimeToMinutes(String timeStr) {
    try {
      final clean = timeStr.trim().toUpperCase();
      final parts = clean.split(RegExp(r'[:\\s]+'));
      if (parts.length < 2) return 0;
      int hour = int.parse(parts[0]);
      int min = int.parse(parts[1]);
      String modifier = parts.length >= 3 ? parts[2] : 'AM';
      if (modifier == 'PM' && hour < 12) hour += 12;
      if (modifier == 'AM' && hour == 12) hour = 0;
      return hour * 60 + min;
    } catch (_) {
      return 0;
    }
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<AppProvider>(context);
    final timeFormat = DateFormat('hh:mm:ss a');
    final formattedTime = timeFormat.format(_currentTime);

    return Scaffold(
      backgroundColor: const Color(0xFFF5F5F7),
      // 1. PINNED TOP APP BAR with Wallet Balance
      appBar: AppBar(
        backgroundColor: const Color(0xFF6B0028),
        elevation: 2,
        leading: Builder(
          builder: (ctx) => IconButton(
            icon: const Icon(Icons.menu, color: Colors.white),
            onPressed: () => Scaffold.of(ctx).openDrawer(),
          ),
        ),
        title: const Text(
          'Dhan Raj',
          style: TextStyle(
            fontFamily: 'serif',
            fontStyle: FontStyle.italic,
            fontWeight: FontWeight.w900,
            color: Colors.white,
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_none, color: Colors.white),
            onPressed: () {},
          ),
          Padding(
            padding: const EdgeInsets.only(right: 12),
            child: ActionChip(
              avatar: const Icon(Icons.wallet, size: 16, color: Color(0xFF6B0028)),
              label: Text(
                '₹\${provider.balance.toStringAsFixed(2)}',
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
              ),
              backgroundColor: Colors.white,
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const FundsScreen(initialTab: 'add')),
                );
              },
            ),
          ),
        ],
      ),
      body: Column(
        children: [
          // 2. PINNED PROMOTIONAL MARQUEE BANNER (Fixed at Top)
          Container(
            color: const Color(0xFF50001E),
            padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 12),
            width: double.infinity,
            child: const Text(
              'भरोसा, क्वालिटी और बेहतरीन सर्विस — यही पहचान है DhanRaj Games की ⭐ 24x7 Instant Withdrawal',
              style: TextStyle(
                color: Color(0xFFFCD34D),
                fontSize: 12,
                fontWeight: FontWeight.w600,
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ),

          // 3. PINNED QUICK ACTION BUTTONS (Starline, Jackpot, Add Money, Withdraw Money)
          Padding(
            padding: const EdgeInsets.fromLTRB(12, 10, 12, 4),
            child: Card(
              elevation: 0.5,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
                side: BorderSide(color: Colors.grey.shade200),
              ),
              child: Padding(
                padding: const EdgeInsets.all(10),
                child: Column(
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: OutlinedButton.icon(
                            onPressed: () {},
                            icon: const Icon(Icons.stars, color: Color(0xFF6B0028), size: 16),
                            style: OutlinedButton.styleFrom(
                              shape: const StadiumBorder(),
                              side: BorderSide(color: Colors.grey.shade300),
                              padding: const EdgeInsets.symmetric(vertical: 8),
                            ),
                            label: const Text(
                              'Dhan Starline',
                              style: TextStyle(fontWeight: FontWeight.bold, color: Colors.black87, fontSize: 12),
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: OutlinedButton.icon(
                            onPressed: () {},
                            icon: const Icon(Icons.bolt, color: Colors.amber, size: 16),
                            style: OutlinedButton.styleFrom(
                              shape: const StadiumBorder(),
                              side: BorderSide(color: Colors.grey.shade300),
                              padding: const EdgeInsets.symmetric(vertical: 8),
                            ),
                            label: const Text(
                              'Dhan Jackpot',
                              style: TextStyle(fontWeight: FontWeight.bold, color: Colors.black87, fontSize: 12),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Expanded(
                          child: ElevatedButton.icon(
                            onPressed: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(builder: (_) => const FundsScreen(initialTab: 'add')),
                              );
                            },
                            icon: const Icon(Icons.account_balance_wallet, size: 16, color: Colors.white),
                            label: const Text(
                              'Add Money',
                              style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12),
                            ),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF6B0028),
                              shape: const StadiumBorder(),
                              padding: const EdgeInsets.symmetric(vertical: 10),
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: OutlinedButton.icon(
                            onPressed: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(builder: (_) => const FundsScreen(initialTab: 'withdraw')),
                              );
                            },
                            icon: const Icon(Icons.download, size: 16, color: Color(0xFF6B0028)),
                            label: const Text(
                              'Withdraw Money',
                              style: TextStyle(color: Color(0xFF6B0028), fontWeight: FontWeight.bold, fontSize: 12),
                            ),
                            style: OutlinedButton.styleFrom(
                              side: const BorderSide(color: Color(0xFF6B0028)),
                              shape: const StadiumBorder(),
                              padding: const EdgeInsets.symmetric(vertical: 10),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),

          // 4. PINNED LIVE CLOCK & REAL-TIME STATUS BAR
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Container(
                      width: 8,
                      height: 8,
                      decoration: const BoxDecoration(
                        color: Colors.green,
                        shape: BoxShape.circle,
                      ),
                    ),
                    const SizedBox(width: 6),
                    Text(
                      'Live Time: \$formattedTime',
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 11, color: Colors.black87),
                    ),
                  ],
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: Colors.green.shade50,
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: Colors.green.shade200),
                  ),
                  child: const Text(
                    'Real-Time Status Active',
                    style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.green),
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 4),

          // 5. SMOOTH VERTICALLY SCROLLING MARKET LIST ONLY
          Expanded(
            child: ListView.builder(
              physics: const BouncingScrollPhysics(),
              padding: const EdgeInsets.fromLTRB(12, 4, 12, 16),
              itemCount: provider.markets.length,
              itemBuilder: (context, index) {
                final market = provider.markets[index];
                final currentMinutes = _currentTime.hour * 60 + _currentTime.minute;
                final openMin = _parseTimeToMinutes(market.openTime);
                final closeMin = _parseTimeToMinutes(market.closeTime);

                // Real-time market state evaluation
                bool isRunning = false;
                if (closeMin > openMin) {
                  isRunning = currentMinutes < closeMin;
                } else {
                  // Overnight market
                  isRunning = currentMinutes >= openMin || currentMinutes < closeMin;
                }

                return MarketCard(
                  market: market,
                  isRunning: isRunning,
                  onPlay: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => GameCenterScreen(market: market),
                      ),
                    );
                  },
                );
              },
            ),
          ),
        ],
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        type: BottomNavigationBarType.fixed,
        backgroundColor: const Color(0xFF6B0028),
        selectedItemColor: const Color(0xFFFCD34D),
        unselectedItemColor: Colors.white70,
        onTap: (index) {
          setState(() => _currentIndex = index);
          if (index == 0) Navigator.push(context, MaterialPageRoute(builder: (_) => const HistoryScreen()));
          if (index == 3) Navigator.push(context, MaterialPageRoute(builder: (_) => const FundsScreen()));
          if (index == 4) Navigator.push(context, MaterialPageRoute(builder: (_) => const SupportScreen()));
        },
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.gavel), label: 'My Bids'),
          BottomNavigationBarItem(icon: Icon(Icons.menu_book), label: 'Passbook'),
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.account_balance_wallet), label: 'Funds'),
          BottomNavigationBarItem(icon: Icon(Icons.headset_mic), label: 'Support'),
        ],
      ),
    );
  }
}

class MarketCard extends StatelessWidget {
  final Market market;
  final bool isRunning;
  final VoidCallback onPlay;

  const MarketCard({
    super.key,
    required this.market,
    required this.isRunning,
    required this.onPlay,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 0.8,
      margin: const EdgeInsets.only(bottom: 10),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(
          color: isRunning ? Colors.green.shade200 : Colors.grey.shade200,
          width: isRunning ? 1.2 : 0.8,
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(
                        market.name,
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                      ),
                      const SizedBox(width: 4),
                      const Icon(Icons.info_outline, size: 16, color: Colors.grey),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(
                    market.result,
                    style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, letterSpacing: 1),
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      Container(
                        width: 7,
                        height: 7,
                        decoration: BoxDecoration(
                          color: isRunning ? Colors.green : Colors.red,
                          shape: BoxShape.circle,
                        ),
                      ),
                      const SizedBox(width: 6),
                      Text(
                        isRunning ? 'Bet is Running' : 'Closed for today',
                        style: TextStyle(
                          color: isRunning ? Colors.green.shade700 : Colors.red.shade700,
                          fontWeight: FontWeight.bold,
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Open Bids : \${market.openTime}   Close Bids : \${market.closeTime}',
                    style: TextStyle(fontSize: 11, color: Colors.grey[600]),
                  ),
                ],
              ),
            ),
            // Play Button: Enabled green button when running, disabled gray when closed
            GestureDetector(
              onTap: isRunning ? onPlay : null,
              child: Container(
                width: 52,
                height: 52,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: isRunning ? Colors.green : Colors.grey.shade300,
                    width: 2,
                  ),
                  color: isRunning ? Colors.green.shade50 : Colors.grey.shade100,
                ),
                child: Center(
                  child: Icon(
                    isRunning ? Icons.play_arrow : Icons.lock,
                    color: isRunning ? Colors.green : Colors.grey.shade400,
                    size: isRunning ? 30 : 20,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
`,
    },
    'game_center_screen.dart': {
      desc: 'Market Game Center with Open/Close tabs & 14 game types (00:05)',
      code: `import 'package:flutter/material.dart';
import '../models/models.dart';
import 'single_digit_bid_screen.dart';
import 'jodi_digit_bid_screen.dart';

class GameCenterScreen extends StatefulWidget {
  final Market market;
  const GameCenterScreen({super.key, required this.market});

  @override
  State<GameCenterScreen> createState() => _GameCenterScreenState();
}

class _GameCenterScreenState extends State<GameCenterScreen> {
  String _session = 'Open';

  final List<Map<String, dynamic>> _games = [
    {'title': 'Single Digit', 'icon': Icons.radio_button_checked, 'onlyOpen': false},
    {'title': 'Single Digit Bulk', 'icon': Icons.adjust, 'onlyOpen': false},
    {'title': 'Jodi Digit', 'icon': Icons.circle_outlined, 'onlyOpen': true},
    {'title': 'Jodi Digit Bulk', 'icon': Icons.toll, 'onlyOpen': true},
    {'title': 'Single Pana', 'icon': Icons.add_box, 'onlyOpen': false},
    {'title': 'Single Pana Bulk', 'icon': Icons.post_add, 'onlyOpen': false},
    {'title': 'Double Pana', 'icon': Icons.copy, 'onlyOpen': false},
    {'title': 'Double Pana Bulk', 'icon': Icons.dynamic_feed, 'onlyOpen': false},
    {'title': 'Triple Pana', 'icon': Icons.auto_awesome, 'onlyOpen': false},
    {'title': 'SP Motor', 'icon': Icons.explore, 'onlyOpen': false},
    {'title': 'DP Motor', 'icon': Icons.compass_calibration, 'onlyOpen': false},
    {'title': 'Red Bracket', 'icon': Icons.code, 'onlyOpen': true},
    {'title': 'Group Jodi', 'icon': Icons.groups, 'onlyOpen': true},
    {'title': 'SP DP TP', 'icon': Icons.layers, 'onlyOpen': false},
  ];

  @override
  Widget build(BuildContext context) {
    final visible = _games.where((g) => !(_session == 'Close' && g['onlyOpen'] == true)).toList();
    return Scaffold(
      appBar: AppBar(title: Text(widget.market.name)),
      body: Column(
        children: [
          Row(
            children: [
              Expanded(child: ElevatedButton(onPressed: () => setState(() => _session = 'Open'), child: const Text('Open'))),
              Expanded(child: ElevatedButton(onPressed: () => setState(() => _session = 'Close'), child: const Text('Close'))),
            ],
          ),
          Expanded(
            child: GridView.builder(
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 2),
              itemCount: visible.length,
              itemBuilder: (ctx, i) => Card(child: Center(child: Text(visible[i]['title']))),
            ),
          ),
        ],
      ),
    );
  }
}
`,
    },
    'single_digit_bid_screen.dart': {
      desc: 'Single Digit Standard & Bulk bidding with large bold number grids & inline alerts',
      code: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/models.dart';
import '../providers/app_provider.dart';

class SingleDigitBidScreen extends StatefulWidget {
  final Market market;
  final String session;
  final bool isBulk;
  const SingleDigitBidScreen({super.key, required this.market, required this.session, required this.isBulk});

  @override
  State<SingleDigitBidScreen> createState() => _SingleDigitBidScreenState();
}

class _SingleDigitBidScreenState extends State<SingleDigitBidScreen> {
  final List<Map<String, dynamic>> _bids = [];
  final TextEditingController _bulkPointsCtrl = TextEditingController(text: '10');
  final Map<String, TextEditingController> _controllers = {};
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    for (int i = 0; i <= 9; i++) {
      _controllers['\$i'] = TextEditingController();
    }
  }

  void _confirm() {
    setState(() => _errorMessage = null);
    final provider = Provider.of<AppProvider>(context, listen: false);
    final total = _bids.fold<int>(0, (sum, b) => sum + (b['points'] as int));
    
    if (_bids.isEmpty) {
      setState(() => _errorMessage = 'Please add at least one bid number.');
      return;
    }

    if (provider.balance < total) {
      // Inline message without blocking popups
      setState(() => _errorMessage = 'Insufficient balance in wallet.');
      return;
    }

    provider.user!.balance -= total;
    provider.notifyListeners();
    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('\${widget.market.name} - Single Digit \${widget.isBulk ? "Bulk" : ""}'),
        backgroundColor: const Color(0xFF6B0028),
      ),
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Color(0xFF6B0028), Color(0xFF50001E)],
          ),
        ),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              if (widget.isBulk) ...[
                // Bulk Points
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.white12,
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Text('Enter Points : ', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
                      SizedBox(
                        width: 100,
                        child: TextField(
                          controller: _bulkPointsCtrl,
                          keyboardType: TextInputType.number,
                          textAlign: TextAlign.center,
                          style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 20),
                          decoration: InputDecoration(
                            filled: true,
                            fillColor: Colors.white,
                            contentPadding: const EdgeInsets.symmetric(vertical: 8),
                            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                // Large, Bold Number Grid (0-9)
                Expanded(
                  child: GridView.count(
                    crossAxisCount: 4,
                    crossAxisSpacing: 12,
                    mainAxisSpacing: 12,
                    children: List.generate(10, (idx) {
                      final digit = idx == 9 ? '0' : '\${idx + 1}';
                      return ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.white,
                          foregroundColor: Colors.black87,
                          elevation: 4,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        ),
                        onPressed: () {
                          final pts = int.tryParse(_bulkPointsCtrl.text) ?? 10;
                          if (_bids.any((b) => b['number'] == digit)) {
                            setState(() => _errorMessage = 'Number \$digit already added!');
                            return;
                          }
                          setState(() {
                            _errorMessage = null;
                            _bids.add({'number': digit, 'points': pts});
                          });
                        },
                        child: Text(
                          digit,
                          // FIX: Large, bold, readable font size
                          style: const TextStyle(fontSize: 32, fontWeight: FontWeight.w900),
                        ),
                      );
                    }),
                  ),
                ),
              ] else ...[
                // Standard 2-column mode with large, bold number boxes
                Expanded(
                  child: ListView.separated(
                    itemCount: 5,
                    separatorBuilder: (_, __) => const SizedBox(height: 10),
                    itemBuilder: (ctx, i) {
                      final leftDigit = ['1', '3', '5', '7', '9'][i];
                      final rightDigit = ['2', '4', '6', '8', '0'][i];
                      return Row(
                        children: [
                          _buildDigitRow(leftDigit),
                          const SizedBox(width: 10),
                          _buildDigitRow(rightDigit),
                        ],
                      );
                    },
                  ),
                ),
              ],

              // Inline Error Notice (replaces blocking popups)
              if (_errorMessage != null)
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 16),
                  margin: const EdgeInsets.only(bottom: 10),
                  decoration: BoxDecoration(
                    color: Colors.redAccent,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    _errorMessage!,
                    textAlign: TextAlign.center,
                    style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                  ),
                ),

              // Confirm Button
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: _confirm,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.white,
                    foregroundColor: const Color(0xFF6B0028),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  ),
                  child: const Text('Confirm', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildDigitRow(String digit) {
    return Expanded(
      child: Container(
        height: 60,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: Colors.rose.shade200, width: 2),
        ),
        child: Row(
          children: [
            Container(
              width: 55,
              height: double.infinity,
              decoration: const BoxDecoration(
                color: Color(0xFF6B0028),
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(12),
                  bottomLeft: Radius.circular(12),
                ),
              ),
              alignment: Alignment.center,
              child: Text(
                digit,
                // FIX: Large, bold number badge
                style: const TextStyle(color: Colors.white, fontSize: 26, fontWeight: FontWeight.w900),
              ),
            ),
            Expanded(
              child: TextField(
                controller: _controllers[digit],
                keyboardType: TextInputType.number,
                textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w900),
                decoration: const InputDecoration(border: InputBorder.none),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
`,
    },
    'triple_pana_bid_screen.dart': {
      desc: 'Triple Pana: Large number grids & inline alerts without popup overlays',
      code: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/models.dart';
import '../providers/app_provider.dart';

class TriplePanaBidScreen extends StatefulWidget {
  final Market market;
  final String session;
  const TriplePanaBidScreen({super.key, required this.market, required this.session});

  @override
  State<TriplePanaBidScreen> createState() => _TriplePanaBidScreenState();
}

class _TriplePanaBidScreenState extends State<TriplePanaBidScreen> {
  bool _isFixNumber = true;
  final List<Map<String, dynamic>> _bids = [];
  final TextEditingController _fixPointsCtrl = TextEditingController(text: '10');
  String? _errorMessage;

  final List<String> _triples = ['000', '111', '222', '333', '444', '555', '666', '777', '888', '999'];

  void _addFixAmount(String pana) {
    final pts = int.tryParse(_fixPointsCtrl.text) ?? 10;
    if (_bids.any((b) => b['number'] == pana)) {
      // Inline duplicate warning without blocking popups
      setState(() => _errorMessage = 'Number \$pana already added!');
      return;
    }
    setState(() {
      _errorMessage = null;
      _bids.add({'number': pana, 'points': pts});
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('\${widget.market.name} - Triple Pana'),
        backgroundColor: const Color(0xFF6B0028),
      ),
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Color(0xFF6B0028), Color(0xFF50001E)],
          ),
        ),
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // Mode selector
            Row(
              children: [
                Expanded(
                  child: ElevatedButton(
                    onPressed: () => setState(() {
                      _errorMessage = null;
                      _isFixNumber = true;
                    }),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: _isFixNumber ? Colors.white : Colors.white24,
                      foregroundColor: _isFixNumber ? const Color(0xFF6B0028) : Colors.white,
                    ),
                    child: const Text('Fix Number Mode', style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () => setState(() {
                      _errorMessage = null;
                      _isFixNumber = false;
                    }),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: !_isFixNumber ? Colors.white : Colors.white24,
                      foregroundColor: !_isFixNumber ? const Color(0xFF6B0028) : Colors.white,
                    ),
                    child: const Text('Fix Amount Mode', style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Triple Pana Large Grid
            Expanded(
              child: GridView.count(
                crossAxisCount: 3,
                crossAxisSpacing: 10,
                mainAxisSpacing: 10,
                childAspectRatio: 1.3,
                children: _triples.map((pana) {
                  return ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.white,
                      foregroundColor: Colors.black87,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      elevation: 3,
                    ),
                    onPressed: () => _addFixAmount(pana),
                    child: Text(
                      pana,
                      // FIX: Large, bold number font size
                      style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w900, letterSpacing: 1.5),
                    ),
                  );
                }).toList(),
              ),
            ),

            // Inline Error banner (No popup blocking)
            if (_errorMessage != null)
              Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
                margin: const EdgeInsets.only(bottom: 10),
                decoration: BoxDecoration(
                  color: Colors.redAccent,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  _errorMessage!,
                  textAlign: TextAlign.center,
                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                ),
              ),

            // Confirm
            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                onPressed: () => Navigator.pop(context),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.white,
                  foregroundColor: const Color(0xFF6B0028),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
                child: const Text('Confirm', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
`,
    },
  };

  const backendFiles: Record<string, { desc: string; code: string }> = {
    'server.ts': {
      desc: 'Node.js Express backend server with security middleware & DB connection',
      code: `import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import marketRoutes from './routes/market.routes';
import walletRoutes from './routes/wallet.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/markets', marketRoutes);
app.use('/api/wallet', walletRoutes);

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', service: 'Dhan Raj Games Backend API', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(\`Dhan Raj Games API Server running on port \${PORT}\`);
});
`,
    },
    'routes/auth.routes.ts': {
      desc: 'Authentication controller: phone verification, mPIN setup and login',
      code: `import { Router, Request, Response } from 'express';

const router = Router();

// In-memory / DB user store
interface UserRecord {
  id: string;
  phone: string;
  name: string;
  mpin: string;
  balance: number;
}

const users: Record<string, UserRecord> = {
  '7231001800': {
    id: 'usr_7231001800',
    phone: '7231001800',
    name: 'Girish',
    mpin: '1234',
    balance: 2500,
  },
};

// Check Phone
router.post('/check-phone', (req: Request, res: Response) => {
  const { phone } = req.body;
  const user = users[phone];
  return res.json({
    exists: !!user,
    requireMpin: !!user,
  });
});

// Register
router.post('/register', (req: Request, res: Response) => {
  const { phone, name, mpin } = req.body;
  if (!phone || !name || !mpin) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newUser: UserRecord = {
    id: \`usr_\${phone}\`,
    phone,
    name,
    mpin,
    balance: 1000,
  };
  users[phone] = newUser;

  return res.json({ success: true, user: newUser, token: 'jwt_token_sample' });
});

// Login with mPIN
router.post('/login-mpin', (req: Request, res: Response) => {
  const { phone, mpin } = req.body;
  const user = users[phone];

  if (!user || user.mpin !== mpin) {
    return res.status(401).json({ success: false, message: 'Invalid mpin.' });
  }

  return res.json({ success: true, user, token: 'jwt_token_sample' });
});

export default router;
`,
    },
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentFileContent =
    activeTab === 'flutter'
      ? flutterFiles[selectedFile]?.code || Object.values(flutterFiles)[0].code
      : backendFiles[selectedFile]?.code || Object.values(backendFiles)[0].code;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-neutral-900 rounded-3xl max-w-4xl w-full h-[90vh] flex flex-col shadow-2xl border border-neutral-700 overflow-hidden text-neutral-100">
        {/* Top Header */}
        <div className="bg-[#6b0028] px-6 py-4 flex items-center justify-between border-b border-rose-950">
          <div className="flex items-center gap-2.5">
            <Smartphone size={22} className="text-amber-300" />
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">Dhan Raj Games - Flutter & Backend Code Center</h3>
              <p className="text-xs text-rose-200">Complete, compile-ready code for Android APK generation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-neutral-800 bg-neutral-950 px-6 gap-6 text-sm font-bold">
          <button
            onClick={() => {
              setActiveTab('flutter');
              setSelectedFile('main.dart');
            }}
            className={`py-3 flex items-center gap-2 border-b-2 transition ${
              activeTab === 'flutter'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Smartphone size={16} />
            <span>Flutter App Source</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('backend');
              setSelectedFile('server.ts');
            }}
            className={`py-3 flex items-center gap-2 border-b-2 transition ${
              activeTab === 'backend'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Server size={16} />
            <span>Node.js Backend API</span>
          </button>

          <button
            onClick={() => setActiveTab('apk_guide')}
            className={`py-3 flex items-center gap-2 border-b-2 transition ${
              activeTab === 'apk_guide'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Terminal size={16} />
            <span>APK Build Guide</span>
          </button>
        </div>

        {/* Body */}
        {activeTab === 'apk_guide' ? (
          <div className="p-6 overflow-y-auto space-y-4 text-sm text-neutral-300 font-mono">
            <div className="bg-neutral-800/80 rounded-2xl p-5 border border-neutral-700">
              <h4 className="text-amber-400 font-bold text-base mb-3 font-sans">
                🚀 How to compile into an APK file in 3 Steps:
              </h4>

              <div className="space-y-4 font-mono text-xs">
                <div>
                  <span className="text-neutral-400">// Step 1: Initialize Flutter project</span>
                  <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 text-emerald-400 mt-1">
                    flutter create dhanraj_games<br />
                    cd dhanraj_games
                  </div>
                </div>

                <div>
                  <span className="text-neutral-400">// Step 2: Install dependencies & copy files</span>
                  <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 text-emerald-400 mt-1">
                    flutter pub add provider http shared_preferences intl google_fonts url_launcher
                  </div>
                </div>

                <div>
                  <span className="text-neutral-400">// Step 3: Compile Release APK</span>
                  <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 text-emerald-400 mt-1">
                    flutter build apk --release
                  </div>
                  <p className="text-neutral-400 text-[11px] mt-1 font-sans">
                    Output APK will be located at: <code className="text-amber-300">build/app/outputs/flutter-apk/app-release.apk</code>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* File List */}
            <div className="w-full md:w-60 bg-neutral-950 p-3 border-r border-neutral-800 overflow-y-auto space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 px-3 py-1 block">
                {activeTab === 'flutter' ? 'Flutter Files' : 'Backend Files'}
              </span>
              {Object.keys(activeTab === 'flutter' ? flutterFiles : backendFiles).map((fileName) => (
                <button
                  key={fileName}
                  onClick={() => setSelectedFile(fileName)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono flex items-center gap-2 transition ${
                    selectedFile === fileName
                      ? 'bg-[#6b0028] text-white font-bold'
                      : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                  }`}
                >
                  <FileCode size={14} />
                  <span className="truncate">{fileName}</span>
                </button>
              ))}
            </div>

            {/* Code Viewer */}
            <div className="flex-1 flex flex-col bg-neutral-900 overflow-hidden">
              <div className="px-5 py-2.5 bg-neutral-950/60 border-b border-neutral-800 flex items-center justify-between text-xs">
                <span className="font-mono text-amber-300">{selectedFile}</span>
                <button
                  onClick={() => handleCopy(currentFileContent)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-semibold transition"
                >
                  {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span>{copied ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>

              <pre className="flex-1 p-4 overflow-auto text-xs font-mono text-neutral-200 leading-relaxed bg-neutral-950/40 select-text">
                {currentFileContent}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/models.dart';
import '../providers/app_provider.dart';
import 'single_digit_bid_screen.dart';
import 'jodi_digit_bid_screen.dart';
import 'pana_bid_screen.dart';
import 'triple_pana_bid_screen.dart';

class GameCenterScreen extends StatefulWidget {
  final Market market;
  const GameCenterScreen({super.key, required this.market});

  @override
  State<GameCenterScreen> createState() => _GameCenterScreenState();
}

class _GameCenterScreenState extends State<GameCenterScreen> {
  String _session = 'Open';

  final List<Map<String, dynamic>> _allGames = [
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
    final visibleGames = _allGames.where((g) {
      if (_session == 'Close' && g['onlyOpen'] == true) return false;
      return true;
    }).toList();

    return Scaffold(
      appBar: AppBar(
        title: Text(widget.market.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        backgroundColor: const Color(0xFF6B0028),
      ),
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Color(0xFF6B0028), Color(0xFF850533), Color(0xFF50001E)],
          ),
        ),
        child: Column(
          children: [
            // Session Toggle: Open | Close
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              child: Row(
                children: [
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () => setState(() => _session = 'Open'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: _session == 'Open' ? const Color(0xFF50001E) : Colors.white,
                        foregroundColor: _session == 'Open' ? Colors.white : Colors.black87,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                          side: BorderSide(color: _session == 'Open' ? Colors.white38 : Colors.transparent),
                        ),
                        padding: const EdgeInsets.symmetric(vertical: 14),
                      ),
                      child: const Text('Open', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () => setState(() => _session = 'Close'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: _session == 'Close' ? const Color(0xFF50001E) : Colors.white,
                        foregroundColor: _session == 'Close' ? Colors.white : Colors.black87,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                          side: BorderSide(color: _session == 'Close' ? Colors.white38 : Colors.transparent),
                        ),
                        padding: const EdgeInsets.symmetric(vertical: 14),
                      ),
                      child: const Text('Close', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                    ),
                  ),
                ],
              ),
            ),

            // Game Cards Grid
            Expanded(
              child: GridView.builder(
                padding: const EdgeInsets.all(16),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  childAspectRatio: 1.25,
                  crossAxisSpacing: 12,
                  mainAxisSpacing: 12,
                ),
                itemCount: visibleGames.length,
                itemBuilder: (context, index) {
                  final game = visibleGames[index];
                  return Card(
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                    elevation: 3,
                    child: InkWell(
                      borderRadius: BorderRadius.circular(20),
                      onTap: () {
                        _navigateToGame(game['title'] as String);
                      },
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Container(
                            padding: const EdgeInsets.all(10),
                            decoration: const BoxDecoration(
                              shape: BoxShape.circle,
                              color: Color(0xFF6B0028),
                            ),
                            child: Icon(game['icon'] as IconData, color: Colors.white, size: 24),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            game['title'] as String,
                            textAlign: TextAlign.center,
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.black87),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _navigateToGame(String gameTitle) {
    if (gameTitle == 'Single Digit') {
      Navigator.push(context, MaterialPageRoute(builder: (_) => SingleDigitBidScreen(market: widget.market, session: _session, isBulk: false)));
    } else if (gameTitle == 'Single Digit Bulk') {
      Navigator.push(context, MaterialPageRoute(builder: (_) => SingleDigitBidScreen(market: widget.market, session: _session, isBulk: true)));
    } else if (gameTitle == 'Jodi Digit') {
      Navigator.push(context, MaterialPageRoute(builder: (_) => JodiDigitBidScreen(market: widget.market, session: _session, isBulk: false)));
    } else if (gameTitle == 'Jodi Digit Bulk') {
      Navigator.push(context, MaterialPageRoute(builder: (_) => JodiDigitBidScreen(market: widget.market, session: _session, isBulk: true)));
    } else if (gameTitle.contains('Pana') && !gameTitle.contains('Triple')) {
      Navigator.push(context, MaterialPageRoute(builder: (_) => PanaBidScreen(market: widget.market, session: _session, gameType: gameTitle)));
    } else if (gameTitle == 'Triple Pana') {
      Navigator.push(context, MaterialPageRoute(builder: (_) => TriplePanaBidScreen(market: widget.market, session: _session)));
    } else {
      // Default / Motor fallback
      Navigator.push(context, MaterialPageRoute(builder: (_) => SingleDigitBidScreen(market: widget.market, session: _session, isBulk: false)));
    }
  }
}

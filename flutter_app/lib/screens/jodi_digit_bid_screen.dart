import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/models.dart';
import '../providers/app_provider.dart';

class JodiDigitBidScreen extends StatefulWidget {
  final Market market;
  final String session;
  final bool isBulk;

  const JodiDigitBidScreen({
    super.key,
    required this.market,
    required this.session,
    required this.isBulk,
  });

  @override
  State<JodiDigitBidScreen> createState() => _JodiDigitBidScreenState();
}

class _JodiDigitBidScreenState extends State<JodiDigitBidScreen> {
  String _activeTab = '1';
  final Map<String, TextEditingController> _controllers = {};
  final TextEditingController _bulkController = TextEditingController(text: '20');
  final List<Map<String, dynamic>> _bidEntries = [];

  List<String> _getJodisForTab(String tab) {
    return List.generate(10, (i) => '$tab$i');
  }

  @override
  Widget build(BuildContext context) {
    final jodis = _getJodisForTab(_activeTab);
    final totalPoints = _bidEntries.fold<int>(0, (sum, item) => sum + (item['points'] as int));

    return Scaffold(
      appBar: AppBar(
        title: Text('${widget.market.name} - ${widget.session} - Jodi Digit', style: const TextStyle(fontSize: 14)),
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
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Column(
            children: [
              // Top Tabs 1, 2, 3... 0
              SizedBox(
                height: 42,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  itemCount: 10,
                  itemBuilder: (ctx, idx) {
                    final tab = idx == 9 ? '0' : '${idx + 1}';
                    final isSel = _activeTab == tab;
                    return Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 3),
                      child: ActionChip(
                        label: Text(tab, style: TextStyle(fontWeight: FontWeight.bold, color: isSel ? Colors.black : Colors.white)),
                        backgroundColor: isSel ? const Color(0xFFFCD34D) : Colors.white24,
                        shape: const CircleBorder(),
                        onPressed: () => setState(() => _activeTab = tab),
                      ),
                    );
                  },
                ),
              ),

              const SizedBox(height: 10),

              if (widget.isBulk) ...[
                // Bulk Mode
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(color: Colors.black26, borderRadius: BorderRadius.circular(14)),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Text('Enter Points : ', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                      SizedBox(
                        width: 100,
                        child: TextField(
                          controller: _bulkController,
                          keyboardType: TextInputType.number,
                          textAlign: TextAlign.center,
                          style: const TextStyle(fontWeight: FontWeight.bold),
                          decoration: InputDecoration(
                            filled: true,
                            fillColor: Colors.white,
                            contentPadding: const EdgeInsets.symmetric(vertical: 6),
                            border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 8),
                GridView.builder(
                  shrinkWrap: true,
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 5,
                    childAspectRatio: 1.5,
                    crossAxisSpacing: 6,
                    mainAxisSpacing: 6,
                  ),
                  itemCount: jodis.length,
                  itemBuilder: (ctx, i) {
                    final jodi = jodis[i];
                    return ElevatedButton(
                      onPressed: () {
                        final pts = int.tryParse(_bulkController.text.trim()) ?? 0;
                        if (pts <= 0) return;
                        if (_bidEntries.any((e) => e['number'] == jodi)) {
                          ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Number $jodi already added!')));
                          return;
                        }
                        setState(() => _bidEntries.add({'number': jodi, 'points': pts}));
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.white,
                        foregroundColor: Colors.black,
                        padding: EdgeInsets.zero,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                      child: Text(jodi, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                    );
                  },
                ),
              ] else ...[
                // Standard Mode
                Expanded(
                  child: GridView.builder(
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      childAspectRatio: 2.8,
                      crossAxisSpacing: 8,
                      mainAxisSpacing: 8,
                    ),
                    itemCount: jodis.length,
                    itemBuilder: (ctx, i) {
                      final jodi = jodis[i];
                      _controllers[jodi] ??= TextEditingController();
                      return Container(
                        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(10)),
                        child: Row(
                          children: [
                            Container(
                              width: 44,
                              height: double.infinity,
                              decoration: const BoxDecoration(
                                color: Color(0xFF6B0028),
                                borderRadius: BorderRadius.horizontal(left: Radius.circular(10)),
                              ),
                              child: Center(child: Text(jodi, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold))),
                            ),
                            Expanded(
                              child: TextField(
                                controller: _controllers[jodi],
                                keyboardType: TextInputType.number,
                                textAlign: TextAlign.center,
                                decoration: const InputDecoration(border: InputBorder.none),
                              ),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
                ),
                ElevatedButton(
                  onPressed: () {
                    for (var jodi in jodis) {
                      final pts = int.tryParse(_controllers[jodi]?.text.trim() ?? '') ?? 0;
                      if (pts > 0) {
                        _bidEntries.add({'number': jodi, 'points': pts});
                        _controllers[jodi]?.clear();
                      }
                    }
                    setState(() {});
                  },
                  style: ElevatedButton.styleFrom(backgroundColor: Colors.white, foregroundColor: const Color(0xFF6B0028)),
                  child: const Text('Add', style: TextStyle(fontWeight: FontWeight.bold)),
                ),
              ],

              const SizedBox(height: 8),

              // Summary Table Card
              Card(
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                child: Padding(
                  padding: const EdgeInsets.all(10),
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text('Number', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                          const Text('Points', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                          TextButton(
                            onPressed: () => setState(() => _bidEntries.clear()),
                            child: const Text('Delete All', style: TextStyle(color: Colors.red, fontSize: 12)),
                          ),
                        ],
                      ),
                      ConstrainedBox(
                        constraints: const BoxConstraints(maxHeight: 110),
                        child: ListView.builder(
                          shrinkWrap: true,
                          itemCount: _bidEntries.length,
                          itemBuilder: (ctx, i) {
                            final item = _bidEntries[i];
                            return Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(item['number'], style: const TextStyle(fontWeight: FontWeight.bold)),
                                Text('${item['points']}'),
                                IconButton(
                                  icon: const Icon(Icons.cancel, color: Colors.red, size: 16),
                                  onPressed: () => setState(() => _bidEntries.removeAt(i)),
                                ),
                              ],
                            );
                          },
                        ),
                      ),
                      const Divider(),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text('Total :', style: TextStyle(fontWeight: FontWeight.bold)),
                          Text('$totalPoints', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFF6B0028))),
                        ],
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 8),

              // Confirm Button with Wallet check
              SizedBox(
                width: double.infinity,
                height: 46,
                child: ElevatedButton(
                  onPressed: () {
                    final provider = Provider.of<AppProvider>(context, listen: false);
                    if (provider.balance < totalPoints) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Insufficient balance in wallet.')),
                      );
                      return;
                    }
                    provider.user!.balance -= totalPoints;
                    provider.notifyListeners();
                    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Bids Placed!'), backgroundColor: Colors.green));
                    Navigator.pop(context);
                  },
                  style: ElevatedButton.styleFrom(backgroundColor: Colors.white, foregroundColor: const Color(0xFF6B0028)),
                  child: const Text('Confirm', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/models.dart';
import '../providers/app_provider.dart';

class SingleDigitBidScreen extends StatefulWidget {
  final Market market;
  final String session;
  final bool isBulk;

  const SingleDigitBidScreen({
    super.key,
    required this.market,
    required this.session,
    required this.isBulk,
  });

  @override
  State<SingleDigitBidScreen> createState() => _SingleDigitBidScreenState();
}

class _SingleDigitBidScreenState extends State<SingleDigitBidScreen> {
  final Map<String, TextEditingController> _controllers = {};
  final TextEditingController _bulkController = TextEditingController(text: '10');
  final List<Map<String, dynamic>> _bidEntries = [];

  @override
  void initState() {
    super.initState();
    for (var d in ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']) {
      _controllers[d] = TextEditingController();
    }
  }

  @override
  void dispose() {
    _controllers.forEach((_, c) => c.dispose());
    _bulkController.dispose();
    super.dispose();
  }

  void _addStandard() {
    _controllers.forEach((digit, controller) {
      final pts = int.tryParse(controller.text.trim()) ?? 0;
      if (pts > 0) {
        final existingIdx = _bidEntries.indexWhere((e) => e['number'] == digit);
        if (existingIdx >= 0) {
          _bidEntries[existingIdx]['points'] = pts;
        } else {
          _bidEntries.add({'number': digit, 'points': pts});
        }
        controller.clear();
      }
    });
    setState(() {});
  }

  void _addBulk(String digit) {
    final pts = int.tryParse(_bulkController.text.trim()) ?? 0;
    if (pts <= 0) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Please enter points first')));
      return;
    }
    final existingIdx = _bidEntries.indexWhere((e) => e['number'] == digit);
    if (existingIdx >= 0) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Number $digit already added!')));
      return;
    }
    setState(() {
      _bidEntries.add({'number': digit, 'points': pts});
    });
  }

  void _confirmBids() {
    if (_bidEntries.isEmpty) return;
    final provider = Provider.of<AppProvider>(context, listen: false);
    final total = _bidEntries.fold<int>(0, (sum, item) => sum + (item['points'] as int));

    // Video wallet check: Insufficient balance in wallet.
    if (provider.balance < total) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Row(
            children: const [
              Icon(Icons.error_outline, color: Colors.white),
              SizedBox(width: 8),
              Text('Insufficient balance in wallet.', style: TextStyle(fontWeight: FontWeight.bold)),
            ],
          ),
          backgroundColor: Colors.black87,
          behavior: SnackBarBehavior.floating,
        ),
      );
      return;
    }

    // Deduct and save
    provider.user!.balance -= total;
    for (var item in _bidEntries) {
      provider.bids.insert(
        0,
        BidItem(
          id: 'bid_${DateTime.now().millisecondsSinceEpoch}',
          marketName: widget.market.name,
          gameType: widget.isBulk ? 'Single Digit Bulk' : 'Single Digit',
          number: item['number'],
          amount: (item['points'] as int).toDouble(),
          date: '2026-10-17',
          time: '04:30 PM',
          status: 'Pending',
        ),
      );
    }
    provider.notifyListeners();

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Bids placed successfully!'), backgroundColor: Colors.green),
    );
    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    final totalPoints = _bidEntries.fold<int>(0, (sum, item) => sum + (item['points'] as int));

    return Scaffold(
      appBar: AppBar(
        title: Text(
          '${widget.market.name} - ${widget.session} - Single Digit',
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
        ),
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
          padding: const EdgeInsets.all(16.0),
          child: Column(
            children: [
              if (widget.isBulk) ...[
                // Bulk Mode
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  decoration: BoxDecoration(color: Colors.black26, borderRadius: BorderRadius.circular(16)),
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
                const SizedBox(height: 12),
                GridView.count(
                  shrinkWrap: true,
                  crossAxisCount: 4,
                  childAspectRatio: 1.8,
                  crossAxisSpacing: 8,
                  mainAxisSpacing: 8,
                  children: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map((d) {
                    return ElevatedButton(
                      onPressed: () => _addBulk(d),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.white,
                        foregroundColor: Colors.black,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      child: Text(d, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                    );
                  }).toList(),
                ),
              ] else ...[
                // Standard 2-column Mode
                Expanded(
                  child: ListView(
                    children: [
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Expanded(
                            child: Column(
                              children: ['1', '3', '5', '7', '9'].map((d) => _buildInputRow(d)).toList(),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              children: ['2', '4', '6', '8', '0'].map((d) => _buildInputRow(d)).toList(),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          onPressed: _addStandard,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.white,
                            foregroundColor: const Color(0xFF6B0028),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                          ),
                          child: const Text('Add', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                        ),
                      ),
                    ],
                  ),
                ),
              ],

              const SizedBox(height: 8),

              // Summary Table Card
              Card(
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                child: Padding(
                  padding: const EdgeInsets.all(12),
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
                      const Divider(),
                      ConstrainedBox(
                        constraints: const BoxConstraints(maxHeight: 120),
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
                                  icon: const Icon(Icons.cancel, color: Colors.red, size: 18),
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
                          const Text('Total :', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                          Text('$totalPoints', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFF6B0028))),
                        ],
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 8),

              // Confirm Button
              SizedBox(
                width: double.infinity,
                height: 48,
                child: ElevatedButton(
                  onPressed: _confirmBids,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.white,
                    foregroundColor: const Color(0xFF6B0028),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                  child: const Text('Confirm', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildInputRow(String digit) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          Container(
            width: 44,
            padding: const EdgeInsets.symmetric(vertical: 10),
            decoration: const BoxDecoration(
              color: Color(0xFF6B0028),
              borderRadius: BorderRadius.horizontal(left: Radius.circular(12)),
            ),
            child: Center(
              child: Text(digit, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            ),
          ),
          Expanded(
            child: TextField(
              controller: _controllers[digit],
              keyboardType: TextInputType.number,
              textAlign: TextAlign.center,
              decoration: const InputDecoration(border: InputBorder.none, contentPadding: EdgeInsets.symmetric(horizontal: 8)),
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
          ),
        ],
      ),
    );
  }
}

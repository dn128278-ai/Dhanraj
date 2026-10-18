import 'package:flutter/material.dart';
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
  bool _isFixNumber = true; // Fix Number Mode vs Fix Amount Mode
  final TextEditingController _fixAmountController = TextEditingController(text: '10');
  final Map<String, TextEditingController> _controllers = {};
  final List<Map<String, dynamic>> _bidEntries = [];

  final List<String> _triplePanas = ['000', '111', '222', '333', '444', '555', '666', '777', '888', '999'];

  @override
  void initState() {
    super.initState();
    for (var p in _triplePanas) {
      _controllers[p] = TextEditingController();
    }
  }

  @override
  Widget build(BuildContext context) {
    final totalPoints = _bidEntries.fold<int>(0, (sum, item) => sum + (item['points'] as int));

    return Scaffold(
      appBar: AppBar(
        title: Text('${widget.market.name} - ${widget.session} - Triple Pana', style: const TextStyle(fontSize: 14)),
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
              // Mode Toggles matching video 03:51: Fix Number Mode | Fix Amount Mode
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () => setState(() => _isFixNumber = true),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: _isFixNumber ? Colors.white : Colors.white24,
                        foregroundColor: _isFixNumber ? const Color(0xFF6B0028) : Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      child: const Text('Fix Number Mode', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () => setState(() => _isFixNumber = false),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: !_isFixNumber ? Colors.white : Colors.white24,
                        foregroundColor: !_isFixNumber ? const Color(0xFF6B0028) : Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      child: const Text('Fix Amount Mode', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 10),

              if (!_isFixNumber) ...[
                // Fix Amount Mode
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
                          controller: _fixAmountController,
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
                GridView.count(
                  shrinkWrap: true,
                  crossAxisCount: 4,
                  childAspectRatio: 1.8,
                  crossAxisSpacing: 6,
                  mainAxisSpacing: 6,
                  children: _triplePanas.map((pana) {
                    return ElevatedButton(
                      onPressed: () {
                        final pts = int.tryParse(_fixAmountController.text.trim()) ?? 0;
                        if (pts <= 0) return;
                        if (_bidEntries.any((e) => e['number'] == pana)) {
                          // Exact video alert: Number XXX already added!
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text('Number $pana already added!'),
                              backgroundColor: Colors.black87,
                            ),
                          );
                          return;
                        }
                        setState(() => _bidEntries.add({'number': pana, 'points': pts}));
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.white,
                        foregroundColor: Colors.black,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                      child: Text(pana, style: const TextStyle(fontWeight: FontWeight.bold)),
                    );
                  }).toList(),
                ),
              ] else ...[
                // Fix Number Mode
                Expanded(
                  child: GridView.builder(
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      childAspectRatio: 2.8,
                      crossAxisSpacing: 8,
                      mainAxisSpacing: 8,
                    ),
                    itemCount: _triplePanas.length,
                    itemBuilder: (ctx, i) {
                      final pana = _triplePanas[i];
                      return Container(
                        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(10)),
                        child: Row(
                          children: [
                            Container(
                              width: 50,
                              height: double.infinity,
                              decoration: const BoxDecoration(
                                color: Color(0xFF6B0028),
                                borderRadius: BorderRadius.horizontal(left: Radius.circular(10)),
                              ),
                              child: Center(child: Text(pana, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold))),
                            ),
                            Expanded(
                              child: TextField(
                                controller: _controllers[pana],
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
                    for (var pana in _triplePanas) {
                      final pts = int.tryParse(_controllers[pana]?.text.trim() ?? '') ?? 0;
                      if (pts > 0) {
                        _bidEntries.add({'number': pana, 'points': pts});
                        _controllers[pana]?.clear();
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

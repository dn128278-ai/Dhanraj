import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/models.dart';
import '../providers/app_provider.dart';

class PanaBidScreen extends StatefulWidget {
  final Market market;
  final String session;
  final String gameType; // 'Single Pana', 'Single Pana Bulk', 'Double Pana', 'Double Pana Bulk'

  const PanaBidScreen({
    super.key,
    required this.market,
    required this.session,
    required this.gameType,
  });

  @override
  State<PanaBidScreen> createState() => _PanaBidScreenState();
}

class _PanaBidScreenState extends State<PanaBidScreen> {
  String _activeTab = '1';
  final TextEditingController _bulkController = TextEditingController(text: '20');
  final Map<String, TextEditingController> _controllers = {};
  final List<Map<String, dynamic>> _bidEntries = [];

  final Map<String, List<String>> _singlePanas = {
    '1': ['128', '137', '146', '236', '245', '290', '380', '470', '489', '560', '678', '579'],
    '2': ['129', '138', '147', '156', '237', '246', '345', '390', '480', '570', '679', '589'],
    '3': ['120', '139', '148', '157', '238', '247', '256', '346', '490', '580', '670', '689'],
    '4': ['130', '149', '158', '167', '239', '248', '257', '347', '356', '590', '680', '789'],
    '5': ['140', '159', '168', '230', '249', '258', '267', '348', '357', '456', '690', '780'],
    '6': ['123', '150', '169', '178', '240', '259', '268', '349', '358', '457', '367', '790'],
    '7': ['124', '160', '179', '250', '269', '278', '340', '359', '368', '458', '467', '890'],
    '8': ['125', '134', '170', '189', '260', '279', '350', '369', '378', '459', '567', '468'],
    '9': ['126', '135', '180', '234', '270', '289', '360', '379', '450', '469', '478', '568'],
    '0': ['127', '136', '145', '190', '235', '280', '370', '479', '460', '569', '389', '578'],
  };

  final Map<String, List<String>> _doublePanas = {
    '1': ['100', '119', '155', '227', '335', '344', '399', '588', '669'],
    '2': ['200', '110', '228', '255', '336', '499', '660', '688', '778'],
    '3': ['300', '166', '229', '337', '355', '445', '599', '779', '788'],
    '4': ['400', '112', '220', '266', '338', '446', '455', '699', '770'],
    '5': ['500', '113', '122', '177', '339', '366', '447', '799', '889'],
    '6': ['600', '114', '277', '330', '448', '466', '556', '880', '899'],
    '7': ['700', '115', '133', '188', '223', '377', '449', '557', '566'],
    '8': ['800', '116', '224', '233', '288', '440', '477', '558', '990'],
    '9': ['900', '117', '144', '199', '225', '388', '559', '577', '667'],
    '0': ['550', '668', '244', '299', '226', '488', '677', '118', '334'],
  };

  @override
  Widget build(BuildContext context) {
    final isDouble = widget.gameType.contains('Double');
    final isBulk = widget.gameType.contains('Bulk');
    final panas = (isDouble ? _doublePanas[_activeTab] : _singlePanas[_activeTab]) ?? [];
    final totalPoints = _bidEntries.fold<int>(0, (sum, item) => sum + (item['points'] as int));

    return Scaffold(
      appBar: AppBar(
        title: Text('${widget.market.name} - ${widget.session} - ${widget.gameType}', style: const TextStyle(fontSize: 14)),
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
              // Digit Tabs
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

              if (isBulk) ...[
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
                    crossAxisCount: 4,
                    childAspectRatio: 1.8,
                    crossAxisSpacing: 6,
                    mainAxisSpacing: 6,
                  ),
                  itemCount: panas.length,
                  itemBuilder: (ctx, i) {
                    final pana = panas[i];
                    return ElevatedButton(
                      onPressed: () {
                        final pts = int.tryParse(_bulkController.text.trim()) ?? 0;
                        if (pts <= 0) return;
                        if (_bidEntries.any((e) => e['number'] == pana)) {
                          ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Number $pana already added!')));
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
                    itemCount: panas.length,
                    itemBuilder: (ctx, i) {
                      final pana = panas[i];
                      _controllers[pana] ??= TextEditingController();
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
                    for (var pana in panas) {
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

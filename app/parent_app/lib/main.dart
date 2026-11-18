import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:raad_core/raad_core.dart';

void main() {
  runApp(const RaadParentApp());
}

/// The root widget for the Raad parent application.
class RaadParentApp extends StatelessWidget {
  /// Creates the Raad parent application.
  const RaadParentApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Raad',
      theme: RaadTheme.light(),
      debugShowCheckedModeBanner: false,
      home: const ParentHomeScreen(),
    );
  }
}

/// The primary screen shown by the Raad parent application.
class ParentHomeScreen extends StatelessWidget {
  /// Creates the parent home screen.
  const ParentHomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: const Padding(padding: EdgeInsets.all(12), child: RaadMark()),
        title: const Text('Raad'),
        actions: [
          if (kDebugMode)
            IconButton(
              tooltip: 'Design system',
              icon: const RaadIcon(RaadIcons.layers, color: RaadColors.white),
              onPressed: () => Navigator.of(
                context,
              ).push(
                MaterialPageRoute<void>(
                  builder: (_) => const RaadDesignSystemScreen(),
                ),
              ),
            ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(RaadSpace.s5),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Raad', style: RaadText.h1),
            const SizedBox(height: RaadSpace.s2),
            Text(
              'Always know where the bus is.',
              style: RaadText.body.copyWith(color: RaadColors.textSecondary),
            ),
          ],
        ),
      ),
    );
  }
}

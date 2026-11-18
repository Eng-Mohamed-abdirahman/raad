import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:raad_core/raad_core.dart';

void main() {
  runApp(const RaadDriverApp());
}

/// The root widget for the Raad driver application.
class RaadDriverApp extends StatelessWidget {
  /// Creates the Raad driver application.
  const RaadDriverApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Raad Driver',
      theme: RaadTheme.light(),
      debugShowCheckedModeBanner: false,
      home: const DriverHomeScreen(),
    );
  }
}

/// The primary screen shown by the Raad driver application.
class DriverHomeScreen extends StatelessWidget {
  /// Creates the driver home screen.
  const DriverHomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        // The navy tile helps drivers distinguish this app from the parent app.
        leading: const Padding(
          padding: EdgeInsets.all(12),
          child: RaadMark(navyTile: true),
        ),
        title: const Text('Raad Driver'),
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
            const Text('Raad Driver', style: RaadText.h1),
            const SizedBox(height: RaadSpace.s2),
            Text(
              'Trips, stops and location sharing come next.',
              style: RaadText.body.copyWith(color: RaadColors.textSecondary),
            ),
          ],
        ),
      ),
    );
  }
}

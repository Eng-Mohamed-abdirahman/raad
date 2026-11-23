import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:raad_core/raad_core.dart';

void main() {
  test('semantic colours match the design tokens', () {
    expect(RaadColors.bgBrand, RaadColors.yellow400);
    expect(RaadColors.textOnBrand, RaadColors.navy900);
    expect(RaadColors.yellow400.toARGB32(), 0xFFF5B400);
  });

  test('every status has an icon and both labels', () {
    for (final status in RaadStatus.values) {
      expect(status.en, isNotEmpty);
      expect(status.so, isNotEmpty);
      expect(status.icon.svg, contains('<'));
    }
  });

  test('ETA style uses tabular figures and the bundled Inter font', () {
    expect(RaadText.eta.fontFamily, 'packages/raad_core/Inter');
    expect(RaadText.eta.fontFeatures, isNotEmpty);
  });

  testWidgets('design system screen builds with the Raad theme', (tester) async {
    await tester.pumpWidget(
      MaterialApp(theme: RaadTheme.light(), home: const RaadDesignSystemScreen()),
    );
    expect(find.text('Design system'), findsOneWidget);
  });
}

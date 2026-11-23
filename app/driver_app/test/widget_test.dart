import 'package:flutter_test/flutter_test.dart';
import 'package:raad_driver/main.dart';

void main() {
  testWidgets('home screen shows the app name', (tester) async {
    await tester.pumpWidget(const RaadDriverApp());
    expect(find.text('Raad Driver'), findsWidgets);
  });
}

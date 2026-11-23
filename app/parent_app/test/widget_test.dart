import 'package:flutter_test/flutter_test.dart';
import 'package:raad_parent/main.dart';

void main() {
  testWidgets('home screen shows the app name', (tester) async {
    await tester.pumpWidget(const RaadParentApp());
    expect(find.text('Raad'), findsWidgets);
  });
}

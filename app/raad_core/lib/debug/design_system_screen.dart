import 'package:flutter/material.dart';

import '../theme/generated/raad_icons.dart';
import '../theme/generated/raad_text.dart';
import '../theme/generated/raad_tokens.dart';
import '../theme/raad_widgets.dart';

/// Debug-only screen showing colours, text styles, buttons, status pills and icons.
/// Open it from a debug menu and compare with Figma page "0 · Design system".
class RaadDesignSystemScreen extends StatelessWidget {
  const RaadDesignSystemScreen({super.key});

  static const _scales = <String, List<Color>>{
    'yellow': [
      RaadColors.yellow50,
      RaadColors.yellow100,
      RaadColors.yellow200,
      RaadColors.yellow300,
      RaadColors.yellow400,
      RaadColors.yellow500,
      RaadColors.yellow600,
      RaadColors.yellow700,
      RaadColors.yellow800,
      RaadColors.yellow900,
    ],
    'navy': [
      RaadColors.navy50,
      RaadColors.navy100,
      RaadColors.navy200,
      RaadColors.navy300,
      RaadColors.navy400,
      RaadColors.navy500,
      RaadColors.navy600,
      RaadColors.navy700,
      RaadColors.navy800,
      RaadColors.navy900,
    ],
    'blue': [
      RaadColors.blue50,
      RaadColors.blue100,
      RaadColors.blue200,
      RaadColors.blue300,
      RaadColors.blue400,
      RaadColors.blue500,
      RaadColors.blue600,
      RaadColors.blue700,
      RaadColors.blue800,
      RaadColors.blue900,
    ],
    'green': [
      RaadColors.green50,
      RaadColors.green100,
      RaadColors.green200,
      RaadColors.green300,
      RaadColors.green400,
      RaadColors.green500,
      RaadColors.green600,
      RaadColors.green700,
      RaadColors.green800,
      RaadColors.green900,
    ],
    'red': [
      RaadColors.red50,
      RaadColors.red100,
      RaadColors.red200,
      RaadColors.red300,
      RaadColors.red400,
      RaadColors.red500,
      RaadColors.red600,
      RaadColors.red700,
      RaadColors.red800,
      RaadColors.red900,
    ],
    'sand': [
      RaadColors.sand0,
      RaadColors.sand50,
      RaadColors.sand100,
      RaadColors.sand200,
      RaadColors.sand300,
      RaadColors.sand400,
    ],
  };

  static const _textStyles = <String, (TextStyle, String)>{
    'display': (RaadText.display, 'Arriving'),
    'eta': (RaadText.eta, '6 min'),
    'h1': (RaadText.h1, 'Good morning, Hodan'),
    'h2': (RaadText.h2, 'Today’s trips'),
    'h3': (RaadText.h3, 'Stop 4 · Jigjiga Yar'),
    'title': (RaadText.title, 'Bus 07 · Morning route'),
    'body': (RaadText.body, 'The bus left Stop 3 and is heading to your stop.'),
    'small': (RaadText.small, 'Updated 8 s ago · Driver: Abdi'),
    'caption': (RaadText.caption, '© OpenStreetMap contributors'),
    'overline': (RaadText.overline, 'NEXT STOP'),
    'mono': (RaadText.mono, 'SL-4471'),
  };

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Design system'),
        actions: const [Padding(padding: EdgeInsets.only(right: 16), child: RaadMark(size: 32))],
      ),
      body: ListView(
        padding: const EdgeInsets.all(RaadSpace.s4),
        children: [
          _section('Colour scales'),
          for (final entry in _scales.entries) ...[
            Text(entry.key, style: RaadText.mono.copyWith(color: RaadColors.textSecondary)),
            const SizedBox(height: RaadSpace.s1),
            Row(
              children: [
                for (final color in entry.value)
                  Expanded(
                    child: Container(
                      height: 32,
                      decoration: BoxDecoration(
                        color: color,
                        border: Border.all(color: RaadColors.borderSubtle, width: 0.5),
                      ),
                    ),
                  ),
              ],
            ),
            const SizedBox(height: RaadSpace.s3),
          ],
          _section('Status'),
          Wrap(
            spacing: RaadSpace.s2,
            runSpacing: RaadSpace.s2,
            children: [
              for (final status in RaadStatus.values) RaadStatusPill(status),
              for (final status in RaadStatus.values) RaadStatusPill(status, label: status.so),
              const RaadStatusPill(RaadStatus.late, label: 'Delayed 8 min', large: true),
            ],
          ),
          _section('Text'),
          for (final entry in _textStyles.entries)
            Padding(
              padding: const EdgeInsets.only(bottom: RaadSpace.s3),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(entry.key, style: RaadText.caption.copyWith(color: RaadColors.textMuted)),
                  Text(entry.value.$2, style: entry.value.$1),
                ],
              ),
            ),
          _section('Buttons'),
          for (final variant in RaadButtonVariant.values)
            Container(
              color: variant == RaadButtonVariant.inverse ? RaadColors.bgInverse : null,
              padding: const EdgeInsets.symmetric(vertical: RaadSpace.s1),
              child: Wrap(
                spacing: RaadSpace.s2,
                runSpacing: RaadSpace.s2,
                crossAxisAlignment: WrapCrossAlignment.center,
                children: [
                  for (final size in RaadButtonSize.values)
                    RaadButton(
                      label: size == RaadButtonSize.md ? variant.name : size.name,
                      icon: RaadIcons.bus,
                      variant: variant,
                      size: size,
                      onPressed: () {},
                    ),
                ],
              ),
            ),
          RaadButton(label: 'Disabled', onPressed: null, icon: RaadIcons.lock),
          const SizedBox(height: RaadSpace.s2),
          RaadButton(
            label: 'Calaamadi in ardayda oo dhan la qaaday',
            icon: RaadIcons.checkC,
            size: RaadButtonSize.lg,
            expand: true,
            onPressed: () {},
          ),
          _section('Tags and input'),
          const Wrap(
            spacing: RaadSpace.s2,
            children: [RaadPlateTag('SL-4471'), RaadPlateTag('Route 07', light: true)],
          ),
          const SizedBox(height: RaadSpace.s3),
          const TextField(decoration: InputDecoration(hintText: 'Hodan Ahmed')),
          _section('Icons (${RaadIcons.values.length})'),
          Wrap(
            spacing: RaadSpace.s3,
            runSpacing: RaadSpace.s3,
            children: [
              for (final icon in RaadIcons.values)
                SizedBox(
                  width: 64,
                  child: Column(
                    children: [
                      RaadIcon(icon),
                      const SizedBox(height: RaadSpace.s1),
                      Text(
                        icon.name,
                        style: RaadText.caption.copyWith(fontSize: 10),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
            ],
          ),
          const SizedBox(height: RaadSpace.s10),
        ],
      ),
    );
  }

  Widget _section(String title) => Padding(
    padding: const EdgeInsets.only(top: RaadSpace.s6, bottom: RaadSpace.s3),
    child: Text(title, style: RaadText.h2),
  );
}

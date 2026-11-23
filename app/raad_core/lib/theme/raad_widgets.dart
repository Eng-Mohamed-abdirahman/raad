import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

import 'generated/raad_icons.dart';
import 'generated/raad_text.dart';
import 'generated/raad_tokens.dart';

/// A Raad UI icon: 24×24 grid, 2px round stroke, drawn in [color] (defaults to the icon theme).
class RaadIcon extends StatelessWidget {
  const RaadIcon(this.icon, {super.key, this.size = 24, this.color, this.semanticLabel});

  final RaadIcons icon;
  final double size;
  final Color? color;

  /// Leave null for decorative icons next to text.
  final String? semanticLabel;

  @override
  Widget build(BuildContext context) {
    final resolved = color ?? IconTheme.of(context).color ?? RaadColors.textPrimary;
    return SvgPicture.string(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000" '
      'stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${icon.svg}</svg>',
      width: size,
      height: size,
      colorFilter: ColorFilter.mode(resolved, BlendMode.srcIn),
      semanticsLabel: semanticLabel,
      excludeFromSemantics: semanticLabel == null,
    );
  }
}

/// The Raad mark: three dots (the bus's trail) leading to a pin (your stop).
/// Parent app uses the yellow tile, driver app the navy tile. Never recolour or stretch it.
class RaadMark extends StatelessWidget {
  const RaadMark({super.key, this.navyTile = false, this.size = 36});

  final bool navyTile;
  final double size;

  @override
  Widget build(BuildContext context) {
    final bg = navyTile ? '#0B1F3A' : '#F5B400';
    final fg = navyTile ? '#F5B400' : '#0B1F3A';
    return SvgPicture.string(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">'
      '<rect width="48" height="48" rx="13" fill="$bg"/>'
      '<circle cx="11" cy="37" r="2.6" fill="$fg"/>'
      '<circle cx="17.5" cy="32.5" r="2.6" fill="$fg"/>'
      '<circle cx="23" cy="27" r="2.6" fill="$fg"/>'
      '<path d="M32 30s-7.5-6.2-7.5-12a7.5 7.5 0 0 1 15 0c0 5.8-7.5 12-7.5 12z" fill="$fg"/>'
      '<circle cx="32" cy="18" r="2.8" fill="$bg"/></svg>',
      width: size,
      height: size,
      semanticsLabel: 'Raad',
    );
  }
}

/// Trip/bus status: always icon + word + colour, never colour alone.
class RaadStatusPill extends StatelessWidget {
  const RaadStatusPill(this.status, {super.key, this.label, this.large = false});

  final RaadStatus status;

  /// The words shown. Defaults to the English label; pass detail such as "Delayed 8 min".
  final String? label;
  final bool large;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: large ? 36 : 28,
      padding: EdgeInsets.only(left: large ? 10 : 8, right: large ? 14 : 10),
      decoration: BoxDecoration(
        color: status.bg,
        borderRadius: BorderRadius.circular(RaadRadius.pill),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          RaadIcon(status.icon, size: 16, color: status.fg),
          const SizedBox(width: 6),
          Text(
            label ?? status.en,
            style: RaadText.small.copyWith(
              fontSize: large ? 15 : 13,
              fontWeight: FontWeight.w600,
              fontVariations: const [FontVariation('wght', 600)],
              color: status.fg,
            ),
          ),
        ],
      ),
    );
  }
}

/// Raad button variants from Figma page 0 (primary, secondary, outline, ghost, danger,
/// success, inverse). Navy text on yellow only; danger is for destructive/SOS actions only.
enum RaadButtonVariant { primary, secondary, outline, ghost, danger, success, inverse }

enum RaadButtonSize { sm, md, lg, xl }

class RaadButton extends StatelessWidget {
  const RaadButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.icon,
    this.variant = RaadButtonVariant.primary,
    this.size = RaadButtonSize.md,
    this.expand = false,
  });

  final String label;
  final VoidCallback? onPressed;
  final RaadIcons? icon;
  final RaadButtonVariant variant;
  final RaadButtonSize size;

  /// Full width (block) button.
  final bool expand;

  @override
  Widget build(BuildContext context) {
    final (bg, fg) = switch (variant) {
      RaadButtonVariant.primary => (RaadColors.yellow400, RaadColors.navy900),
      RaadButtonVariant.secondary => (RaadColors.navy900, RaadColors.white),
      RaadButtonVariant.outline => (Colors.transparent, RaadColors.navy900),
      RaadButtonVariant.ghost => (Colors.transparent, RaadColors.blue700),
      RaadButtonVariant.danger => (RaadColors.red600, RaadColors.white),
      RaadButtonVariant.success => (RaadColors.green700, RaadColors.white),
      RaadButtonVariant.inverse => (RaadColors.white, RaadColors.navy900),
    };
    final (height, padding, fontSize, radius) = switch (size) {
      RaadButtonSize.sm => (36.0, 14.0, 14.0, 10.0),
      RaadButtonSize.md => (48.0, 20.0, 16.0, 12.0),
      RaadButtonSize.lg => (56.0, 24.0, 17.0, 14.0),
      RaadButtonSize.xl => (72.0, 28.0, 20.0, 18.0),
    };
    final weight = size == RaadButtonSize.xl ? 700 : 600;
    final enabled = onPressed != null;

    return SizedBox(
      width: expand ? double.infinity : null,
      height: height,
      child: TextButton(
        onPressed: onPressed,
        style: TextButton.styleFrom(
          backgroundColor: enabled ? bg : RaadColors.sand200,
          foregroundColor: enabled ? fg : RaadColors.navy500,
          minimumSize: Size(height, height),
          padding: EdgeInsets.symmetric(
            horizontal: variant == RaadButtonVariant.ghost ? 12 : padding,
          ),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(radius),
            side: variant == RaadButtonVariant.outline && enabled
                ? const BorderSide(color: RaadColors.navy900, width: 1.5)
                : BorderSide.none,
          ),
          textStyle: RaadText.title.copyWith(
            fontSize: fontSize,
            fontWeight: FontWeight.values[weight ~/ 100 - 1],
            fontVariations: [FontVariation('wght', weight.toDouble())],
          ),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (icon != null) ...[
              RaadIcon(icon!, size: size == RaadButtonSize.xl ? 24 : 20),
              const SizedBox(width: 8),
            ],
            Flexible(child: Text(label, textAlign: TextAlign.center)),
          ],
        ),
      ),
    );
  }
}

/// Bus plate or route code in JetBrains Mono.
class RaadPlateTag extends StatelessWidget {
  const RaadPlateTag(this.text, {super.key, this.light = false});

  final String text;
  final bool light;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 26,
      padding: const EdgeInsets.symmetric(horizontal: 8),
      alignment: Alignment.center,
      decoration: BoxDecoration(
        color: light ? RaadColors.yellow100 : RaadColors.navy900,
        borderRadius: BorderRadius.circular(RaadRadius.xs),
      ),
      child: Text(
        text,
        style: RaadText.mono.copyWith(
          fontSize: 12.5,
          letterSpacing: 0.5,
          color: light ? RaadColors.navy900 : RaadColors.yellow300,
        ),
      ),
    );
  }
}

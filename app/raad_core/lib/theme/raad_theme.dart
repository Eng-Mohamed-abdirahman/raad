import 'package:flutter/material.dart';

import 'generated/raad_text.dart';
import 'generated/raad_tokens.dart';

/// Semantic colours exposed on the theme, so widgets read them with
/// `Theme.of(context).extension<RaadSemanticColors>()!` and a future dark theme can swap them.
/// Status colours live on [RaadStatus].
@immutable
class RaadSemanticColors extends ThemeExtension<RaadSemanticColors> {
  const RaadSemanticColors({
    required this.bgApp,
    required this.bgSurface,
    required this.bgSubtle,
    required this.bgInverse,
    required this.bgBrand,
    required this.textPrimary,
    required this.textSecondary,
    required this.textMuted,
    required this.textOnBrand,
    required this.textInverse,
    required this.textLink,
    required this.borderSubtle,
    required this.borderStrong,
    required this.focus,
    required this.route,
    required this.routeDone,
  });

  static const light = RaadSemanticColors(
    bgApp: RaadColors.bgApp,
    bgSurface: RaadColors.bgSurface,
    bgSubtle: RaadColors.bgSubtle,
    bgInverse: RaadColors.bgInverse,
    bgBrand: RaadColors.bgBrand,
    textPrimary: RaadColors.textPrimary,
    textSecondary: RaadColors.textSecondary,
    textMuted: RaadColors.textMuted,
    textOnBrand: RaadColors.textOnBrand,
    textInverse: RaadColors.textInverse,
    textLink: RaadColors.textLink,
    borderSubtle: RaadColors.borderSubtle,
    borderStrong: RaadColors.borderStrong,
    focus: RaadColors.focus,
    route: RaadColors.route,
    routeDone: RaadColors.routeDone,
  );

  final Color bgApp;
  final Color bgSurface;
  final Color bgSubtle;
  final Color bgInverse;
  final Color bgBrand;
  final Color textPrimary;
  final Color textSecondary;
  final Color textMuted;
  final Color textOnBrand;
  final Color textInverse;
  final Color textLink;
  final Color borderSubtle;
  final Color borderStrong;
  final Color focus;
  final Color route;
  final Color routeDone;

  @override
  RaadSemanticColors copyWith({
    Color? bgApp,
    Color? bgSurface,
    Color? bgSubtle,
    Color? bgInverse,
    Color? bgBrand,
    Color? textPrimary,
    Color? textSecondary,
    Color? textMuted,
    Color? textOnBrand,
    Color? textInverse,
    Color? textLink,
    Color? borderSubtle,
    Color? borderStrong,
    Color? focus,
    Color? route,
    Color? routeDone,
  }) {
    return RaadSemanticColors(
      bgApp: bgApp ?? this.bgApp,
      bgSurface: bgSurface ?? this.bgSurface,
      bgSubtle: bgSubtle ?? this.bgSubtle,
      bgInverse: bgInverse ?? this.bgInverse,
      bgBrand: bgBrand ?? this.bgBrand,
      textPrimary: textPrimary ?? this.textPrimary,
      textSecondary: textSecondary ?? this.textSecondary,
      textMuted: textMuted ?? this.textMuted,
      textOnBrand: textOnBrand ?? this.textOnBrand,
      textInverse: textInverse ?? this.textInverse,
      textLink: textLink ?? this.textLink,
      borderSubtle: borderSubtle ?? this.borderSubtle,
      borderStrong: borderStrong ?? this.borderStrong,
      focus: focus ?? this.focus,
      route: route ?? this.route,
      routeDone: routeDone ?? this.routeDone,
    );
  }

  @override
  RaadSemanticColors lerp(RaadSemanticColors? other, double t) {
    if (other == null) return this;
    Color mix(Color a, Color b) => Color.lerp(a, b, t)!;
    return RaadSemanticColors(
      bgApp: mix(bgApp, other.bgApp),
      bgSurface: mix(bgSurface, other.bgSurface),
      bgSubtle: mix(bgSubtle, other.bgSubtle),
      bgInverse: mix(bgInverse, other.bgInverse),
      bgBrand: mix(bgBrand, other.bgBrand),
      textPrimary: mix(textPrimary, other.textPrimary),
      textSecondary: mix(textSecondary, other.textSecondary),
      textMuted: mix(textMuted, other.textMuted),
      textOnBrand: mix(textOnBrand, other.textOnBrand),
      textInverse: mix(textInverse, other.textInverse),
      textLink: mix(textLink, other.textLink),
      borderSubtle: mix(borderSubtle, other.borderSubtle),
      borderStrong: mix(borderStrong, other.borderStrong),
      focus: mix(focus, other.focus),
      route: mix(route, other.route),
      routeDone: mix(routeDone, other.routeDone),
    );
  }
}

/// The Raad Material theme for both apps.
///
/// Rules from the design system: navy text on yellow only (never white on yellow); every status
/// shows icon + word + colour; green only for done/arrived, red only for late and SOS.
abstract final class RaadTheme {
  static ThemeData light() {
    const scheme = ColorScheme(
      brightness: Brightness.light,
      primary: RaadColors.yellow400,
      onPrimary: RaadColors.navy900,
      primaryContainer: RaadColors.yellow100,
      onPrimaryContainer: RaadColors.navy900,
      secondary: RaadColors.navy900,
      onSecondary: RaadColors.white,
      secondaryContainer: RaadColors.navy50,
      onSecondaryContainer: RaadColors.navy900,
      tertiary: RaadColors.blue600,
      onTertiary: RaadColors.white,
      error: RaadColors.red600,
      onError: RaadColors.white,
      errorContainer: RaadColors.red50,
      onErrorContainer: RaadColors.red700,
      surface: RaadColors.bgSurface,
      onSurface: RaadColors.textPrimary,
      onSurfaceVariant: RaadColors.textSecondary,
      surfaceContainerLowest: RaadColors.white,
      surfaceContainerLow: RaadColors.bgApp,
      surfaceContainer: RaadColors.bgSubtle,
      outline: RaadColors.borderStrong,
      outlineVariant: RaadColors.borderSubtle,
      inverseSurface: RaadColors.bgInverse,
      onInverseSurface: RaadColors.white,
      inversePrimary: RaadColors.yellow300,
      shadow: RaadColors.navy900,
      scrim: RaadColors.navy900,
    );

    final textTheme = const TextTheme(
      displayLarge: RaadText.display,
      headlineMedium: RaadText.h1,
      titleLarge: RaadText.h2,
      titleMedium: RaadText.h3,
      titleSmall: RaadText.title,
      labelLarge: RaadText.title,
      bodyLarge: RaadText.body,
      bodyMedium: RaadText.small,
      bodySmall: RaadText.caption,
      labelSmall: RaadText.overline,
    ).apply(bodyColor: RaadColors.textPrimary, displayColor: RaadColors.textPrimary);

    final buttonShape = RoundedRectangleBorder(borderRadius: BorderRadius.circular(12));
    const buttonSize = Size(48, 48);
    final buttonText = RaadText.title.copyWith(fontSize: 16);

    return ThemeData(
      useMaterial3: true,
      colorScheme: scheme,
      scaffoldBackgroundColor: RaadColors.bgApp,
      textTheme: textTheme,
      fontFamily: RaadFonts.body,
      extensions: const [RaadSemanticColors.light],
      appBarTheme: AppBarTheme(
        backgroundColor: RaadColors.bgInverse,
        foregroundColor: RaadColors.white,
        elevation: 0,
        titleTextStyle: RaadText.h3.copyWith(fontSize: 19, color: RaadColors.white),
      ),
      // Primary action: yellow with navy text.
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          backgroundColor: RaadColors.yellow400,
          foregroundColor: RaadColors.navy900,
          disabledBackgroundColor: RaadColors.sand200,
          disabledForegroundColor: RaadColors.navy500,
          minimumSize: buttonSize,
          padding: const EdgeInsets.symmetric(horizontal: 20),
          shape: buttonShape,
          textStyle: buttonText,
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: RaadColors.navy900,
          side: const BorderSide(color: RaadColors.navy900, width: 1.5),
          minimumSize: buttonSize,
          padding: const EdgeInsets.symmetric(horizontal: 20),
          shape: buttonShape,
          textStyle: buttonText,
        ),
      ),
      // Ghost button.
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: RaadColors.blue700,
          minimumSize: buttonSize,
          padding: const EdgeInsets.symmetric(horizontal: 12),
          shape: buttonShape,
          textStyle: buttonText,
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: RaadColors.white,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
        hintStyle: RaadText.body.copyWith(color: RaadColors.navy400),
        border: _inputBorder(RaadColors.borderStrong),
        enabledBorder: _inputBorder(RaadColors.borderStrong),
        focusedBorder: _inputBorder(RaadColors.blue600),
        errorBorder: _inputBorder(RaadColors.red600),
        focusedErrorBorder: _inputBorder(RaadColors.red600),
        disabledBorder: _inputBorder(RaadColors.sand300),
      ),
      cardTheme: CardThemeData(
        color: RaadColors.bgSurface,
        elevation: 0,
        margin: EdgeInsets.zero,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(RaadRadius.lg),
          side: const BorderSide(color: RaadColors.borderSubtle),
        ),
      ),
      dividerTheme: const DividerThemeData(color: RaadColors.borderSubtle, thickness: 1),
      snackBarTheme: SnackBarThemeData(
        backgroundColor: RaadColors.navy900,
        contentTextStyle: RaadText.small.copyWith(
          color: RaadColors.white,
          fontWeight: FontWeight.w500,
        ),
        actionTextColor: RaadColors.yellow300,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(RaadRadius.md)),
      ),
    );
  }

  static OutlineInputBorder _inputBorder(Color color) => OutlineInputBorder(
    borderRadius: BorderRadius.circular(12),
    borderSide: BorderSide(color: color, width: 1.5),
  );
}

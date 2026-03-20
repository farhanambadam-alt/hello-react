# Cursor AI Prompt — Flutter WebView Shell for ChicSalon

> **Copy-paste this entire prompt into Cursor AI to generate the Flutter project.**

---

## PROJECT OVERVIEW

Build a Flutter app that wraps a React web app (ChicSalon) in a fullscreen WebView. The web app handles ALL layout, safe areas, and UI via CSS. Flutter ONLY provides the native shell, keyboard behavior, and injects safe area values into the web layer via CSS custom properties.

**Web App URL:** `https://your-deployed-url.com`
(Replace with your actual deployed URL)

---

## REQUIREMENTS

### 1. Dependencies (pubspec.yaml)

```yaml
name: chicsalon
description: ChicSalon Flutter WebView Shell

environment:
  sdk: '>=3.0.0 <4.0.0'
  flutter: '>=3.10.0'

dependencies:
  flutter:
    sdk: flutter
  flutter_inappwebview: ^6.0.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true
```

### 2. Android Configuration

**android/app/src/main/AndroidManifest.xml:**
- Add internet permission: `<uses-permission android:name="android.permission.INTERNET"/>`
- On the `<activity>` tag, set:
  ```xml
  android:windowSoftInputMode="adjustPan"
  android:windowLayoutInDisplayCutoutMode="shortEdges"
  ```

**android/app/src/main/res/values/styles.xml:**
- Ensure the app theme extends a no-action-bar theme
- Set `<item name="android:windowLayoutInDisplayCutoutMode">shortEdges</item>`

### 3. iOS Configuration

**ios/Runner/Info.plist:**
- Add `UIViewControllerBasedStatusBarAppearance` = `true`
- The web app already uses `viewport-fit=cover` so iOS safe areas work via `env()` CSS

### 4. main.dart — COMPLETE CODE

```dart
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();

  // Edge-to-edge: transparent system bars, content draws behind them
  SystemChrome.setEnabledSystemUIMode(SystemUiMode.edgeToEdge);
  SystemChrome.setSystemUIOverlayStyle(const SystemUIOverlayStyle(
    statusBarColor: Colors.transparent,
    statusBarIconBrightness: Brightness.dark,
    systemNavigationBarColor: Colors.transparent,
    systemNavigationBarIconBrightness: Brightness.dark,
    systemNavigationBarDividerColor: Colors.transparent,
  ));

  runApp(const ChicSalonApp());
}

class ChicSalonApp extends StatelessWidget {
  const ChicSalonApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'ChicSalon',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(useMaterial3: true),
      home: const WebViewScreen(),
    );
  }
}

class WebViewScreen extends StatefulWidget {
  const WebViewScreen({super.key});

  @override
  State<WebViewScreen> createState() => _WebViewScreenState();
}

class _WebViewScreenState extends State<WebViewScreen> {
  InAppWebViewController? _controller;

  // !! REPLACE WITH YOUR DEPLOYED URL !!
  static const String _webAppUrl = 'https://your-deployed-url.com';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // CRITICAL: Do NOT resize when keyboard opens
      resizeToAvoidBottomInset: false,
      body: InAppWebView(
        initialUrlRequest: URLRequest(url: WebUri(_webAppUrl)),
        initialSettings: InAppWebViewSettings(
          // JavaScript & DOM storage
          javaScriptEnabled: true,
          domStorageEnabled: true,

          // Disable overscroll glow/bounce
          overScrollMode: OverScrollMode.NEVER,

          // Disable scrollbars (web handles its own)
          verticalScrollBarEnabled: false,
          horizontalScrollBarEnabled: false,

          // Allow inline media playback (iOS)
          allowsInlineMediaPlayback: true,
          mediaPlaybackRequiresUserGesture: false,

          // Transparent background during load
          transparentBackground: true,

          // Disable zoom
          supportZoom: false,

          // Use wide viewport
          useWideViewPort: true,
          loadWithOverviewMode: true,
        ),
        onWebViewCreated: (controller) {
          _controller = controller;
        },
        onLoadStop: (controller, url) {
          _injectSafeAreaValues();
        },
      ),
    );
  }

  /// Injects Flutter's safe area padding into CSS custom properties.
  /// The web app's CSS uses max(env(...), var(--flutter-*)) to handle both
  /// browser and Flutter safe areas.
  void _injectSafeAreaValues() {
    final padding = MediaQuery.of(context).padding;
    final js = '''
      document.documentElement.style.setProperty('--flutter-top', '${padding.top}px');
      document.documentElement.style.setProperty('--flutter-bottom', '${padding.bottom}px');
      document.documentElement.style.setProperty('--flutter-left', '${padding.left}px');
      document.documentElement.style.setProperty('--flutter-right', '${padding.right}px');
    ''';
    _controller?.evaluateJavascript(source: js);
  }
}
```

---

## CRITICAL RULES — DO NOT VIOLATE

1. **DO NOT** wrap the WebView in a `SafeArea` widget — the web app handles safe areas via CSS
2. **DO NOT** use `android:windowSoftInputMode="adjustResize"` — use `adjustPan` only
3. **DO NOT** allow Flutter to resize the WebView when the keyboard opens (`resizeToAvoidBottomInset: false`)
4. **DO NOT** add any padding, margin, or insets around the WebView — it must fill the entire screen
5. **DO NOT** add any Flutter UI elements (AppBar, BottomNavigationBar, etc.) — the web app provides all UI
6. The WebView MUST fill the entire screen edge-to-edge with no gaps

## HOW THE BRIDGE WORKS

```
┌─────────────────────────────────────┐
│           FLUTTER SHELL             │
│  • Edge-to-edge system UI          │
│  • adjustPan keyboard mode         │
│  • Injects --flutter-* CSS vars    │
│  • No SafeArea, no resize          │
├─────────────────────────────────────┤
│           WEB APP (CSS)             │
│  --inset-top: max(               │
│      env(safe-area-inset-top),     │
│      var(--flutter-top)            │
│  )                                  │
│  • Header uses --inset-top         │
│  • BottomNav uses --inset-bottom   │
│  • Content scrolls internally      │
│  • No 100vh, no position:fixed nav │
└─────────────────────────────────────┘
```

## FILE STRUCTURE

```
lib/
  main.dart          ← Full code above
pubspec.yaml         ← Dependencies above
android/
  app/src/main/
    AndroidManifest.xml  ← adjustPan + shortEdges
    res/values/styles.xml ← shortEdges cutout mode
```

## 8. DEEP LINKING & NAVIGATION BRIDGE

The React app exposes a bi-directional navigation bridge. Flutter must integrate with it.

### React → Flutter (Route Change Notifications)

The web app calls `routeChanged` handler on every navigation:

```dart
// In WebView setup, register the handler:
onWebViewCreated: (controller) {
  controller.addJavaScriptHandler(
    handlerName: 'routeChanged',
    callback: (args) {
      final String path = args.isNotEmpty ? args[0].toString() : '/';
      debugPrint('Web route changed: $path');
      // Use this to sync Flutter UI (e.g. back button visibility)
    },
  );
},
```

### Flutter → React (Push Navigation)

To navigate the web app from Flutter (e.g. deep link, push notification):

```dart
await controller.evaluateJavascript(source: "window.navigateTo('/salon/42');");
```

### Back Button Handling

**CRITICAL:** Do NOT use `controller.goBack()`. Always call `window.appBack()` which manages the internal route stack correctly.

```dart
// In WillPopScope or PopScope back button handler:
onPopInvokedWithResult: (didPop, result) async {
  if (didPop) return;
  // Let the web app handle back navigation via its managed stack
  await controller.evaluateJavascript(
    source: "window.appBack && window.appBack();"
  );
  // appBack will call Flutter's exitApp handler when at root
},
```

Also register the `exitApp` handler to actually close the app:

```dart
onWebViewCreated: (controller) {
  controller.addJavaScriptHandler(
    handlerName: 'exitApp',
    callback: (args) {
      SystemNavigator.pop();
    },
  );
  // ... other handlers
},
```

### Deep Link Support

On app start, if a deep link is received, load it directly:

```dart
final initialUrl = deepLinkPath ?? '/';
InAppWebView(
  initialUrlRequest: URLRequest(
    url: WebUri('https://your-deployed-url.com$initialUrl'),
  ),
  // ...
)
```

---

## TESTING CHECKLIST

- [ ] App launches and loads web app fullscreen
- [ ] Status bar content is visible (not hidden behind notch)
- [ ] Bottom nav is not hidden behind gesture bar
- [ ] Keyboard opens without resizing/shifting the layout
- [ ] Scrolling is smooth (60fps)
- [ ] No white flash on load (transparent background)
- [ ] Pull-to-refresh is disabled (no overscroll bounce)
- [ ] `routeChanged` handler fires on every web navigation
- [ ] `window.navigateTo('/path')` works from Flutter
- [ ] Back button uses `isRootRoute()` correctly
- [ ] Deep links open the correct screen

# Dayfule 🎯

A minimalist, high-productivity mobile application built with **React Native (Expo SDK 58)** and **Expo Router** to plan daily todos and track your entire year's productivity in a single, unified view.

---

## ✨ Features

- **Single-Page Year View**:
  - View all 365 (or 366) days on a single page.
  - Switch seamlessly between **12-Month Calendar Grid** and **Dense 52-Week Matrix**.
  - Live year metrics: Completion rate (%), Current day streak 🔥, Total tasks completed, and Perfect days.
- **Day Loaders**:
  - Every day is represented as a micro circular SVG progress loader.
  - Dynamically fills with vibrant rainbow gradients as tasks are completed.
  - Highlights today with a distinct pulsing badge.
- **Interactive Day Dropdown / Sheet**:
  - Tap any day to open the tasks management sheet.
  - Add tasks with priority tags (`High`, `Normal`, `Low`) and optional notes.
  - Edit or delete planned tasks.
  - Tick / check off tasks with tactile haptic feedback.
- **Freezing at End of Day**:
  - Once a day has concluded (past days), the loader and all its tasks **freeze automatically**.
  - Preserves your genuine productivity history—users can view past days and tasks, but cannot alter or game the historical record.
- **Rainbow Celebrations & Borders**:
  - Plain, clean monochrome aesthetic (Deep Obsidian Dark Mode & Clean White Light Mode).
  - Rainbow accent borders and celebration popup with dynamic confetti particles upon completing 100% of tasks for a day.
- **Year Archives & History**:
  - Move forward to upcoming years or look back at historical years.
  - Archive completed years with one tap to lock the entire year.
  - Instant access to archived past years from the archive drawer.
- **Local-Only SQLite Storage**:
  - Powered by `expo-sqlite` (WAL journal mode).
  - Fast, privacy-first, on-device storage with zero external cloud dependencies.
- **Built for Android & iOS with EAS & Expo Go**:
  - Configured with `eas.json` for APK preview builds and Google Play App Bundles.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ (tested on Node.js v22)
- Expo Go app on your Android device (or an Android emulator)

### 2. Run Locally with Expo Go
```bash
# Start the dev server
npx expo start
```
Scan the QR code displayed in your terminal using the **Expo Go** app on Android.

### 3. Verify Code Quality
```bash
# TypeScript typecheck
npx tsc --noEmit

# Expo dependency & configuration doctor
npx expo-doctor
```

---

## 📦 Building for Android with EAS

The project includes an `eas.json` configured for EAS Build:

### Install EAS CLI (if not installed)
```bash
npm install -g eas-cli
```

### Build a Standalone Android APK (Direct Install on Phone)
```bash
eas build --platform android --profile preview
```

### Build an Android App Bundle (.aab) for Google Play
```bash
eas build --platform android --profile production
```

---

## 🛠️ Tech Stack
- **Framework**: [Expo SDK 58](https://expo.dev) (React Native 0.88, React 19)
- **Routing**: [Expo Router v58](https://docs.expo.dev/router/introduction/)
- **Database**: [expo-sqlite](https://docs.expo.dev/versions/latest/sdk/sqlite/)
- **Graphics & Vectors**: `react-native-svg`, `@expo/vector-icons`, `expo-linear-gradient`
- **Haptics**: `expo-haptics`
- **Build System**: EAS Build (Continuous Native Generation)

# Expo Development Build Setup Guide

This project is configured for Expo Development Builds, which provide a production-like environment for testing your app with all native modules.

## Prerequisites

- Node.js >= 18
- Expo account (free at https://expo.dev)
- For iOS: Xcode (for local builds) or TestFlight access
- For Android: Android Studio (for local builds) or device for APK installation

## Initial Setup

### 1. Login to Expo

```bash
npx eas login
```

This will prompt you to:
- Create an Expo account (if you don't have one)
- Login with your credentials

### 2. Initialize EAS Project

```bash
npx eas init
```

This will:
- Create an EAS project
- Generate a project ID
- Update `app.json` with your project ID

### 3. Build Development Client

Choose one of the following options:

#### Option A: Cloud Build (Recommended for first time)

**iOS:**
```bash
npm run build:dev:ios
```

**Android:**
```bash
npm run build:dev:android
```

This will:
- Build your development client in the cloud
- Provide a download link when complete
- Take 10-20 minutes

#### Option B: Local Build (Faster, requires Xcode/Android Studio)

**iOS (requires Xcode):**
```bash
npm run build:dev:ios:local
```

**Android (requires Android Studio):**
```bash
npm run build:dev:android:local
```

This will:
- Build locally on your machine
- Take 5-10 minutes
- Require Xcode/Android Studio setup

#### Option C: Use Expo Run (Fastest for development)

**iOS:**
```bash
npm run run:ios
```

**Android:**
```bash
npm run run:android
```

This will:
- Build and install directly to simulator/device
- Start Metro bundler automatically
- Fastest iteration cycle

### 4. Install Development Build

After the build completes:

**iOS:**
- Download from the build link
- Install via TestFlight (if using cloud build)
- Or install directly on simulator (if using local build)

**Android:**
- Download APK from the build link
- Install on your device: `adb install <path-to-apk>`
- Or install directly via `expo run:android`

### 5. Start Development Server

Once the development build is installed:

```bash
npm run start:dev
```

Or:
```bash
npx expo start --dev-client
```

This will:
- Start Metro bundler
- Show QR code to connect your development build
- Enable hot reloading and debugging

## Development Workflow

1. **Make code changes** in your source files
2. **Save files** - changes will hot reload automatically
3. **Test on device/simulator** with the development build installed
4. **Debug** using React Native Debugger or Chrome DevTools

## Building for Production

When ready for production:

```bash
# iOS
eas build --profile production --platform ios

# Android
eas build --profile production --platform android
```

## Troubleshooting

### Build Fails

- Check `eas.json` configuration
- Verify all dependencies are compatible
- Check Expo status page for service issues

### Development Build Won't Connect

- Ensure you're using `--dev-client` flag: `expo start --dev-client`
- Check that the development build is installed
- Verify network connectivity
- Try restarting Metro bundler

### Native Module Issues

- Development builds support all native modules
- If a module isn't working, check Expo compatibility
- May need to rebuild development client after adding new native modules

## Benefits of Development Build

✅ Supports all native modules (not just Expo Go compatible ones)  
✅ Production-like environment  
✅ Better performance than Expo Go  
✅ Can test native features fully  
✅ Supports custom native code  
✅ Closer to final app experience  

## Next Steps

1. Run `npx eas login` to authenticate
2. Run `npx eas init` to create project
3. Build development client for your platform
4. Install on device/simulator
5. Start development server with `npm run start:dev`

For more information, see: https://docs.expo.dev/development/introduction/


# Setup Guide - Medical Bill Scanner

## Quick Start

### 1. Prerequisites

Ensure you have installed:
- Node.js >= 18
- React Native CLI
- Xcode (for iOS) or Android Studio (for Android)
- CocoaPods (for iOS)

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# iOS only: Install CocoaPods dependencies
cd ios && pod install && cd ..
```

### 3. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env and add your OpenAI API key
# OPENAI_API_KEY=sk-your-key-here
```

### 4. Native Dependencies Setup

#### React Native Vision Camera

This app uses `react-native-vision-camera` which requires native setup:

**iOS:**
1. Open `ios/YourApp.xcworkspace` in Xcode
2. Add camera permissions to `Info.plist`:
   ```xml
   <key>NSCameraUsageDescription</key>
   <string>We need access to your camera to scan medical bills</string>
   ```

**Android:**
1. Add to `android/app/src/main/AndroidManifest.xml`:
   ```xml
   <uses-permission android:name="android.permission.CAMERA" />
   ```

2. In `android/app/src/main/AndroidManifest.xml`, inside `<application>`:
   ```xml
   <meta-data
     android:name="com.google.android.camerav2.CameraCharacteristics"
     android:value="true" />
   ```

### 5. Run the App

```bash
# iOS
npm run ios

# Android
npm run android
```

## Backend API Setup (Optional for MVP)

The app can work directly with OpenAI API, but a backend is recommended for production.

### Setup Backend

```bash
cd api
npm install

# Configure environment
cp ../.env.example .env
# Edit .env with your configuration

# Start server
npm run dev
```

### Update API URL

In your `.env` file, set:
```
API_BASE_URL=http://localhost:3000
```

Or update the base URL in `src/services/medicare.service.ts` if using a remote server.

## Important Notes

### Image Handling

The app currently uses `fetch` and `FileReader` for image conversion. For better performance with local files, consider installing `react-native-fs`:

```bash
npm install react-native-fs
# Follow react-native-fs setup instructions for native linking
```

Then update `src/utils/imageProcessing.ts` to use react-native-fs for local files.

### GPT-4V Model

The code uses `gpt-4-vision-preview`. Check [OpenAI's documentation](https://platform.openai.com/docs/models) for the current vision model name. You may need to update:
- `src/services/gpt4v.service.ts` - model name in API call
- `api/services/gpt4vService.js` (when implemented) - model name

### Medicare Rates

Currently using mock data. For production:

1. Download CMS Medicare Physician Fee Schedule data
2. Import into database (PostgreSQL recommended)
3. Update `getMedicareRate()` in `src/services/medicare.service.ts` to query database
4. Set up backend API endpoint (see `api/server.js`)

### Troubleshooting

**Camera not working:**
- Check permissions are granted
- Verify Info.plist (iOS) / AndroidManifest.xml (Android) have camera permissions
- For iOS, ensure you opened `.xcworkspace`, not `.xcodeproj`

**Image conversion errors:**
- For local files, consider using react-native-fs
- Ensure image URI is accessible
- Check network connectivity if using remote images

**OpenAI API errors:**
- Verify API key is correct in `.env`
- Check API key has credits/billing set up
- Verify model name is correct (may have changed)

**TypeScript errors:**
- Run `npm run type-check` to see all TypeScript errors
- Ensure all dependencies are installed
- Check `tsconfig.json` paths are correct

## Next Steps

1. Test camera functionality
2. Test GPT-4V integration with a sample bill
3. Verify Medicare rate lookups work
4. Test full flow: scan → analyze → results
5. Implement backend database for Medicare rates
6. Add error handling and edge cases
7. Test on physical devices (iOS and Android)

## Support

For issues, check:
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [React Native Vision Camera Docs](https://react-native-vision-camera.com/)
- [OpenAI API Documentation](https://platform.openai.com/docs)


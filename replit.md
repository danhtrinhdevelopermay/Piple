# Piple - Social Media App

## Overview
Piple is a modern social media application built with React Native and Expo SDK 54. It features a vibrant yellow-green color scheme (#C6FF00) and provides Instagram-like functionality for sharing photos, connecting with friends, and exploring content.

## Project Architecture
This is a React Native mobile application targeting Android platform, using Expo for development and build management.

### Technology Stack
- **Framework**: React Native with Expo SDK 54
- **Navigation**: React Navigation v7 (Stack & Bottom Tabs)
- **State Management**: React Context API
- **UI Components**: Custom components with Expo Vector Icons
- **Image Handling**: expo-image-picker
- **Build System**: EAS Build for APK generation

### Project Structure
```
src/
├── screens/          # Main application screens
│   ├── WelcomeScreen.js
│   ├── LoginScreen.js
│   ├── HomeScreen.js
│   ├── ProfileScreen.js
│   ├── CreatePostScreen.js
│   ├── BrowseScreen.js
│   └── ActivityScreen.js
├── components/       # Reusable UI components
│   ├── StoryItem.js
│   └── PostItem.js
├── navigation/       # Navigation configuration
│   ├── AppNavigator.js
│   └── MainTabs.js
├── context/          # State management
│   └── AppContext.js
├── data/            # Mock data
│   └── mockData.js
└── constants/       # Theme and styling
    └── theme.js
```

## Features
### Implemented
- ✅ Welcome/onboarding screen with Piple branding
- ✅ Login screen
- ✅ Home feed with stories carousel
- ✅ Post feed with like, comment, share, save interactions
- ✅ User profile screen with stats and photo grid
- ✅ Bottom tab navigation with 5 tabs
- ✅ Create post with image picker
- ✅ Follow/unfollow functionality
- ✅ Browse screen with categories
- ✅ Activity/notifications screen
- ✅ State management with Context API

### Future Enhancements
- Real-time messaging
- Video support for posts and reels
- Story creation with 24-hour expiration
- Search and discovery
- Comment system with replies
- Backend API integration
- Push notifications

## Recent Changes
- **November 2, 2025**: Initial project setup with all core features
  - Created complete application structure
  - Implemented all main screens and navigation
  - Added state management with Context API
  - Configured for Android APK build with EAS

## Development

### Running the App
```bash
npm start
```

This will start the Expo development server. You can:
- Press `a` to open in Android emulator
- Scan QR code with Expo Go app on Android device

### Building APK
To build an APK for distribution:

1. Install EAS CLI globally (if not already):
```bash
npm install -g eas-cli
```

2. Login to Expo:
```bash
eas login
```

3. Configure the project:
```bash
eas build:configure
```

4. Build APK:
```bash
eas build -p android --profile preview
```

The APK will be available for download from your Expo dashboard.

### For Production Build
```bash
eas build -p android --profile production
```

## Design System

### Color Palette
- **Primary**: #C6FF00 (Yellow-green)
- **Black**: #000000
- **White**: #FFFFFF
- **Pink**: #FF006B
- **Cyan**: #00D9FF
- **Purple**: #7B61FF

### Key UI Elements
- Stories with circular avatars and LIVE indicators
- Photo grid layout (3 columns)
- Prominent yellow floating action button
- Bottom tab navigation with custom center button
- Card-based post design

## User Preferences
- Modern, vibrant design aesthetic
- Instagram-inspired UX patterns
- Clean typography and spacing
- Focus on visual content sharing

## Notes
- The app uses mock data for demonstration purposes
- All images are sourced from Unsplash and Pravatar
- Image picker requires appropriate permissions on Android
- Navigation uses React Navigation native stack and bottom tabs

# Piple Social Media App

A modern social media application built with React Native and Expo SDK 54, featuring a vibrant yellow-green design and Instagram-like functionality.

## Features

- 📱 Welcome screen with creative branding
- 🔐 User authentication (Login)
- 🏠 Home feed with stories and posts
- 👤 User profiles with stats and photo grid
- ✏️ Create posts with image selection
- ❤️ Like, comment, save, and share posts
- 👥 Follow/unfollow users
- 🔍 Browse categories and trending content
- 🔔 Activity notifications
- 🎨 Vibrant yellow-green (#C6FF00) color scheme

## Getting Started

### Prerequisites

- Node.js (v20 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android emulator) or physical Android device with Expo Go app

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on Android:
- Press `a` in the terminal to open Android emulator
- Or scan QR code with Expo Go app on your Android device

## Building APK

### Using EAS Build (Recommended)

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Login to Expo:
```bash
eas login
```

3. Build APK for preview:
```bash
eas build -p android --profile preview
```

4. Build APK for production:
```bash
eas build -p android --profile production
```

The APK will be available in your Expo dashboard for download.

## Project Structure

```
piple-app/
├── src/
│   ├── screens/        # Application screens
│   ├── components/     # Reusable components
│   ├── navigation/     # Navigation setup
│   ├── context/        # State management
│   ├── data/          # Mock data
│   └── constants/     # Theme and constants
├── assets/            # Images and static files
├── App.js            # Root component
├── app.json          # Expo configuration
└── eas.json          # EAS Build configuration
```

## Technologies Used

- **React Native** - Mobile app framework
- **Expo SDK 54** - Development platform
- **React Navigation** - Navigation library
- **Expo Vector Icons** - Icon library
- **Expo Image Picker** - Image selection
- **Context API** - State management

## Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS (macOS only)
- `npm run web` - Run on web

## Color Scheme

- Primary: #C6FF00 (Yellow-green)
- Black: #000000
- White: #FFFFFF
- Pink: #FF006B
- Cyan: #00D9FF
- Purple: #7B61FF

## License

This project is for demonstration purposes.

## Support

For issues or questions, please check the Expo documentation at https://docs.expo.dev/

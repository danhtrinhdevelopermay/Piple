# Piple - Social Media App

## Overview
Piple is a modern social media application built with React Native and Expo SDK 54. It features a vibrant yellow-green color scheme (#C6FF00) and provides Instagram-like functionality for sharing photos, connecting with friends, and exploring content.

## Project Architecture
This is a full-stack social media application with a React Native mobile frontend and Express backend API, using PostgreSQL for data persistence.

### Technology Stack
- **Frontend**: React Native with Expo SDK 54
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL (Neon-backed)
- **ORM**: Drizzle ORM
- **Navigation**: React Navigation v7 (Stack & Bottom Tabs)
- **State Management**: React Context API with API integration
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
├── context/          # State management with API integration
│   └── AppContext.js
├── services/         # API service layer
│   └── api.ts
├── data/             # Legacy mock data (deprecated)
│   └── mockData.js
└── constants/        # Theme and styling
    └── theme.js

server/
├── index.ts          # Express API server
├── storage.ts        # Database access layer
└── seed.ts          # Database seeding script

shared/
└── schema.ts        # Drizzle database schema
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

### Implemented
- ✅ PostgreSQL database with Drizzle ORM
- ✅ REST API backend with Express
- ✅ Database-driven posts, users, and stories
- ✅ Real-time data synchronization
- ✅ CRUD operations for posts
- ✅ Like, save, and follow functionality

### Future Enhancements
- Real-time messaging
- Video support for posts and reels
- Story creation with 24-hour expiration
- Search and discovery
- Comment system with replies
- User authentication and authorization
- Push notifications
- Image upload to cloud storage

## Recent Changes
- **November 2, 2025**: Migrated to full-stack architecture with database
  - Implemented PostgreSQL database with Drizzle ORM
  - Created Express backend API with TypeScript
  - Added database schema for users, posts, stories, comments, follows
  - Integrated frontend with backend API
  - Set up database seeding with sample data
  - Removed dependency on mock data
  - Created API service layer for data fetching

## Development

### Running the App
The project uses two workflows that run automatically:
1. **Backend**: Express API server on port 3000
2. **Expo**: React Native app with Metro bundler

To manually start:
```bash
# Start backend server
npm run server

# Start Expo dev server
npm start
```

### Database Management
```bash
# Push schema changes to database
npm run db:push

# Force push (use when data loss is acceptable)
npm run db:push --force

# Seed database with sample data
npm run db:seed

# Open Drizzle Studio (database GUI)
npm run db:studio
```

### API Endpoints
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `GET /api/posts` - Get all posts with user data
- `POST /api/posts` - Create new post
- `POST /api/posts/:id/like` - Toggle post like
- `POST /api/posts/:id/save` - Toggle post save
- `GET /api/stories` - Get all stories
- `POST /api/users/:id/follow` - Toggle user follow

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
- The app uses PostgreSQL database for data persistence
- All images are sourced from Unsplash and Pravatar
- Image picker requires appropriate permissions on Android
- Navigation uses React Navigation native stack and bottom tabs
- Backend API runs on port 3000
- Database credentials are managed via environment variables

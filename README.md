# PixelNest

A React Native Expo image gallery application built as a technical assignment. PixelNest demonstrates local authentication, image browsing with search/filter/sort, favorites persistence, and media library integration.

## Features

- **Local Authentication** — Register and login with email/password; credentials stored in AsyncStorage
- **Persistent Session** — Session survives app restarts
- **Picsum Image Gallery** — Browse images from Picsum Photos API
- **Search by Author** — Real-time debounced search (300ms)
- **Filter** — A-M / N-Z / All by author name
- **Sort** — Author A-Z, Author Z-A, ID Ascending, ID Descending, Default
- **Infinite Scrolling** — Pagination with automatic load-more
- **Pull-to-Refresh** — Refresh gallery from server
- **Persistent Favorites** — Add/remove favorites saved to AsyncStorage
- **Image Details** — Full image, author, ID, dimensions
- **Full-Screen View** — Tap image for full-screen modal
- **Download to Gallery** — Save images using expo-media-library (requires permission)
- **Share Image** — Native share sheet via React Native Share
- **Profile Screen** — View personal information and avatar
- **Edit Profile** — Update name, mobile, gender, address, city, avatar
- **Theme Toggle** — Light/Dark mode persisted across sessions
- **Logout** — Clears session only; preserves registered user and favorites

## Tech Stack

- React Native
- Expo (SDK 57)
- TypeScript (strict mode)
- React Navigation v7 (Native Stack + Bottom Tabs)
- Zustand (state management)
- AsyncStorage (persistence)
- Picsum Photos API
- expo-file-system
- expo-media-library (legacy export for Expo Go compatibility)
- @expo/vector-icons (Ionicons)

## Project Structure

```
src/
├── api/
│   └── picsumApi.ts          # Picsum API client
├── components/
│   ├── AppButton.tsx         # Reusable themed button
│   ├── AppInput.tsx          # Reusable themed input
│   ├── EmptyState.tsx        # Empty state UI
│   ├── ErrorState.tsx        # Error state with retry
│   ├── FilterBar.tsx         # Filter/sort chips
│   ├── ImageCard.tsx         # Gallery image card
│   ├── LoadingIndicator.tsx  # Loading spinner
│   └── SearchBar.tsx         # Search input
├── hooks/
│   ├── useAuth.ts            # Auth store hook
│   ├── useDebounce.ts        # Debounce hook (300ms)
│   ├── useFetchImages.ts     # Gallery fetch logic
│   └── useTheme.ts           # Theme store hook
├── navigation/
│   ├── AppNavigator.tsx      # Root navigator (conditional Auth/Main)
│   ├── AuthNavigator.tsx     # Login/Register stack
│   ├── MainStackNavigator.tsx # Main tabs + ImageDetail + EditProfile
│   └── MainTabNavigator.tsx  # Home/Favorites/Profile tabs
├── screens/
│   ├── auth/
│   │   ├── LoginScreen.tsx
│   │   └── RegisterScreen.tsx
│   └── main/
│       ├── EditProfileScreen.tsx
│       ├── FavoritesScreen.tsx
│       ├── HomeScreen.tsx
│       ├── ImageDetailScreen.tsx
│       └── ProfileScreen.tsx
├── store/
│   ├── useAuthStore.ts       # Auth state + session
│   ├── useGalleryStore.ts    # Gallery state + favorites
│   └── useThemeStore.ts      # Theme + avatar state
├── types/
│   ├── auth.ts               # User, form types, cities
│   ├── avatar.ts             # Avatar definitions
│   ├── gallery.ts            # ImageData, filters, sorts
│   ├── navigation.ts         # Navigation param lists
│   └── theme.ts              # Theme types, colors, storage keys
└── utils/
    ├── storage.ts            # AsyncStorage helpers
    ├── themeStorage.ts       # Theme/avatar persistence
    └── validation.ts         # Form validation
```

## Installation

```bash
git clone https://github.com/harish-2807/pixelnest.git
cd pixelnest
npm install
npx expo start
```

**Development Testing:** Use the Expo Go app on a physical device or emulator to scan the QR code from `npx expo start`.

## How to Use

1. **Register** — Enter full name, email, gender, mobile (10 digits), address, city, password (≥6 chars), confirm password
2. **Login** — Use the email and password you just registered
3. **Browse** — Home screen loads Picsum images
4. **Search/Filter/Sort** — Use the search bar and chip controls
5. **Favorite** — Tap the heart icon on any card
6. **View Details** — Tap an image to open full details
7. **Download/Share** — In Image Details, use Download (saves to device gallery) or Share (native share sheet)
8. **Edit Profile** — From Profile screen, tap "Edit Profile" to update info or change avatar
9. **Theme** — From Profile, tap "Switch to Dark/Light Mode"
10. **Logout** — From Profile, tap "Logout" (clears session only)

> **Note:** This assignment uses local AsyncStorage authentication. There are no predefined credentials. A reviewer can register their own account on first launch.

## Permissions

- **Media Library / Gallery** — Required for "Download Image" functionality. The app requests permission at download time via `expo-media-library/legacy` for Expo Go compatibility.

## API

Images sourced from: `https://picsum.photos/v2/list`

## Storage

All user data, session, favorites, theme preference, and avatar selection are stored locally using AsyncStorage:

- `@fotoowl_registered_user` — Registered user credentials
- `@fotoowl_session` — Active session user ID
- `@fotoowl_favorites` — Favorite image IDs
- `@fotoowl_theme` — Light/dark theme mode
- `@fotoowl_avatar` — Selected avatar ID

## Running Checks

```bash
# TypeScript strict check
npx tsc --noEmit

# Also check for unused locals
npx tsc --noEmit --noUnusedLocals

# Expo dependency validation
npx expo-doctor
```

All checks pass with 0 errors.
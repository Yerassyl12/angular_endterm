# OpenSky Flight Tracker - Project Documentation

An Angular application that tracks real-time flight data from around the world using the OpenSky Network API.

## Features

- **Real-time Flight Tracking**: View live flight data from the OpenSky Network API
- **Multi-language Support**: Available in English (EN), Russian (RU), and Kazakh (KZ)
- **Firebase Authentication**: Secure user authentication with email/password
- **Favorites System**: Save favorite flights (localStorage for guests, Firestore for authenticated users)
- **Profile Management**: Upload and manage profile pictures with image compression
- **Advanced Search & Filtering**: Search by callsign, country with pagination
- **Responsive Design**: Mobile-friendly interface
- **Protected Routes**: Auth guard for profile page

## Project Structure

```
src/app/
├── components/
│   ├── home/                    # Landing page
│   ├── login/                   # Login page
│   ├── signup/                  # Registration page
│   ├── product-list/            # Flight list with search & filters
│   ├── product-details/         # Detailed flight information
│   ├── favorites/               # Saved favorite flights
│   └── profile/                 # User profile with picture upload
├── items/
│   └── states/
│       └── auth.state.ts        # Authentication state management
├── guards/
│   └── auth.guard.ts            # Route protection guard
├── services/
│   ├── opensky.service.ts       # OpenSky API integration
│   ├── translation.service.ts   # i18n service
│   ├── favorites.service.ts     # Favorites management
│   ├── translate.pipe.ts        # Translation pipe
│   └── state-vector.interface.ts # TypeScript interfaces
├── app.component.ts             # Root component
├── app.routes.ts                # Application routes
└── app.config.ts                # App configuration
```

## Requirements Met

### Core Requirements
✅ Multi-language support (KZ, EN, RU)
✅ OpenSky API integration with state vectors
✅ ProductListComponent displaying flights (icao24, callsign, origin_country, geo_altitude, velocity)
✅ ProductDetailsComponent showing all 17 fields
✅ Routing: /products → list, /products/:icao24 → details
✅ Proper project structure with components, guards, and states folders

### Additional Requirements
✅ Firebase Authentication with email/password validation
✅ 7+ pages: Home, Login, Signup, Products List, Product Details, Favorites, Profile
✅ External API (OpenSky Network)
✅ Search with RxJS (debounceTime, distinctUntilChanged, switchMap)
✅ Filtering by country with query parameters
✅ Pagination with items per page selection
✅ TypeScript interfaces for all data
✅ Protected route (Profile) with auth guard
✅ Observable auth state
✅ Favorites (localStorage for guests, Firestore for authenticated users)
✅ Profile picture upload with compression and Firebase Storage

## Setup Instructions

### 1. Install Dependencies

```bash
cd opensky-app
npm install
```

### 2. Configure Firebase

1. Create a Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)
2. Enable the following services:
   - Authentication (Email/Password provider)
   - Firestore Database
   - Storage

3. Update `src/environments/environment.ts` with your Firebase configuration:

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
  }
};
```

### 3. Run Development Server

```bash
ng serve
```

Navigate to `http://localhost:4200/`

### 4. Build for Production

```bash
ng build --configuration production
```

## API Information

### OpenSky Network API

- **Endpoint**: `https://opensky-network.org/api/states/all`
- **Documentation**: [https://opensky-network.org/apidoc/](https://opensky-network.org/apidoc/)
- **Rate Limits**: Anonymous users are limited to 400 API credits per day
- **No API Key Required**: Public endpoint

### State Vector Fields (17 fields)

| Index | Field | Type | Description |
|-------|-------|------|-------------|
| 0 | icao24 | string | Unique ICAO 24-bit address |
| 1 | callsign | string | Callsign of the vehicle |
| 2 | origin_country | string | Country name |
| 3 | time_position | number | Unix timestamp for last position update |
| 4 | last_contact | number | Unix timestamp for last update |
| 5 | longitude | number | WGS-84 longitude in degrees |
| 6 | latitude | number | WGS-84 latitude in degrees |
| 7 | baro_altitude | number | Barometric altitude in meters |
| 8 | on_ground | boolean | On ground indicator |
| 9 | velocity | number | Velocity over ground in m/s |
| 10 | true_track | number | True track in degrees |
| 11 | vertical_rate | number | Vertical rate in m/s |
| 12 | sensors | array | IDs of contributing receivers |
| 13 | geo_altitude | number | Geometric altitude in meters |
| 14 | squawk | string | Transponder code |
| 15 | spi | boolean | Special purpose indicator |
| 16 | position_source | number | Origin of position (0=ADS-B, 1=ASTERIX, 2=MLAT) |

## Application Routes

| Path | Component | Protected | Description |
|------|-----------|-----------|-------------|
| / | HomeComponent | No | Landing page |
| /home | HomeComponent | No | Landing page |
| /login | LoginComponent | No | User login |
| /signup | SignupComponent | No | User registration |
| /products | ProductListComponent | No | Flight list |
| /products/:icao24 | ProductDetailsComponent | No | Flight details |
| /favorites | FavoritesComponent | No | Favorite flights |
| /profile | ProfileComponent | Yes | User profile |

## Key Features Implementation

### 1. Multi-language Support (i18n)

**Files**: `services/translation.service.ts`, `services/translate.pipe.ts`

- Language selector in navigation bar
- Supports EN, RU, KZ
- Translations stored in TranslationService
- Language preference saved in localStorage
- Usage: `{{ 'key' | translate }}`

### 2. Authentication System

**Files**: `items/states/auth.state.ts`, `guards/auth.guard.ts`

- Firebase Authentication integration
- Email/password validation
- Password requirements: 8+ chars, 1 number, 1 special character
- Observable auth state
- Protected routes with auth guard
- Auto-redirect to login for protected pages

### 3. OpenSky API Integration

**Files**: `services/opensky.service.ts`, `services/state-vector.interface.ts`

- Fetches real-time flight data
- Transforms raw API response to TypeScript interfaces
- Caching mechanism (10 seconds)
- Error handling with RxJS catchError
- Filter by ICAO24 for details view

### 4. Search & Filtering

**Files**: `components/product-list/product-list.component.ts`

- RxJS operators: debounceTime (300ms), distinctUntilChanged
- Search by callsign, country, ICAO24
- Filter by country dropdown
- Pagination with configurable items per page (5, 10, 20, 50)
- URL query parameters for state management

### 5. Favorites System

**Files**: `services/favorites.service.ts`

- **Guest users**: localStorage
- **Authenticated users**: Firestore
- Auto-sync on login (merge local + server favorites)
- Add/remove favorites with visual feedback
- Observable favorites list

### 6. Profile Picture Upload

**Files**: `components/profile/profile.component.ts`

- File type validation (JPG, PNG)
- File size limit (5MB)
- Client-side image compression
- Upload to Firebase Storage
- URL saved to Firestore
- Display in profile page

## RxJS Usage

The application extensively uses RxJS operators:

1. **debounceTime**: Search input delay (300ms)
2. **distinctUntilChanged**: Prevent duplicate API calls
3. **switchMap**: Cancel previous requests
4. **takeUntil**: Automatic unsubscription
5. **map**: Data transformation
6. **catchError**: Error handling
7. **combineLatest**: Combine multiple observables
8. **shareReplay**: Cache API responses

## Firebase Configuration

### Firestore Structure

```
users/
  {uid}/
    favorites: string[]
    profilePictureUrl: string
```

### Storage Structure

```
profile-pictures/
  {uid}/
    {timestamp}_{filename}
```

### Security Rules (Recommended)

**Firestore**:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

**Storage**:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /profile-pictures/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Technologies Used

- **Angular 21**: Frontend framework (standalone components)
- **Firebase**: Authentication, Firestore, Storage
- **RxJS**: Reactive programming
- **TypeScript**: Type-safe development
- **OpenSky Network API**: Real-time flight data
- **Angular Router**: Navigation and routing
- **Angular Forms**: Reactive forms with validation

## Development Notes

### Component Architecture

All components are **standalone** (no NgModule required):
- Self-contained with imports
- Easier testing and maintenance
- Better tree-shaking

### State Management

- **AuthState**: Centralized authentication state
- **FavoritesService**: Favorites state with persistence
- **TranslationService**: Language state

### Performance Optimizations

- API response caching (10 seconds)
- Image compression before upload
- Lazy loading ready (can be added)
- OnPush change detection ready

## Testing

Run unit tests:
```bash
ng test
```

Run e2e tests:
```bash
ng e2e
```

## Troubleshooting

### Firebase Connection Issues

1. Verify Firebase configuration in `environment.ts`
2. Check Firebase console for enabled services
3. Verify network connectivity

### OpenSky API Rate Limits

- Anonymous users: 400 credits/day
- Consider implementing request throttling
- Cache responses to reduce API calls

### CORS Issues

OpenSky API supports CORS, but if issues occur:
- Use a proxy configuration
- Check browser console for errors

## Future Enhancements

- [ ] PWA support with service worker
- [ ] Offline mode with cached data
- [ ] Real-time flight tracking on map
- [ ] Flight history and statistics
- [ ] Email verification
- [ ] Social authentication (Google, Facebook)
- [ ] Dark mode theme
- [ ] Export favorites to CSV/JSON

## License

This project is for educational purposes.

## Credits

Flight data provided by [OpenSky Network](https://opensky-network.org)

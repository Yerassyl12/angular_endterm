# Firebase Setup Guide

This guide will help you configure Firebase for the OpenSky Flight Tracker application.

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `opensky-flight-tracker` (or your preferred name)
4. Disable Google Analytics (optional)
5. Click "Create project"

## Step 2: Register Web App

1. In your Firebase project, click the **Web** icon (`</>`)
2. Enter app nickname: `OpenSky Web App`
3. Check "Also set up Firebase Hosting" (optional)
4. Click "Register app"
5. Copy the Firebase configuration object

## Step 3: Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click "Get started"
3. Click on **Sign-in method** tab
4. Enable **Email/Password** provider
5. Click "Save"

## Step 4: Create Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click "Create database"
3. Select **Start in test mode** (for development)
4. Choose a location close to your users
5. Click "Enable"

### Set Firestore Security Rules

Go to the **Rules** tab and update with:

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

## Step 5: Enable Storage

1. In Firebase Console, go to **Storage**
2. Click "Get started"
3. Select **Start in test mode** (for development)
4. Click "Next" and "Done"

### Set Storage Security Rules

Go to the **Rules** tab and update with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /profile-pictures/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null 
                   && request.auth.uid == userId
                   && request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
```

## Step 6: Update Environment Configuration

1. Open `src/environments/environment.ts`
2. Replace the Firebase configuration with your values:

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef123456"
  }
};
```

## Step 7: Test the Setup

1. Start the development server:
   ```bash
   ng serve
   ```

2. Open browser at `http://localhost:4200`

3. Test authentication:
   - Go to Sign Up page
   - Create a new account
   - Verify you can log in

4. Test Firestore:
   - Add a flight to favorites
   - Check Firebase Console → Firestore to see the data

5. Test Storage:
   - Go to Profile page
   - Upload a profile picture
   - Check Firebase Console → Storage to see the uploaded file

## Production Configuration

For production, create `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  firebase: {
    apiKey: "YOUR_PRODUCTION_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef123456"
  }
};
```

## Security Best Practices

### Firestore Rules (Production)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null 
                    && request.auth.uid == userId
                    && request.resource.data.keys().hasOnly(['favorites', 'profilePictureUrl']);
      allow delete: if false; // Prevent deletion
    }
  }
}
```

### Storage Rules (Production)

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /profile-pictures/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null 
                   && request.auth.uid == userId
                   && request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/(jpeg|png)');
      allow delete: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Troubleshooting

### Error: "Firebase: Error (auth/configuration-not-found)"

- Verify Firebase configuration in `environment.ts`
- Ensure Authentication is enabled in Firebase Console

### Error: "Missing or insufficient permissions"

- Check Firestore security rules
- Ensure user is authenticated before accessing Firestore

### Storage upload fails

- Check Storage security rules
- Verify file size is under 5MB
- Ensure file type is JPG or PNG

### CORS errors

- Firebase services support CORS by default
- If issues persist, check browser console for specific errors

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Angular Fire Documentation](https://github.com/angular/angularfire)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Storage Security Rules](https://firebase.google.com/docs/storage/security)

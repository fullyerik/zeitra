// Copy this file to environment.ts and environment.prod.ts
// and fill in your own Firebase and Cloudinary credentials.

export const environment = {
  production: false, // set to true in environment.prod.ts
  firebase: {
    apiKey: 'YOUR_FIREBASE_API_KEY',
    authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_PROJECT_ID.firebasestorage.app',
    messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
    appId: 'YOUR_APP_ID',
  },
  cloudinary: {
    cloudName: 'YOUR_CLOUDINARY_CLOUD_NAME',
    avatarPreset: 'YOUR_AVATAR_UPLOAD_PRESET',
    bannerPreset: 'YOUR_BANNER_UPLOAD_PRESET',
  },
};

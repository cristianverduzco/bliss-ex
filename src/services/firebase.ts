// src/services/firebase.ts

import { Platform } from 'react-native';
import {
    initializeApp,
    getApps,
    getApp,
    type FirebaseApp,
} from 'firebase/app';
import {
    getAuth,
    initializeAuth,
    type Auth,
} from 'firebase/auth';
// getReactNativePersistence may not be in some TS typings.
// @ts-ignore
import { getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    getFirestore,
    type Firestore,
} from 'firebase/firestore';

// Config based on google-services.json for this project.
const firebaseConfig = {
    apiKey: 'AIzaSyClTov4nbJ6xq9PCZpPrPRAoDyRJTt1DSU',
    authDomain: 'bliss-cfe67.firebaseapp.com',
    projectId: 'bliss-cfe67',
    storageBucket: 'bliss-cfe67.firebasestorage.app',
    messagingSenderId: '678196479534',
    appId: '1:678196479534:android:2dc6d393a9070a718701bf',
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);

    if (Platform.OS === 'web') {
        // On web, use default browser persistence.
        auth = getAuth(app);
    } else {
        // On native, use AsyncStorage so the user stays logged in.
        auth = initializeAuth(app, {
            persistence: getReactNativePersistence(AsyncStorage),
        });
    }

    db = getFirestore(app);
} else {
    app = getApp();
    auth = getAuth(app);
    db = getFirestore(app);
}

export { app, auth, db };

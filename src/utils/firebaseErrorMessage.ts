// src/utils/firebaseErrorMessage.ts

import type { FirebaseError } from 'firebase/app';

export const getFirebaseAuthErrorMessage = (error: unknown): string => {
    const defaultMessage = 'Something went wrong. Please try again.';

    if (!error) return defaultMessage;

    const err = error as Partial<FirebaseError> & {
        code?: string;
        message?: string;
    };

    switch (err.code) {
        case 'auth/invalid-email':
            return 'That email address looks wrong. Please double-check it.';
        case 'auth/user-disabled':
            return 'This account has been disabled. Contact support if you think this is a mistake.';
        case 'auth/user-not-found':
            return 'No account found with that email and password.';
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
            return 'Incorrect email or password.';
        case 'auth/email-already-in-use':
            return 'There is already an account using that email.';
        case 'auth/weak-password':
            return 'Your password is too weak. Please use at least 6 characters.';
        case 'auth/too-many-requests':
            return 'Too many attempts. Please wait a moment and try again.';
        default:
            return err.message || defaultMessage;
    }
};

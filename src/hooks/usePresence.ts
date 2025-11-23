// src/hooks/usePresence.ts

import { useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';

import { db } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';

const HEARTBEAT_MS = 60_000; // update presence roughly once a minute

export const usePresence = (): void => {
    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            return;
        }

        const userRef = doc(db, 'users', user.uid);

        const setOnline = async () => {
            try {
                await updateDoc(userRef, {
                    isOnline: true,
                    lastSeenAt: serverTimestamp(),
                });
            } catch {
                // ignore presence errors – never block UI
            }
        };

        const setOffline = async () => {
            try {
                await updateDoc(userRef, {
                    isOnline: false,
                    lastSeenAt: serverTimestamp(),
                });
            } catch {
                // ignore presence errors
            }
        };

        void setOnline();

        const intervalId: ReturnType<typeof setInterval> = setInterval(() => {
            void setOnline();
        }, HEARTBEAT_MS);

        const handleAppStateChange = (nextState: AppStateStatus) => {
            if (nextState === 'active') {
                void setOnline();
            } else if (nextState === 'background' || nextState === 'inactive') {
                void setOffline();
            }
        };

        const subscription = AppState.addEventListener(
            'change',
            handleAppStateChange,
        );

        return () => {
            clearInterval(intervalId);
            subscription.remove();
            void setOffline();
        };
    }, [user]);
};

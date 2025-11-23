// src/contexts/AuthContext.tsx

import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged, reload } from 'firebase/auth';

import { auth } from '../services/firebase';

type AuthContextValue = {
    user: User | null;
    initializing: boolean;
    refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
                                                                          children,
                                                                      }) => {
    const [user, setUser] = useState<User | null>(null);
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            setInitializing(false);
        });

        return unsubscribe;
    }, []);

    const refreshUser = useCallback(async () => {
        const current = auth.currentUser;
        if (current) {
            await reload(current);
            // Push updated user into React state.
            setUser({ ...current });
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, initializing, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextValue => {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return ctx;
};

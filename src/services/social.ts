// src/services/social.ts

import {
    collection,
    doc,
    DocumentData,
    getDoc,
    getDocs,
    increment,
    onSnapshot,
    query,
    serverTimestamp,
    Timestamp,
    where,
    writeBatch,
    type DocumentSnapshot,
} from 'firebase/firestore';

import { db } from './firebase';
import { UserProfile } from '../types/userProfile';
import { fallbackUsernameFromEmail } from '../utils/user';

interface FirestoreUserRecord {
    uid?: string;
    email?: string;
    username?: string;
    displayName?: string;
    avatarUrl?: string | null;
    bio?: string | null;
    gender?: string | null;
    starSign?: string | null;
    age?: number | null;
    location?: string | null;
    hobbies?: string[] | string | null;
    followersCount?: number;
    followingCount?: number;
    isOnline?: boolean;
    lastSeenAt?: Timestamp | null;
}

/**
 * Map a Firestore user document into our UserProfile model.
 */
export const mapUserDocToProfile = (
    docSnap: DocumentSnapshot<DocumentData>,
): UserProfile => {
    const raw = docSnap.data() as FirestoreUserRecord | undefined;

    const email = raw?.email ?? null;
    const baseName =
        raw?.username ??
        raw?.displayName ??
        (email ? fallbackUsernameFromEmail(email) : null) ??
        'New user';

    const hobbiesArray: string[] | null =
        raw?.hobbies == null
            ? null
            : Array.isArray(raw.hobbies)
                ? raw.hobbies
                : typeof raw.hobbies === 'string'
                    ? raw.hobbies
                        .split(',')
                        .map((h) => h.trim())
                        .filter(Boolean)
                    : null;

    const lastSeenAt =
        raw?.lastSeenAt instanceof Timestamp
            ? raw.lastSeenAt.toDate()
            : null;

    return {
        uid: raw?.uid ?? docSnap.id,
        email,
        username: raw?.username ?? baseName,
        displayName: raw?.displayName ?? baseName,
        avatarUrl: raw?.avatarUrl ?? null,
        bio: raw?.bio ?? null,
        gender: raw?.gender ?? null,
        starSign: raw?.starSign ?? null,
        age:
            typeof raw?.age === 'number' && !Number.isNaN(raw.age)
                ? raw.age
                : null,
        location: raw?.location ?? null,
        hobbies: hobbiesArray,
        followersCount: raw?.followersCount ?? 0,
        followingCount: raw?.followingCount ?? 0,
        isOnline: raw?.isOnline ?? false,
        lastSeenAt,
    };
};

const usersCollection = collection(db, 'users');

/**
 * Fetch a single user profile by uid.
 */
export const fetchUserProfile = async (
    uid: string,
): Promise<UserProfile | null> => {
    const ref = doc(usersCollection, uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
        return null;
    }
    return mapUserDocToProfile(snap);
};

/**
 * Fetch many user profiles by uid using batched `where in` queries.
 */
export const fetchUserProfilesByUids = async (
    uids: string[],
): Promise<UserProfile[]> => {
    if (uids.length === 0) return [];

    const chunks: string[][] = [];
    for (let i = 0; i < uids.length; i += 10) {
        chunks.push(uids.slice(i, i + 10));
    }

    const results: UserProfile[] = [];

    for (const chunk of chunks) {
        const q = query(usersCollection, where('uid', 'in', chunk));
        const snapshot = await getDocs(q);
        snapshot.forEach((docSnap) => {
            results.push(mapUserDocToProfile(docSnap));
        });
    }

    return results;
};

/**
 * Subscribe to the set of userIds that `currentUid` is following.
 */
export const subscribeToFollowing = (
    currentUid: string,
    callback: (ids: Set<string>) => void,
): (() => void) => {
    const followingRef = collection(db, 'users', currentUid, 'following');

    return onSnapshot(followingRef, (snapshot) => {
        const ids = new Set<string>();
        snapshot.forEach((docSnap) => {
            ids.add(docSnap.id);
        });
        callback(ids);
    });
};

/**
 * Start following `targetUid` from `currentUid`.
 * Creates follower/following subcollection docs and bumps counters.
 */
export const followUser = async (
    currentUid: string,
    targetUid: string,
): Promise<void> => {
    if (!currentUid || !targetUid || currentUid === targetUid) {
        return;
    }

    const batch = writeBatch(db);

    const followingRef = doc(
        db,
        'users',
        currentUid,
        'following',
        targetUid,
    );
    const followersRef = doc(
        db,
        'users',
        targetUid,
        'followers',
        currentUid,
    );

    const currentUserRef = doc(db, 'users', currentUid);
    const targetUserRef = doc(db, 'users', targetUid);

    batch.set(
        followingRef,
        {
            uid: targetUid,
            createdAt: serverTimestamp(),
        },
        { merge: true },
    );
    batch.set(
        followersRef,
        {
            uid: currentUid,
            createdAt: serverTimestamp(),
        },
        { merge: true },
    );

    batch.set(
        currentUserRef,
        { followingCount: increment(1) },
        { merge: true },
    );
    batch.set(
        targetUserRef,
        { followersCount: increment(1) },
        { merge: true },
    );

    await batch.commit();
};

/**
 * Stop following `targetUid` from `currentUid`.
 */
export const unfollowUser = async (
    currentUid: string,
    targetUid: string,
): Promise<void> => {
    if (!currentUid || !targetUid || currentUid === targetUid) {
        return;
    }

    const batch = writeBatch(db);

    const followingRef = doc(
        db,
        'users',
        currentUid,
        'following',
        targetUid,
    );
    const followersRef = doc(
        db,
        'users',
        targetUid,
        'followers',
        currentUid,
    );

    const currentUserRef = doc(db, 'users', currentUid);
    const targetUserRef = doc(db, 'users', targetUid);

    batch.delete(followingRef);
    batch.delete(followersRef);

    batch.set(
        currentUserRef,
        { followingCount: increment(-1) },
        { merge: true },
    );
    batch.set(
        targetUserRef,
        { followersCount: increment(-1) },
        { merge: true },
    );

    await batch.commit();
};

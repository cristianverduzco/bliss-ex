// src/types/userProfile.ts

export interface UserProfile {
    uid: string;
    email?: string | null;
    username?: string | null;
    displayName?: string | null;
    avatarUrl?: string | null;

    bio?: string | null;
    gender?: string | null;
    starSign?: string | null;
    age?: number | null;
    location?: string | null;
    hobbies?: string[] | null;

    followersCount: number;
    followingCount: number;

    isOnline?: boolean | null;
    lastSeenAt?: Date | null;
}

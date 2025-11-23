// src/screens/profile/UserProfileScreen.tsx

import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import {
    RouteProp,
    useNavigation,
    useRoute,
} from '@react-navigation/native';
import { doc, onSnapshot } from 'firebase/firestore';

import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import { db } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';
import {
    followUser,
    mapUserDocToProfile,
    subscribeToFollowing,
    unfollowUser,
} from '../../services/social';
import { UserProfile } from '../../types/userProfile';
import Card from '../../components/common/Card';

type Params = {
    userId: string;
};

type GenericRoute = RouteProp<Record<string, Params>, string>;

const ONLINE_WINDOW_MS = 5 * 60 * 1000;

const formatLastSeenLabel = (
    online: boolean | null | undefined,
    lastSeenAt: Date | null | undefined,
): string => {
    const now = Date.now();

    if (lastSeenAt) {
        const diff = now - lastSeenAt.getTime();
        const recentOnline = diff <= ONLINE_WINDOW_MS;

        if (online || recentOnline) {
            return 'Online now';
        }

        const minutes = Math.floor(diff / 60000);
        if (minutes < 60) return `Last seen ${minutes}m ago`;

        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `Last seen ${hours}h ago`;

        const days = Math.floor(hours / 24);
        return `Last seen ${days}d ago`;
    }

    if (online) return 'Online now';

    return 'Recently joined';
};

const UserProfileScreen: React.FC = () => {
    const { user } = useAuth();
    const route = useRoute<GenericRoute>();
    const navigation = useNavigation<any>();

    const viewedUserId = route.params?.userId;

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [followingIds, setFollowingIds] = useState<Set<string>>(
        () => new Set(),
    );
    const [pendingFollow, setPendingFollow] = useState(false);

    const viewingOwnProfile = !!user && user.uid === viewedUserId;

    useEffect(() => {
        if (!viewedUserId) {
            setLoading(false);
            return;
        }

        const ref = doc(db, 'users', viewedUserId);
        const unsubscribe = onSnapshot(
            ref,
            (snap) => {
                if (!snap.exists()) {
                    setProfile(null);
                } else {
                    setProfile(mapUserDocToProfile(snap));
                }
                setLoading(false);
            },
            () => {
                setLoading(false);
            },
        );

        return unsubscribe;
    }, [viewedUserId]);

    useEffect(() => {
        if (!user) return;
        const unsubscribe = subscribeToFollowing(user.uid, (ids) =>
            setFollowingIds(new Set(ids)),
        );
        return unsubscribe;
    }, [user]);

    useEffect(() => {
        if (profile) {
            navigation.setOptions({
                title: profile.displayName ?? profile.username ?? 'Profile',
            });
        }
    }, [navigation, profile]);

    const handleToggleFollow = async () => {
        if (!user || !profile || viewingOwnProfile) return;

        setPendingFollow(true);
        try {
            const currentlyFollowing = followingIds.has(profile.uid);
            if (currentlyFollowing) {
                await unfollowUser(user.uid, profile.uid);
            } else {
                await followUser(user.uid, profile.uid);
            }
        } finally {
            setPendingFollow(false);
        }
    };

    if (!viewedUserId) {
        return (
            <View style={styles.center}>
                <Text style={styles.infoText}>User not found.</Text>
            </View>
        );
    }

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={colors.accent} />
            </View>
        );
    }

    if (!profile) {
        return (
            <View style={styles.center}>
                <Text style={styles.infoText}>
                    This user profile could not be loaded.
                </Text>
            </View>
        );
    }

    const displayName =
        profile.displayName ?? profile.username ?? 'New user';

    const isFollowing =
        !viewingOwnProfile && followingIds.has(profile.uid);

    const lastSeenLabel = formatLastSeenLabel(
        profile.isOnline ?? false,
        profile.lastSeenAt ?? null,
    );

    const showFollowButton = !!user && !viewingOwnProfile;

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
        >
            <View style={styles.headerRow}>
                <View
                    style={[
                        styles.avatarCircle,
                        (profile.isOnline ||
                            (!!profile.lastSeenAt &&
                                Date.now() -
                                profile.lastSeenAt.getTime() <=
                                ONLINE_WINDOW_MS)) &&
                        styles.avatarCircleOnline,
                    ]}
                >
                    <Text style={styles.avatarInitial}>
                        {displayName
                            .trim()
                            .slice(0, 1)
                            .toUpperCase() || 'U'}
                    </Text>
                </View>
                <View style={styles.headerText}>
                    <Text style={styles.name}>{displayName}</Text>
                    <Text style={styles.lastSeenText}>{lastSeenLabel}</Text>
                    <Text style={styles.followStats}>
                        {profile.followersCount} followers ·{' '}
                        {profile.followingCount} following
                    </Text>
                </View>
            </View>

            {showFollowButton && (
                <View style={styles.followButtonRow}>
                    <TouchableOpacity
                        style={[
                            styles.followButton,
                            isFollowing && styles.followingButton,
                        ]}
                        activeOpacity={0.85}
                        onPress={handleToggleFollow}
                        disabled={pendingFollow}
                    >
                        {pendingFollow ? (
                            <ActivityIndicator
                                size="small"
                                color={
                                    isFollowing ? colors.textPrimary : '#000'
                                }
                            />
                        ) : (
                            <Text
                                style={[
                                    styles.followButtonText,
                                    isFollowing && styles.followingButtonText,
                                ]}
                            >
                                {isFollowing ? 'Following' : 'Follow'}
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            )}

            <Card style={styles.card}>
                <Text style={styles.sectionTitle}>About</Text>
                <Text style={styles.bioText}>
                    {profile.bio && profile.bio.trim().length > 0
                        ? profile.bio
                        : 'This user has not added a bio yet.'}
                </Text>

                <View style={styles.infoRow}>
                    {profile.age != null && (
                        <View style={styles.infoChip}>
                            <Text style={styles.infoChipLabel}>Age</Text>
                            <Text style={styles.infoChipValue}>
                                {profile.age}
                            </Text>
                        </View>
                    )}
                    {profile.gender && (
                        <View style={styles.infoChip}>
                            <Text style={styles.infoChipLabel}>Gender</Text>
                            <Text style={styles.infoChipValue}>
                                {profile.gender}
                            </Text>
                        </View>
                    )}
                    {profile.starSign && (
                        <View style={styles.infoChip}>
                            <Text style={styles.infoChipLabel}>Star sign</Text>
                            <Text style={styles.infoChipValue}>
                                {profile.starSign}
                            </Text>
                        </View>
                    )}
                    {profile.location && (
                        <View style={styles.infoChip}>
                            <Text style={styles.infoChipLabel}>Location</Text>
                            <Text style={styles.infoChipValue}>
                                {profile.location}
                            </Text>
                        </View>
                    )}
                </View>

                {profile.hobbies && profile.hobbies.length > 0 && (
                    <View style={styles.hobbiesBlock}>
                        <Text style={styles.hobbiesLabel}>Hobbies</Text>
                        <View style={styles.hobbiesChips}>
                            {profile.hobbies.map((hobby) => (
                                <View
                                    key={hobby}
                                    style={styles.hobbyChip}
                                >
                                    <Text style={styles.hobbyChipText}>
                                        {hobby}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}
            </Card>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
        paddingBottom: spacing.xl,
    },
    center: {
        flex: 1,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.lg,
    },
    infoText: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    avatarCircle: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#272736',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
        borderWidth: 3,
        borderColor: 'transparent',
    },
    avatarCircleOnline: {
        borderColor: '#22c55e',
    },
    avatarInitial: {
        fontSize: 32,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    headerText: {
        flex: 1,
    },
    name: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: 4,
    },
    lastSeenText: {
        fontSize: 12,
        color: colors.textSecondary,
        marginBottom: 4,
    },
    followStats: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    followButtonRow: {
        marginBottom: spacing.lg,
    },
    followButton: {
        alignSelf: 'flex-start',
        paddingHorizontal: spacing.lg,
        paddingVertical: 8,
        borderRadius: 999,
        backgroundColor: colors.accent,
    },
    followingButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.borderSubtle,
    },
    followButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
    },
    followingButtonText: {
        color: colors.textPrimary,
    },
    card: {
        marginTop: spacing.sm,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: spacing.sm,
    },
    bioText: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: spacing.md,
    },
    infoRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: spacing.md,
    },
    infoChip: {
        paddingHorizontal: spacing.sm,
        paddingVertical: 6,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: colors.borderSubtle,
        marginRight: spacing.sm,
        marginBottom: spacing.sm,
    },
    infoChipLabel: {
        fontSize: 11,
        color: colors.textMuted,
    },
    infoChipValue: {
        fontSize: 13,
        color: colors.textPrimary,
        fontWeight: '500',
    },
    hobbiesBlock: {
        marginTop: spacing.sm,
    },
    hobbiesLabel: {
        fontSize: 13,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
    },
    hobbiesChips: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    hobbyChip: {
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: 999,
        backgroundColor: '#1b1b28',
        marginRight: spacing.xs,
        marginBottom: spacing.xs,
    },
    hobbyChipText: {
        fontSize: 12,
        color: colors.textPrimary,
    },
});

export default UserProfileScreen;

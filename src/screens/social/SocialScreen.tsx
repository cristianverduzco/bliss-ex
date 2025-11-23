// src/screens/social/SocialScreen.tsx

import React, { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { collection, onSnapshot } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

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
import UserCard from '../../components/social/UserCard';

const ONLINE_WINDOW_MS = 5 * 60 * 1000;

const SocialScreen: React.FC = () => {
    const { user } = useAuth();
    const navigation = useNavigation<any>();

    const [profiles, setProfiles] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [followingIds, setFollowingIds] = useState<Set<string>>(
        () => new Set(),
    );
    const [pendingUserId, setPendingUserId] = useState<string | null>(null);

    // listen to all user profiles (lightweight discovery feed)
    useEffect(() => {
        const usersRef = collection(db, 'users');

        const unsubscribe = onSnapshot(
            usersRef,
            (snapshot) => {
                const list: UserProfile[] = [];
                snapshot.forEach((docSnap) => {
                    const profile = mapUserDocToProfile(docSnap);
                    list.push(profile);
                });
                setProfiles(list);
                setLoading(false);
            },
            () => {
                setLoading(false);
            },
        );

        return unsubscribe;
    }, []);

    // track who the current user is following, to render Follow buttons
    useEffect(() => {
        if (!user) return;
        const unsubscribe = subscribeToFollowing(user.uid, (ids) =>
            setFollowingIds(new Set(ids)),
        );
        return unsubscribe;
    }, [user]);

    const sortedProfiles = useMemo(() => {
        const now = Date.now();

        const isOnline = (profile: UserProfile): boolean => {
            if (profile.isOnline) return true;
            if (!profile.lastSeenAt) return false;
            return now - profile.lastSeenAt.getTime() <= ONLINE_WINDOW_MS;
        };

        const clone = profiles.filter(
            (p) => !user || p.uid !== user.uid, // don't show yourself
        );

        clone.sort((a, b) => {
            const aOnline = isOnline(a);
            const bOnline = isOnline(b);
            if (aOnline !== bOnline) {
                return aOnline ? -1 : 1;
            }

            if (b.followersCount !== a.followersCount) {
                return b.followersCount - a.followersCount;
            }

            const aLast = a.lastSeenAt?.getTime() ?? 0;
            const bLast = b.lastSeenAt?.getTime() ?? 0;
            return bLast - aLast;
        });

        return clone;
    }, [profiles, user]);

    const handleToggleFollow = async (
        targetUid: string,
        currentlyFollowing: boolean,
    ) => {
        if (!user || user.uid === targetUid) return;

        setPendingUserId(targetUid);
        try {
            if (currentlyFollowing) {
                await unfollowUser(user.uid, targetUid);
            } else {
                await followUser(user.uid, targetUid);
            }
        } finally {
            setPendingUserId(null);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        // everything is live via onSnapshot; just fake a short refresh
        setTimeout(() => setRefreshing(false), 400);
    };

    const renderItem = ({ item }: { item: UserProfile }) => {
        const isFollowing = followingIds.has(item.uid);
        const disableFollow = !user || user.uid === item.uid;

        return (
            <UserCard
                profile={item}
                isFollowing={isFollowing}
                disableFollow={disableFollow}
                isBusy={pendingUserId === item.uid}
                onToggleFollow={() =>
                    handleToggleFollow(item.uid, isFollowing)
                }
                onPressProfile={() =>
                    navigation.navigate('UserProfile', {
                        userId: item.uid,
                    })
                }
            />
        );
    };

    const keyExtractor = (item: UserProfile) => item.uid;

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={colors.accent} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Discover people</Text>
                <Text style={styles.subtitle}>
                    Online users and people with the most followers appear
                    first.
                </Text>
            </View>

            <FlatList
                data={sortedProfiles}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                refreshControl={
                    <RefreshControl
                        tintColor={colors.accent}
                        colors={[colors.accent]}
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>
                            No users to show yet. Come back soon!
                        </Text>
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    center: {
        flex: 1,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
        paddingBottom: spacing.sm,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 13,
        color: colors.textSecondary,
    },
    emptyState: {
        paddingVertical: spacing.xl,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 14,
        color: colors.textSecondary,
    },
});

export default SocialScreen;

// src/screens/profile/FollowListScreen.tsx

import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { collection, onSnapshot } from 'firebase/firestore';

import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import { db } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';
import {
    fetchUserProfilesByUids,
    followUser,
    subscribeToFollowing,
    unfollowUser,
} from '../../services/social';
import { UserProfile } from '../../types/userProfile';
import UserCard from '../../components/social/UserCard';

type Params = {
    userId?: string;
};

type GenericRoute = RouteProp<Record<string, Params>, string>;

const FollowListScreen: React.FC = () => {
    const { user } = useAuth();
    const route = useRoute<GenericRoute>();
    const navigation = useNavigation<any>();

    const mode: 'followers' | 'following' =
        route.name === 'Following' ? 'following' : 'followers';

    const viewingUserId = route.params?.userId ?? user?.uid ?? null;

    const [profiles, setProfiles] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [followingIds, setFollowingIds] = useState<Set<string>>(
        () => new Set(),
    );
    const [pendingUserId, setPendingUserId] = useState<string | null>(null);

    useEffect(() => {
        if (!user) return;
        const unsubscribe = subscribeToFollowing(user.uid, (ids) =>
            setFollowingIds(new Set(ids)),
        );
        return unsubscribe;
    }, [user]);

    useEffect(() => {
        if (!viewingUserId) {
            setLoading(false);
            return;
        }

        const colRef = collection(db, 'users', viewingUserId, mode);

        const unsubscribe = onSnapshot(
            colRef,
            async (snapshot) => {
                const uids = snapshot.docs.map((d) => d.id);
                if (uids.length === 0) {
                    setProfiles([]);
                    setLoading(false);
                    return;
                }

                try {
                    const fetched = await fetchUserProfilesByUids(uids);
                    const order = new Map<string, number>();
                    uids.forEach((id, index) => order.set(id, index));
                    fetched.sort(
                        (a, b) =>
                            (order.get(a.uid) ?? 0) -
                            (order.get(b.uid) ?? 0),
                    );
                    setProfiles(fetched);
                } catch {
                    setProfiles([]);
                } finally {
                    setLoading(false);
                }
            },
            () => {
                setLoading(false);
            },
        );

        return unsubscribe;
    }, [viewingUserId, mode]);

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

    if (!viewingUserId) {
        return (
            <View style={styles.center}>
                <Text style={styles.infoText}>
                    You need to be signed in to view this list.
                </Text>
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

    if (profiles.length === 0) {
        return (
            <View style={styles.center}>
                <Text style={styles.infoText}>
                    {mode === 'followers'
                        ? "You don't have any followers yet."
                        : "You aren't following anyone yet."}
                </Text>
            </View>
        );
    }

    return (
        <FlatList
            style={styles.list}
            data={profiles}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
        />
    );
};

const styles = StyleSheet.create({
    list: {
        flex: 1,
        backgroundColor: colors.background,
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
});

export default FollowListScreen;

// src/screens/profile/ProfileScreen.tsx

import React, { useEffect, useState } from 'react';
import {
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { doc, onSnapshot, Timestamp } from 'firebase/firestore';

import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import { db } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';
import ProfileHeader from '../../components/profile/ProfileHeader';
import ProfileStatsRow from '../../components/profile/ProfileStatsRow';
import ProfileTasksSection from '../../components/profile/ProfileTasksSection';
import ProfileFeatureGrid, {
    ProfileFeatureId,
} from '../../components/profile/ProfileFeatureGrid';
import ProfileAccountCard from '../../components/profile/ProfileAccountCard';
import Card from '../../components/common/Card';
import { UserProfile } from '../../types/userProfile';
import {
    fallbackUsernameFromEmail,
    formatUserIdFromUid,
} from '../../utils/user';

const ProfileScreen: React.FC = () => {
    const { user } = useAuth();
    const navigation = useNavigation<any>();

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (!user) return;

        const ref = doc(db, 'users', user.uid);
        const unsubscribe = onSnapshot(ref, (snap) => {
            const raw = snap.data() as {
                email?: string;
                username?: string;
                displayName?: string;
                bio?: string;
                gender?: string;
                age?: number;
                starSign?: string;
                location?: string;
                hobbies?: string[] | string;
                followersCount?: number;
                followingCount?: number;
                isOnline?: boolean;
                lastSeenAt?: Timestamp | null;
            } | null;

            const email = raw?.email ?? user.email ?? undefined;
            const fallbackName =
                raw?.username ??
                raw?.displayName ??
                user.displayName ??
                (email ? fallbackUsernameFromEmail(email) : null) ??
                'New user';

            let hobbies: string[] | null = null;
            if (raw?.hobbies) {
                hobbies = Array.isArray(raw.hobbies)
                    ? raw.hobbies
                    : raw.hobbies
                        .split(',')
                        .map((h) => h.trim())
                        .filter(Boolean);
            }

            const lastSeenAt =
                raw?.lastSeenAt instanceof Timestamp
                    ? raw.lastSeenAt.toDate()
                    : null;

            setProfile({
                uid: snap.id,
                email: email ?? null,
                username: raw?.username ?? fallbackName,
                displayName: raw?.displayName ?? fallbackName,
                avatarUrl: null,
                bio: raw?.bio ?? null,
                gender: raw?.gender ?? null,
                age:
                    typeof raw?.age === 'number' && !Number.isNaN(raw.age)
                        ? raw.age
                        : null,
                starSign: raw?.starSign ?? null,
                location: raw?.location ?? null,
                hobbies,
                followersCount: raw?.followersCount ?? 0,
                followingCount: raw?.followingCount ?? 0,
                isOnline: raw?.isOnline ?? false,
                lastSeenAt,
            });
        });

        return unsubscribe;
    }, [user]);

    const onRefresh = () => {
        setRefreshing(true);
        // everything is live via onSnapshot already – just fake a short refresh
        setTimeout(() => setRefreshing(false), 500);
    };

    const handleFeaturePress = (featureId: ProfileFeatureId) => {
        navigation.navigate(featureId);
    };

    if (!user) {
        return (
            <View style={styles.center}>
                <Text style={styles.infoText}>
                    You need to be signed in to view your profile.
                </Text>
            </View>
        );
    }

    const username =
        profile?.displayName ??
        profile?.username ??
        fallbackUsernameFromEmail(user.email) ??
        'New user';

    const userIdFormatted = formatUserIdFromUid(user.uid);

    const followersCount = profile?.followersCount ?? 0;
    const followingCount = profile?.followingCount ?? 0;

    const bio =
        profile?.bio && profile.bio.trim().length > 0
            ? profile.bio
            : 'Add a short bio so people know who you are.';

    const hobbies = profile?.hobbies ?? [];
    const gender = profile?.gender;
    const age = profile?.age;
    const starSign = profile?.starSign;
    const location = profile?.location;

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            refreshControl={
                <RefreshControl
                    tintColor={colors.accent}
                    colors={[colors.accent]}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }
        >
            <ProfileHeader
                username={username}
                userId={userIdFormatted}
                onPressEditProfile={() => navigation.navigate('EditProfile')}
                onPressSettings={() => navigation.navigate('EditProfile')}
                onPressId={() => {
                    Alert.alert(
                        'Your ID',
                        `${userIdFormatted}\n\nShare this ID so people can find you.`,
                    );
                }}
            />

            <ProfileStatsRow
                following={followingCount}
                fans={followersCount}
                visitors={0}
                companions={0}
                onPressFollowing={() =>
                    navigation.navigate('Following', { userId: user.uid })
                }
                onPressFans={() =>
                    navigation.navigate('Followers', { userId: user.uid })
                }
                onPressVisitors={() => {
                    // placeholder for a future "visitors" screen
                    Alert.alert(
                        'Coming soon',
                        'Profile visitors will be available in a future update.',
                    );
                }}
                onPressCompanions={() => {
                    Alert.alert(
                        'Coming soon',
                        'Companions will be available in a future update.',
                    );
                }}
            />

            <Card style={styles.aboutCard}>
                <Text style={styles.aboutTitle}>About me</Text>
                <Text style={styles.bioText}>{bio}</Text>

                <View style={styles.infoRow}>
                    {age != null && (
                        <View style={styles.infoChip}>
                            <Text style={styles.infoChipLabel}>Age</Text>
                            <Text style={styles.infoChipValue}>{age}</Text>
                        </View>
                    )}
                    {gender && (
                        <View style={styles.infoChip}>
                            <Text style={styles.infoChipLabel}>Gender</Text>
                            <Text style={styles.infoChipValue}>{gender}</Text>
                        </View>
                    )}
                    {starSign && (
                        <View style={styles.infoChip}>
                            <Text style={styles.infoChipLabel}>Star sign</Text>
                            <Text style={styles.infoChipValue}>
                                {starSign}
                            </Text>
                        </View>
                    )}
                    {location && (
                        <View style={styles.infoChip}>
                            <Text style={styles.infoChipLabel}>Location</Text>
                            <Text style={styles.infoChipValue}>
                                {location}
                            </Text>
                        </View>
                    )}
                </View>

                {hobbies && hobbies.length > 0 && (
                    <View style={styles.hobbiesBlock}>
                        <Text style={styles.hobbiesLabel}>Hobbies</Text>
                        <View style={styles.hobbiesChips}>
                            {hobbies.map((hobby) => (
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

            <ProfileTasksSection
                onPressTaskCenter={() => navigation.navigate('Tasks')}
                onPressMoreTasks={() => navigation.navigate('Tasks')}
                onPressCheckIn={() =>
                    navigation.navigate('DailyCheckIn')
                }
            />

            <ProfileFeatureGrid onPressFeature={handleFeaturePress} />

            <ProfileAccountCard
                diamonds={0}
                goldenBeans={50}
                onPressAccount={() => navigation.navigate('Wallet')}
                onPressDiamonds={() => navigation.navigate('Wallet')}
                onPressGoldenBeans={() =>
                    navigation.navigate('Wallet')
                }
            />

            <View style={styles.bottomSpacer} />
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
        paddingTop: spacing.xl,
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
    aboutCard: {
        marginBottom: spacing.lg,
    },
    aboutTitle: {
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
    bottomSpacer: {
        height: 32,
    },
});

export default ProfileScreen;

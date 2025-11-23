// src/components/social/UserCard.tsx

import React, { useMemo } from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import { UserProfile } from '../../types/userProfile';

const ONLINE_WINDOW_MS = 5 * 60 * 1000;

export interface UserCardProps {
    profile: UserProfile;
    isFollowing: boolean;
    onToggleFollow: () => void;
    onPressProfile: () => void;
    disableFollow?: boolean;
    isBusy?: boolean;
}

const formatFollowersCount = (count: number): string => {
    if (count >= 1_000_000) {
        return `${(count / 1_000_000).toFixed(1)}M`;
    }
    if (count >= 1_000) {
        return `${(count / 1_000).toFixed(1)}K`;
    }
    return `${count}`;
};

const formatLastSeen = (
    isOnline: boolean | null | undefined,
    lastSeenAt: Date | null | undefined,
): { label: string; online: boolean } => {
    const now = Date.now();

    if (lastSeenAt) {
        const diff = now - lastSeenAt.getTime();
        const recentOnline = diff <= ONLINE_WINDOW_MS;

        if (isOnline || recentOnline) {
            return { label: 'Online now', online: true };
        }

        const minutes = Math.floor(diff / 60000);
        if (minutes < 60) {
            return { label: `Last seen ${minutes}m ago`, online: false };
        }
        const hours = Math.floor(minutes / 60);
        if (hours < 24) {
            return { label: `Last seen ${hours}h ago`, online: false };
        }
        const days = Math.floor(hours / 24);
        return { label: `Last seen ${days}d ago`, online: false };
    }

    if (isOnline) {
        return { label: 'Online now', online: true };
    }

    return { label: 'Recently joined', online: false };
};

const UserCard: React.FC<UserCardProps> = ({
                                               profile,
                                               isFollowing,
                                               onToggleFollow,
                                               onPressProfile,
                                               disableFollow,
                                               isBusy,
                                           }) => {
    const displayName =
        profile.displayName ?? profile.username ?? 'New user';

    const initials = displayName.trim().slice(0, 1).toUpperCase() || 'U';

    const followersLabel = useMemo(
        () => `${formatFollowersCount(profile.followersCount)} followers`,
        [profile.followersCount],
    );

    const { label: lastSeenLabel, online } = formatLastSeen(
        profile.isOnline ?? false,
        profile.lastSeenAt ?? null,
    );

    return (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={onPressProfile}
        >
            <View style={styles.leftColumn}>
                <View
                    style={[
                        styles.avatarCircle,
                        online && styles.avatarCircleOnline,
                    ]}
                >
                    <Text style={styles.avatarInitial}>{initials}</Text>
                </View>
            </View>

            <View style={styles.middleColumn}>
                <Text style={styles.username} numberOfLines={1}>
                    {displayName}
                </Text>
                <Text style={styles.metaText} numberOfLines={1}>
                    {followersLabel}
                    {profile.location ? ` · ${profile.location}` : ''}
                </Text>
                <Text
                    style={[
                        styles.lastSeen,
                        online && styles.lastSeenOnline,
                    ]}
                    numberOfLines={1}
                >
                    {lastSeenLabel}
                </Text>
            </View>

            {!disableFollow && (
                <View style={styles.rightColumn}>
                    <TouchableOpacity
                        style={[
                            styles.followButton,
                            isFollowing && styles.followingButton,
                        ]}
                        disabled={isBusy}
                        activeOpacity={0.85}
                        onPress={(event) => {
                            event.stopPropagation();
                            onToggleFollow();
                        }}
                    >
                        {isBusy ? (
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
                                    isFollowing &&
                                    styles.followingButtonText,
                                ]}
                            >
                                {isFollowing ? 'Following' : 'Follow'}
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderSubtle,
    },
    leftColumn: {
        marginRight: spacing.md,
    },
    avatarCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#272736',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    avatarCircleOnline: {
        borderColor: '#22c55e',
    },
    avatarInitial: {
        fontSize: 22,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    middleColumn: {
        flex: 1,
    },
    username: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 2,
    },
    metaText: {
        fontSize: 12,
        color: colors.textSecondary,
        marginBottom: 2,
    },
    lastSeen: {
        fontSize: 11,
        color: colors.textSecondary,
    },
    lastSeenOnline: {
        color: '#22c55e',
    },
    rightColumn: {
        marginLeft: spacing.md,
    },
    followButton: {
        paddingHorizontal: spacing.md,
        paddingVertical: 6,
        borderRadius: 999,
        backgroundColor: colors.accent,
        minWidth: 88,
        alignItems: 'center',
        justifyContent: 'center',
    },
    followingButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.borderSubtle,
    },
    followButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#000',
    },
    followingButtonText: {
        color: colors.textPrimary,
    },
});

export default UserCard;

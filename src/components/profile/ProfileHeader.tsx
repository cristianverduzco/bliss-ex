// src/components/profile/ProfileHeader.tsx

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import IconButton from '../common/IconButton';

interface ProfileHeaderProps {
    username: string;
    userId: string;
    onPressEditProfile: () => void;
    onPressSettings: () => void;
    onPressId: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
                                                         username,
                                                         userId,
                                                         onPressEditProfile,
                                                         onPressSettings,
                                                         onPressId,
                                                     }) => {
    return (
        <View style={styles.container}>
            <View style={styles.left}>
                <View style={styles.avatarWrapper}>
                    <View style={styles.avatarCircle}>
                        <Ionicons name="person" size={32} color={colors.textPrimary} />
                    </View>
                    <TouchableOpacity
                        style={styles.profileChip}
                        onPress={onPressEditProfile}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.profileChipText}>Complete profile</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.info}>
                    <Text style={styles.username}>{username}</Text>
                    <TouchableOpacity
                        onPress={onPressId}
                        activeOpacity={0.8}
                        style={styles.idRow}
                    >
                        <Text style={styles.idLabel}>ID {userId}</Text>
                        <View style={styles.copyPill}>
                            <Text style={styles.copyText}>Copy</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            <IconButton name="settings-outline" onPress={onPressSettings} />
        </View>
    );
};

const AVATAR_SIZE = 64;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.lg,
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatarWrapper: {
        marginRight: spacing.md,
    },
    avatarCircle: {
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE / 2,
        backgroundColor: '#272736',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.sm,
    },
    profileChip: {
        alignSelf: 'flex-start',
        borderRadius: 999,
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        backgroundColor: colors.accentSoft,
    },
    profileChipText: {
        fontSize: 11,
        fontWeight: '500',
        color: colors.accent,
    },
    info: {
        flex: 1,
    },
    username: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    idRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    idLabel: {
        fontSize: 13,
        color: colors.textSecondary,
        marginRight: spacing.sm,
    },
    copyPill: {
        borderRadius: 999,
        borderWidth: 1,
        borderColor: colors.borderSubtle,
        paddingHorizontal: spacing.sm,
        paddingVertical: 3,
    },
    copyText: {
        fontSize: 11,
        color: colors.textPrimary,
    },
});

export default ProfileHeader;

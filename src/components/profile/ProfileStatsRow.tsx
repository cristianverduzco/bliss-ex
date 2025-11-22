// src/components/profile/ProfileStatsRow.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';

interface ProfileStatsRowProps {
    following?: number;
    fans?: number;
    visitors?: number;
    companions?: number;
    onPressFollowing: () => void;
    onPressFans: () => void;
    onPressVisitors: () => void;
    onPressCompanions: () => void;
}

const ProfileStatsRow: React.FC<ProfileStatsRowProps> = ({
                                                             following = 0,
                                                             fans = 0,
                                                             visitors = 0,
                                                             companions = 0,
                                                             onPressFollowing,
                                                             onPressFans,
                                                             onPressVisitors,
                                                             onPressCompanions,
                                                         }) => {
    const stats = [
        { label: 'Following', value: following, onPress: onPressFollowing },
        { label: 'Fans', value: fans, onPress: onPressFans },
        { label: 'Visitors', value: visitors, onPress: onPressVisitors },
        { label: 'Companions', value: companions, onPress: onPressCompanions },
    ];

    return (
        <View style={styles.row}>
            {stats.map((stat) => (
                <TouchableOpacity
                    key={stat.label}
                    style={styles.stat}
                    activeOpacity={0.8}
                    onPress={stat.onPress}
                >
                    <Text style={styles.value}>{stat.value}</Text>
                    <Text style={styles.label}>{stat.label}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.lg,
    },
    stat: {
        flex: 1,
        alignItems: 'center',
    },
    value: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 4,
    },
    label: {
        fontSize: 12,
        color: colors.textSecondary,
    },
});

export default ProfileStatsRow;

// src/components/profile/ProfileTasksSection.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import Card from '../common/Card';
import SectionHeader from '../common/SectionHeader';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';

interface ProfileTasksSectionProps {
    onPressTaskCenter: () => void;
    onPressMoreTasks: () => void;
    onPressCheckIn: () => void;
}

const ProfileTasksSection: React.FC<ProfileTasksSectionProps> = ({
                                                                     onPressTaskCenter,
                                                                     onPressMoreTasks,
                                                                     onPressCheckIn,
                                                                 }) => {
    return (
        <Card style={styles.card} onPress={onPressTaskCenter}>
            <SectionHeader
                title="Complete tasks and win rewards"
                subtitle="Lv. 1"
                rightLabel="More tasks >"
                onPressRight={onPressMoreTasks}
            />

            <View style={styles.progressBackground}>
                <View style={styles.progressFill} />
            </View>

            <TouchableOpacity
                activeOpacity={0.85}
                style={styles.checkInCard}
                onPress={onPressCheckIn}
            >
                <View style={styles.checkInLeft}>
                    <View style={styles.iconDot} />
                    <Text style={styles.checkInTitle}>
                        Go to Check-in Center to claim daily rewards
                    </Text>
                </View>
                <View style={styles.viewButton}>
                    <Text style={styles.viewButtonText}>View</Text>
                </View>
            </TouchableOpacity>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: spacing.lg,
    },
    progressBackground: {
        height: 6,
        borderRadius: 999,
        backgroundColor: '#252535',
        overflow: 'hidden',
        marginBottom: spacing.lg,
    },
    progressFill: {
        flex: 1,
        width: '30%',
        backgroundColor: colors.accent,
    },
    checkInCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.sm,
        borderRadius: 14,
        backgroundColor: '#1b1b28',
    },
    checkInLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: spacing.sm,
    },
    iconDot: {
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: colors.accentSoft,
        marginRight: spacing.sm,
    },
    checkInTitle: {
        flex: 1,
        fontSize: 13,
        color: colors.textPrimary,
    },
    viewButton: {
        borderRadius: 999,
        paddingHorizontal: spacing.md,
        paddingVertical: 6,
        backgroundColor: colors.accent,
    },
    viewButtonText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#000',
    },
});

export default ProfileTasksSection;

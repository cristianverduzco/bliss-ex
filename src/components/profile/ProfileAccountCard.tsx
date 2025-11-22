// src/components/profile/ProfileAccountCard.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import Card from '../common/Card';
import SectionHeader from '../common/SectionHeader';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';

interface ProfileAccountCardProps {
    diamonds: number;
    goldenBeans: number;
    onPressAccount: () => void;
    onPressDiamonds: () => void;
    onPressGoldenBeans: () => void;
}

const ProfileAccountCard: React.FC<ProfileAccountCardProps> = ({
                                                                   diamonds,
                                                                   goldenBeans,
                                                                   onPressAccount,
                                                                   onPressDiamonds,
                                                                   onPressGoldenBeans,
                                                               }) => {
    return (
        <Card style={styles.card} onPress={onPressAccount}>
            <SectionHeader title="My Account" />

            <View style={styles.valuesRow}>
                <TouchableOpacity
                    style={[styles.valueBlock, styles.borderRight]}
                    activeOpacity={0.8}
                    onPress={onPressDiamonds}
                >
                    <Text style={styles.valueLabel}>Diamond</Text>
                    <Text style={styles.value}>{diamonds.toFixed(1)}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.valueBlock}
                    activeOpacity={0.8}
                    onPress={onPressGoldenBeans}
                >
                    <Text style={styles.valueLabel}>Golden bean</Text>
                    <Text style={styles.value}>{goldenBeans.toFixed(1)}</Text>
                </TouchableOpacity>
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: spacing.xl,
    },
    valuesRow: {
        flexDirection: 'row',
        marginTop: spacing.sm,
    },
    valueBlock: {
        flex: 1,
    },
    borderRight: {
        borderRightWidth: 1,
        borderRightColor: colors.borderSubtle,
        paddingRight: spacing.lg,
        marginRight: spacing.lg,
    },
    valueLabel: {
        fontSize: 12,
        color: colors.textSecondary,
        marginBottom: 4,
    },
    value: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textPrimary,
    },
});

export default ProfileAccountCard;

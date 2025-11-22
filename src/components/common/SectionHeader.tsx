// src/components/common/SectionHeader.tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    rightLabel?: string;
    onPressRight?: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
                                                         title,
                                                         subtitle,
                                                         rightLabel,
                                                         onPressRight,
                                                     }) => {
    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.title}>{title}</Text>
                {subtitle ? (
                    <Text style={styles.subtitle}>{subtitle}</Text>
                ) : null}
            </View>
            {rightLabel ? (
                <TouchableOpacity onPress={onPressRight} activeOpacity={0.8}>
                    <Text style={styles.rightLabel}>{rightLabel}</Text>
                </TouchableOpacity>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: spacing.sm,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    subtitle: {
        fontSize: 12,
        color: colors.textMuted,
        marginTop: 2,
    },
    rightLabel: {
        fontSize: 13,
        color: colors.textSecondary,
    },
});

export default SectionHeader;

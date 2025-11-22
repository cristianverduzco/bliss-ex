// src/screens/social/SocialScreen.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';

const SocialScreen: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Social</Text>
            <Text style={styles.subtitle}>
                This is a placeholder for your social / discovery feed. Navigation
                is fully wired so you can drop in real content later.
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: spacing.lg,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: spacing.sm,
    },
    subtitle: {
        fontSize: 14,
        color: colors.textSecondary,
    },
});

export default SocialScreen;

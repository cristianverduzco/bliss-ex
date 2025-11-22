// src/screens/messages/MessagesScreen.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';

const MessagesScreen: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Messages</Text>
            <Text style={styles.subtitle}>
                This is a shell for your chat and inbox experience. The red badge on
                the tab bar is already configured.
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

export default MessagesScreen;

// src/screens/profile/ProfilePlaceholderScreen.tsx

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';

import colors from '../../theme/colors';
import spacing from '../../theme/spacing';

type PlaceholderParams = {
    title?: string;
    description?: string;
};

type GenericRoute = RouteProp<Record<string, PlaceholderParams>, string>;

const ProfilePlaceholderScreen: React.FC = () => {
    const route = useRoute<GenericRoute>();
    const { title = 'Coming soon', description } = route.params ?? {};

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
        >
            <Text style={styles.title}>{title}</Text>
            {description ? (
                <Text style={styles.description}>{description}</Text>
            ) : null}
            <View style={styles.box}>
                <Text style={styles.boxTitle}>Screen shell only</Text>
                <Text style={styles.boxText}>
                    All navigation is wired up already. You can now replace this
                    placeholder content with real UI and features whenever you are
                    ready.
                </Text>
                <Text style={styles.boxText}>
                    Check{' '}
                    <Text style={styles.highlight}>
                        src/navigation/ProfileStackNavigator.tsx
                    </Text>{' '}
                    to see which route pushed you here and to connect new components.
                </Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        padding: spacing.lg,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: spacing.sm,
    },
    description: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: spacing.lg,
    },
    box: {
        borderRadius: 16,
        padding: spacing.lg,
        backgroundColor: '#181822',
        borderWidth: 1,
        borderColor: colors.borderSubtle,
    },
    boxTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: spacing.sm,
    },
    boxText: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: spacing.sm,
    },
    highlight: {
        color: colors.accent,
        fontWeight: '600',
    },
});

export default ProfilePlaceholderScreen;

// src/screens/auth/ForgotUsernameScreen.tsx

import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { collection, getDocs, query, where } from 'firebase/firestore';

import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import { db } from '../../services/firebase';
import type { AuthStackParamList } from '../../navigation/AuthStackNavigator';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotUsername'>;

const ForgotUsernameScreen: React.FC<Props> = () => {
    const [email, setEmail] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);

    const handleLookup = async () => {
        setError(null);
        setUsername(null);

        const trimmedEmail = email.trim().toLowerCase();
        if (!trimmedEmail) {
            setError('Please enter the email linked to your account.');
            return;
        }

        setSubmitting(true);
        try {
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('email', '==', trimmedEmail));
            const snapshot = await getDocs(q);

            if (snapshot.empty) {
                setError(
                    "We couldn't find any username associated with that email.",
                );
            } else {
                const data = snapshot.docs[0].data() as { username?: string };
                if (!data.username) {
                    setError('This account does not have a username stored yet.');
                } else {
                    setUsername(data.username);
                }
            }
        } catch {
            setError(
                'Something went wrong while looking up your username. Please try again.',
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.root}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={styles.container}>
                <Text style={styles.title}>Find your username</Text>
                <Text style={styles.subtitle}>
                    Enter the email you used when signing up. If we find a match,
                    we&apos;ll show the username linked to it.
                </Text>

                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="you@example.com"
                    placeholderTextColor={colors.textMuted}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    style={styles.input}
                />

                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                {username ? (
                    <Text style={styles.successText}>
                        Your username is{' '}
                        <Text style={styles.usernameHighlight}>{username}</Text>
                    </Text>
                ) : null}

                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={handleLookup}
                    activeOpacity={0.85}
                    disabled={submitting}
                >
                    {submitting ? (
                        <ActivityIndicator color="#000" />
                    ) : (
                        <Text style={styles.primaryButtonText}>Look up username</Text>
                    )}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: colors.background,
    },
    container: {
        flex: 1,
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xl,
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
        marginBottom: spacing.xl,
    },
    inputLabel: {
        fontSize: 13,
        color: colors.textSecondary,
        marginBottom: 4,
    },
    input: {
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.borderSubtle,
        paddingHorizontal: spacing.md,
        paddingVertical: 10,
        color: colors.textPrimary,
        fontSize: 15,
        marginBottom: spacing.lg,
        backgroundColor: '#11111a',
    },
    primaryButton: {
        marginTop: spacing.sm,
        borderRadius: 999,
        backgroundColor: colors.accent,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
    },
    errorText: {
        marginBottom: spacing.sm,
        color: colors.danger,
        fontSize: 13,
    },
    successText: {
        marginBottom: spacing.sm,
        color: colors.accent,
        fontSize: 13,
    },
    usernameHighlight: {
        fontWeight: '700',
        color: colors.textPrimary,
    },
});

export default ForgotUsernameScreen;

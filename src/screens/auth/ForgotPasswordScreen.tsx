// src/screens/auth/ForgotPasswordScreen.tsx

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
import { sendPasswordResetEmail } from 'firebase/auth';

import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import { auth } from '../../services/firebase';
import type { AuthStackParamList } from '../../navigation/AuthStackNavigator';
import { getFirebaseAuthErrorMessage } from '../../utils/firebaseErrorMessage';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

const ForgotPasswordScreen: React.FC<Props> = () => {
    const [email, setEmail] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleReset = async () => {
        setError(null);
        setSuccessMessage(null);

        const trimmedEmail = email.trim().toLowerCase();
        if (!trimmedEmail) {
            setError('Please enter the email you used for your account.');
            return;
        }

        setSubmitting(true);
        try {
            await sendPasswordResetEmail(auth, trimmedEmail);
            setSuccessMessage(
                'If an account exists for that email, a reset link has been sent.',
            );
        } catch (err) {
            setError(getFirebaseAuthErrorMessage(err));
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
                <Text style={styles.title}>Reset password</Text>
                <Text style={styles.subtitle}>
                    Enter your email and we&apos;ll send you a link to choose a new
                    password.
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
                {successMessage ? (
                    <Text style={styles.successText}>{successMessage}</Text>
                ) : null}

                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={handleReset}
                    activeOpacity={0.85}
                    disabled={submitting}
                >
                    {submitting ? (
                        <ActivityIndicator color="#000" />
                    ) : (
                        <Text style={styles.primaryButtonText}>Send reset link</Text>
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
});

export default ForgotPasswordScreen;

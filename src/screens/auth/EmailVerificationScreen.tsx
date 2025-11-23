// src/screens/auth/EmailVerificationScreen.tsx

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { sendEmailVerification, signOut } from 'firebase/auth';

import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import { auth } from '../../services/firebase';
import type { AuthStackParamList } from '../../navigation/AuthStackNavigator';
import { useAuth } from '../../contexts/AuthContext';

type Props = NativeStackScreenProps<AuthStackParamList, 'EmailVerification'>;

const EmailVerificationScreen: React.FC<Props> = () => {
    const { user, refreshUser } = useAuth();
    const [checking, setChecking] = useState(false);
    const [resending, setResending] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const email = user?.email ?? 'your email address';

    const handleResend = async () => {
        setError(null);
        setMessage(null);

        if (!user) {
            setError('You need to be signed in to resend the verification email.');
            return;
        }

        setResending(true);
        try {
            await sendEmailVerification(user);
            setMessage('Verification email sent again. Please check your inbox.');
        } catch {
            setError('Could not resend the verification email. Please try again.');
        } finally {
            setResending(false);
        }
    };

    const handleCheckVerified = async () => {
        setError(null);
        setMessage(null);
        setChecking(true);
        try {
            await refreshUser();
            if (auth.currentUser?.emailVerified) {
                setMessage('Nice! Your email is verified. Loading your account...');
                // RootNavigator will switch to main tabs automatically.
            } else {
                setError(
                    "We still don't see your email as verified yet. Please tap the link in the email and try again.",
                );
            }
        } catch {
            setError(
                'Something went wrong while checking your verification status. Please try again.',
            );
        } finally {
            setChecking(false);
        }
    };

    const handleSignOut = async () => {
        setError(null);
        setMessage(null);
        try {
            await signOut(auth);
        } catch {
            setError('Could not sign out. Please try again.');
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.root}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={styles.container}>
                <Text style={styles.title}>Check your email</Text>
                <Text style={styles.subtitle}>
                    We&apos;ve sent a verification link to{' '}
                    <Text style={styles.emailHighlight}>{email}</Text>. Open that
                    link to activate your account, then come back here.
                </Text>

                {message ? <Text style={styles.messageText}>{message}</Text> : null}
                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={handleCheckVerified}
                    activeOpacity={0.85}
                    disabled={checking}
                >
                    {checking ? (
                        <ActivityIndicator color="#000" />
                    ) : (
                        <Text style={styles.primaryButtonText}>
                            I&apos;ve verified my email
                        </Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={handleResend}
                    activeOpacity={0.85}
                    disabled={resending}
                >
                    {resending ? (
                        <ActivityIndicator color={colors.accent} />
                    ) : (
                        <Text style={styles.secondaryButtonText}>
                            Resend verification email
                        </Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.signOutButton}
                    onPress={handleSignOut}
                    activeOpacity={0.8}
                >
                    <Text style={styles.signOutText}>
                        Use a different email? Sign out
                    </Text>
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
    emailHighlight: {
        color: colors.textPrimary,
        fontWeight: '600',
    },
    messageText: {
        fontSize: 13,
        color: colors.accent,
        marginBottom: spacing.sm,
    },
    errorText: {
        fontSize: 13,
        color: colors.danger,
        marginBottom: spacing.sm,
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
    secondaryButton: {
        marginTop: spacing.md,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: colors.accent,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondaryButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.accent,
    },
    signOutButton: {
        marginTop: spacing.lg,
        alignItems: 'center',
    },
    signOutText: {
        fontSize: 13,
        color: colors.textSecondary,
    },
});

export default EmailVerificationScreen;

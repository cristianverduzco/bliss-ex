// src/screens/auth/LoginScreen.tsx

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
import {
    signInWithEmailAndPassword,
    sendEmailVerification,
} from 'firebase/auth';

import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import { auth } from '../../services/firebase';
import type { AuthStackParamList } from '../../navigation/AuthStackNavigator';
import { getFirebaseAuthErrorMessage } from '../../utils/firebaseErrorMessage';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async () => {
        setError(null);

        const trimmedEmail = email.trim().toLowerCase();
        if (!trimmedEmail || !password) {
            setError('Please enter both email and password.');
            return;
        }

        setSubmitting(true);
        try {
            const credential = await signInWithEmailAndPassword(
                auth,
                trimmedEmail,
                password,
            );

            if (!credential.user.emailVerified) {
                // Keep them in auth flow until they verify.
                await sendEmailVerification(credential.user).catch(() => undefined);
                navigation.navigate('EmailVerification');
            }
            // If verified, RootNavigator will switch into the main tabs automatically.
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
                <Text style={styles.title}>Welcome back</Text>
                <Text style={styles.subtitle}>
                    Log in with the email you used to create your account.
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

                <Text style={styles.inputLabel}>Password</Text>
                <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="••••••••"
                    placeholderTextColor={colors.textMuted}
                    secureTextEntry
                    autoCapitalize="none"
                    style={styles.input}
                />

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={handleLogin}
                    activeOpacity={0.85}
                    disabled={submitting}
                >
                    {submitting ? (
                        <ActivityIndicator color="#000" />
                    ) : (
                        <Text style={styles.primaryButtonText}>Log in</Text>
                    )}
                </TouchableOpacity>

                <View style={styles.linkRow}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('ForgotPassword')}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.linkText}>Forgot password?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('ForgotUsername')}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.linkText}>Forgot username?</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.bottomRow}>
                    <Text style={styles.bottomText}>New here?</Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Signup')}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.linkText}>Create an account</Text>
                    </TouchableOpacity>
                </View>
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
    linkRow: {
        marginTop: spacing.lg,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    linkText: {
        fontSize: 13,
        color: colors.accent,
        fontWeight: '500',
    },
    bottomRow: {
        marginTop: spacing.xl,
        flexDirection: 'row',
        alignItems: 'center',
    },
    bottomText: {
        fontSize: 13,
        color: colors.textSecondary,
        marginRight: 6,
    },
});

export default LoginScreen;

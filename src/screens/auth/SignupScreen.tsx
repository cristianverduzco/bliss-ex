// src/screens/auth/SignupScreen.tsx

import React, { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    updateProfile,
} from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';

import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import { auth, db } from '../../services/firebase';
import type { AuthStackParamList } from '../../navigation/AuthStackNavigator';
import { getFirebaseAuthErrorMessage } from '../../utils/firebaseErrorMessage';

type Props = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

const SignupScreen: React.FC<Props> = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSignup = async () => {
        setError(null);

        const trimmedUsername = username.trim();
        const trimmedEmail = email.trim().toLowerCase();

        if (!trimmedUsername) {
            setError('Please choose a username.');
            return;
        }
        if (!trimmedEmail) {
            setError('Please enter an email address.');
            return;
        }
        if (!password || password.length < 6) {
            setError('Password should be at least 6 characters long.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setSubmitting(true);
        try {
            const credential = await createUserWithEmailAndPassword(
                auth,
                trimmedEmail,
                password,
            );

            await updateProfile(credential.user, {
                displayName: trimmedUsername,
            });

            await setDoc(doc(db, 'users', credential.user.uid), {
                uid: credential.user.uid,
                email: trimmedEmail,
                username: trimmedUsername,
                displayName: trimmedUsername,
                createdAt: serverTimestamp(),

                // profile fields (empty by default)
                bio: '',
                gender: null,
                age: null,
                starSign: null,
                location: '',
                hobbies: [],

                // social graph
                followersCount: 0,
                followingCount: 0,

                // presence
                isOnline: true,
                lastSeenAt: serverTimestamp(),
            });

            await sendEmailVerification(credential.user);

            navigation.navigate('EmailVerification');
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
                <Text style={styles.title}>Create your account</Text>
                <Text style={styles.subtitle}>
                    Sign up with your email. We&apos;ll send a confirmation
                    link to activate your profile.
                </Text>

                <Text style={styles.inputLabel}>Username</Text>
                <TextInput
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Choose a username"
                    placeholderTextColor={colors.textMuted}
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={styles.input}
                />

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

                <Text style={styles.inputLabel}>Confirm password</Text>
                <TextInput
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="••••••••"
                    placeholderTextColor={colors.textMuted}
                    secureTextEntry
                    autoCapitalize="none"
                    style={styles.input}
                />

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={handleSignup}
                    activeOpacity={0.85}
                    disabled={submitting}
                >
                    {submitting ? (
                        <ActivityIndicator color="#000" />
                    ) : (
                        <Text style={styles.primaryButtonText}>
                            Create account
                        </Text>
                    )}
                </TouchableOpacity>

                <View style={styles.bottomRow}>
                    <Text style={styles.bottomText}>
                        Already have an account?
                    </Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Login')}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.linkText}>Log in</Text>
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
    linkText: {
        fontSize: 13,
        color: colors.accent,
        fontWeight: '500',
    },
});

export default SignupScreen;

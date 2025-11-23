// src/screens/profile/EditProfileScreen.tsx

import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';

import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import { db } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { fallbackUsernameFromEmail } from '../../utils/user';

const EditProfileScreen: React.FC = () => {
    const { user, refreshUser } = useAuth();

    const [displayName, setDisplayName] = useState('');
    const [bio, setBio] = useState('');
    const [gender, setGender] = useState('');
    const [age, setAge] = useState('');
    const [starSign, setStarSign] = useState('');
    const [location, setLocation] = useState('');
    const [hobbies, setHobbies] = useState('');

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        const loadProfile = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const ref = doc(db, 'users', user.uid);
                const snap = await getDoc(ref);

                const fallbackName =
                    user.displayName ||
                    fallbackUsernameFromEmail(user.email) ||
                    'New user';

                if (!snap.exists()) {
                    setDisplayName(fallbackName);
                    setLoading(false);
                    return;
                }

                const data = snap.data() as {
                    username?: string;
                    bio?: string;
                    gender?: string;
                    age?: number;
                    starSign?: string;
                    location?: string;
                    hobbies?: string[] | string;
                };

                setDisplayName(data.username ?? fallbackName);
                setBio(data.bio ?? '');
                setGender(data.gender ?? '');
                setAge(
                    typeof data.age === 'number' && !Number.isNaN(data.age)
                        ? String(data.age)
                        : '',
                );
                setStarSign(data.starSign ?? '');
                setLocation(data.location ?? '');

                if (Array.isArray(data.hobbies)) {
                    setHobbies(data.hobbies.join(', '));
                } else if (typeof data.hobbies === 'string') {
                    setHobbies(data.hobbies);
                } else {
                    setHobbies('');
                }
            } finally {
                setLoading(false);
            }
        };

        void loadProfile();
    }, [user]);

    const handleSave = async () => {
        if (!user) return;

        setError(null);
        setSuccess(null);

        const trimmedName = displayName.trim();
        if (!trimmedName) {
            setError('Please choose a display name.');
            return;
        }

        let parsedAge: number | null = null;
        if (age.trim().length > 0) {
            const num = Number(age.trim());
            if (!Number.isNaN(num) && num > 0 && num < 130) {
                parsedAge = Math.round(num);
            } else {
                setError('Please enter a realistic age (1–129).');
                return;
            }
        }

        const hobbiesArray =
            hobbies.trim().length === 0
                ? []
                : hobbies
                    .split(',')
                    .map((h) => h.trim())
                    .filter(Boolean);

        setSaving(true);
        try {
            const ref = doc(db, 'users', user.uid);
            await updateDoc(ref, {
                username: trimmedName,
                bio: bio.trim(),
                gender: gender.trim() || null,
                age: parsedAge,
                starSign: starSign.trim() || null,
                location: location.trim() || null,
                hobbies: hobbiesArray,
            });

            await updateProfile(user, {
                displayName: trimmedName,
            }).catch(() => undefined);

            await refreshUser();
            setSuccess('Profile updated.');
        } catch {
            setError(
                'Could not save your profile right now. Please try again in a moment.',
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.accent} />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={styles.root}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled"
            >
                <Text style={styles.title}>Edit profile</Text>
                <Text style={styles.subtitle}>
                    This is the information other people see when they tap your
                    profile.
                </Text>

                <Text style={styles.label}>Display name</Text>
                <TextInput
                    value={displayName}
                    onChangeText={setDisplayName}
                    placeholder="How should others see you?"
                    placeholderTextColor={colors.textMuted}
                    style={styles.input}
                />

                <Text style={styles.label}>Bio</Text>
                <TextInput
                    value={bio}
                    onChangeText={setBio}
                    placeholder="Say something about yourself"
                    placeholderTextColor={colors.textMuted}
                    multiline
                    numberOfLines={3}
                    style={[styles.input, styles.textArea]}
                />

                <View style={styles.row}>
                    <View style={styles.rowItem}>
                        <Text style={styles.label}>Gender</Text>
                        <TextInput
                            value={gender}
                            onChangeText={setGender}
                            placeholder="Female / Male / Other"
                            placeholderTextColor={colors.textMuted}
                            style={styles.input}
                        />
                    </View>
                    <View style={styles.rowItem}>
                        <Text style={styles.label}>Age</Text>
                        <TextInput
                            value={age}
                            onChangeText={setAge}
                            placeholder="21"
                            placeholderTextColor={colors.textMuted}
                            keyboardType="number-pad"
                            style={styles.input}
                        />
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={styles.rowItem}>
                        <Text style={styles.label}>Star sign</Text>
                        <TextInput
                            value={starSign}
                            onChangeText={setStarSign}
                            placeholder="Libra, Leo..."
                            placeholderTextColor={colors.textMuted}
                            style={styles.input}
                        />
                    </View>
                    <View style={styles.rowItem}>
                        <Text style={styles.label}>Location</Text>
                        <TextInput
                            value={location}
                            onChangeText={setLocation}
                            placeholder="Where are you?"
                            placeholderTextColor={colors.textMuted}
                            style={styles.input}
                        />
                    </View>
                </View>

                <Text style={styles.label}>Hobbies</Text>
                <TextInput
                    value={hobbies}
                    onChangeText={setHobbies}
                    placeholder="Music, gaming, travel..."
                    placeholderTextColor={colors.textMuted}
                    style={styles.input}
                />
                <Text style={styles.helperText}>
                    Separate multiple hobbies with commas. We’ll show them as
                    tags on your profile.
                </Text>

                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                {success ? (
                    <Text style={styles.successText}>{success}</Text>
                ) : null}

                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={handleSave}
                    activeOpacity={0.85}
                    disabled={saving}
                >
                    {saving ? (
                        <ActivityIndicator color="#000" />
                    ) : (
                        <Text style={styles.primaryButtonText}>Save</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: colors.background,
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xl,
        paddingBottom: spacing.lg,
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
    label: {
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
    textArea: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    rowItem: {
        flex: 1,
    },
    helperText: {
        fontSize: 12,
        color: colors.textMuted,
        marginTop: -spacing.sm,
        marginBottom: spacing.lg,
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

export default EditProfileScreen;

// src/navigation/ProfileStackNavigator.tsx

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    GestureResponderEvent,
} from 'react-native';
import {
    createNativeStackNavigator,
    NativeStackScreenProps,
} from '@react-navigation/native-stack';

/**
 * ROUTE TYPES
 * ------------------------------------------------------------------ */
export type ProfileStackParamList = {
    ProfileHome: undefined;
    EditProfile: undefined;
    Tasks: undefined;
    DailyCheckIn: undefined;
    Wallet: undefined;

    Backpack: undefined;
    Nobility: undefined;
    Mall: undefined;
    GiftWall: undefined;
    Family: undefined;
    Union: undefined;
    BadgeWall: undefined;
    Future: undefined;
    CPHouse: undefined;
    Mentorship: undefined;
    Heart: undefined;
};

export type ProfileStackScreenProps<
    RouteName extends keyof ProfileStackParamList,
> = NativeStackScreenProps<ProfileStackParamList, RouteName>;

type FeatureRouteName =
    | 'Backpack'
    | 'Nobility'
    | 'Mall'
    | 'GiftWall'
    | 'Family'
    | 'Union'
    | 'BadgeWall'
    | 'Future'
    | 'CPHouse'
    | 'Mentorship'
    | 'Heart';

type FeatureDefinition = {
    key: FeatureRouteName;
    label: string;
    iconEmoji: string;
    background: string;
    description: string;
};

/**
 * FEATURE DEFINITIONS
 * (used by ProfileHome and by the generic feature screen)
 * ------------------------------------------------------------------ */
const FEATURE_DEFINITIONS: FeatureDefinition[] = [
    {
        key: 'Backpack',
        label: 'Backpack',
        iconEmoji: '🎒',
        background: '#ff9f43',
        description: 'Store items, props, and special rewards you earn in the app.',
    },
    {
        key: 'Nobility',
        label: 'Nobility',
        iconEmoji: '👑',
        background: '#f368e0',
        description: 'VIP status, special frames, and exclusive profile perks.',
    },
    {
        key: 'Mall',
        label: 'Mall',
        iconEmoji: '🛒',
        background: '#54a0ff',
        description: 'Browse and purchase premium gifts, themes, and upgrades.',
    },
    {
        key: 'GiftWall',
        label: 'Gift Wall',
        iconEmoji: '🎁',
        background: '#5f27cd',
        description: 'See all gifts you’ve received from friends and fans.',
    },
    {
        key: 'Family',
        label: 'Family',
        iconEmoji: '👨‍👩‍👧‍👦',
        background: '#10ac84',
        description: 'Create or join a family group to unlock team rewards.',
    },
    {
        key: 'Union',
        label: 'Union',
        iconEmoji: '🤝',
        background: '#ff6b6b',
        description: 'Collaborate with other creators in unions and events.',
    },
    {
        key: 'BadgeWall',
        label: 'Badge Wall',
        iconEmoji: '🏅',
        background: '#1dd1a1',
        description: 'Track achievements and badges unlocked by your activity.',
    },
    {
        key: 'Future',
        label: 'Future',
        iconEmoji: '🚀',
        background: '#ee5253',
        description: 'Upcoming features, experimental tools, and beta programs.',
    },
    {
        key: 'CPHouse',
        label: 'CP House',
        iconEmoji: '🏠',
        background: '#ff9ff3',
        description: 'Partner spaces, co-host perks, and shared rooms.',
    },
    {
        key: 'Mentorship',
        label: 'Mentorship',
        iconEmoji: '🧠',
        background: '#48dbfb',
        description: 'Connect with mentors or guide new users to grow faster.',
    },
    {
        key: 'Heart',
        label: 'Heart',
        iconEmoji: '💖',
        background: '#ff6b81',
        description: 'Your favorites, liked content, and people you care about.',
    },
];

const FEATURE_MAP: Record<FeatureRouteName, FeatureDefinition> =
    FEATURE_DEFINITIONS.reduce<Record<FeatureRouteName, FeatureDefinition>>(
        (map, def) => {
            map[def.key] = def;
            return map;
        },
        {} as Record<FeatureRouteName, FeatureDefinition>,
    );

/**
 * SHARED PRESENTATION COMPONENTS
 * ------------------------------------------------------------------ */

type ScreenContainerProps = {
    title: string;
    description?: string;
    children?: React.ReactNode;
};

const ScreenContainer: React.FC<ScreenContainerProps> = ({
                                                             title,
                                                             description,
                                                             children,
                                                         }) => {
    return (
        <ScrollView
            style={styles.featureScreenRoot}
            contentContainerStyle={styles.featureScreenContent}
        >
            <Text style={styles.featureScreenTitle}>{title}</Text>
            {description ? (
                <Text style={styles.featureScreenDescription}>{description}</Text>
            ) : null}
            {children}
        </ScrollView>
    );
};

type PrimaryButtonProps = {
    label: string;
    onPress: (event: GestureResponderEvent) => void;
};

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ label, onPress }) => {
    return (
        <Pressable style={styles.primaryButton} onPress={onPress}>
            <Text style={styles.primaryButtonText}>{label}</Text>
        </Pressable>
    );
};

/**
 * PROFILE HOME SCREEN
 * (the main "Me" page from your screenshot)
 * ------------------------------------------------------------------ */

type ProfileHomeProps = ProfileStackScreenProps<'ProfileHome'>;

const ProfileHomeScreen: React.FC<ProfileHomeProps> = ({ navigation }) => {
    return (
        <ScrollView
            style={styles.root}
            contentContainerStyle={styles.rootContent}
            showsVerticalScrollIndicator={false}
        >
            {/* Profile header */}
            <View style={styles.profileHeaderRow}>
                <View style={styles.avatarBubble}>
                    <Text style={styles.avatarEmoji}>👨‍💻</Text>
                </View>

                <View style={styles.profileHeaderTextColumn}>
                    <Text style={styles.profileName}>PierzAustn</Text>
                    <Text style={styles.profileId}>ID 824-320-297</Text>

                    <Pressable
                        style={styles.completeProfileChip}
                        onPress={() => navigation.navigate('EditProfile')}
                    >
                        <Text style={styles.completeProfileChipText}>Complete profile</Text>
                    </Pressable>
                </View>
            </View>

            {/* Stats row */}
            <View style={styles.statsRow}>
                {[
                    { label: 'Following', value: '0' },
                    { label: 'Fans', value: '0' },
                    { label: 'Visitors', value: '0' },
                    { label: 'Companions', value: '0' },
                ].map((stat) => (
                    <View key={stat.label} style={styles.statItem}>
                        <Text style={styles.statValue}>{stat.value}</Text>
                        <Text style={styles.statLabel}>{stat.label}</Text>
                    </View>
                ))}
            </View>

            {/* Tasks card */}
            <Pressable
                style={styles.tasksCard}
                onPress={() => navigation.navigate('Tasks')}
            >
                <View style={styles.tasksHeaderRow}>
                    <Text style={styles.tasksTitle}>Complete tasks and win rewards</Text>
                    <Text style={styles.tasksMore}>More tasks &gt;</Text>
                </View>

                <View style={styles.tasksLevelRow}>
                    <Text style={styles.tasksLevelLabel}>Lv. 1</Text>
                    <View style={styles.tasksProgressTrack}>
                        <View style={styles.tasksProgressFill} />
                    </View>
                </View>
            </Pressable>

            {/* Daily check-in card */}
            <Pressable
                style={styles.checkInCard}
                onPress={() => navigation.navigate('DailyCheckIn')}
            >
                <View style={styles.checkInLeft}>
                    <View style={styles.checkInIconBubble}>
                        <Text style={styles.checkInIcon}>🎁</Text>
                    </View>
                    <View style={styles.checkInTextColumn}>
                        <Text style={styles.checkInTitle}>
                            Go to Check-in Center to claim daily rewards
                        </Text>
                    </View>
                </View>

                <View style={styles.checkInButton}>
                    <Text style={styles.checkInButtonText}>View</Text>
                </View>
            </Pressable>

            {/* Feature grid */}
            <View style={styles.featureGridCard}>
                <View style={styles.featureGrid}>
                    {FEATURE_DEFINITIONS.map((feature) => (
                        <Pressable
                            key={feature.key}
                            style={styles.featureItem}
                            onPress={() => navigation.navigate(feature.key)}
                        >
                            <View
                                style={[
                                    styles.featureIconBubble,
                                    { backgroundColor: feature.background },
                                ]}
                            >
                                <Text style={styles.featureIconEmoji}>{feature.iconEmoji}</Text>
                            </View>
                            <Text style={styles.featureLabel}>{feature.label}</Text>
                        </Pressable>
                    ))}
                </View>
            </View>

            {/* Wallet / My Account */}
            <Pressable
                style={styles.walletCard}
                onPress={() => navigation.navigate('Wallet')}
            >
                <View style={styles.walletHeaderRow}>
                    <Text style={styles.walletTitle}>My Account</Text>
                </View>

                <View style={styles.walletBalanceRow}>
                    <View style={styles.walletBalanceItem}>
                        <Text style={styles.walletBalanceValue}>0.0</Text>
                        <Text style={styles.walletBalanceLabel}>Diamond</Text>
                    </View>

                    <View style={styles.walletBalanceItem}>
                        <Text style={styles.walletBalanceValue}>50.0</Text>
                        <Text style={styles.walletBalanceLabel}>Golden bean</Text>
                    </View>
                </View>
            </Pressable>
        </ScrollView>
    );
};

/**
 * SIMPLE DETAIL SCREENS
 * (no params; just static placeholder copy)
 * ------------------------------------------------------------------ */

const EditProfileScreen: React.FC<
    ProfileStackScreenProps<'EditProfile'>
> = () => (
    <ScreenContainer
        title="Complete your profile"
        description="Let users set their avatar, nickname, and personal details here."
    >
        <Text style={styles.placeholderBody}>
            This is a placeholder edit-profile screen. Plug your real profile-editing
            UI here.
        </Text>
    </ScreenContainer>
);

const TasksScreen: React.FC<ProfileStackScreenProps<'Tasks'>> = ({
                                                                     navigation,
                                                                 }) => (
    <ScreenContainer
        title="Tasks & Rewards"
        description="Daily, weekly, and special tasks that grant XP, coins, and beans."
    >
        <Text style={styles.placeholderBody}>
            Replace this with a full tasks list UI (daily check-in streaks, event
            missions, etc.).
        </Text>
        <PrimaryButton
            label="Go to daily check-in"
            onPress={() => navigation.navigate('DailyCheckIn')}
        />
    </ScreenContainer>
);

const DailyCheckInScreen: React.FC<
    ProfileStackScreenProps<'DailyCheckIn'>
> = () => (
    <ScreenContainer
        title="Daily Check-in"
        description="Reward your users for opening the app and staying active."
    >
        <Text style={styles.placeholderBody}>
            Show a calendar, streak counter, and rewards history here.
        </Text>
    </ScreenContainer>
);

const WalletScreen: React.FC<ProfileStackScreenProps<'Wallet'>> = () => (
    <ScreenContainer
        title="My Account"
        description="Balances for diamonds, golden beans, and other in‑app currencies."
    >
        <Text style={styles.placeholderBody}>
            Build a wallet summary, transaction history, and recharge / withdrawal
            actions here.
        </Text>
    </ScreenContainer>
);

/**
 * GENERIC FEATURE PLACEHOLDER SCREEN
 * (Backpack, Nobility, Mall, etc.)
 * ------------------------------------------------------------------ */

type FeatureScreenProps = NativeStackScreenProps<ProfileStackParamList>;

const FeaturePlaceholderScreen: React.FC<FeatureScreenProps> = ({ route }) => {
    // This screen is only used for the feature routes defined in FEATURE_DEFINITIONS.
    const featureKey = route.name as FeatureRouteName;
    const feature = FEATURE_MAP[featureKey];

    return (
        <ScreenContainer title={feature.label} description={feature.description}>
            <Text style={styles.placeholderBody}>
                This is the placeholder screen for the{' '}
                <Text style={styles.placeholderBodyStrong}>{feature.label}</Text>{' '}
                feature. Flesh this out with the real functionality and UI when you’re
                ready.
            </Text>
        </ScreenContainer>
    );
};

/**
 * STACK NAVIGATOR
 * ------------------------------------------------------------------ */

const Stack = createNativeStackNavigator<ProfileStackParamList>();

const ProfileStackNavigator: React.FC = () => {
    return (
        <Stack.Navigator
            initialRouteName="ProfileHome"
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#111111',
                },
                headerTitleStyle: {
                    fontSize: 16,
                    fontWeight: '600',
                    color: '#ffffff',
                },
                headerTintColor: '#ffffff',
                contentStyle: {
                    backgroundColor: '#050505',
                },
            }}
        >
            <Stack.Screen
                name="ProfileHome"
                component={ProfileHomeScreen}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="EditProfile"
                component={EditProfileScreen}
                options={{ title: 'Complete profile' }}
            />

            <Stack.Screen
                name="Tasks"
                component={TasksScreen}
                options={{ title: 'Tasks & rewards' }}
            />

            <Stack.Screen
                name="DailyCheckIn"
                component={DailyCheckInScreen}
                options={{ title: 'Daily check‑in' }}
            />

            <Stack.Screen
                name="Wallet"
                component={WalletScreen}
                options={{ title: 'My account' }}
            />

            {FEATURE_DEFINITIONS.map((feature) => (
                <Stack.Screen
                    key={feature.key}
                    name={feature.key}
                    component={FeaturePlaceholderScreen}
                    options={{ title: feature.label }}
                />
            ))}
        </Stack.Navigator>
    );
};

export default ProfileStackNavigator;

/**
 * STYLES
 * ------------------------------------------------------------------ */

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#050505',
    },
    rootContent: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 24,
    },

    profileHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatarBubble: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#333333',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    avatarEmoji: {
        fontSize: 32,
    },
    profileHeaderTextColumn: {
        flex: 1,
    },
    profileName: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 4,
    },
    profileId: {
        color: '#aaaaaa',
        fontSize: 12,
        marginBottom: 8,
    },
    completeProfileChip: {
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        backgroundColor: '#ff8c43',
    },
    completeProfileChipText: {
        color: '#1b1b1b',
        fontSize: 11,
        fontWeight: '600',
    },

    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
        paddingHorizontal: 8,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    statLabel: {
        color: '#888888',
        fontSize: 11,
    },

    tasksCard: {
        backgroundColor: '#181818',
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: 12,
        marginBottom: 12,
    },
    tasksHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    tasksTitle: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
        flex: 1,
        marginRight: 8,
    },
    tasksMore: {
        color: '#ffaa4c',
        fontSize: 12,
    },
    tasksLevelRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    tasksLevelLabel: {
        color: '#aaaaaa',
        fontSize: 12,
        marginRight: 8,
    },
    tasksProgressTrack: {
        flex: 1,
        height: 5,
        borderRadius: 999,
        backgroundColor: '#262626',
        overflow: 'hidden',
    },
    tasksProgressFill: {
        flex: 0.3,
        height: '100%',
        borderRadius: 999,
        backgroundColor: '#ffaa4c',
    },

    checkInCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#181818',
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: 12,
        marginBottom: 16,
    },
    checkInLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 10,
    },
    checkInIconBubble: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#4b3fcb',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    checkInIcon: {
        fontSize: 20,
    },
    checkInTextColumn: {
        flex: 1,
    },
    checkInTitle: {
        color: '#ffffff',
        fontSize: 13,
        fontWeight: '500',
    },
    checkInButton: {
        borderRadius: 999,
        paddingHorizontal: 16,
        paddingVertical: 6,
        backgroundColor: '#ff8c43',
    },
    checkInButtonText: {
        color: '#1b1b1b',
        fontSize: 12,
        fontWeight: '600',
    },

    featureGridCard: {
        backgroundColor: '#181818',
        borderRadius: 16,
        paddingHorizontal: 10,
        paddingVertical: 16,
        marginBottom: 16,
    },
    featureGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    featureItem: {
        width: '25%',
        alignItems: 'center',
        marginBottom: 18,
    },
    featureIconBubble: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 6,
    },
    featureIconEmoji: {
        fontSize: 22,
    },
    featureLabel: {
        color: '#e5e5e5',
        fontSize: 11,
    },

    walletCard: {
        backgroundColor: '#181818',
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: 14,
    },
    walletHeaderRow: {
        marginBottom: 10,
    },
    walletTitle: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
    },
    walletBalanceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    walletBalanceItem: {
        flex: 1,
    },
    walletBalanceValue: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '600',
    },
    walletBalanceLabel: {
        color: '#888888',
        fontSize: 12,
    },

    featureScreenRoot: {
        flex: 1,
        backgroundColor: '#050505',
    },
    featureScreenContent: {
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 24,
    },
    featureScreenTitle: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 8,
    },
    featureScreenDescription: {
        color: '#aaaaaa',
        fontSize: 14,
        marginBottom: 20,
    },

    placeholderBody: {
        color: '#dddddd',
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 16,
    },
    placeholderBodyStrong: {
        fontWeight: '700',
    },

    primaryButton: {
        marginTop: 8,
        borderRadius: 999,
        backgroundColor: '#ff8c43',
        paddingHorizontal: 20,
        paddingVertical: 10,
        alignSelf: 'flex-start',
    },
    primaryButtonText: {
        color: '#1b1b1b',
        fontSize: 14,
        fontWeight: '600',
    },
});

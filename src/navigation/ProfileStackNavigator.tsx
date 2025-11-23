// src/navigation/ProfileStackNavigator.tsx

import React from 'react';
import {
    GestureResponderEvent,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
} from 'react-native';
import {
    createNativeStackNavigator,
    type NativeStackScreenProps,
} from '@react-navigation/native-stack';

import ProfileScreen from '../screens/profile/ProfileScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import FollowListScreen from '../screens/profile/FollowListScreen';
import UserProfileScreen from '../screens/profile/UserProfileScreen';
import ProfilePlaceholderScreen from '../screens/profile/ProfilePlaceholderScreen';

/**
 * ROUTE TYPES
 * ------------------------------------------------------------------ */
export type ProfileStackParamList = {
    ProfileHome: undefined;
    EditProfile: undefined;
    Followers: { userId?: string } | undefined;
    Following: { userId?: string } | undefined;
    UserProfile: { userId: string };

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
    FEATURE_DEFINITIONS.reduce(
        (map, def) => {
            map[def.key] = def;
            return map;
        },
        {} as Record<FeatureRouteName, FeatureDefinition>,
    );

/**
 * SHARED PRESENTATION COMPONENTS (for placeholder screens)
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
                <Text style={styles.featureScreenDescription}>
                    {description}
                </Text>
            ) : null}
            {children}
        </ScrollView>
    );
};

type PrimaryButtonProps = {
    label: string;
    onPress: (event: GestureResponderEvent) => void;
};

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
                                                         label,
                                                         onPress,
                                                     }) => {
    return (
        <Pressable style={styles.primaryButton} onPress={onPress}>
            <Text style={styles.primaryButtonText}>{label}</Text>
        </Pressable>
    );
};

/**
 * SIMPLE DETAIL PLACEHOLDER SCREENS
 * ------------------------------------------------------------------ */

const TasksScreen: React.FC<ProfileStackScreenProps<'Tasks'>> = ({
                                                                     navigation,
                                                                 }) => (
    <ScreenContainer
        title="Tasks & Rewards"
        description="Daily, weekly, and special tasks that grant XP, coins, and beans."
    >
        <Text style={styles.placeholderBody}>
            Replace this with a full tasks list UI (daily check-in streaks,
            event missions, etc.).
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
            Build a wallet summary, transaction history, and recharge /
            withdrawal actions here.
        </Text>
    </ScreenContainer>
);

/**
 * GENERIC FEATURE PLACEHOLDER SCREEN
 * ------------------------------------------------------------------ */

type FeatureScreenProps = NativeStackScreenProps<ProfileStackParamList>;

const FeaturePlaceholderScreen: React.FC<FeatureScreenProps> = ({
                                                                    route,
                                                                }) => {
    const featureKey = route.name as FeatureRouteName;
    const feature = FEATURE_MAP[featureKey];

    return (
        <ScreenContainer
            title={feature.label}
            description={feature.description}
        >
            <Text style={styles.placeholderBody}>
                This is the placeholder screen for the{' '}
                <Text style={styles.placeholderBodyStrong}>
                    {feature.label}
                </Text>{' '}
                feature. Flesh this out with the real functionality and UI when
                you’re ready.
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
                component={ProfileScreen}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="EditProfile"
                component={EditProfileScreen}
                options={{ title: 'Edit profile' }}
            />

            <Stack.Screen
                name="Followers"
                component={FollowListScreen}
                options={{ title: 'Followers' }}
            />
            <Stack.Screen
                name="Following"
                component={FollowListScreen}
                options={{ title: 'Following' }}
            />

            <Stack.Screen
                name="UserProfile"
                component={UserProfileScreen}
                options={{ title: 'Profile' }}
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

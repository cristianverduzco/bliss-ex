// src/navigation/RootNavigator.tsx

import React from 'react';
import {
    ActivityIndicator,
    Platform,
    StyleSheet,
    View,
} from 'react-native';
import {
    DefaultTheme,
    NavigationContainer,
    type Theme,
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/home/HomeScreen';
import MessagesScreen from '../screens/messages/MessagesScreen';
import ProfileStackNavigator from './ProfileStackNavigator';
import AuthStackNavigator from './AuthStackNavigator';
import colors from '../theme/colors';
import { useAuth } from '../contexts/AuthContext';
import SocialStackNavigator from './SocialStackNavigator';
import { usePresence } from '../hooks/usePresence';

export type RootTabParamList = {
    HomeTab: undefined;
    SocialTab: undefined;
    MessagesTab: undefined;
    ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const navTheme: Theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: colors.background,
        card: colors.backgroundAlt,
        border: colors.borderSubtle,
        text: colors.textPrimary,
        primary: colors.accent,
    },
};

const MainTabs: React.FC = () => {
    return (
        <Tab.Navigator
            initialRouteName="ProfileTab"
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: true,
                tabBarActiveTintColor: colors.accent,
                tabBarInactiveTintColor: colors.textMuted,
                tabBarStyle: {
                    backgroundColor: '#11111a',
                    borderTopWidth: 1,
                    borderTopColor: colors.borderSubtle,
                    height: Platform.OS === 'android' ? 64 : 80,
                    paddingBottom: Platform.OS === 'android' ? 8 : 16,
                    paddingTop: 8,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                },
                tabBarIcon: ({ color, size, focused }) => {
                    let iconName: React.ComponentProps<
                        typeof Ionicons
                    >['name'] = 'home';

                    if (route.name === 'HomeTab') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'SocialTab') {
                        iconName = focused ? 'people' : 'people-outline';
                    } else if (route.name === 'MessagesTab') {
                        iconName = focused
                            ? 'chatbubbles'
                            : 'chatbubbles-outline';
                    } else if (route.name === 'ProfileTab') {
                        iconName = focused
                            ? 'person-circle'
                            : 'person-circle-outline';
                    }

                    return (
                        <Ionicons name={iconName} size={size} color={color} />
                    );
                },
            })}
        >
            <Tab.Screen
                name="HomeTab"
                component={HomeScreen}
                options={{ title: 'Home' }}
            />
            <Tab.Screen
                name="SocialTab"
                component={SocialStackNavigator}
                options={{ title: 'Social' }}
            />
            <Tab.Screen
                name="MessagesTab"
                component={MessagesScreen}
                options={{
                    title: 'Message',
                    tabBarBadge: 1,
                    tabBarBadgeStyle: {
                        backgroundColor: colors.danger,
                        color: 'white',
                    },
                }}
            />
            <Tab.Screen
                name="ProfileTab"
                component={ProfileStackNavigator}
                options={{ title: 'Me' }}
            />
        </Tab.Navigator>
    );
};

const RootNavigator: React.FC = () => {
    const { user, initializing } = useAuth();

    // keep user presence updated while authenticated
    usePresence();

    return (
        <NavigationContainer theme={navTheme}>
            {initializing ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.accent} />
                </View>
            ) : user && user.emailVerified ? (
                <MainTabs />
            ) : (
                <AuthStackNavigator />
            )}
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default RootNavigator;

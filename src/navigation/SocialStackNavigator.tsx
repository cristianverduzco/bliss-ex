// src/navigation/SocialStackNavigator.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SocialScreen from '../screens/social/SocialScreen';
import UserProfileScreen from '../screens/profile/UserProfileScreen';

export type SocialStackParamList = {
    SocialHome: undefined;
    UserProfile: { userId: string };
};

const Stack = createNativeStackNavigator<SocialStackParamList>();

const SocialStackNavigator: React.FC = () => {
    return (
        <Stack.Navigator
            initialRouteName="SocialHome"
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
                name="SocialHome"
                component={SocialScreen}
                options={{ title: 'Social' }}
            />
            <Stack.Screen
                name="UserProfile"
                component={UserProfileScreen}
                options={{ title: 'Profile' }}
            />
        </Stack.Navigator>
    );
};

export default SocialStackNavigator;

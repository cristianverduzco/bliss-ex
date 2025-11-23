// src/navigation/AuthStackNavigator.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import ForgotUsernameScreen from '../screens/auth/ForgotUsernameScreen';
import EmailVerificationScreen from '../screens/auth/EmailVerificationScreen';
import { useAuth } from '../contexts/AuthContext';

export type AuthStackParamList = {
    Login: undefined;
    Signup: undefined;
    ForgotPassword: undefined;
    ForgotUsername: undefined;
    EmailVerification: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStackNavigator: React.FC = () => {
    const { user } = useAuth();

    const initialRouteName: keyof AuthStackParamList =
        user && !user.emailVerified ? 'EmailVerification' : 'Login';

    return (
        <Stack.Navigator
            initialRouteName={initialRouteName}
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#050505',
                },
                headerTintColor: '#ffffff',
                headerTitleStyle: {
                    fontSize: 16,
                    fontWeight: '600',
                },
                contentStyle: {
                    backgroundColor: '#050505',
                },
            }}
        >
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ title: 'Log in' }}
            />
            <Stack.Screen
                name="Signup"
                component={SignupScreen}
                options={{ title: 'Create account' }}
            />
            <Stack.Screen
                name="ForgotPassword"
                component={ForgotPasswordScreen}
                options={{ title: 'Reset password' }}
            />
            <Stack.Screen
                name="ForgotUsername"
                component={ForgotUsernameScreen}
                options={{ title: 'Find your username' }}
            />
            <Stack.Screen
                name="EmailVerification"
                component={EmailVerificationScreen}
                options={{ title: 'Verify your email' }}
            />
        </Stack.Navigator>
    );
};

export default AuthStackNavigator;

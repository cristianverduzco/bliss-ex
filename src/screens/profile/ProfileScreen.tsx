// src/screens/profile/ProfileScreen.tsx

import React from 'react';
import {
    ScrollView,
    View,
    StyleSheet,
    RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import colors from '../../theme/colors';
import spacing from '../../theme/spacing';

import ProfileHeader from '../../components/profile/ProfileHeader';
import ProfileStatsRow from '../../components/profile/ProfileStatsRow';
import ProfileTasksSection from '../../components/profile/ProfileTasksSection';
import ProfileFeatureGrid, {
    ProfileFeatureId,
} from '../../components/profile/ProfileFeatureGrid';
import ProfileAccountCard from '../../components/profile/ProfileAccountCard';
import type { ProfileStackParamList } from '../../navigation/ProfileStackNavigator';

type Nav = NativeStackNavigationProp<ProfileStackParamList, 'ProfileMain'>;

const ProfileScreen: React.FC = () => {
    const navigation = useNavigation<Nav>();
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 600);
    }, []);

    const handleFeaturePress = (featureId: ProfileFeatureId) => {
        navigation.navigate(featureId);
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            refreshControl={
                <RefreshControl
                    tintColor={colors.accent}
                    colors={[colors.accent]}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }
        >
            <ProfileHeader
                username="PierzAustn"
                userId="824-320-297"
                onPressEditProfile={() => navigation.navigate('EditProfile')}
                onPressSettings={() => navigation.navigate('ProfileSettings')}
                onPressId={() => navigation.navigate('ProfileIdDetails')}
            />

            <ProfileStatsRow
                following={0}
                fans={0}
                visitors={0}
                companions={0}
                onPressFollowing={() => navigation.navigate('ProfileFollowing')}
                onPressFans={() => navigation.navigate('ProfileFans')}
                onPressVisitors={() => navigation.navigate('ProfileVisitors')}
                onPressCompanions={() => navigation.navigate('ProfileCompanions')}
            />

            <ProfileTasksSection
                onPressTaskCenter={() => navigation.navigate('ProfileTaskCenter')}
                onPressMoreTasks={() => navigation.navigate('ProfileTaskCenter')}
                onPressCheckIn={() =>
                    navigation.navigate('ProfileCheckInCenter')
                }
            />

            <ProfileFeatureGrid onPressFeature={handleFeaturePress} />

            <ProfileAccountCard
                diamonds={0}
                goldenBeans={50}
                onPressAccount={() => navigation.navigate('ProfileAccount')}
                onPressDiamonds={() => navigation.navigate('ProfileDiamond')}
                onPressGoldenBeans={() =>
                    navigation.navigate('ProfileGoldenBean')
                }
            />

            <View style={styles.bottomSpacer} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xl,
    },
    bottomSpacer: {
        height: 32,
    },
});

export default ProfileScreen;

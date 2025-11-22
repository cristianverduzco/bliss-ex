// src/components/profile/ProfileFeatureGrid.tsx

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ListRenderItemInfo,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Card from '../common/Card';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';

export type ProfileFeatureId =
    | 'ProfileBackpack'
    | 'ProfileNobility'
    | 'ProfileMall'
    | 'ProfileGiftWall'
    | 'ProfileFamily'
    | 'ProfileUnion'
    | 'ProfileBadgeWall'
    | 'ProfileFuture'
    | 'ProfileCPHouse'
    | 'ProfileMentorship'
    | 'ProfileHeart';

export interface ProfileFeature {
    id: ProfileFeatureId;
    label: string;
    icon: React.ComponentProps<typeof Ionicons>['name'];
}

interface ProfileFeatureGridProps {
    onPressFeature: (featureId: ProfileFeatureId) => void;
}

const FEATURES: ProfileFeature[] = [
    { id: 'ProfileBackpack', label: 'Backpack', icon: 'briefcase-outline' },
    { id: 'ProfileNobility', label: 'Nobility', icon: 'ribbon-outline' },
    { id: 'ProfileMall', label: 'Mall', icon: 'bag-handle-outline' },
    { id: 'ProfileGiftWall', label: 'Gift Wall', icon: 'gift-outline' },
    { id: 'ProfileFamily', label: 'Family', icon: 'people-outline' },
    { id: 'ProfileUnion', label: 'Union', icon: 'layers-outline' },
    { id: 'ProfileBadgeWall', label: 'Badge Wall', icon: 'medal-outline' },
    { id: 'ProfileFuture', label: 'Future', icon: 'planet-outline' },
    { id: 'ProfileCPHouse', label: 'CP House', icon: 'home-outline' },
    { id: 'ProfileMentorship', label: 'Mentorship', icon: 'school-outline' },
    { id: 'ProfileHeart', label: 'Heart', icon: 'heart-outline' },
];

const ProfileFeatureGrid: React.FC<ProfileFeatureGridProps> = ({
                                                                   onPressFeature,
                                                               }) => {
    const renderItem = ({ item }: ListRenderItemInfo<ProfileFeature>) => (
        <TouchableOpacity
            key={item.id}
            style={styles.item}
            activeOpacity={0.8}
            onPress={() => onPressFeature(item.id)}
        >
            <View style={styles.iconWrapper}>
                <Ionicons
                    name={item.icon}
                    size={22}
                    color={colors.accentSecondary}
                />
            </View>
            <Text style={styles.label} numberOfLines={1}>
                {item.label}
            </Text>
        </TouchableOpacity>
    );

    return (
        <Card style={styles.card}>
            <FlatList
                data={FEATURES}
                renderItem={renderItem}
                numColumns={4}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                columnWrapperStyle={styles.row}
            />
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: spacing.lg,
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: spacing.lg,
    },
    item: {
        width: '24%',
        alignItems: 'center',
    },
    iconWrapper: {
        width: 42,
        height: 42,
        borderRadius: 21,
        marginBottom: spacing.sm,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1e1e2b',
    },
    label: {
        fontSize: 11,
        color: colors.textSecondary,
        textAlign: 'center',
    },
});

export default ProfileFeatureGrid;

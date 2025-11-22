// src/components/common/IconButton.tsx

import React from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    ViewStyle,
    StyleProp,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';

export interface IconButtonProps {
    name: React.ComponentProps<typeof Ionicons>['name'];
    size?: number;
    color?: string;
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
}

const IconButton: React.FC<IconButtonProps> = ({
                                                   name,
                                                   size = 20,
                                                   color = colors.textPrimary,
                                                   onPress,
                                                   style,
                                               }) => {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            style={[styles.root, style]}
        >
            <Ionicons name={name} size={size} color={color} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    root: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.06)',
    },
});

export default IconButton;

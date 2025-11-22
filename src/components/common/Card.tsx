// src/components/common/Card.tsx

import React from 'react';
import {
    View,
    StyleSheet,
    StyleProp,
    ViewStyle,
    TouchableOpacity,
    GestureResponderEvent,
} from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';

export interface CardProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    onPress?: (event: GestureResponderEvent) => void;
    disabled?: boolean;
}

const Card: React.FC<CardProps> = ({
                                       children,
                                       style,
                                       onPress,
                                       disabled,
                                   }) => {
    if (onPress) {
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={onPress}
                disabled={disabled}
                style={[styles.card, style]}
            >
                {children}
            </TouchableOpacity>
        );
    }

    return <View style={[styles.card, style]}>{children}</View>;
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 18,
        backgroundColor: colors.card,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderWidth: 1,
        borderColor: colors.borderSubtle,
    },
});

export default Card;

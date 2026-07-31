import React from 'react';
import { router } from 'expo-router';

import { Pressable, StyleSheet } from 'react-native';
import Animated, {
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

import Flex from '#/Flex';
import Text from '#/Text';
import Button from '#/controls/Button';
import SearchArticle from '#/display/SearchArticle';

import { Certification } from '#/icons';

import { useTheme } from '@/src/lib/hooks/useTheme'


interface NotificationRowProps {
    left?: React.ReactNode;
    title?: string;
    avatar?: React.ReactNode;
    user?: {
        userName?: string;
        userCertified?: boolean;
        certificationColor?: string;
    };
    itemImage?: string;
    itemName?: string;
    timestamp?: string;
    actionLink?: string;
    pressable?: boolean;
}


const NotificationRow: React.FC<NotificationRowProps> = ({
    left,
    title,
    avatar,
    user,
    itemImage,
    itemName,
    timestamp,
    actionLink,
    pressable = true,
}) => {
    const { activeTheme } = useTheme();

    const pressedValue = useSharedValue(0);

    const handlePressIn = () => { pressedValue.value = withTiming(1, { duration: 150 }) };
    const handlePressOut = () => { pressedValue.value = withTiming(0, { duration: 150 }) };

    const animatedStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(
                pressedValue.value,
                [0, 1],
                [
                    activeTheme.colors.surface.secondary,
                    activeTheme.colors.surface.neutralLight
                ]
            ),
        };
    });


    const handlePressVoir = () => {
        if (!actionLink) return;
        router.push({
            pathname: actionLink,
            // params: {
            //     id: 1,
            // },
        });
    };

    return (
        <Animated.View style={[styles.container, animatedStyle, { borderRadius: activeTheme.radius.card, padding: activeTheme.spacing._100 }]}>
            <Pressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
            >
                <Flex direction='row' gap={activeTheme.spacing._50}>

                    {left && <Flex direction='column' alignItems='flex-end' justifyContent='flex-end' style={{ width: activeTheme.spacing._500 }}>{left}</Flex>}

                    <Flex direction='column' gap={activeTheme.spacing._100} style={{ flex: 1, margin: 'auto' }}>
                        <Flex direction='column' gap={activeTheme.spacing._50} alignItems='flex-start'>
                            {avatar && <Flex>{avatar}</Flex>}

                            <Flex direction="row" alignItems="center">
                                <Text variant="body_Medium">
                                    {user?.userName && (<>
                                        {user?.userName}
                                    </>)}
                                    {user?.userCertified && (
                                        <Flex direction='row' style={{ width: 20, height: 10, justifyContent: 'center', overflow: 'visible' }}>
                                            <Certification
                                                filled
                                                color={activeTheme.colors.icon[user?.certificationColor as keyof typeof activeTheme.colors.icon]}
                                                size={20}
                                                style={{ position: 'absolute', top: 0, transform: [{ translateY: '-25%' }] }} // On la recentre verticalement
                                            />
                                        </Flex>
                                    )}
                                    {user?.userCertified || user?.userName ? (<>{' '}</>) : null}
                                    {title}
                                </Text>
                            </Flex>
                        </Flex>

                        {itemImage || itemName || actionLink ? (
                            <Flex direction='row' justifyContent='flex-start' alignItems='flex-start' gap={activeTheme.spacing._100}>
                                {itemImage && <SearchArticle imageSrc={itemImage} />}
                                {itemName && <Text variant='title_Small'>{itemName}</Text>}
                                {actionLink && <Button variant='secondary' label='Voir' size='small' onPress={() => handlePressVoir()} />}
                            </Flex>
                        ) : null}
                    </Flex>

                </Flex>
            </Pressable>
        </Animated.View>
    );
};

export default NotificationRow;

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
});

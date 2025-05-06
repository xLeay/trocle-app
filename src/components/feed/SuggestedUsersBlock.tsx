import { useRef, useState } from "react";
import { StyleSheet } from "react-native";
import { Image } from 'expo-image';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

import { useTheme } from '@/src/lib/hooks/useTheme';
import { Product, User } from "@/src/types/feed";

import Flex from "#/Flex";
import Grid from "#/Grid";
import Text from "#/Text";
import Button from '#/controls/Button';
import Card from "#/Card";
import Avatar from "#/display/Avatar";

import { Heart, State1, State2, State3, State4, Star0, Star05, Star1, Certification, Plusvert } from '#/icons';


interface SuggestedUsersBlockProps {
    users: User[];
}

const SuggestedUsersBlock: React.FC<SuggestedUsersBlockProps> = ({
    users,
}) => {
    const { activeTheme } = useTheme();

    // user.profilePicture

    return (
        <Flex
            // border
            // borderColor="blue"
            gap={activeTheme.spacing._100}
            style={{
                width: '100%',
                flex: 1,
                paddingHorizontal: activeTheme.spacing._200,
                backgroundColor: activeTheme.colors.surface.primary,
            }}>

            <Flex
                // border
                // borderColor="red"
                style={{ width: '100%' }}
            >
                <Flex
                    scroll
                    direction="row"
                    gap={activeTheme.spacing._100}
                    style={{ width: '100%' }}
                >
                    {users.map(user => (
                        <Card
                            key={user.id}
                            gap={activeTheme.spacing._100}
                            width={160}
                        >
                            {/* <Avatar size="enormous" customImage={require('@/assets/icon.png')} /> */}
                            <Avatar size="enormous" customImage={user.image} />
                            <Flex>
                                <Text variant="body_Large">{user.username}</Text>
                                <Flex direction="row" gap={activeTheme.spacing._50}>
                                    <Flex direction="row">
                                        <Text variant="body_Small">4,8</Text>
                                        <Star1 size={16} />
                                    </Flex>
                                    <Text variant="body_Small">(48)</Text>
                                </Flex>
                            </Flex>
                            <Button size="large" label="Suivre" variant="secondary" />
                        </Card>
                    ))}
                </Flex>

            </Flex>
        </Flex>
    );
}

export default SuggestedUsersBlock

const styles = StyleSheet.create({
    item: {
        width: '100%',
        height: 140,
    },
    image: {
        width: '100%',
        height: '100%',
    },
});

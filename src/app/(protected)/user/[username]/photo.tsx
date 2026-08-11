import { Stack, router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/src/lib/hooks/useTheme';
import { ThemeScope } from '@/src/lib/providers/ThemeScope';
import useTopAppBar from '@/src/lib/hooks/useTopAppBar';

import CustomSafeAreaView from '#/CustomSafeAreaView';
import Flex from '#/Flex';
import ImageRatio from '#/display/ImageRatio';
import Text from '#/Text';
import TopAppBar from '#/display/TopAppBar/TopAppBar';

import { Plusvert } from '#/icons'

const MOCK_USER = {
    banner: require('@/assets/profile_banner.png'),
    avatar: require('@/assets/icon.png'),
};

export default function ProfilePhoto() {
    return (
        <ThemeScope theme="dark">
            <ProfilePhotoContent />
        </ThemeScope>
    );
}

function ProfilePhotoContent() {
    const { activeTheme } = useTheme();
    const { username, kind } = useLocalSearchParams<{
        username: string;
        kind: 'banner' | 'avatar';
    }>();

    const source =
        kind === 'avatar'
            ? MOCK_USER.avatar
            : MOCK_USER.banner;

    const canGoBack = router.canGoBack();
    const onBack = () => { canGoBack && router.back() };

    const { left, center, right } = useTopAppBar('_small', {
        outlinedButtons: true,
        canGoBack,
        onBack,
        rightArea: [
            { iconName: Plusvert, onPress: () => alert("Plus !"), },
        ],
    });

    return (
        <CustomSafeAreaView
            edges={['top', 'left', 'right', 'bottom']}
            style={{ backgroundColor: 'black' }}
        >
            <Stack.Screen
                options={{
                    headerShown: false,
                    statusBarStyle: 'inverted',
                }}
            />

            <TopAppBar
                invertedStyle
                backgroundTransparent
                left={left}
                center={center}
                right={right}
            />

            <Flex
                fullWidth
                justifyContent="center"
                alignItems="center"
                style={{ flex: 1 }}
            >
                <ImageRatio
                    ratio={kind === 'avatar' ? '1:1' : 'banner'}
                    source={source}
                />
            </Flex>
        </CustomSafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { StyleSheet } from 'react-native';

import { useTheme } from '@/src/lib/hooks/useTheme';
import useTopAppBar from '@/src/lib/hooks/useTopAppBar';
import { ThemeScope } from '@/src/lib/providers/ThemeScope';

import CustomSafeAreaView from '#/CustomSafeAreaView';
import Flex from '#/Flex';
import ImageRatio from '#/display/ImageRatio';
import TopAppBar from '#/display/TopAppBar/TopAppBar';

import { Plusvert } from '#/icons';

export default function ProfilePhoto() {
    return (
        <ThemeScope theme="dark">
            <ProfilePhotoContent />
        </ThemeScope>
    );
}

function ProfilePhotoContent() {
    const { activeTheme } = useTheme();

    const { username, kind, photo } = useLocalSearchParams<{
        username: string;
        kind: 'banner' | 'avatar';
        photo: string;
    }>();

    const source = photo;

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
            style={{ backgroundColor: 'black' }}
        >
            <Stack.Screen
                options={{
                    headerShown: false,
                    statusBarStyle: 'inverted',
                }}
            />

            <TopAppBar
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
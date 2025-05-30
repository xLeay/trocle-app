import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';
import { SystemBars } from 'react-native-edge-to-edge';

import { usePhotoContext } from '#/context/PhotoContext';
import { useTheme } from '@/src/lib/hooks/useTheme';
import { useGoBack } from '@/src/lib/hooks/useGoBack';
import useTopAppBar from '@/src/lib/hooks/useTopAppBar';

import Flex from '#/Flex';
import Text from '#/Text';
import Button from '#/controls/Button';
import TopAppBar from '@/src/components/display/TopAppBar/TopAppBar';
import ImageRatio from '#/display/ImageRatio';

import { Arrowleft, Done } from '#/icons';
import { useState } from 'react';


export default function ProductImageModal() {
    const { theme, activeTheme } = useTheme();

    // Config de la top app bar
    const topAppBarConfig = "_small";
    const canGoBack = true;
    const onBack = useGoBack();

    const { left, center, right } = useTopAppBar(topAppBarConfig, {
        iconName: Arrowleft,
        canGoBack,
        onBack,
        label: '',
        rightArea: [
            {
                label: 'Appliquer',
                iconName: Done,
                iconPosition: 'right',
                onPress: () => router.back(),
            },
        ],
    });

    const router = useRouter();
    const { uri, index } = useLocalSearchParams<{ uri: string; index: string }>();

    const photoContext = usePhotoContext();
    if (!photoContext) throw new Error("PhotoContext absent du provider");

    const { photos, setPhotos } = photoContext;

    const idx = Number(index);


    const [isBlack, setIsBlack] = useState(false);
    const toggleBlack = () => {
        SystemBars.setHidden(!isBlack);
        setIsBlack(!isBlack);
    }

    return (
        <Flex style={[
            styles.container,
            {
                backgroundColor: activeTheme.colors.surface.secondary,
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
            }
        ]}
        >
            <Stack.Screen
                options={{
                    header: () => (
                        <TopAppBar
                            left={left}
                            center={center}
                            right={right}
                            style={{
                                backgroundColor: 'transparent',
                            }}
                        />
                    ),
                }}
            />
            <Flex
                alignItems="center"
                justifyContent="center"
                style={{
                    flex: 1,
                    width: '100%',
                    backgroundColor: 'rgba(0,0,0,0.85)',
                }}
            >
                <Button label="Mettre en noir" onPress={toggleBlack} />
                <ImageRatio
                    ratio="cover"
                    source={{ uri }}
                    style={{
                        width: 320,
                        maxWidth: '90%',
                        borderRadius: 16,
                        borderWidth: 2,
                        borderColor: '#fff',
                    }}
                    contentFit="contain"
                    transition={500}
                />
                <Flex direction="row" gap={16} style={{ marginTop: 24 }}>
                    <Button
                        label="Supprimer"
                        variant="danger"
                        onPress={() => {
                            setPhotos(photos.filter((_, i) => i !== idx));
                            router.back();
                        }}
                    />
                    <Button
                        label="Editer"
                        variant="outlined"
                        onPress={() => {
                            router.push(`/modal/productImage?index=${idx}`);
                        }}
                    />
                </Flex>
            </Flex>
        </Flex>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
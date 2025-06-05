import { useEffect, useState } from 'react';
import { StyleSheet, Image } from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { SaveFormat, useImageManipulator } from 'expo-image-manipulator';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

import { usePhotoContext } from '#/context/PhotoContext';
import { useTheme } from '@/src/lib/hooks/useTheme';
import { useGoBack } from '@/src/lib/hooks/useGoBack';
import useTopAppBar from '@/src/lib/hooks/useTopAppBar';

import Flex from '#/Flex';
import Text from '#/Text';
import TopAppBar from '#/display/TopAppBar/TopAppBar';
import CropBox from '#/display/CropBox';
import Slider from '#/controls/Slider';

import { Close, Done } from '#/icons';

const CROP_BOX_SIZE = 300;
const MIN_SCALE = 1;
const MAX_SCALE = 4;

export default function CropImage() {
    const { activeTheme } = useTheme();

    // Config de la top app bar
    const topAppBarConfig = "_small";
    const canGoBack = true;
    const onBack = useGoBack();

    const { left, center, right } = useTopAppBar(topAppBarConfig, {
        iconName: Close,
        canGoBack,
        onBack,
        label: '',
        rightArea: [
            {
                label: 'Appliquer',
                iconName: Done,
                iconPosition: 'right',
                onPress: () => handleApplyCrop(),
            },
        ],
    });


    const { index } = useLocalSearchParams<{ index: string }>();
    const idx = Number(index);
    const router = useRouter();

    const photoContext = usePhotoContext();
    if (!photoContext) return null;

    const { photos, setPhotos } = photoContext;
    const image = photos[idx];
    const ctx = useImageManipulator(image.uri);

    const [cropBox, setCropBox] = useState({
        x: 50,
        y: 50,
        width: CROP_BOX_SIZE,
        height: CROP_BOX_SIZE,
    });

    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const scale = useSharedValue(1);
    const [scaleUI, setScaleUI] = useState(1);
    const [layout, setLayout] = useState({ width: 0, height: 0 });

    const handlePanGesture = Gesture.Pan()
        .onChange((event) => {
            const nextX = translateX.value + event.changeX;
            const nextY = translateY.value + event.changeY;

            // image dimensions après zoom
            const imageDisplayWidth = layout.width * scale.value;
            const imageDisplayHeight = layout.height * scale.value;

            const maxOffsetX = (imageDisplayWidth - CROP_BOX_SIZE) / 2;
            const maxOffsetY = (imageDisplayHeight - CROP_BOX_SIZE) / 2;

            translateX.value = Math.min(Math.max(nextX, -maxOffsetX), maxOffsetX);
            translateY.value = Math.min(Math.max(nextY, -maxOffsetY), maxOffsetY);
        });

    const handlePinchGesture = Gesture.Pinch()
        .onChange((event) => {
            scale.value = Math.min(Math.max(event.scale, MIN_SCALE), MAX_SCALE);
            setScaleUI(scale.value);
        });

    const gesture = Gesture.Race(handlePanGesture, handlePinchGesture);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { scale: scale.value },
        ],
    }));


    const handleApplyCrop = async () => {
        try {
            console.log("→ Début du crop");

            const { width: imgWidth, height: imgHeight } = await new Promise<{ width: number; height: number }>((resolve, reject) => {
                Image.getSize(
                    image.uri,
                    (w, h) => resolve({ width: w, height: h }),
                    (err) => reject(err)
                );
            });

            console.log("Taille réelle de l'image :", imgWidth, imgHeight);

            const ratioX = imgWidth / CROP_BOX_SIZE;
            const ratioY = imgHeight / CROP_BOX_SIZE;

            const rawCropWidth = CROP_BOX_SIZE * ratioX / scale.value;
            const rawCropHeight = CROP_BOX_SIZE * ratioY / scale.value;

            const rawOriginX = (-translateX.value * ratioX) / scale.value;
            const rawOriginY = (-translateY.value * ratioY) / scale.value;

            const originX = Math.max(0, rawOriginX);
            const originY = Math.max(0, rawOriginY);

            const cropWidth = Math.min(rawCropWidth, imgWidth - originX);
            const cropHeight = Math.min(rawCropHeight, imgHeight - originY);

            console.log("Zone sécurisée de crop :", { originX, originY, cropWidth, cropHeight });

            ctx.crop({
                originX,
                originY,
                width: cropWidth,
                height: cropHeight,
            });

            const manipulated = await ctx.renderAsync();
            const result = await manipulated.saveAsync({ format: SaveFormat.PNG });

            const newPhotos = [...photos];
            newPhotos[idx] = { ...newPhotos[idx], uri: result.uri };
            setPhotos(newPhotos);

            console.log("Crop appliqué :", result.uri);
            router.back();
        } catch (err) {
            console.error("Erreur pendant le crop sécurisé :", err);
        }
    };

    return (
        <Flex alignItems='center' justifyContent='center' style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.9)' }}>
            <Stack.Screen
                options={{
                    header: () => (
                        <TopAppBar
                            left={left}
                            center={center}
                            right={right}
                        // style={{ zIndex: 10 }}
                        />
                    ),
                }}
            />

            <GestureDetector gesture={gesture}>
                <Animated.View
                    onLayout={(e) => {
                        const { width, height } = e.nativeEvent.layout;
                        setLayout({ width, height });
                    }}
                    style={{ width: '100%', height: '100%' }}
                >
                    <Animated.Image
                        source={{ uri: image.uri }}
                        style={[
                            {
                                width: '100%',
                                height: '100%',
                            },
                            animatedStyle
                        ]}
                        resizeMode="contain"
                    />
                </Animated.View>
            </GestureDetector>

            <CropBox cropBox={cropBox} setCropBox={setCropBox} />

            <Flex
                direction='row'
                alignItems='center'
                justifyContent='center'
                style={{
                    height: activeTheme.spacing._600,
                    backgroundColor: 'cyan',
                    width: '100%',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 10
                }}
            >
                <Slider
                    min={MIN_SCALE}
                    max={MAX_SCALE}
                    value={scaleUI}
                    onChange={(value) => {
                        setScaleUI(value);
                        scale.value = value;
                    }}
                />

                <Text type='brand'>{scaleUI}</Text>
            </Flex>

        </Flex>
    );
}

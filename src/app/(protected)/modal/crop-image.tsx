import { SaveFormat, useImageManipulator } from 'expo-image-manipulator';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { usePhotoContext } from '#/context/PhotoContext';
import { useGoBack } from '@/src/lib/hooks/useGoBack';
import { useTheme } from '@/src/lib/hooks/useTheme';
import useTopAppBar from '@/src/lib/hooks/useTopAppBar';

import { PRODUCT_IMAGE_SIZE } from '@/src/lib/utils/image';

import Flex from '#/Flex';
import Slider from '#/controls/Slider';
import CropBox from '#/display/CropBox';
import TopAppBar from '#/display/TopAppBar/TopAppBar';

import { Close, Done } from '#/icons';

const CROP_BOX_WIDTH = 300;
const CROP_BOX_HEIGHT = Math.round((CROP_BOX_WIDTH * 120) / 127);

const MIN_SCALE = 1;
const MAX_SCALE = 4;

const clamp = (value: number, min: number, max: number) => {
    'worklet';
    return Math.min(Math.max(value, min), max);
};

export default function CropImage() {
    const { activeTheme } = useTheme();

    // Config TopAppBar
    const topAppBarConfig = '_small';
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

    const [cropBox] = useState({
        width: CROP_BOX_WIDTH,
        height: CROP_BOX_HEIGHT,
    });

    const [imageDimensions, setImageDimensions] = useState({
        width: image.width || 0,
        height: image.height || 0,
    });

    useEffect(() => {
        if (!image.width || !image.height) {
            Image.getSize(
                image.uri,
                (width, height) => setImageDimensions({ width, height }),
                (err) => console.error('Erreur dimensions image', err)
            );
        } else {
            setImageDimensions({ width: image.width, height: image.height });
        }
    }, [image.uri, image.width, image.height]);

    // baseScale pour que l'image à 1x recouvre exactement toute la CropBox
    const baseScale =
        imageDimensions.width && imageDimensions.height
            ? Math.max(
                cropBox.width / imageDimensions.width,
                cropBox.height / imageDimensions.height
            )
            : 1;

    const baseWidth = imageDimensions.width * baseScale;
    const baseHeight = imageDimensions.height * baseScale;

    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const scale = useSharedValue(1);
    const [scaleUI, setScaleUI] = useState(1);

    const handlePanGesture = Gesture.Pan().onChange((event) => {
        if (!baseWidth || !baseHeight) return;

        const currentScale = scale.value;
        const currentWidth = baseWidth * currentScale;
        const currentHeight = baseHeight * currentScale;

        // Limites pour ne jamais laisser de trou dans la cropBox
        const maxOffsetX = Math.max(0, (currentWidth - cropBox.width) / 2);
        const maxOffsetY = Math.max(0, (currentHeight - cropBox.height) / 2);

        const nextX = translateX.value + event.changeX;
        const nextY = translateY.value + event.changeY;

        translateX.value = clamp(nextX, -maxOffsetX, maxOffsetX);
        translateY.value = clamp(nextY, -maxOffsetY, maxOffsetY);
    });

    const pinchStartScale = useSharedValue(1);
    const handlePinchGesture = Gesture.Pinch()
        .onBegin(() => {
            pinchStartScale.value = scale.value;
        })
        .onChange((event) => {
            const nextScale = clamp(
                pinchStartScale.value * event.scale,
                MIN_SCALE,
                MAX_SCALE
            );

            scale.value = nextScale;
            scheduleOnRN(setScaleUI, nextScale);

            // Recentrer / réajuster le pan si on dézoome
            const currentWidth = baseWidth * nextScale;
            const currentHeight = baseHeight * nextScale;
            const maxOffsetX = Math.max(0, (currentWidth - cropBox.width) / 2);
            const maxOffsetY = Math.max(0, (currentHeight - cropBox.height) / 2);

            translateX.value = clamp(translateX.value, -maxOffsetX, maxOffsetX);
            translateY.value = clamp(translateY.value, -maxOffsetY, maxOffsetY);
        });

    const gesture = Gesture.Simultaneous(handlePanGesture, handlePinchGesture);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { scale: scale.value },
        ],
    }));

    const handleApplyCrop = async () => {
        try {
            if (!imageDimensions.width || !imageDimensions.height) return;

            const totalScale = baseScale * scale.value;

            // Dimensions de l'image affichée à l'écran
            const displayWidth = imageDimensions.width * totalScale;
            const displayHeight = imageDimensions.height * totalScale;

            // Calcul du coin supérieur gauche de la cropBox sur l'image à l'écran
            const cropLeftOnDisplay = (displayWidth - cropBox.width) / 2 - translateX.value;
            const cropTopOnDisplay = (displayHeight - cropBox.height) / 2 - translateY.value;

            // Conversion vers les coordonnées de l'image originale
            const originX = cropLeftOnDisplay / totalScale;
            const originY = cropTopOnDisplay / totalScale;
            const rawWidth = cropBox.width / totalScale;
            const rawHeight = cropBox.height / totalScale;

            const finalOriginX = Math.max(0, Math.min(originX, imageDimensions.width - rawWidth));
            const finalOriginY = Math.max(0, Math.min(originY, imageDimensions.height - rawHeight));

            ctx.crop({
                originX: Math.round(finalOriginX),
                originY: Math.round(finalOriginY),
                width: Math.round(rawWidth),
                height: Math.round(rawHeight),
            }).resize({
                width: PRODUCT_IMAGE_SIZE.width,
                height: PRODUCT_IMAGE_SIZE.height,
            })

            const renderedImage = await ctx.renderAsync();
            const result = await renderedImage.saveAsync({
                format: SaveFormat.JPEG,
                compress: 0.8,
            });

            const newPhotos = [...photos];
            newPhotos[idx] = {
                ...newPhotos[idx],
                uri: result.uri,
                width: Math.round(rawWidth),
                height: Math.round(rawHeight),
            };

            setPhotos(newPhotos);
            router.back();
        } catch (error) {
            console.error('Erreur crop image :', error);
        }
    };

    const updateScale = (newScale: number) => {
        setScaleUI(newScale);
        scale.value = newScale;

        const currentWidth = baseWidth * newScale;
        const currentHeight = baseHeight * newScale;
        const maxOffsetX = Math.max(0, (currentWidth - cropBox.width) / 2);
        const maxOffsetY = Math.max(0, (currentHeight - cropBox.height) / 2);

        translateX.value = clamp(translateX.value, -maxOffsetX, maxOffsetX);
        translateY.value = clamp(translateY.value, -maxOffsetY, maxOffsetY);
    };


    return (
        <Flex
            alignItems="center"
            justifyContent="center"
            style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
        >
            <Stack.Screen
                options={{
                    header: () => (
                        <TopAppBar
                            left={left}
                            center={center}
                            right={right}
                        />
                    ),
                }}
            />

            {/* Zone de l'image centrée sous la CropBox */}
            {baseWidth > 0 && (
                <GestureDetector gesture={gesture}>
                    <Animated.View
                        style={[
                            {
                                width: baseWidth,
                                height: baseHeight,
                                position: 'absolute',
                            },
                            animatedStyle,
                        ]}
                    >
                        <Image
                            source={{ uri: image.uri }}
                            style={{ width: '100%', height: '100%' }}
                            resizeMode="stretch"
                        />
                    </Animated.View>
                </GestureDetector>
            )}

            {/* Masque CropBox au dessus */}
            <CropBox cropBox={cropBox} />

            {/* Slider de zoom */}
            <Flex
                direction='row'
                alignItems='center'
                justifyContent='space-between'
                style={{
                    height: activeTheme.spacing._600,
                    backgroundColor: activeTheme.colors.surface.secondary,
                    width: '100%',
                    paddingHorizontal: activeTheme.spacing._200,
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
                    onChange={updateScale}
                />
            </Flex>
        </Flex>
    );
}

import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { ActivityIndicator, Keyboard, Pressable } from 'react-native';
import Animated, {
    FadeIn,
    FadeOut,
    LinearTransition
} from 'react-native-reanimated';

import { useTheme } from '@/src/lib/hooks/useTheme';

import Flex from '#/Flex';
import Text from '#/Text';
import Button from '#/controls/Button';
import ImageRatio from '#/display/ImageRatio';
import Tooltip from '#/display/Tooltip';
import { Close, Photo, Plus } from '#/icons';

interface CreationPhotosSectionProps {
    photos: ImagePicker.ImagePickerAsset[];
    loadingPhotos: boolean;
    maxPhotos: number;
    onAddPhotoPress: () => void;
    onRemovePhoto: (index: number) => void;
}

export default function CreationPhotosSection({
    photos,
    loadingPhotos,
    maxPhotos,
    onAddPhotoPress,
    onRemovePhoto,
}: CreationPhotosSectionProps) {
    const { activeTheme } = useTheme();
    const router = useRouter();

    const gotPhotos = photos.length > 0;

    return (
        <Flex gap={activeTheme.spacing._200} style={{ paddingHorizontal: activeTheme.spacing._200, width: '100%' }}>
            {/* Textes d'en-tête */}
            <Flex gap={activeTheme.spacing._100}>
                <Text variant='title_Large' type='primary'>Ajoute des photos à ton article</Text>
                {!gotPhotos && (
                    <Text variant='body_Small' type='secondary'>
                        Tu peux ajouter jusqu'à {maxPhotos} photos. N'hésite pas, cela permet de mettre en valeur tes articles et augmenter ton nombre d'échanges.
                    </Text>
                )}
            </Flex>

            <Flex
                direction={gotPhotos || loadingPhotos ? 'row' : 'column'}
                style={{ width: gotPhotos || loadingPhotos ? '100%' : undefined }}
            >
                {loadingPhotos ? (
                    <Flex alignItems="center" justifyContent="center" style={{ width: '100%', height: 100 }}>
                        <ActivityIndicator size="large" color={activeTheme.colors.icon.primary} />
                    </Flex>
                ) : gotPhotos ? (
                    <Flex gap={activeTheme.spacing._100} style={{ width: '100%' }}>
                        <Flex direction='row'>
                            {/* Scroll horizontal */}
                            <Flex
                                scroll
                                direction='row'
                                alignItems='center'
                                gap={activeTheme.spacing._400}
                                style={{
                                    width: '100%',
                                    borderTopRightRadius: activeTheme.radius.default,
                                    borderBottomRightRadius: activeTheme.radius.default,
                                }}
                            >
                                {/* Photos list */}
                                <Flex direction='row' gap={activeTheme.spacing._200}>
                                    {photos.map((photo, index) => (
                                        <Animated.View
                                            key={photo.uri}
                                            entering={FadeIn.duration(200)}
                                            exiting={FadeOut.duration(200)}
                                            layout={LinearTransition}
                                            style={{
                                                width: 127,
                                                borderRadius: activeTheme.radius.default,
                                                overflow: 'hidden',
                                            }}
                                        >
                                            <ImageRatio
                                                ratio='cover'
                                                source={{ uri: photo.uri }}
                                                style={{
                                                    borderRadius: activeTheme.radius.default,
                                                }}
                                                contentFit="cover"
                                                transition={1000}
                                                onPress={() => {
                                                    router.push({
                                                        pathname: '/modal/product-image',
                                                        params: { uri: photo.uri, index },
                                                    });
                                                }}
                                            />

                                            <Flex
                                                alignItems='center'
                                                justifyContent='center'
                                                style={{
                                                    position: 'absolute',
                                                    top: activeTheme.spacing._100,
                                                    right: activeTheme.spacing._100,
                                                    backgroundColor: activeTheme.colors.icon.invert,
                                                    height: 24,
                                                    width: 24,
                                                    borderRadius: 12,
                                                }}
                                            >
                                                <Pressable hitSlop={4} onPress={() => onRemovePhoto(index)}>
                                                    <Close color={activeTheme.colors.icon.primary} />
                                                </Pressable>
                                            </Flex>
                                        </Animated.View>
                                    ))}
                                </Flex>

                                {/* Bouton Ajouter supplémentaire (+) */}
                                <Tooltip content='Ajouter des photos'>
                                    <Button
                                        variant='outlined'
                                        size='large'
                                        icon={<Plus />}
                                        onPress={() => {
                                            Keyboard.dismiss();
                                            onAddPhotoPress();
                                        }}
                                        disabled={photos.length >= maxPhotos}
                                    />
                                </Tooltip>

                                <Flex style={{ width: 0, height: 20 }} />
                            </Flex>
                        </Flex>

                        {/* Compteur de photos */}
                        <Flex>
                            <Text variant='body_Small' type='secondary'>{photos.length}/{maxPhotos}</Text>
                        </Flex>
                    </Flex>
                ) : (
                    <Button
                        label='Ajouter photo'
                        variant='secondary'
                        size='large'
                        icon={<Photo />}
                        onPress={() => {
                            Keyboard.dismiss();
                            onAddPhotoPress();
                        }}
                    />
                )}
            </Flex>
        </Flex>
    );
}

import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';

import { optimizeImage, PRODUCT_IMAGE_SIZE } from '@/src/lib/utils/image';

import { useSnackbarStore } from '@/src/state/snackbarStore';

import { usePhotoContext } from '#/context/PhotoContext';

export const MAX_PHOTOS = 10;

export function useProductPhotos() {
    const photoContext = usePhotoContext();
    if (!photoContext) throw new Error('PhotoContext absent du provider');

    const { photos, setPhotos } = photoContext;
    const [loadingPhotos, setLoadingPhotos] = useState(false);
    const addSnackbar = useSnackbarStore((state) => state.addSnackbar);

    const handleAddPhoto = async (type: 'camera' | 'library') => {
        if (photos.length >= MAX_PHOTOS) return;

        setLoadingPhotos(true);

        try {
            const permission =
                type === 'camera'
                    ? await ImagePicker.requestCameraPermissionsAsync()
                    : await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (permission.status !== 'granted') {
                addSnackbar({
                    message:
                        type === 'camera'
                            ? 'Autorise la caméra pour prendre une photo'
                            : 'Autorise la galerie pour choisir une photo',
                    type: 'error',
                    position: 'bottom',
                });

                return;
            }

            const result =
                type === 'camera'
                    ? await ImagePicker.launchCameraAsync({
                        mediaTypes: 'images',
                        allowsEditing: true,
                        aspect: [127, 120],
                        quality: 1,
                    })
                    : await ImagePicker.launchImageLibraryAsync({
                        mediaTypes: 'images',
                        allowsMultipleSelection: true,
                        selectionLimit: MAX_PHOTOS - photos.length,
                        quality: 1,
                    });

            if (result.canceled) return;

            const optimizedPhotos: ImagePicker.ImagePickerAsset[] = [];

            for (const asset of result.assets) {
                const optimized = await optimizeImage(asset, PRODUCT_IMAGE_SIZE);

                optimizedPhotos.push({
                    ...asset,
                    uri: optimized.uri,
                    width: optimized.width,
                    height: optimized.height,
                });
            }

            setPhotos([
                ...photos,
                ...optimizedPhotos.slice(0, MAX_PHOTOS - photos.length),
            ]);

            const photosCount = optimizedPhotos.length;
            const snackbarMessage =
                photosCount > 1 ? `${photosCount} photos ajoutées` : `1 photo ajoutée`;

            addSnackbar({
                message: `${snackbarMessage}, n'hésite pas à les recadrer`,
                type: 'info',
                position: 'bottom',
                duration: 4000,
            });
        } catch (error) {
            console.error('Erreur ajout photo produit :', error);

            addSnackbar({
                message: "Impossible d'ajouter cette photo",
                type: 'error',
                position: 'bottom',
            });
        } finally {
            setLoadingPhotos(false);
        }
    };

    const removePhoto = (indexToRemove: number) => {
        setPhotos(photos.filter((_, i) => i !== indexToRemove));
    };

    return {
        photos,
        setPhotos,
        loadingPhotos,
        maxPhotos: MAX_PHOTOS,
        handleAddPhoto,
        removePhoto,
    };
}

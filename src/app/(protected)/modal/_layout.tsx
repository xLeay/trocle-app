import { Stack } from 'expo-router';
import { useState } from 'react';

import { PhotoContext } from '#/context/PhotoContext';
import CustomSafeAreaView from '#/CustomSafeAreaView';
import { useTheme } from '@/src/lib/hooks/useTheme';

export default function ModalLayout() {
    const { activeTheme } = useTheme();
    const [photos, setPhotos] = useState<any[]>([]);

    return (
        <CustomSafeAreaView style={{ backgroundColor: activeTheme.colors.surface.secondary }}>
            <PhotoContext.Provider value={{ photos, setPhotos }}>
                <Stack>
                    <Stack.Screen name="creation" />
                    <Stack.Screen name="product-image" />
                    <Stack.Screen name="crop-image" />
                </Stack>
            </PhotoContext.Provider>
        </CustomSafeAreaView>
    );
}
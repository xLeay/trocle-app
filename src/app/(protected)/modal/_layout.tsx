import { useState } from 'react';
import { Stack } from 'expo-router';

import CustomSafeAreaView from '#/CustomSafeAreaView';
import { PhotoContext } from '#/context/PhotoContext';

export default function ModalLayout() {
    const [photos, setPhotos] = useState<any[]>([]);

    return (
        <CustomSafeAreaView>
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
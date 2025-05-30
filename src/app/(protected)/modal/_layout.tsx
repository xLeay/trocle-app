import { useState } from 'react';
import { Stack } from 'expo-router';

import { PhotoContext } from '#/context/PhotoContext';

export default function ModalLayout() {
    const [photos, setPhotos] = useState<any[]>([]);

    return (
        <PhotoContext.Provider value={{ photos, setPhotos }}>
            <Stack>
                <Stack.Screen name="creation" />
                <Stack.Screen name="productImage" />
            </Stack>
        </PhotoContext.Provider>
    );
}
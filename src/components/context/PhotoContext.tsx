import { createContext, useContext } from 'react';

export const PhotoContext = createContext<{
    photos: any[];
    setPhotos: (photos: any[]) => void;
} | null>(null);

export const usePhotoContext = () => useContext(PhotoContext);
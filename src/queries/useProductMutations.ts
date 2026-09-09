import { useMutation } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';

import { createProduct, CreateProductInput } from '@/src/lib/api/product';

type CreateProductVariables = {
    input: CreateProductInput;
    photos: ImagePicker.ImagePickerAsset[];
};

export function useCreateProduct() {
    return useMutation({
        mutationFn: ({
            input,
            photos,
        }: CreateProductVariables) =>
            createProduct(input, photos),
    });
}
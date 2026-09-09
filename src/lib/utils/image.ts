import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';

export const AVATAR_SIZE = {
    width: 400,
    height: 400,
    compress: 0.7,
};

export const BANNER_SIZE = {
    width: 1500,
    height: 529,
    compress: 0.7,
};

export const PRODUCT_IMAGE_SIZE = {
    width: 1016,
    height: 960,
    compress: 0.8,
};

export type ImageSize = {
    width: number;
    height: number;
    compress: number;
};

export async function optimizeImage(
    asset: Pick<ImagePicker.ImagePickerAsset, 'uri' | 'width' | 'height'>,
    target: ImageSize
) {
    const sourceRatio = asset.width / asset.height;
    const targetRatio = target.width / target.height;

    const crop =
        sourceRatio > targetRatio
            ? {
                width: asset.height * targetRatio,
                height: asset.height,
                originX: (asset.width - asset.height * targetRatio) / 2,
                originY: 0,
            }
            : {
                width: asset.width,
                height: asset.width / targetRatio,
                originX: 0,
                originY: (asset.height - asset.width / targetRatio) / 2,
            };

    const context = ImageManipulator.ImageManipulator
        .manipulate(asset.uri)
        .crop(crop)
        .resize({
            width: target.width,
            height: target.height,
        });

    const renderedImage = await context.renderAsync();

    return renderedImage.saveAsync({
        format: ImageManipulator.SaveFormat.JPEG,
        compress: target.compress,
    });
}

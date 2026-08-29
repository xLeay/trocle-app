import { Image, ImageProps } from "expo-image";
import React, { memo, useCallback, useState } from "react";
import {
    ActivityIndicator,
    LayoutChangeEvent,
    StyleSheet,
    View
} from "react-native";
import Animated from "react-native-reanimated";

import PressableOverlay from "#/controls/PressableOverlay";

type RatioName =
    | "cover"
    | "1:1"
    | "3:2"
    | "4:3"
    | "2:3"
    | "3:4"
    | "9:16"
    | "16:9"
    | "banner";

export const RATIO_PRESETS: Record<RatioName, number> = {
    cover: 127 / 120,
    "1:1": 1,
    "3:2": 3 / 2,
    "4:3": 4 / 3,
    "2:3": 2 / 3,
    "3:4": 3 / 4,
    "9:16": 9 / 16,
    "16:9": 16 / 9,
    banner: 340 / 120,
};


const AnimatedImage = Animated.createAnimatedComponent(Image);

type AnimatedImageProps = React.ComponentProps<typeof AnimatedImage>;

type ImageRatioProps = {
    ratio?: RatioName;
    style?: any;
    transition?: number;

    /**
     * Si présent, ImageRatio utilise AnimatedImage.
     */
    animatedStyle?: AnimatedImageProps["style"];

    /**
     * Props animées Reanimated, ex: blurRadius.
     */
    animatedProps?: AnimatedImageProps["animatedProps"];

    onPress?: () => void;
    onPressIn?: () => void;
    onPressOut?: () => void;
} & Omit<ImageProps, "style">;

const ImageRatio = ({
    ratio,
    style,
    transition = 250,
    animatedStyle,
    animatedProps,
    onPress,
    onPressIn,
    onPressOut,
    ...props
}: ImageRatioProps) => {
    const [width, setWidth] = useState<number | null>(null);

    const onLayout = useCallback((e: LayoutChangeEvent) => {
        setWidth(e.nativeEvent.layout.width);
    }, []);

    const aspectRatio = RATIO_PRESETS[ratio ?? "cover"];
    const imageStyle = {
        width: "100%" as const,
        height: ratio ? width! / aspectRatio : ("100%" as const),
        ...StyleSheet.flatten(style),
    };

    const isAnimated = !!animatedStyle || !!animatedProps;

    return (
        <View style={styles.container} onLayout={onLayout}>
            {width !== null ? (
                isAnimated ? (
                    <PressableOverlay onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
                        <AnimatedImage
                            {...props}
                            animatedProps={animatedProps}
                            style={[imageStyle, animatedStyle]}
                        />
                    </PressableOverlay>
                ) : (
                    <PressableOverlay onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
                        <Image
                            {...props}
                            transition={transition}
                            style={imageStyle}
                        />
                    </PressableOverlay>
                )
            ) : (
                <ActivityIndicator />
            )}
        </View>
    );
};

export default memo(ImageRatio);

const styles = StyleSheet.create({
    container: {
        width: "100%",
    },
});

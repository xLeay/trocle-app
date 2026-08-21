import { Image, ImageProps } from "expo-image";
import React, { useCallback, useState } from "react";
import {
    ActivityIndicator,
    LayoutChangeEvent,
    Pressable,
    StyleSheet,
    View,
} from "react-native";
import Animated from "react-native-reanimated";

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
} & Omit<ImageProps, "style">;

const ImageRatio = ({
    ratio,
    style,
    transition = 250,
    animatedStyle,
    animatedProps,
    onPress,
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
                    <Pressable onPress={onPress}>
                        <AnimatedImage
                            {...props}
                            animatedProps={animatedProps}
                            style={[imageStyle, animatedStyle]}
                        />
                    </Pressable>
                ) : (
                    <Pressable onPress={onPress}>
                        <Image
                            {...props}
                            transition={transition}
                            style={imageStyle}
                        />
                    </Pressable>
                )
            ) : (
                <ActivityIndicator />
            )}
        </View>
    );
};

export default ImageRatio;

const styles = StyleSheet.create({
    container: {
        width: "100%",
    },
});

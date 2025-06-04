import React, { useState, useCallback } from "react";
import { View, StyleSheet, LayoutChangeEvent, ActivityIndicator } from "react-native";
import { Image, ImageProps } from "expo-image";

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

const RATIO_PRESETS: Record<RatioName, number> = {
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

type ImageRatioProps = {
    ratio?: RatioName;
    style?: any;
} & Omit<ImageProps, "style">;

const ImageRatio = ({ ratio, style, ...props }: ImageRatioProps) => {
    const [width, setWidth] = useState<number | null>(null);

    const onLayout = useCallback((e: LayoutChangeEvent) => {
        setWidth(e.nativeEvent.layout.width);
    }, []);

    const aspectRatio = RATIO_PRESETS[ratio ?? "cover"];

    // Si width n'est pas encore connu, on ne rend rien (ou un loader)
    return (
        <View style={[styles.container]} onLayout={onLayout}>
            {width !== null ? (
                <Image
                    {...props}
                    style={{
                        width: "100%",
                        height: ratio ? width / aspectRatio : '100%',
                        borderRadius: style?.borderRadius,
                        ...StyleSheet.flatten(style),
                    }}
                />
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
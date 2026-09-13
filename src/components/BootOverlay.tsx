import { useEffect } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
    Easing,
    FadeIn,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withTiming
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import TrocleLogoPicto from '@/src/components/logos/TrocleLogoPicto';
import { useTheme } from '@/src/lib/hooks/useTheme';
import { useBootOverlayStore } from '@/src/state/bootOverlayStore';

const LOGO_RENDER_SIZE = 1024;
const LOGO_INITIAL_VISIBLE_SIZE = 256;
const LOGO_WAIT_DURATION = 400;
const LOGO_ZOOM_DURATION = 650;
const OVERLAY_FADE_DURATION = 500;

type BootOverlayProps = {
    splashHidden: boolean;
}

export default function BootOverlay({
    splashHidden
}: BootOverlayProps) {
    const { activeTheme } = useTheme();
    const { width, height } = useWindowDimensions();

    const visible = useBootOverlayStore((state) => state.visible);
    const exitRequested = useBootOverlayStore((state) => state.exitRequested);
    const hide = useBootOverlayStore((state) => state.hide);

    const logoScale = useSharedValue(LOGO_INITIAL_VISIBLE_SIZE / LOGO_RENDER_SIZE);

    const finalLogoSize = Math.min(Math.hypot(width, height) * 2.3, 2400);
    const finalLogoScale = finalLogoSize / LOGO_RENDER_SIZE;

    const logoStyle = useAnimatedStyle(() => ({
        transform: [{ scale: logoScale.value }],
    }));


    const overlayOpacity = useSharedValue(0);

    const overlayStyle = useAnimatedStyle(() => ({
        opacity: overlayOpacity.value,
    }));

    useEffect(() => {
        if (splashHidden) {
            overlayOpacity.value = withTiming(1, { duration: OVERLAY_FADE_DURATION });
        }
    }, [overlayOpacity, splashHidden]);

    useEffect(() => {
        if (!exitRequested) {
            return;
        }

        logoScale.value = withDelay(
            LOGO_WAIT_DURATION,
            withTiming(
                finalLogoScale,
                {
                    duration: LOGO_ZOOM_DURATION,
                    easing: Easing.inOut(Easing.cubic),
                },
                (zoomFinished) => {
                    if (!zoomFinished) {
                        return;
                    }

                    // Révèle progressivement la Home déjà montée derrière.
                    overlayOpacity.value = withTiming(
                        0,
                        {
                            duration: OVERLAY_FADE_DURATION,
                            easing: Easing.out(Easing.cubic),
                        },
                        (fadeFinished) => {
                            if (fadeFinished) {
                                scheduleOnRN(hide);
                            }
                        }
                    );
                }
            )
        );
    }, [
        exitRequested,
        finalLogoScale,
        hide,
        logoScale,
        overlayOpacity,
    ]);

    if (!visible) { return null; }

    return (
        <Animated.View
            pointerEvents={exitRequested ? 'none' : 'auto'}
            style={[
                StyleSheet.absoluteFill,
                styles.container,
                overlayStyle,
                {
                    backgroundColor: activeTheme.colors.surface.secondary,
                },
            ]}
        >
            <Animated.View
                style={logoStyle}
                entering={FadeIn.duration(OVERLAY_FADE_DURATION)}
            >
                <TrocleLogoPicto
                    width={LOGO_RENDER_SIZE}
                    height={LOGO_RENDER_SIZE}
                />
            </Animated.View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
});
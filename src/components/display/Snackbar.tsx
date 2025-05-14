import React, { useEffect } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
    withSpring,
    runOnJS
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import { useTheme } from '@/src/lib/hooks/useTheme';
import { useSnackbarStore } from '@/src/state/snackbarStore';
import { SnackbarInterface } from '@/src/state/snackbarStore';

import Flex from '#/Flex';
import Text from '#/Text';
import Button from '#/controls/Button';

const Snackbar: React.FC = () => {
    const { activeTheme } = useTheme();
    const { snackbars, removeSnackbar } = useSnackbarStore();

    return (
        <>
            {snackbars.map((snackbar) => (
                <SnackbarItem key={snackbar.id} theme={activeTheme} snackbar={snackbar} onDismiss={() => removeSnackbar(snackbar.id)} />
            ))}
        </>
    );
};

const SnackbarItem: React.FC<{ theme: any; snackbar: SnackbarInterface; onDismiss: () => void }> = ({ theme, snackbar, onDismiss }) => {
    const activeTheme = theme;

    const distance = 150;
    const translateY = useSharedValue(100);
    const context = useSharedValue({ y: 0 });
    const position = snackbar.position || 'bottom';
    const animationDuration = 300;
    const animationEasing = Easing.bezier(0.60, -0.15, 0.25, 1.20);
    const snackbarDuration = snackbar.duration || 3000;

    const animateIn = () => {
        if (position === 'top') {
            translateY.value = -distance;
        } else {
            translateY.value = distance;
        }

        translateY.value = withTiming(0, {
            duration: animationDuration,
            easing: animationEasing,
        });
    };

    const animateOut = () => {
        if (position === 'top') {
            translateY.value = withTiming(-distance, {
                duration: animationDuration,
                easing: animationEasing,
            }, () => runOnJS(onDismiss)());
        } else {
            translateY.value = withTiming(distance, {
                duration: animationDuration,
                easing: animationEasing,
            }, () => runOnJS(onDismiss)());
        }
    };

    useEffect(() => {
        animateIn();

        if (!snackbar.isPersistent) {
            const timer = setTimeout(() => {
                animateOut();
            }, snackbarDuration);

            return () => clearTimeout(timer);
        }
    }, []);

    const handlePanGesture = Gesture.Pan()
        .onStart(() => {
            context.value = { y: translateY.value };
        })
        .onUpdate((event) => {
            if (position === 'top') {
                translateY.value = Math.min(context.value.y + event.translationY, 0);
            } else {
                translateY.value = Math.max(context.value.y + event.translationY, 0);
            }
        })
        .onEnd((event) => {
            const shouldDismiss =
                (position === 'top' && (event.velocityY < -500)) ||
                (position === 'bottom' && (event.velocityY > 500));

            if (shouldDismiss) {
                if (event.velocityY < 0) {
                    translateY.value = withTiming(-distance, {
                        duration: animationDuration,
                        easing: animationEasing,
                    }, () => runOnJS(onDismiss)());
                } else {
                    translateY.value = withTiming(distance, {
                        duration: animationDuration,
                        easing: animationEasing,
                    }, () => runOnJS(onDismiss)());
                }
            } else {
                translateY.value = withSpring(0);
            }
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    const positionStyle = snackbar.position === 'top'
        ? { top: activeTheme.spacing._100, left: activeTheme.spacing._200, right: activeTheme.spacing._200 }
        : { bottom: activeTheme.spacing._100, left: activeTheme.spacing._200, right: activeTheme.spacing._200 };

    const typeStyle = snackbar.type === 'success'
        ? {
            backgroundColor: activeTheme.colors.surface.successLight,
            borderColor: activeTheme.colors.surface.success
        }
        : snackbar.type === 'error'
            ? {
                backgroundColor: activeTheme.colors.surface.dangerLight,
                borderColor: activeTheme.colors.surface.danger
            }
            : snackbar.type === 'warning'
                ? {
                    backgroundColor: activeTheme.colors.surface.alertLight,
                    borderColor: activeTheme.colors.surface.alert
                }
                : snackbar.type === 'info'
                    ? {
                        backgroundColor: activeTheme.colors.surface.blueLight,
                        borderColor: activeTheme.colors.surface.blue
                    }
                    : {
                        backgroundColor: activeTheme.colors.surface.contrast,
                        borderWidth: 0
                    };

    return (
        <GestureDetector gesture={handlePanGesture}>
            <Animated.View style={[styles.container, animatedStyle, positionStyle, typeStyle, {
                borderRadius: activeTheme.radius.default,
                paddingLeft: activeTheme.spacing._200,
                paddingRight: activeTheme.spacing._50,
                borderWidth: 1,
                boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.25)',
            }]}
            >
                <Flex style={{ flexGrow: 1, flexShrink: 1 }}>
                    <Text variant='body_Medium' type={snackbar.type == 'default' ? 'invert' : 'primary'} numberOfLines={1}>{snackbar.message}</Text>
                </Flex>
                {snackbar.action && (
                    <Flex>
                        <Button label={snackbar.action.label} variant='ghost' size='small' onPress={() => {
                            snackbar?.action?.onPress();
                            animateOut();
                        }} />
                    </Flex>
                )}
            </Animated.View>
        </GestureDetector>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 48,
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 1000,
    },
});

export default Snackbar;
import {
    forwardRef,
    ReactNode,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from 'react';
import {
    BackHandler,
    Modal,
    Pressable,
    ScrollView,
    StyleProp,
    StyleSheet,
    useWindowDimensions,
    View,
    ViewStyle,
} from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
    Extrapolation,
    FadeInUp,
    FadeOutDown,
    interpolate,
    LinearTransition,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/src/lib/hooks/useTheme';

import Flex from '#/Flex';
import Text from '#/Text';
import Button from '#/controls/Button';

import { Arrowleft, Close } from '#/icons';
import { scheduleOnRN } from 'react-native-worklets';

export type BottomSheetHeaderVariant =
    | 'handle'
    | 'empty'
    | 'icon'
    | 'text + icon';

export type BottomSheetRef = {
    present: () => void;
    dismiss: () => void;
};

type BottomSheetProps = {
    children: ReactNode;

    onClose?: () => void;

    title?: string;
    headerVariant?: BottomSheetHeaderVariant;
    iconPosition?: 'left' | 'right';
    icon?: ReactNode;

    onBack?: () => void;
    canGoBack?: boolean;

    actions?: ReactNode;

    maxHeight?: number | `${number}%`;
    scrollable?: boolean;

    closeOnBackdropPress?: boolean;
    enablePanDownToClose?: boolean;

    contentContainerStyle?: StyleProp<ViewStyle>;
    style?: StyleProp<ViewStyle>;
};

const ANIMATION_DURATION = 250;
const CLOSE_THRESHOLD = 100;
const CLOSE_VELOCITY = 900;
const SPRING_CONFIG = {
    damping: 22,
    stiffness: 220,
    mass: 0.8,
};
const HEIGHT_TRANSITION = LinearTransition
    .springify()
    .damping(22)
    .stiffness(220)
    .mass(0.8);

const BottomSheet = forwardRef<BottomSheetRef, BottomSheetProps>(({
    children,
    onClose,

    title,
    headerVariant = 'handle',
    iconPosition = 'right',
    icon,

    onBack,
    canGoBack = false,

    actions,

    maxHeight = '80%',
    scrollable = true,

    closeOnBackdropPress = true,
    enablePanDownToClose = true,

    contentContainerStyle,
    style,
}, ref,) => {
    const { activeTheme } = useTheme();
    const insets = useSafeAreaInsets();
    const { height: windowHeight } = useWindowDimensions();

    const [mounted, setMounted] = useState(false);

    const translateY = useSharedValue(windowHeight);
    const sheetHeight = useSharedValue(0);
    const gestureStartY = useSharedValue(0);
    const progress = useSharedValue(0);

    const animatedHeight = useSharedValue<number>(0);
    const isFirstLayout = useSharedValue(true);

    const headerHeightRef = useRef(0);
    const contentHeightRef = useRef(0);
    const actionsHeightRef = useRef(0);


    const resolvedMaxHeight =
        typeof maxHeight === 'string'
            ? windowHeight * (parseFloat(maxHeight) / 100)
            : maxHeight;

    const open = () => {
        isFirstLayout.value = true;
        setMounted(true);
    };

    const finishClose = () => {
        setMounted(false);
        onClose?.();
    };

    const close = () => {
        progress.value = withTiming(
            0,
            { duration: ANIMATION_DURATION },
        );

        translateY.value = withTiming(
            Math.max(sheetHeight.value, windowHeight),
            { duration: ANIMATION_DURATION },
            (finished) => {
                if (finished) {
                    scheduleOnRN(finishClose);
                }
            },
        );
    };

    useImperativeHandle(ref, () => ({
        present: open,
        dismiss: close,
    }));


    const resizeSheet = useCallback(() => {
        const targetHeight = Math.min(
            headerHeightRef.current +
            contentHeightRef.current +
            actionsHeightRef.current +
            insets.bottom,
            resolvedMaxHeight,
        );

        sheetHeight.value = targetHeight;

        if (isFirstLayout.value) {
            animatedHeight.value = targetHeight;
            isFirstLayout.value = false;
            return;
        }

        animatedHeight.value = withSpring(
            targetHeight,
            SPRING_CONFIG,
        );
    }, [insets.bottom, resolvedMaxHeight]);





    useEffect(() => {
        if (!mounted) return;

        translateY.value = sheetHeight.value || windowHeight;

        requestAnimationFrame(() => {
            progress.value = withTiming(1, {
                duration: ANIMATION_DURATION,
            });

            translateY.value = withSpring(0, SPRING_CONFIG);
        });
    }, [mounted, progress, translateY, windowHeight]);

    useEffect(() => {
        if (!mounted) return;

        const subscription = BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
                if (canGoBack && onBack) {
                    onBack();
                } else {
                    close();
                }

                return true;
            },
        );

        return () => subscription.remove();
    }, [mounted, canGoBack, onBack]);

    const panGesture = Gesture.Pan()
        .enabled(enablePanDownToClose)
        .onBegin(() => {
            gestureStartY.value = translateY.value;
        })
        .onUpdate((event) => {
            translateY.value = Math.max(
                0,
                gestureStartY.value + event.translationY,
            );
        })
        .onEnd((event) => {
            const shouldClose =
                translateY.value > CLOSE_THRESHOLD ||
                event.velocityY > CLOSE_VELOCITY;

            if (shouldClose) {
                translateY.value = withTiming(
                    Math.max(sheetHeight.value, windowHeight),
                    { duration: ANIMATION_DURATION },
                    (finished) => {
                        if (finished) {
                            scheduleOnRN(finishClose)
                        }
                    },
                );

                progress.value = withTiming(0, {
                    duration: ANIMATION_DURATION,
                });
            } else {
                translateY.value = withSpring(0, SPRING_CONFIG);
            }
        });

    // 1. Pour la translation Y (ouverture/fermeture et gesture)
    const sheetAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    // 2. Pour la hauteur animée lors des changements de page/catégorie
    const animatedContainerStyle = useAnimatedStyle(() => ({
        height: animatedHeight.value > 0 ? animatedHeight.value : undefined,
    }));

    const backdropAnimatedStyle = useAnimatedStyle(() => ({
        opacity: interpolate(
            progress.value,
            [0, 1],
            [0, 0.45],
            Extrapolation.CLAMP,
        ),
    }));

    const handleHeaderAction = () => {
        if (canGoBack && onBack) {
            onBack();
            return;
        }

        close();
    };

    const headerIcon = canGoBack
        ? <Arrowleft />
        : icon ?? <Close />;

    const renderHeader = () => {
        if (headerVariant === 'empty') {
            return <View style={styles.emptyHeader} />;
        }

        if (headerVariant === 'handle') {
            return (
                <GestureDetector gesture={panGesture}>
                    <Animated.View style={styles.handleHeader}>
                        <View
                            style={[
                                styles.handle,
                                {
                                    backgroundColor:
                                        activeTheme.colors.surface.field,
                                },
                            ]}
                        />
                    </Animated.View>
                </GestureDetector>
            );
        }

        return (
            <GestureDetector gesture={panGesture}>
                <Animated.View
                    style={[
                        styles.header,
                        {
                            flexDirection:
                                iconPosition === 'right'
                                    ? 'row'
                                    : 'row-reverse',
                        },
                    ]}
                >

                    {headerVariant === 'text + icon' && (
                        <Text variant="title_Large" type="primary">{title}</Text>
                    )}

                    <Button
                        icon={headerIcon}
                        variant="ghost"
                        size="large"
                        onPress={handleHeaderAction}
                    />

                    {/* {headerVariant === 'text + icon' && (
                        <View style={styles.headerPlaceholder} />
                    )} */}
                </Animated.View>
            </GestureDetector>
        );
    };

    if (!mounted) {
        return null;
    }



    const content = scrollable ? (
        <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={contentContainerStyle}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={(_, height) => {
                if (contentHeightRef.current === height) return;

                contentHeightRef.current = height;
                resizeSheet();
            }}
        >
            {children}
        </ScrollView>
    ) : (
        <View
            style={contentContainerStyle}
            onLayout={(event) => {
                const height = event.nativeEvent.layout.height;

                if (contentHeightRef.current === height) return;

                contentHeightRef.current = height;
                resizeSheet();
            }}
        >
            {children}
        </View>
    );


    return (
        <Modal
            visible
            transparent
            animationType="none"
            statusBarTranslucent
            onRequestClose={close}
        >
            <GestureHandlerRootView style={styles.modal}>
                <Animated.View
                    pointerEvents="none"
                    style={[
                        StyleSheet.absoluteFill,
                        { backgroundColor: activeTheme.colors.surface.contrast },
                        backdropAnimatedStyle,
                    ]}
                />

                <Pressable
                    style={styles.backdropPressable}
                    onPress={closeOnBackdropPress ? close : undefined}
                />



                <Animated.View
                    style={[
                        styles.sheet,
                        {
                            maxHeight: resolvedMaxHeight,
                            paddingBottom: insets.bottom,
                            backgroundColor: activeTheme.colors.surface.secondary,
                            borderTopLeftRadius: activeTheme.radius.modal,
                            borderTopRightRadius: activeTheme.radius.modal,
                            overflow: 'hidden',
                        },
                        sheetAnimatedStyle,
                        animatedContainerStyle,
                        style,
                    ]}
                >

                    <View
                        style={{}}
                        onLayout={(event) => {
                            const height = event.nativeEvent.layout.height;

                            if (headerHeightRef.current === height) return;

                            headerHeightRef.current = height;
                            resizeSheet();
                        }}
                    >
                        {renderHeader()}
                    </View>

                    <Animated.View
                        key={title}
                        entering={FadeInUp.duration(ANIMATION_DURATION)}
                        exiting={FadeOutDown.duration(ANIMATION_DURATION)}
                        style={[styles.content, {}]}
                    >
                        {content}
                    </Animated.View>

                    {actions && (
                        <Flex
                            direction="row"
                            alignItems="center"
                            gap={activeTheme.spacing._100}
                            onLayout={(event) => {
                                const height = event.nativeEvent.layout.height;

                                if (actionsHeightRef.current === height) return;

                                actionsHeightRef.current = height;
                                resizeSheet();
                            }}
                            style={{
                                paddingHorizontal: activeTheme.spacing._200,
                                paddingVertical: activeTheme.spacing._200,
                                backgroundColor: activeTheme.colors.surface.secondary,

                            }}
                        >
                            {actions}
                        </Flex>
                    )}
                </Animated.View>

            </GestureHandlerRootView>
        </Modal>
    );
});

BottomSheet.displayName = 'BottomSheet';

export default BottomSheet;

const styles = StyleSheet.create({
    modal: {
        flex: 1,
        justifyContent: 'flex-end',
    },

    backdropPressable: {
        ...StyleSheet.absoluteFill,
    },

    sheet: {
        width: '100%',
        overflow: 'hidden',
    },

    scrollView: {
        flex: 1
    },

    content: {
        flex: 1,
    },

    emptyHeader: {
        height: 24,
    },

    handleHeader: {
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },

    handle: {
        width: 48,
        height: 5,
        borderRadius: 999,
    },

    header: {
        minHeight: 64,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },

    headerPlaceholder: {
        width: 40,
    },
});
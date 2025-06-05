import React, { useState, useRef, isValidElement, Children, cloneElement } from 'react';
import {
    StyleSheet,
    ViewStyle,
    StyleProp,
    LayoutRectangle,
    Dimensions,
    Pressable,
    Modal,
    View,
    TextLayoutEventData
} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    runOnJS,
} from 'react-native-reanimated';

import { useTheme } from '@/src/lib/hooks/useTheme';

import Text from '#/Text';
import Flex from '#/Flex';
import Button from '#/controls/Button';

interface TooltipProps {
    type?: 'default' | 'rich';
    content: string;
    title?: string;
    actions?: React.ReactNode[];
    position?: 'top' | 'bottom' | 'left' | 'right';
    offset?: number;
    beforeDelay?: number;
    afterDelay?: number;
    children: React.ReactNode;
}

const ANIMATION_DURATION = 250;
const ANIMATION_OFFSET = 8;

export default function Tooltip({
    type = 'default',
    content,
    title,
    actions,
    position = 'top',
    offset = 8,
    beforeDelay = 500,
    afterDelay = 2000,
    children,
}: TooltipProps) {
    const { activeTheme } = useTheme();
    const [visible, setVisible] = useState(false);
    const [tooltipLayout, setTooltipLayout] = useState<LayoutRectangle | null>(null);
    const [childLayout, setChildLayout] = useState<LayoutRectangle | null>(null);
    const [contentLineCount, setContentLineCount] = useState(1);

    const childRef = useRef<View>(null);

    // Reanimated shared values for animation
    const translateY = useSharedValue(ANIMATION_OFFSET); // Start 8 pixels below
    const opacity = useSharedValue(0);

    const longPressTimeout = useRef<NodeJS.Timeout | null>(null);

    const screen = Dimensions.get('window');



    const handleTouchStart = () => {
        longPressTimeout.current = setTimeout(() => {
            showTooltip();
        }, beforeDelay); // ms
    };

    const handleTouchEnd = () => {
        if (longPressTimeout.current) {
            clearTimeout(longPressTimeout.current);
        }
        hideTooltip();
    };

    const showTooltip = () => {
        if (childRef.current) {
            childRef.current.measureInWindow((pageX, pageY, width, height) => {
                setChildLayout({ x: pageX, y: pageY, width, height });
                setVisible(true);

                // Start animation
                translateY.value = withTiming(0, { duration: ANIMATION_DURATION }); // Slide up to original position
                opacity.value = withTiming(1, { duration: ANIMATION_DURATION }); // Fade in
            });
        }
    };

    const hideTooltip = () => {
        // Start animation in reverse after a delay
        setTimeout(() => {
            opacity.value = withTiming(0, { duration: ANIMATION_DURATION }, (isFinished) => {
                if (isFinished) {
                    runOnJS(setVisible)(false); // Hide the modal after animation is complete
                }
            });
            translateY.value = withTiming(ANIMATION_OFFSET, { duration: ANIMATION_DURATION }); // Slide down
        }, afterDelay);
    };



    const getTooltipPosition = (): StyleProp<ViewStyle> => {
        if (!childLayout || !tooltipLayout) return { opacity: 0 };

        const { width: tw, height: th } = tooltipLayout;
        let top = 0;
        let left = 0;

        switch (position) {
            case 'top':
                top = Math.max(childLayout.y - th - offset, 4);
                left = Math.min(
                    Math.max(childLayout.x + childLayout.width / 2 - tw / 2, 4),
                    screen.width - tw - 4
                );
                break;

            case 'bottom':
                top = Math.min(childLayout.y + childLayout.height + offset, screen.height - th - 4);
                left = Math.min(
                    Math.max(childLayout.x + childLayout.width / 2 - tw / 2, 4),
                    screen.width - tw - 4
                );
                break;

            case 'left':
                top = Math.min(
                    Math.max(childLayout.y + childLayout.height / 2 - th / 2, 4),
                    screen.height - th - 4
                );
                left = Math.max(childLayout.x - tw - offset, 4);
                break;

            case 'right':
                top = Math.min(
                    Math.max(childLayout.y + childLayout.height / 2 - th / 2, 4),
                    screen.height - th - 4
                );
                left = Math.min(childLayout.x + childLayout.width + offset, screen.width - tw - 4);
                break;
        }

        return {
            position: 'absolute',
            top,
            left,
        };
    };

    // Animated style for the tooltip wrapper
    const animatedTooltipStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
            transform: [{ translateY: translateY.value }],
        };
    });

    const getTooltipContent = () => {
        if (type === 'default') {
            return (
                <Flex
                    style={{
                        backgroundColor: activeTheme.colors.surface.contrast,
                        borderRadius: activeTheme.radius.default,
                        paddingHorizontal: activeTheme.spacing._100,
                        paddingVertical: contentLineCount > 1 ? activeTheme.spacing._100 : activeTheme.spacing._50,
                        maxWidth: 200,
                        minHeight: 24,
                        opacity: 0.95,

                        boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.25)',
                    }}
                >
                    <Text
                        variant='body_Small'
                        type='invert'
                        onTextLayout={(e) => {
                            setContentLineCount(e.nativeEvent.lines.length);
                        }}
                    >
                        {content}
                    </Text>
                </Flex>
            )
        }

        if (type === 'rich') {
            return (
                <Flex
                    gap={activeTheme.spacing._100}
                    style={{
                        backgroundColor: activeTheme.colors.surface.secondary,
                        borderRadius: activeTheme.radius.default,
                        paddingBottom: activeTheme.spacing._100,
                        width: 312,
                        minHeight: 140,
                        opacity: 0.95,

                        boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.25)',
                    }}
                >

                    <Flex
                        gap={activeTheme.spacing._50}
                        style={{
                            paddingHorizontal: activeTheme.spacing._200,
                            paddingTop: activeTheme.spacing._200,
                            paddingBottom: activeTheme.spacing._50,
                        }}
                    >
                        {title && (
                            <Text variant='title_Small' type='primary'>{title}</Text>
                        )}

                        <Text
                            variant='body_Small'
                            type='primary'
                            onTextLayout={(e) => {
                                setContentLineCount(e.nativeEvent.lines.length);
                            }}
                        >
                            {content}
                        </Text>
                    </Flex>


                    {actions && (
                        <Flex
                            direction='row'
                            gap={activeTheme.spacing._100}
                            style={{
                                paddingHorizontal: activeTheme.spacing._100,
                            }}
                        >
                            {actions}
                        </Flex>
                    )}
                </Flex>
            )
        }

        return null;
    }

    const clonedChildren = Children.map(children, (child) => {
        if (isValidElement(child)) {
            const newProps: any = {};
            const typedChild = child as React.ReactElement<any>;
            const childOnPress = typedChild.props.onPress;
            const childPointerEvents = !!typedChild.props.pointerEvents;

            if (visible) {
                if (childOnPress) {
                    newProps.onPress = () => {};
                }

                if (childPointerEvents) {
                    newProps.pointerEvents = 'none';
                }
            } else {
                if (childOnPress) {
                    newProps.onPress = childOnPress;
                }

                if (childPointerEvents) {
                    newProps.pointerEvents = 'auto';
                }
            }
            return cloneElement(typedChild, newProps);
        }
        return child;
    });

    return (
        <>
            <View
                ref={childRef}
                collapsable={false}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                style={{
                    borderWidth: 1,
                    borderColor: 'red',
                    position: 'absolute',
                }}
            >
                {clonedChildren}
            </View>

            <Modal
                transparent={true}
                visible={visible}
                onRequestClose={hideTooltip}
            >
                <Pressable style={StyleSheet.absoluteFill} onPress={hideTooltip}>
                    {visible && childLayout && (
                        <Animated.View
                            style={[styles.tooltipWrapper, getTooltipPosition(), animatedTooltipStyle]}
                            onLayout={(e) => setTooltipLayout(e.nativeEvent.layout)}
                            pointerEvents={visible ? 'auto' : 'none'}
                        >
                            {getTooltipContent()}

                        </Animated.View>
                    )}
                </Pressable>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    tooltipWrapper: {
        zIndex: 1000,
        position: 'absolute',
    },
});
import React, { useState } from 'react';
import { useTheme } from '@/src/lib/hooks/useTheme';
import { Pressable, View, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, interpolateColor } from 'react-native-reanimated';
import Text from '#/Text';


const { theme, activeTheme, toggleTheme } = useTheme();
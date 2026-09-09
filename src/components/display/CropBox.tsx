import { useTheme } from '@/src/lib/hooks/useTheme';
import { StyleSheet, View } from 'react-native';

import Flex from '#/Flex';

interface CropBoxProps {
    cropBox: {
        width: number;
        height: number;
    };
}

export default function CropBox({ cropBox }: CropBoxProps) {
    const { activeTheme } = useTheme();

    const overlayColor = activeTheme.colors.surface.transparent;

    return (
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
            {/* 1. Bande supérieure sombre */}
            <View style={{ flex: 1, backgroundColor: overlayColor }} />
            {/* 2. Rangée du milieu contenant : Gauche sombre + Zone CROP transparente + Droite sombre */}
            <View style={{ flexDirection: 'row', height: cropBox.height }}>
                {/* Bande gauche sombre */}
                <View style={{ flex: 1, backgroundColor: overlayColor }} />
                {/* Zone de Crop : TRANSPARENTE avec grille */}
                <View
                    style={{
                        width: cropBox.width,
                        height: cropBox.height,
                        borderWidth: 2,
                        borderColor: '#FFFFFF',
                        position: 'relative',
                    }}
                >
                    {/* Lignes verticales */}
                    <Flex
                        style={{
                            position: 'absolute',
                            left: '33.333%',
                            top: 0,
                            bottom: 0,
                            width: 1,
                            backgroundColor: 'rgba(255,255,255,0.65)',
                        }}
                    />
                    <Flex
                        style={{
                            position: 'absolute',
                            left: '66.666%',
                            top: 0,
                            bottom: 0,
                            width: 1,
                            backgroundColor: 'rgba(255,255,255,0.65)',
                        }}
                    />
                    {/* Lignes horizontales */}
                    <Flex
                        style={{
                            position: 'absolute',
                            top: '33.333%',
                            left: 0,
                            right: 0,
                            height: 1,
                            backgroundColor: 'rgba(255,255,255,0.65)',
                        }}
                    />
                    <Flex
                        style={{
                            position: 'absolute',
                            top: '66.666%',
                            left: 0,
                            right: 0,
                            height: 1,
                            backgroundColor: 'rgba(255,255,255,0.65)',
                        }}
                    />
                </View>
                {/* Bande droite sombre */}
                <View style={{ flex: 1, backgroundColor: overlayColor }} />
            </View>
            {/* 3. Bande inférieure sombre */}
            <View style={{ flex: 1, backgroundColor: overlayColor }} />
        </View>
    );
}

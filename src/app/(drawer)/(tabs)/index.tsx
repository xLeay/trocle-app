import { Pressable, StyleSheet } from 'react-native';
import { useTheme } from '@/src/lib/hooks/useTheme';

import { ImageBackground } from 'expo-image';

import Text from '#/Text';
import Flex from '#/Flex';
import Button from '#/controls/Button';
import ButtonTroc from '#/controls/ButtonTroc';
import ProgressBar from '#/display/ProgressBar';

import { Location, State1, State2, State3, State4, Trocoin, Certification, Troclike, Trocpass, Trocreroll } from '#/icons';
import { useEffect, useRef, useState } from 'react';

export default function Tab() {
    const { activeTheme } = useTheme();

    const imagesList = [
        'https://images1.vinted.net/t/04_01de2_ZGKABtika9i8WkksPtb27e4D/f800/1746196575.jpeg?s=7ebf8d9920dd6da3506cde89e009592c739ff1cc',
        'https://images1.vinted.net/t/02_019c1_7u1tf2oBHWaHvvczUT9PwG8E/f800/1746196575.jpeg?s=040d7d6c0f6d27a58a819c89e0f41a631e9cfeff',
        'https://images1.vinted.net/t/04_01750_C7H5xAmTdUwgX6vxxKpQxMXD/f800/1746196575.jpeg?s=c34ab299ea7d439c4f160f3b1564e2809408e477',
        'https://images1.vinted.net/t/04_016fe_mZR3hE7dGUnQfb4Kp4Msqxav/f800/1746196575.jpeg?s=ee70f746bf5b5564c41c9ebe1979c1307a75e498',
    ]

    const [currentIndex, setCurrentIndex] = useState(0);
    const [progress, setProgress] = useState(0);


    const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

    const DURATION = 5000; // temps par photo
    const PROGRESS_STEP = 300; // fréquence de mise à jour (ms)

    const startProgress = () => {
        clearInterval(intervalRef.current);
        setProgress(0);

        intervalRef.current = setInterval(() => {
            setProgress(prev => {
                const next = prev + PROGRESS_STEP / DURATION;
                if (next >= 1) {
                    clearInterval(intervalRef.current);
                    goToNext();
                    return 1;
                }
                return next;
            });
        }, PROGRESS_STEP);
    };

    const goToNext = () => {
        if (currentIndex < imagesList.length - 1) {
            setProgress(0);
            setCurrentIndex(prev => prev + 1);
        } else {
            setProgress(0);
            setCurrentIndex(0);
        }
    };

    const goToPrevious = () => {
        if (currentIndex > 0) {
            setProgress(0);
            setCurrentIndex(prev => prev - 1);
        }
    };

    useEffect(() => {
        startProgress();
        return () => clearInterval(intervalRef.current);
    }, [currentIndex]);


    return (
        <Flex style={[styles.container, { backgroundColor: activeTheme.colors.surface.secondary, paddingHorizontal: activeTheme.spacing._400 }]}>
            <Flex
                overflow='hidden'
                style={{ flex: 1, width: '100%', borderRadius: activeTheme.radius.modal, }}>

                <ImageBackground
                    source={{ uri: imagesList[currentIndex] }}
                    style={{ flex: 1, width: '100%', height: '100%', position: 'relative', justifyContent: 'space-between' }}
                    contentFit="cover"
                    transition={500}
                >

                    <Pressable
                        onPress={goToPrevious}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '50%',
                            height: '100%',
                            zIndex: 1,

                            // backgroundColor: 'rgba(0, 0, 127, 0.25)',
                        }}
                    />
                    <Pressable
                        onPress={goToNext}
                        style={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            width: '50%',
                            height: '100%',
                            zIndex: 1,

                            // backgroundColor: 'rgba(127, 0, 0, 0.25)',
                        }}
                    />

                    <Flex pointerEvents="box-none" gap={activeTheme.spacing._100} style={{ width: '100%', padding: activeTheme.spacing._200 }}>
                        <Flex direction='row' gap={activeTheme.spacing._100} style={{ width: '100%' }}>
                            {imagesList.map((_, index) => {
                                let value = 0;
                                if (index < currentIndex) value = 1;
                                else if (index === currentIndex) value = progress;
                                return (
                                    <Flex key={index} style={{ flex: 1 }}>
                                        <ProgressBar
                                            type='mono'
                                            progress={value}
                                            isActive={index === currentIndex}
                                            style={{ width: '100%' }}
                                        />
                                    </Flex>
                                );
                            })}
                        </Flex>
                        <Flex gap={activeTheme.spacing._50}>
                            <Flex
                                direction='row'
                                alignItems='center'
                                gap={activeTheme.spacing._50}
                                style={{
                                    padding: activeTheme.spacing._100,
                                    borderRadius: activeTheme.radius.modal,
                                    backgroundColor: 'rgba(0, 0, 0, 0.25)',
                                    borderWidth: 1,
                                    borderColor: 'rgba(255, 255, 255, 0.25)',
                                    boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.15)',
                                }}
                            >
                                <Location size={16} color='white' />
                                <Text variant='label_Medium' style={styles.textColor}>2,3 km</Text>
                            </Flex>

                            <Flex
                                direction='row'
                                alignItems='center'
                                gap={activeTheme.spacing._50}
                                style={{
                                    padding: activeTheme.spacing._100,
                                    borderRadius: activeTheme.radius.modal,
                                    backgroundColor: 'rgba(0, 0, 0, 0.25)',
                                    borderWidth: 1,
                                    borderColor: 'rgba(255, 255, 255, 0.25)',
                                    boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.15)',
                                }}
                            >
                                <State3 size={16} color='white' />
                                <Text variant='label_Medium' style={styles.textColor}>Bon état</Text>
                            </Flex>
                            <Flex
                                direction='row'
                                alignItems='center'
                                gap={activeTheme.spacing._50}
                                style={{
                                    padding: activeTheme.spacing._100,
                                    borderRadius: activeTheme.radius.modal,
                                    backgroundColor: 'rgba(0, 0, 0, 0.25)',
                                    borderWidth: 1,
                                    borderColor: 'rgba(255, 255, 255, 0.25)',
                                    boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.15)',
                                }}
                            >
                                <Trocoin size={16} color='white' />
                                <Text variant='label_Medium' style={styles.textColor}>800</Text>
                            </Flex>

                        </Flex>
                    </Flex>

                    <Flex pointerEvents="box-none" style={{ width: '100%', padding: activeTheme.spacing._200 }}>
                        <Text variant='title_Large' style={styles.textColor}>Pull (Blanc)</Text>
                        <Text variant='title_Small' style={styles.textColor}>Calvin Klein</Text>
                        <Flex direction='row' gap={2} alignItems='center'>
                            <Text variant='title_Small' style={styles.textColor}>Shuri</Text>
                            <Certification filled size={16} color={activeTheme.colors.icon.brand} />
                        </Flex>
                    </Flex>
                </ImageBackground>
            </Flex>
            <Flex
                alignItems='center'
                style={{ width: '100%', paddingVertical: activeTheme.spacing._200 }}
            >
                {/* TODO : ajouter la logique des boutons */}
                <Flex direction='row' gap={activeTheme.spacing._400}>
                    <ButtonTroc type='pass' color='default' />
                    <ButtonTroc type='reroll' color='default' />
                    <ButtonTroc type='like' color='default' />
                </Flex>
            </Flex>
        </Flex>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    textColor: {
        color: 'white',
    },
    textShadow: {
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 5,
        textShadowColor: 'rgba(0, 0, 0, 0.35)',
    },
});

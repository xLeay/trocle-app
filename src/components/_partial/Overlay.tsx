import { StyleSheet, View } from 'react-native';

type OverlayProps = {
    opacity?: number;
};

export default function Overlay({ opacity = 0.5 }: OverlayProps) {
    return (
        <View style={[styles.overlay, { opacity }]} />
    );
}

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#000',
    },
});

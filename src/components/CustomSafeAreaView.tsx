import { ViewStyle, StyleProp } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';

type CustomSafeAreaViewProps = {
    children: React.ReactNode;
    edges?: Edge[];
    style?: StyleProp<ViewStyle>;
};

const CustomSafeAreaView = ({
    children,
    edges = ['top', 'left', 'right', 'bottom'],
    style
}: CustomSafeAreaViewProps) => {
    return (
        <SafeAreaView edges={edges} style={[{ flex: 1 }, style]}>
            {children}
        </SafeAreaView>
    );
}

export default CustomSafeAreaView
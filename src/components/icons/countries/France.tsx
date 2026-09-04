import type { ColorValue } from 'react-native';
import { Path } from 'react-native-svg';
import { createBrandSVG } from '../iconsTemplate';

const France = createBrandSVG({
    viewBox: '0 0 24 24',
    renderContent: (color: ColorValue | undefined) => (
        <>
            <Path d="M2 6C2 4.89543 2.89543 4 4 4H8.66667V20H4C2.89543 20 2 19.1046 2 18V6Z" fill={color ?? "#004C93"} />
            <Path d="M8.67 4H15.3367V20H8.67V4Z" fill={color ?? "white"} />
            <Path d="M15.33 4H19.9967C21.1012 4 21.9967 4.89543 21.9967 6V18C21.9967 19.1046 21.1012 20 19.9967 20H15.33V4Z" fill={color ?? "#D0002E"} />
        </>
    ),
});

export default France;
import type { ColorValue } from 'react-native';
import { Path } from 'react-native-svg';
import { createBrandSVG } from '../iconsTemplate';

const Germany = createBrandSVG({
    viewBox: '0 0 24 24',
    renderContent: (color: ColorValue | undefined) => (
        <>
            <Path d="M2 6C2 4.89543 2.89543 4 4 4H20C21.1046 4 22 4.89543 22 6V9.33333H2V6Z" fill={color ?? "black"} />
            <Path d="M2 9.34H22V14.6733H2V9.34Z" fill={color ?? "#DA0019"} />
            <Path d="M2 14.67H22V18.0033C22 19.1079 21.1046 20.0033 20 20.0033H4C2.89543 20.0033 2 19.1079 2 18.0033V14.67Z" fill={color ?? "#F7C342"} />
        </>
    ),
});

export default Germany;
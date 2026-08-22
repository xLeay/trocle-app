import type { ColorValue } from 'react-native';
import { Path } from 'react-native-svg';
import { createBrandSVG } from '../iconsTemplate';

const TwitterXLogo = createBrandSVG({
    viewBox: '0 0 24 24',
    renderContent: (color: ColorValue | undefined) => (
        <>
            <Path d="M18.9617 0H22.6405L14.5631 10.1845L24 24H16.5945L10.7964 15.6044L4.15861 24H0.47984L9.03699 13.107L0 0H7.58947L12.8277 7.66937L18.9617 0ZM17.6741 21.6089H19.7134L6.51783 2.30258H4.32656L17.6741 21.6089Z" fill={color ?? "black"} />
        </>
    ),
});

export default TwitterXLogo;
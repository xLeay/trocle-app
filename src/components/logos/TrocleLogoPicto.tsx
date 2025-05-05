import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
import { useTheme } from '@/src/lib/hooks/useTheme';

type TrocleLogoPictoVariant = 'enormous' | 'very_large' | 'large' | 'medium' | 'application'

const SIZE_MAP = {
    enormous: { width: 250, height: 250 },
    very_large: { width: 128, height: 128 },
    large: { width: 64, height: 64 },
    medium: { width: 40, height: 40 },
    application: { width: 108, height: 108 },
}

const COLOR_MAP = {
    trocle: ['#A3E619', '#14B814'],
    green: ['#14B814', '#14B814'],
    black: ['#000', '#000'],
    white: ['#FFF', '#FFF'],
}

interface Props extends SvgProps {
    variant?: TrocleLogoPictoVariant,
    color?: keyof typeof COLOR_MAP,
}

const TrocleLogoPicto = ({ variant = 'medium', color = 'trocle', ...props }: Props) => {
    const { theme, activeTheme, toggleTheme } = useTheme();

    let colors = COLOR_MAP[color as keyof typeof COLOR_MAP] || COLOR_MAP.trocle
    if (theme === 'dark' && color === 'black') {
        colors = COLOR_MAP.white;
    }
    if (theme === 'dark' && color === 'white') {
        colors = COLOR_MAP.black;
    }

    const { width, height } = SIZE_MAP[variant]
    return (
        <Svg style={{
            // borderWidth: 1,
            // backgroundColor: '#FF000025',
        }}
            // xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 500 500"
            width={width}
            height={height}
            preserveAspectRatio="xMidYMid meet"
            {...props}
        >
            <Path
            fill={colors[0]}
            d="m209.707 208.526 69.132-120.355c7.796-13.575 28.304-9.363 30.181 6.198l6.515 54.139s.288 2.705.864 7.147l.169 1.377c.02.14.05.27.07.409a16.3 16.3 0 0 0 6.425 10.78l47.79 35.314c12.632 9.333 6.058 29.465-9.624 29.465H223.76c-12.493 0-20.309-13.595-14.062-24.474z"
        />
        <Path
            fill={colors[1]}
            d="m290.293 291.474-69.132 120.355c-7.796 13.575-28.304 9.363-30.181-6.198l-6.515-54.139s-.288-2.705-.864-7.147l-.169-1.377c-.02-.14-.05-.27-.07-.409a16.3 16.3 0 0 0-6.425-10.78l-47.79-35.314c-12.632-9.333-6.058-29.465 9.624-29.465H276.24c12.493 0 20.309 13.595 14.062 24.474z"
        />
        </Svg>

    )
}
export default TrocleLogoPicto

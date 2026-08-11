import type { TableLeftProps } from '#/_partial/TableLeft';
import type { TableRightProps } from '#/_partial/TableRight';

export type TopAppBarConfiguration<T = string> =
    | '_layout'
    | '_application'
    | '_center'
    | '_search'
    | '_withProgressBar'
    | '_small+table'
    | '_small'
    | '_medium'
    | '_large'
    ;

export interface TopAppBarProps {
    configuration?: TopAppBarConfiguration;

    onPress?: () => void;

    outlinedButtons?: boolean;

    iconName?: React.ElementType;
    iconColor?: string;

    canGoBack?: boolean;
    onBack?: () => void;

    label?: React.ReactNode;

    search?: string;
    setSearch?: (text: string) => void;
    placeHolder?: string;
    onFocus?: () => void;
    onBlur?: () => void;

    progress?: number;
    progressBarType?: 'primary' | 'mono';

    tableLeft?: TableLeftProps;
    tableRight?: TableRightProps;

    rightArea?: {
        label?: string;
        iconName?: React.ElementType;
        iconColor?: string;
        iconPosition?: 'left' | 'right';
        onPress: () => void;
    }[];
}

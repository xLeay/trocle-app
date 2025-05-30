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

    iconName?: React.ElementType;

    canGoBack?: boolean;
    onBack?: () => void;

    label?: string;

    search?: string;
    setSearch?: (text: string) => void;
    placeHolder?: string;

    progress?: number;
    progressBarType?: 'primary' | 'mono';

    tableLeft?: TableLeftProps;
    tableRight?: TableRightProps;

    rightArea?: {
        label?: string;
        iconName?: React.ElementType;
        iconPosition?: 'left' | 'right';
        onPress: () => void;
    }[];
}

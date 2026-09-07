import { ActivityIndicator } from 'react-native';

import { useTheme } from '@/src/lib/hooks/useTheme';

import { Category } from '@/src/lib/api/category';

import { BIG_CATEGORY, getCategoryIcon } from '@/src/lib/utils/product';


import Chip from '#/controls/Chip';
import Flex from '#/Flex';
import Text from '#/Text';

interface PreferencesProps {
    value: number[];
    onChange: (categories: number[]) => void;
    categories: Category[];
    isLoadingCategories: boolean;
    categoriesError: Error | null;
}

function Preferences({
    value,
    onChange,
    categories,
    isLoadingCategories,
    categoriesError
}: PreferencesProps) {
    const { activeTheme } = useTheme();

    return (
        <Flex fullWidth gap={activeTheme.spacing._200}>
            <Text variant='body_Medium' type='primary'>Choisis au moins 3 catégories</Text>
            <Flex
                direction='row'
                style={{
                    flexWrap: 'wrap',
                    rowGap: activeTheme.spacing._200,
                    columnGap: activeTheme.spacing._100,
                    paddingBottom: activeTheme.spacing._200
                }}
            >
                {isLoadingCategories ? (
                    <Flex fullWidth alignItems='center'>
                        <ActivityIndicator size="large" color={activeTheme.colors.surface.brand} />
                    </Flex>
                ) : categoriesError ? (
                    <Flex fullWidth>
                        <Text variant='body_Large'>Erreur lors du chargement des catégories</Text>
                    </Flex>
                ) : categories.map((category) => (
                    <Chip
                        key={category.id}
                        large
                        chipStyle='outlined'
                        label={category.name}
                        icon={getCategoryIcon(category.slug as keyof typeof BIG_CATEGORY, 24)}
                        iconPosition='left'
                        selected={value.includes(category.id)}
                        onPress={() => onChange(value.includes(category.id) ? value.filter((id) => id !== category.id) : [...value, category.id])}
                    />
                ))}
            </Flex>
        </Flex>
    );
}

export default Preferences;

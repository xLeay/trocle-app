import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable } from 'react-native';

import { useDebounce } from '@/src/lib/hooks/useDebounce';
import { useTheme } from '@/src/lib/hooks/useTheme';
import {
    LocationAddress,
    searchCity,
} from '@/src/lib/utils/geocoding';

import Flex from '#/Flex';
import Text from '#/Text';
import TextField from '#/controls/TextField';

import { Mylocation } from '#/icons';

type Props = {
    value: LocationAddress | null;
    onChange: (location: LocationAddress | null) => void;
    onUseCurrentLocation: () => void;
    label?: string;
    placeholder?: string;
};

export default function LocationAutocompleteField({
    value,
    onChange,
    onUseCurrentLocation,
    label = 'Localisation',
    placeholder = 'Ville, code postal',
}: Props) {
    const { activeTheme } = useTheme();

    const [searchValue, setSearchValue] = useState(value?.label ?? '');
    const [predictions, setPredictions] = useState<LocationAddress[]>([]);
    const [loading, setLoading] = useState(false);
    const [showPredictions, setShowPredictions] = useState(false);

    const debouncedSearchValue = useDebounce(searchValue, 350);

    useEffect(() => {
        setSearchValue(value?.label ?? '');
    }, [value?.label]);

    useEffect(() => {
        let active = true;

        const loadPredictions = async () => {
            const query = debouncedSearchValue.trim();

            if (query.length < 3) {
                setPredictions([]);
                setShowPredictions(false);
                return;
            }

            setLoading(true);

            try {
                const results = await searchCity(query);

                if (active) {
                    setPredictions(results);
                    setShowPredictions(true);
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        void loadPredictions();

        return () => {
            active = false;
        };
    }, [debouncedSearchValue]);

    return (
        <Flex style={{ width: '100%', position: 'relative', zIndex: 20 }}>
            <TextField
                type="action"
                label={label}
                placeholder={placeholder}
                value={searchValue}
                icon={<Mylocation />}
                action={onUseCurrentLocation}
                onChangeText={(text) => {
                    setSearchValue(text);
                    onChange(null);
                }}
            />

            {showPredictions && (
                <Flex
                    style={{
                        position: 'absolute',
                        top: 76,
                        left: 0,
                        right: 0,
                        zIndex: 50,
                        padding: activeTheme.spacing._100,
                        borderRadius: activeTheme.radius.default,
                        backgroundColor: activeTheme.colors.surface.primary,
                        borderWidth: 1,
                        borderColor: activeTheme.colors.surface.divider,
                    }}
                >
                    {loading && (
                        <Flex
                            alignItems="center"
                            style={{ padding: activeTheme.spacing._200 }}
                        >
                            <ActivityIndicator
                                color={activeTheme.colors.icon.brand}
                            />
                        </Flex>
                    )}

                    {!loading &&
                        predictions.map((prediction) => (
                            <Pressable
                                key={`${prediction.latitude}-${prediction.longitude}`}
                                onPress={() => {
                                    setSearchValue(prediction.label);
                                    setPredictions([]);
                                    setShowPredictions(false);
                                    onChange(prediction);
                                }}
                                style={{
                                    padding: activeTheme.spacing._100,
                                }}
                            >
                                <Text variant="body_Medium">
                                    {prediction.name}
                                </Text>

                                <Text
                                    variant="body_Small"
                                    type="secondary"
                                >
                                    {prediction.postcode} {prediction.city}
                                </Text>
                            </Pressable>
                        ))}

                    {!loading && predictions.length === 0 && (
                        <Text
                            variant="body_Small"
                            type="secondary"
                            style={{ padding: activeTheme.spacing._100 }}
                        >
                            Aucun résultat trouvé
                        </Text>
                    )}
                </Flex>
            )}
        </Flex>
    );
}
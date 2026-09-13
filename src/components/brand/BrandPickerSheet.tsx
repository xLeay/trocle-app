import React, { useEffect, useMemo, useState } from 'react';

import { Brand } from '@/src/lib/api/brand';
import { useBrands } from '@/src/queries/useBrandQueries';

import { useTheme } from '@/src/lib/hooks/useTheme';

import SearchBar from '#/bars/SearchBar';
import Button from '#/controls/Button';
import Radio from '#/controls/Radio';
import BottomSheet, { BottomSheetRef } from '#/display/BottomSheet';
import Table from '#/display/Table';
import Flex from '#/Flex';
import Text from '#/Text';

export type BrandSelection =
    | Brand
    | {
        id: null;
        name: string;
        isVerified: false;
    };

type Props = {
    sheetRef: React.RefObject<BottomSheetRef | null>;
    value: BrandSelection | null;
    onChange: (brand: BrandSelection) => void;
};

export default function BrandPickerSheet({
    sheetRef,
    value,
    onChange,
}: Props) {
    const { activeTheme } = useTheme();

    const { data: brands = [], isLoading } = useBrands();

    const [search, setSearch] = useState('');
    const [tempValue, setTempValue] = useState<BrandSelection | null>(value);

    useEffect(() => {
        setTempValue(value);
    }, [value]);

    const normalizedSearch = search.trim().toLocaleLowerCase('fr');

    const filteredBrands = useMemo(
        () =>
            brands.filter((brand) =>
                brand.name.toLocaleLowerCase('fr').includes(normalizedSearch),
            ),
        [brands, normalizedSearch],
    );

    const sansBrand = filteredBrands.find(
        (brand) => brand.name.toLocaleLowerCase('fr') === 'sans marque',
    );

    const officialBrands = filteredBrands.filter(
        (brand) =>
            brand.id !== sansBrand?.id &&
            brand.isVerified,
    );

    const communityBrands = filteredBrands.filter(
        (brand) =>
            brand.id !== sansBrand?.id &&
            !brand.isVerified,
    );

    const exactMatch = brands.some(
        (brand) =>
            brand.name.toLocaleLowerCase('fr') === normalizedSearch,
    );

    const canCreate =
        normalizedSearch.length >= 2 &&
        !exactMatch;

    const isSelected = (brand: BrandSelection) =>
        tempValue?.id === brand.id &&
        tempValue?.name === brand.name;

    const selectBrand = (brand: BrandSelection) => {
        setTempValue(brand);
    };

    return (
        <BottomSheet
            ref={sheetRef}
            title="Marque"
            headerVariant="text + icon"
            maxHeight="85%"
            onClose={() => {
                setTempValue(value);
                setSearch('');
            }}
            actions={
                <>
                    <Button
                        label="Réinitialiser"
                        variant="outlined"
                        size="large"
                        fullWidth
                        disabled={tempValue === null}
                        onPress={() => setTempValue(null)}
                    />

                    <Button
                        label="Appliquer"
                        variant="secondary"
                        size="large"
                        fullWidth
                        disabled={!tempValue}
                        onPress={() => {
                            if (!tempValue) {
                                return;
                            }

                            onChange(tempValue);
                            sheetRef.current?.dismiss();
                        }}
                    />
                </>
            }
        >

            <Flex gap={activeTheme.spacing._200}>
                <Flex style={{ paddingHorizontal: activeTheme.spacing._200 }}>
                    <SearchBar
                        value={search}
                        onChangeText={setSearch}
                        placeholder="Rechercher une marque"
                    />
                </Flex>

                {isLoading ? (
                    <Text type="secondary">Chargement des marques…</Text>
                ) : (
                    <>
                        {sansBrand && (
                            <Table
                                leftProps={{
                                    variant: 'empty',
                                    leftText: sansBrand.name,
                                }}
                                rightProps={{
                                    variant: 'radio',
                                    radio: (
                                        <Radio
                                            checked={isSelected(sansBrand)}
                                            onValueChange={() => selectBrand(sansBrand)}
                                        />
                                    ),
                                }}
                                onPress={() => selectBrand(sansBrand)}
                            />
                        )}

                        {officialBrands.length > 0 && (
                            <Flex gap={activeTheme.spacing._100} fullWidth>
                                <Text
                                    variant="label_Medium"
                                    type="secondary"
                                    containerStyle={{ paddingHorizontal: activeTheme.spacing._200 }}
                                >
                                    Marques officielles
                                </Text>

                                <Flex fullWidth gap={activeTheme.spacing._0}>
                                    {officialBrands.map((brand) => (
                                        <Table
                                            key={brand.id}
                                            leftProps={{
                                                variant: 'empty',
                                                leftText: brand.name,
                                                certified: true,
                                                certificationColor: activeTheme.colors.icon.blue
                                            }}
                                            rightProps={{
                                                variant: 'radio',
                                                radio: (
                                                    <Radio
                                                        checked={isSelected(brand)}
                                                        onValueChange={() => selectBrand(brand)}
                                                    />
                                                ),
                                            }}
                                            onPress={() => selectBrand(brand)}
                                        />
                                    ))}
                                </Flex>
                            </Flex>
                        )}

                        {communityBrands.length > 0 && (
                            <Flex gap={activeTheme.spacing._100} fullWidth>
                                <Text
                                    variant="label_Medium"
                                    type="secondary"
                                    containerStyle={{ paddingHorizontal: activeTheme.spacing._200 }}
                                >
                                    Autres marques
                                </Text>

                                <Flex fullWidth gap={activeTheme.spacing._0}>
                                    {communityBrands.map((brand) => (
                                        <Table
                                            key={brand.id}
                                            leftProps={{
                                                variant: 'empty',
                                                leftText: brand.name,
                                            }}
                                            rightProps={{
                                                variant: 'radio',
                                                radio: (
                                                    <Radio
                                                        checked={isSelected(brand)}
                                                        onValueChange={() => selectBrand(brand)}
                                                    />
                                                ),
                                            }}
                                            onPress={() => selectBrand(brand)}
                                        />
                                    ))}
                                </Flex>
                            </Flex>
                        )}

                        {canCreate && (
                            <Table
                                leftProps={{
                                    variant: 'empty',
                                    leftText: `Créer « ${search.trim()} »`,
                                    legendText: 'Nouvelle marque',
                                }}
                                rightProps={{
                                    variant: 'radio',
                                    radio: (
                                        <Radio
                                            checked={
                                                tempValue?.id === null &&
                                                tempValue?.name === search.trim()
                                            }
                                            onValueChange={() =>
                                                selectBrand({
                                                    id: null,
                                                    name: search.trim(),
                                                    isVerified: false,
                                                })
                                            }
                                        />
                                    ),
                                }}
                                onPress={() =>
                                    selectBrand({
                                        id: null,
                                        name: search.trim(),
                                        isVerified: false,
                                    })
                                }
                            />
                        )}

                        {!sansBrand &&
                            officialBrands.length === 0 &&
                            communityBrands.length === 0 &&
                            !canCreate && (
                                <Text type="secondary">
                                    Aucune marque trouvée.
                                </Text>
                            )}
                    </>
                )}
            </Flex>
        </BottomSheet>
    );
}
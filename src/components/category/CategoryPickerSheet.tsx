import React, { useEffect, useMemo, useState } from 'react';

import { Category } from '@/src/lib/api/category';
import { getCategoryIcon } from '@/src/lib/utils/product';
import { useCategories } from '@/src/queries/useCategoryQueries';

import Flex from '#/Flex';
import Text from '#/Text';
import Button from '#/controls/Button';
import Radio from '#/controls/Radio';
import BottomSheet, { BottomSheetRef } from '#/display/BottomSheet';
import Table from '#/display/Table';

type Props = {
    sheetRef: React.RefObject<BottomSheetRef | null>;
    value: Category | null;
    onChange: (category: Category | null) => void;
};

export default function CategoryPickerSheet({
    sheetRef,
    value,
    onChange,
}: Props) {
    const { data: categories = [], isLoading } = useCategories();

    const [tempValue, setTempValue] = useState<Category | null>(value);
    const [path, setPath] = useState<number[]>([]);

    useEffect(() => {
        setTempValue(value);
    }, [value]);

    const currentParentId = path[path.length - 1] ?? null;

    const currentCategory = categories.find(
        (category) => category.id === currentParentId
    );

    const hasChildren = (categoryId: number) =>
        categories.some((category) => category.parentId === categoryId);

    const visibleCategories = useMemo(() => {
        return categories
            .filter((category) => category.parentId === currentParentId)
            .sort((first, second) => {
                const firstIsLeaf = hasChildren(first.id) ? 0 : 1;
                const secondIsLeaf = hasChildren(second.id) ? 0 : 1;

                return (
                    firstIsLeaf - secondIsLeaf ||
                    first.name.localeCompare(second.name, 'fr')
                );
            });
    }, [categories, currentParentId]);

    const selectedPath = useMemo(() => {
        if (!tempValue) {
            return [];
        }

        const result: Category[] = [];
        let current: Category | undefined = tempValue;

        while (current) {
            result.unshift(current);

            current = categories.find(
                (category) => category.id === current?.parentId
            );
        }

        return result;
    }, [categories, tempValue]);

    const handleCategoryPress = (category: Category) => {
        if (hasChildren(category.id)) {
            setPath((previous) => [...previous, category.id]);
            return;
        }

        setTempValue(category);
    };

    return (
        <BottomSheet
            ref={sheetRef}
            headerVariant="text + icon"
            title={currentCategory?.name ?? 'Catégorie'}
            canGoBack={path.length > 0}
            onBack={() => {
                setPath((previous) => previous.slice(0, -1));
            }}
            onClose={() => {
                setPath([]);
                setTempValue(value);
            }}
            actions={
                <>
                    <Button
                        label="Réinitialiser"
                        variant="outlined"
                        size="large"
                        fullWidth
                        disabled={!tempValue}
                        onPress={() => setTempValue(null)}
                    />

                    <Button
                        label="Appliquer"
                        variant="secondary"
                        size="large"
                        fullWidth
                        onPress={() => {
                            onChange(tempValue);
                            sheetRef.current?.dismiss();
                        }}
                    />
                </>
            }
        >
            {isLoading ? (
                <Flex alignItems="center">
                    <Text>Chargement des catégories…</Text>
                </Flex>
            ) : (
                visibleCategories.map((category) => {
                    const categoryHasChildren = hasChildren(category.id);

                    const selectedPathIndex = selectedPath.findIndex(
                        (selectedCategory) =>
                            selectedCategory.id === category.id
                    );

                    const isSelectedBranch = selectedPathIndex >= 0;

                    const selectedDescendantText =
                        selectedPathIndex >= 0
                            ? selectedPath
                                .slice(selectedPathIndex + 1)
                                .map(
                                    (selectedCategory) =>
                                        selectedCategory.name
                                )
                                .join(' · ')
                            : '';

                    const isRootCategory = category.parentId === null;

                    return (
                        <Table
                            key={category.id}
                            leftProps={{
                                variant: isRootCategory ? 'icon' : 'empty',
                                icon: isRootCategory
                                    ? getCategoryIcon(category.slug, 20)
                                    : undefined,
                                leftText: category.name,
                            }}
                            rightProps={
                                categoryHasChildren
                                    ? {
                                        variant: 'text',
                                        rightText: selectedDescendantText,
                                        chevron: true,
                                        active: isSelectedBranch,
                                    }
                                    : {
                                        variant: 'radio',
                                        radio: (
                                            <Radio
                                                checked={
                                                    tempValue?.id ===
                                                    category.id
                                                }
                                                onValueChange={() =>
                                                    setTempValue(category)
                                                }
                                            />
                                        ),
                                    }
                            }
                            onPress={() =>
                                handleCategoryPress(category)
                            }
                        />
                    );
                })
            )}
        </BottomSheet>
    );
}
import { useEffect, useMemo, useState } from 'react';

import { AttributeValue } from '#/category/CategoryAttributesSheet';
import { CategoryAttribute } from '@/src/lib/api/category';

export function useCategoryAttributeValues(
    categoryId: number | null | undefined,
    categoryAttributes: CategoryAttribute[] = []
) {
    const [attributeValues, setAttributeValues] = useState<Record<number, AttributeValue>>({});
    const [activeAttribute, setActiveAttribute] = useState<CategoryAttribute | null>(null);

    // À chaque changement de catégorie, on réinitialise les attributs
    useEffect(() => {
        setAttributeValues({});
        setActiveAttribute(null);
    }, [categoryId]);

    const getAttributeText = (attribute: CategoryAttribute) => {
        const value = attributeValues[attribute.id];

        if (!value) {
            return '';
        }

        const values = Array.isArray(value) ? value : [value];

        return values
            .map(
                (selectedValue) =>
                    attribute.options.find(
                        (option) => option.value === selectedValue
                    )?.name ?? selectedValue
            )
            .join(', ');
    };

    const setAttributeValue = (attributeId: number, value: string) => {
        setAttributeValues((previous) => ({
            ...previous,
            [attributeId]: value,
        }));
    };

    const toggleAttributeValue = (attributeId: number, value: string) => {
        setAttributeValues((previous) => {
            const currentValue = previous[attributeId];

            const currentValues = Array.isArray(currentValue)
                ? currentValue
                : [];

            const alreadySelected = currentValues.includes(value);

            return {
                ...previous,
                [attributeId]: alreadySelected
                    ? currentValues.filter((item) => item !== value)
                    : [...currentValues, value],
            };
        });
    };

    const clearAttributeValue = (attributeId: number) => {
        setAttributeValues((previous) => {
            const next = { ...previous };
            delete next[attributeId];
            return next;
        });
    };

    const requiredAttributesValid = useMemo(() => {
        return categoryAttributes
            .filter((attribute) => attribute.required)
            .every((attribute) => {
                const value = attributeValues[attribute.id];

                return Array.isArray(value)
                    ? value.length > 0
                    : typeof value === 'string' && value.trim().length > 0;
            });
    }, [categoryAttributes, attributeValues]);

    return {
        attributeValues,
        activeAttribute,
        setActiveAttribute,
        getAttributeText,
        setAttributeValue,
        toggleAttributeValue,
        clearAttributeValue,
        requiredAttributesValid,
    };
}

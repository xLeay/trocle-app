import React from 'react';

import { CategoryAttribute } from '@/src/lib/api/category';

import Button from '#/controls/Button';
import Checkbox from '#/controls/Checkbox';
import Radio from '#/controls/Radio';
import BottomSheet, { BottomSheetRef } from '#/display/BottomSheet';
import Table from '#/display/Table';

export type AttributeValue = string | string[];

interface CategoryAttributesSheetProps {
    sheetRef: React.RefObject<BottomSheetRef | null>;
    attribute: CategoryAttribute | null;
    values: Record<number, AttributeValue>;
    onSetValue: (attributeId: number, value: string) => void;
    onToggleValue: (attributeId: number, value: string) => void;
    onClearValue: (attributeId: number) => void;
}

export default function CategoryAttributesSheet({
    sheetRef,
    attribute,
    values,
    onSetValue,
    onToggleValue,
    onClearValue,
}: CategoryAttributesSheetProps) {
    if (!attribute) return null;

    const currentValue = values[attribute.id];
    const isMultiple = attribute.inputType === 'multi_select';

    return (
        <BottomSheet
            ref={sheetRef}
            headerVariant="text + icon"
            title={attribute.name}
            actions={
                <>
                    <Button
                        label="Réinitialiser"
                        variant="outlined"
                        size="large"
                        fullWidth
                        disabled={!currentValue}
                        onPress={() => onClearValue(attribute.id)}
                    />

                    <Button
                        label="Appliquer"
                        variant="secondary"
                        size="large"
                        fullWidth
                        onPress={() => sheetRef.current?.dismiss()}
                    />
                </>
            }
        >
            {attribute.options.map((option) => {
                const checked = isMultiple
                    ? Array.isArray(currentValue) && currentValue.includes(option.value)
                    : currentValue === option.value;

                return (
                    <Table
                        key={option.id}
                        leftProps={{
                            variant: 'empty',
                            leftText: option.name,
                        }}
                        rightProps={
                            isMultiple
                                ? {
                                    variant: 'checkbox',
                                    checkbox: (
                                        <Checkbox
                                            checked={checked}
                                            onValueChange={() =>
                                                onToggleValue(attribute.id, option.value)
                                            }
                                        />
                                    ),
                                }
                                : {
                                    variant: 'radio',
                                    radio: (
                                        <Radio
                                            checked={checked}
                                            onValueChange={() =>
                                                onSetValue(attribute.id, option.value)
                                            }
                                        />
                                    ),
                                }
                        }
                        onPress={() => {
                            if (isMultiple) {
                                onToggleValue(attribute.id, option.value);
                            } else {
                                onSetValue(attribute.id, option.value);
                            }
                        }}
                    />
                );
            })}
        </BottomSheet>
    );
}

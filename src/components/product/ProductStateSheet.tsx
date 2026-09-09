import React from 'react';

import { State } from '@/src/lib/api/condition';
import { useStates } from '@/src/queries/useStateQueries';

import Button from '#/controls/Button';
import Radio from '#/controls/Radio';
import BottomSheet, { BottomSheetRef } from '#/display/BottomSheet';
import Table from '#/display/Table';

interface ProductStateSheetProps {
    sheetRef: React.RefObject<BottomSheetRef | null>;
    value: State | null;
    onChange: (state: State | null) => void;
}

export default function ProductStateSheet({
    sheetRef,
    value,
    onChange,
}: ProductStateSheetProps) {
    const { data: productStates = [] } = useStates();

    return (
        <BottomSheet
            ref={sheetRef}
            headerVariant="text + icon"
            title="État de l'article"
            actions={
                <>
                    <Button
                        label="Réinitialiser"
                        variant="outlined"
                        size="large"
                        fullWidth
                        disabled={!value}
                        onPress={() => onChange(null)}
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
            {productStates.map((state) => (
                <Table
                    key={state.id}
                    leftProps={{
                        leftText: state.name,
                    }}
                    rightProps={{
                        variant: 'radio',
                        radio: (
                            <Radio
                                checked={value?.id === state.id}
                                onValueChange={() => onChange(state)}
                            />
                        ),
                    }}
                    onPress={() => onChange(state)}
                />
            ))}
        </BottomSheet>
    );
}

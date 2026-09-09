import React from 'react';

import BottomSheet, { BottomSheetRef } from '#/display/BottomSheet';
import Table from '#/display/Table';
import { Image, Photo } from '#/icons';

interface PhotoPickerSheetProps {
    sheetRef: React.RefObject<BottomSheetRef | null>;
    onSelectCamera: () => void;
    onSelectLibrary: () => void;
}

export default function PhotoPickerSheet({
    sheetRef,
    onSelectCamera,
    onSelectLibrary,
}: PhotoPickerSheetProps) {
    return (
        <BottomSheet
            ref={sheetRef}
            headerVariant="handle"
        >
            <Table
                leftProps={{
                    leftText: 'Prendre une photo',
                    icon: <Photo />,
                    variant: 'icon',
                }}
                rightProps={{ variant: 'empty' }}
                onPress={() => {
                    sheetRef.current?.dismiss();
                    onSelectCamera();
                }}
            />

            <Table
                leftProps={{
                    leftText: 'Choisir une photo',
                    icon: <Image />,
                    variant: 'icon',
                }}
                rightProps={{ variant: 'empty' }}
                onPress={() => {
                    sheetRef.current?.dismiss();
                    onSelectLibrary();
                }}
            />
        </BottomSheet>
    );
}

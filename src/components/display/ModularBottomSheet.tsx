import React, { useCallback, useMemo, useState, forwardRef, useEffect } from 'react';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetScrollView, BottomSheetHandleProps } from '@gorhom/bottom-sheet';
import { FlashList } from '@shopify/flash-list';

import { useTheme } from '@/src/lib/hooks/useTheme';

import Flex from '#/Flex';
import Text from '#/Text';
import Button from '#/controls/Button';
import Table from '#/display/Table';
import { TableRightProps } from '#/_partial/TableRight';

import { Arrowleft, Close } from '#/icons';

type Item = {
    id: number | string;
    name: string;
    parentId?: number | string | null;
    [key: string]: any;
    leftIcon?: React.ReactNode;
    legendText?: string;
    leftVariant?: 'avatar' | 'empty' | 'icon';
};

type ModularBottomSheetTopVariant = 'handle' | 'empty' | 'icon' | 'text + icon';

type ModularBottomSheetProps = {
    data: Item[];
    allData?: Item[];
    onClose: () => void;
    onSelect: (item: Item) => void;
    renderRight?: (item: Item, selected: boolean, rightText: string) => TableRightProps;
    getChildren?: (item: Item, allData: Item[]) => Item[];
    initialTitle?: string;
    selectedId?: number | string | null;
    snapPoints?: string[];
    enableDynamicSizing?: boolean;
    topVariant?: ModularBottomSheetTopVariant;
    iconPosition?: 'left' | 'right';
    icon?: React.ReactNode;
    showButtons?: boolean;
    buttons?: React.ReactNode[];
    onStackChange?: (stack: Item[][], path: Item[]) => void;
};

const ModularBottomSheet = forwardRef<BottomSheetModal, ModularBottomSheetProps>(({
    data,
    allData,
    onClose,
    onSelect,
    renderRight,
    getChildren,
    initialTitle,
    selectedId,
    snapPoints = ['50%'],
    enableDynamicSizing = true,
    topVariant = 'handle',
    iconPosition = 'left',
    icon,
    showButtons = true,
    buttons,
    onStackChange,
}, ref) => {
    const { activeTheme } = useTheme();

    const [stack, setStack] = useState<Item[][]>([data]);
    const [path, setPath] = useState<Item[]>([]);

    const x_snapPoints = useMemo(() => snapPoints, []);

    const currentData = stack[stack.length - 1];

    const localTitle = useMemo(() => {
        return path.length > 0
            ? path[path.length - 1]?.name
            : initialTitle || '';
    }, [path, initialTitle]);

    const localIcon = useMemo(() => {
        return stack.length > 1 ? <Arrowleft /> : icon ?? <Close />;
    }, [stack, icon]);

    useEffect(() => {
        requestAnimationFrame(() => {
            onStackChange?.(stack, path);
        });
    }, [stack, path]);

    const handleItemPress = useCallback(
        (item: Item) => {
            if (getChildren) {
                const children = getChildren(item, allData ?? data);
                if (children.length > 0) {
                    setStack((prev) => [...prev, children]);
                    setPath((prev) => [...prev, item]);
                    return;
                }
            }
            onSelect(item);
            // onClose();
        },
        [getChildren, data, allData, onSelect] //, onClose]
    );

    const handleBack = useCallback(() => {
        setStack((prev) => prev.slice(0, -1));
        setPath((prev) => prev.slice(0, -1));
    }, []);

    const renderBackdrop = (props: any) => (
        <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            pressBehavior="close"
        />
    );

    const MIN_TOP_SIZE = 48;
    const MAX_TOP_SIZE = 64;
    const renderHandle = (props: BottomSheetHandleProps) => (
        <Flex
            direction='row'
            alignItems='center'
            justifyContent='space-between'
            {...props}
            style={{
                height: topVariant === 'text + icon' ? MAX_TOP_SIZE : MIN_TOP_SIZE,
                borderTopLeftRadius: activeTheme.radius.modal,
                borderTopRightRadius: activeTheme.radius.modal,
                paddingHorizontal: activeTheme.spacing._200,

                // backgroundColor: '#FF000015',
            }}
        >
            {topVariant === 'handle' && (
                <>
                    <Flex />
                    <Flex
                        style={{
                            width: 48,
                            height: 5,
                            borderRadius: 24,
                            backgroundColor: activeTheme.colors.surface.field,
                        }}
                    />
                    <Flex />
                </>
            )}
            {topVariant === 'empty' && (<Flex />)}
            {topVariant === 'icon' && (
                <Flex style={{ width: '100%', flexDirection: iconPosition === 'left' ? 'row' : 'row-reverse' }}>
                    <Button icon={localIcon} variant='ghost' size='small' onPress={stack.length > 1 ? handleBack : onClose} />
                </Flex>
            )}
            {topVariant === 'text + icon' && (
                <Flex alignItems='center' justifyContent='space-between' style={{ width: '100%', flexDirection: iconPosition === 'left' ? 'row' : 'row-reverse' }}>
                    <Button icon={localIcon} variant='ghost' size='small' onPress={stack.length > 1 ? handleBack : onClose} />
                    <Text variant='title_Large' type='primary'>{localTitle}</Text>
                </Flex>
            )}
        </Flex>
    );

    const getAncestorsMap = (selectedItem: Item | undefined, allData: Item[]): Record<number | string, boolean> => {
        const map: Record<number | string, boolean> = {};
        let current = selectedItem;
        while (current && current.parentId != null) {
            map[current.parentId] = true;
            current = allData.find((el) => el.id === current?.parentId);
        }
        return map;
    };

    const selectedItem = useMemo(() => allData?.find((el) => el.id === selectedId), [allData, selectedId]);
    const ancestorsMap = useMemo(() => selectedItem ? getAncestorsMap(selectedItem, allData ?? data) : {}, [selectedItem, allData, data]);

    return (
        <BottomSheetModal
            ref={ref}
            snapPoints={enableDynamicSizing ? undefined : x_snapPoints}
            enableDynamicSizing={enableDynamicSizing}
            backdropComponent={renderBackdrop}
            handleComponent={renderHandle}
            backgroundStyle={{ backgroundColor: activeTheme.colors.surface.secondary }}
            onDismiss={onClose}
            enablePanDownToClose
        >
            <BottomSheetScrollView
                contentContainerStyle={{ marginBottom: activeTheme.spacing._200 }}
                showsVerticalScrollIndicator={false}
            >
                <FlashList
                    data={currentData}
                    extraData={{ selectedId }}
                    estimatedItemSize={60}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item }) => {
                        const isAncestor = item.id in ancestorsMap;
                        const rightText = isAncestor ? selectedItem?.name ?? '' : '';

                        return (
                            <Table
                                leftProps={{
                                    leftText: item.name,
                                    icon: item.leftIcon,
                                    legendText: item.legendText,
                                    variant: item.leftVariant,
                                }}
                                rightProps={
                                    renderRight
                                        ? renderRight(item, selectedId === item.id, rightText ?? '')
                                        : { variant: 'text', active: true, rightText: rightText ?? '' }
                                }
                                onPress={() => handleItemPress(item)}
                            />
                        );
                    }}
                />
            </BottomSheetScrollView>

            {showButtons && buttons && buttons.length > 0 && (
                <Flex
                    direction='row'
                    alignItems='center'
                    gap={activeTheme.spacing._100}
                    style={{ paddingHorizontal: activeTheme.spacing._200, paddingVertical: activeTheme.spacing._200 }}
                >
                    {buttons.map((button, i) => (
                        <Flex key={i} style={{ flex: 1 }}>
                            {button}
                        </Flex>
                    ))}
                </Flex>
            )}
        </BottomSheetModal>
    );
});

export default ModularBottomSheet;
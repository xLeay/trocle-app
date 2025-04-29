import React from "react";
import { View } from "react-native";

import { TopAppBarProps } from "./types";

// Composants
import Flex from "#/Flex";
import Text from "#/Text";
import Button from "#/controls/Button";
import SearchBar from "#/bars/SearchBar";
import ProgressBar from "#/display/ProgressBar";
import Table from "#/display/Table";

// Icônes
import { Circle, ArrowLeft } from "#/icons";
import { TrocleLogoFull } from "#/logos";


function ensureFunction<T extends (...args: any[]) => any>(fn?: T): T {
    return fn ?? ((() => { }) as T);
}

const topAppBarConfigs = {
    _layout: {
        left: null,
        // Nécessite : label: string
        center: ({ label = "Titre" }: TopAppBarProps) => <Text variant="title_Medium">{label}</Text>,
        right: null,
    },

    _application: {
        left: <View />,
        center: <TrocleLogoFull variant="medium" color="black" />,
        // Nécessite : onPress: function, iconName: string
        right: ({ onPress, iconName }: TopAppBarProps) =>
            <Button icon={iconName ? React.createElement(iconName) : <Circle />} variant="ghost" size="small" onPress={onPress} />,
    },

    _center: {
        // Nécessite : canGoBack: boolean, onBack: function
        left: ({ canGoBack, onBack }: TopAppBarProps) => canGoBack ? (
            <Button icon={<ArrowLeft />} variant="ghost" size="small" onPress={onBack} />
        ) : <View />,
        // Nécessite : label: string
        center: ({ label = "Titre" }: TopAppBarProps) => <Text variant="title_Medium">{label}</Text>,
        // Nécessite : onPress: function, iconName: string
        right: ({ onPress, iconName }: TopAppBarProps) =>
            <Button icon={iconName ? React.createElement(iconName) : <Circle />} variant="ghost" size="small" onPress={onPress} />,
    },

    _search: {
        left: null,
        // Nécessite : search: string, setSearch: function, placeHolder: string
        center: ({ search, setSearch, placeHolder }: TopAppBarProps) => (
            <SearchBar value={search} onChangeText={ensureFunction(setSearch)} placeholder={placeHolder} />
        ),
        right: null,
    },

    _withProgressBar: {
        // Nécessite : canGoBack: boolean, onBack: function
        left: ({ canGoBack, onBack }: TopAppBarProps) => canGoBack ? (
            <Button icon={<ArrowLeft />} variant="ghost" size="small" onPress={onBack} />
        ) : <View />,
        // Nécessite : progress: number, progressBarType: primary | mono
        center: ({ progress, progressBarType }: TopAppBarProps) => (
            <ProgressBar progress={progress ?? 0} type={progressBarType} />
        ),
        // Nécessite : label: string
        right: ({ label }: TopAppBarProps) => <Text variant="title_Medium">{label}</Text>,
    },

    "_small+table": {
        // Nécessite : canGoBack: boolean, onBack: function, tableLeft: TableLeftProps, tableRight: TableRightProps
        left: ({ canGoBack, onBack, tableLeft, tableRight }: TopAppBarProps) => (
            <Flex direction="row" gap={4} style={{ flex: 1 }}>
                {canGoBack ? (
                    <Button icon={<ArrowLeft />} variant="ghost" size="small" onPress={onBack} />
                ) : <View style={{ width: 32 }} />}
                <Table leftProps={tableLeft} rightProps={tableRight} style={{ flex: 1 }} />
            </Flex>
        ),
        center: null,
        right: null,
    },

    _small: {
        // Nécessite : canGoBack: boolean, onBack: function, label: string
        left: ({ canGoBack, onBack, label }: TopAppBarProps) => (
            <Flex direction="row" gap={16} style={{ flex: 1 }}>
                {canGoBack ? (
                    <Button icon={<ArrowLeft />} variant="ghost" size="small" onPress={onBack} />
                ) : <View style={{ width: 32 }} />}
                <Text variant="title_Medium">{label}</Text>
            </Flex>
        ),
        center: null,
        // Nécessite : rightArea: {iconName?: nomIcone; onPress: function}[]
        right: ({ rightArea }: TopAppBarProps) => (
            <Flex direction="row" gap={8}>
                {rightArea?.map((action, idx) => (
                    <Button
                        key={idx}
                        icon={action.iconName ? React.createElement(action.iconName) : <Circle />}
                        variant="ghost"
                        size="small"
                        onPress={action.onPress}
                    />
                ))}
            </Flex>
        ),
    },

    _medium: {
        left: null,
        // Nécessite : canGoBack: boolean, onBack: function, label: string, rightArea: {iconName?: nomIcone; onPress: function}[]
        center: ({ canGoBack, onBack, label, rightArea }: TopAppBarProps) => (
            <Flex gap={8} border borderColor="blue" style={{ flex: 1, paddingBottom: 24 }}>
                <Flex direction="row" border borderColor="black" justifyContent="space-between" style={{ width: '100%'}}>
                    {!canGoBack ? (
                        <Button icon={<ArrowLeft />} variant="ghost" size="small" onPress={onBack} />
                    ) : <View style={{ width: 32 }} />}

                    <Flex direction="row" border borderColor="red" gap={8}>
                        {rightArea?.map((action, idx) => (
                            <Button
                                key={idx}
                                icon={action.iconName ? React.createElement(action.iconName) : <Circle />}
                                variant="ghost"
                                size="small"
                                onPress={action.onPress}
                            />
                        ))}
                    </Flex>
                </Flex>
                <Flex border borderColor="green" direction="row" gap={8} style={{ width: '100%', paddingHorizontal: 8 }}>
                    <Text variant="title_Medium">{label}</Text>
                </Flex>
            </Flex>
        ),
        right: null,
    },

    _large: {
        left: null,
        // Nécessite : canGoBack: boolean, onBack: function, label: string, rightArea: {iconName?: nomIcone; onPress: function}[]
        center: ({ canGoBack, onBack, label, rightArea }: TopAppBarProps) => (
            <Flex gap={32} style={{ flex: 1, paddingBottom: 28 }}>
                <Flex direction="row" justifyContent="space-between" style={{ width: '100%'}}>
                    {!canGoBack ? (
                        <Button icon={<ArrowLeft />} variant="ghost" size="small" onPress={onBack} />
                    ) : <View style={{ width: 32 }} />}

                    <Flex direction="row" gap={8}>
                        {rightArea?.map((action, idx) => (
                            <Button
                                key={idx}
                                icon={action.iconName ? React.createElement(action.iconName) : <Circle />}
                                variant="ghost"
                                size="small"
                                onPress={action.onPress}
                            />
                        ))}
                    </Flex>
                </Flex>
                <Flex direction="row" gap={8} style={{ width: '100%', paddingHorizontal: 8 }}>
                    <Text variant="display_Small">{label}</Text>
                </Flex>
            </Flex>
        ),
        right: null,
    },
}

export default topAppBarConfigs;

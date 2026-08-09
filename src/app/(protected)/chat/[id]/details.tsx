import React, { useState } from "react";
import { Stack, router, useLocalSearchParams } from "expo-router";

import { useTheme } from "@/src/lib/hooks/useTheme";
import useTopAppBar from '@/src/lib/hooks/useTopAppBar';

import TopAppBar from "#/display/TopAppBar/TopAppBar";
import Button from "#/controls/Button";
import Table from "#/display/Table";
import Flex from "#/Flex";
import Text from "#/Text";
import Avatar from "#/display/Avatar";
import Divider from "#/display/Divider";
import Switch from "#/controls/Switch";

import { Arrowleft, Certification, Notification, History, Profile, Block, Report, Delete } from "#/icons";

export default function ChatDetailsScreen() {
    const { activeTheme } = useTheme();

    const params = useLocalSearchParams<{
        id: string;
        username: string;
        profile_picture: string;
        certified: string;
        certificationColor: string;
    }>();

    const paramId = params.id;
    const paramUsername = params.username;
    const paramProfilePicture = params.profile_picture;
    const paramCertified = params.certified === 'true';
    const paramCertificationColor = params.certificationColor;


    const canGoBack = router.canGoBack();
    const onBack = () => { canGoBack && router.back() };

    const { left, center, right } = useTopAppBar("_small", {
        // Nécessite : canGoBack: boolean, onBack: function, label: string, iconName: string, iconColor: string
        canGoBack,
        onBack,
        label: 'Détails',
        iconName: Arrowleft,
        iconColor: activeTheme.colors.component.button.secondary,
    });

    const [muted, setMuted] = useState(false);

    const handleMutedToggle = () => {
        setMuted(prev => !prev);
        console.log('muted toggled:', !muted);
    };

    return (
        <>
            <Stack.Screen
                options={{
                    header: () => (
                        <TopAppBar
                            left={left}
                            center={center}
                            right={right}
                        />
                    ),
                }}
            />
            <Flex style={{ flex: 1, backgroundColor: activeTheme.colors.surface.secondary }}>

                <Flex fullWidth justifyContent='center' alignItems='center' gap={activeTheme.spacing._100} style={{ marginBottom: activeTheme.spacing._400 }}>
                    <Avatar size='veryLarge' customImage={`https://api.dicebear.com/10.x/dylan/svg?seed=${paramProfilePicture}`} />
                    <Flex gap={activeTheme.spacing._0} justifyContent='center' alignItems='center'>
                        <Flex direction='row' alignItems='center' gap={activeTheme.spacing._0}>
                            <Text variant='body_Large'>{paramUsername}</Text>
                            {paramCertified && <Certification size={24} filled color={activeTheme.colors.icon[paramCertificationColor as keyof typeof activeTheme.colors.icon ?? 'brand']} />}
                        </Flex>
                    </Flex>
                </Flex>

                <Flex fullWidth gap={activeTheme.spacing._100}>

                    <Flex fullWidth>
                        <Table
                            onPress={handleMutedToggle}
                            leftProps={{
                                variant: 'icon',
                                icon: <Notification size={24} color={activeTheme.colors.icon.primary} />,
                                leftText: "Notifications en sourdine",
                            }}
                            rightProps={{
                                variant: 'switch',
                                switch: <Switch checked={muted} onValueChange={handleMutedToggle} />
                            }}
                        />

                        <Table
                            onPress={() => console.log("Historique des Trocs avec " + paramUsername)}
                            leftProps={{
                                variant: 'icon',
                                icon: <History size={24} color={activeTheme.colors.icon.primary} />,
                                leftText: `Historique des Trocs avec ${paramUsername}`,
                            }}
                        />
                    </Flex>

                    <Divider padding />


                    {/* Profil, Bloquer l'utilisateur, Signaler l'user, Signaler la conv, Supprimer la conv */}
                    <Flex fullWidth>
                        <Table
                            onPress={() => console.log("Profil")}
                            leftProps={{
                                variant: 'icon',
                                icon: <Profile size={24} color={activeTheme.colors.icon.primary} />,
                                leftText: "Profil",
                            }}
                        />

                        <Table
                            onPress={() => console.log("Bloquer l'utilisateur")}
                            leftProps={{
                                variant: 'icon',
                                icon: <Block size={24} color={activeTheme.colors.icon.primary} />,
                                leftText: "Bloquer l'utilisateur",
                            }}
                        />

                        <Table
                            onPress={() => console.log("Signaler l'utilisateur")}
                            leftProps={{
                                variant: 'icon',
                                icon: <Report size={24} color={activeTheme.colors.icon.primary} />,
                                leftText: "Signaler l'utilisateur",
                            }}
                        />

                        <Table
                            onPress={() => console.log("Signaler la conversation")}
                            leftProps={{
                                variant: 'icon',
                                icon: <Report size={24} color={activeTheme.colors.icon.primary} />,
                                leftText: "Signaler la conversation",
                            }}
                        />

                        <Table
                            onPress={() => console.log("Supprimer la conversation")}
                            leftProps={{
                                variant: 'icon',
                                icon: <Delete size={24} color={activeTheme.colors.icon.danger} />,
                                leftText: "Supprimer la conversation",
                                leftTextType: 'danger'
                            }}
                        />
                    </Flex>

                </Flex>
            </Flex>

        </>
    );
}

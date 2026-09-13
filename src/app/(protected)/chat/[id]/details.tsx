import { Stack, router, useLocalSearchParams } from "expo-router";
import { useState } from "react";

// HOOKS
import { useTheme } from "@/src/lib/hooks/useTheme";
import useTopAppBar from '@/src/lib/hooks/useTopAppBar';

// UTILS
import { CERTIFICATIONS } from '@/src/lib/utils/certification';

// QUERIES
import { useConversationContext } from '@/src/queries/useConversationMessages';

// COMPOSANTS BASIQUES
import Switch from "#/controls/Switch";
import Avatar from "#/display/Avatar";
import Divider from "#/display/Divider";
import Table from "#/display/Table";
import TopAppBar from "#/display/TopAppBar/TopAppBar";
import Flex from "#/Flex";
import Text from "#/Text";

// ICÔNES
import { Arrowleft, Block, Certification, Delete, History, Notification, Profile, Report } from "#/icons";

export default function ChatDetailsScreen() {
    const { activeTheme } = useTheme();

    const { id } = useLocalSearchParams<{ id: string }>();

    const { data: conversationContext } = useConversationContext(id);

    const recipientName = conversationContext?.otherUsername ?? 'Utilisateur';
    const recipientProfilePicture = conversationContext?.otherProfilePicture ?? undefined;
    const isRecipientCertified = Boolean(conversationContext?.certificationSlug);

    const getCertificationColor = (slug: string | null | undefined) => {
        if (!slug || !(slug in CERTIFICATIONS)) {
            return activeTheme.colors.icon.brand;
        }

        const certification = CERTIFICATIONS[slug as keyof typeof CERTIFICATIONS];

        if (!certification.color) {
            return activeTheme.colors.icon.brand;
        }

        return activeTheme.colors.icon[
            certification.color as keyof typeof activeTheme.colors.icon
        ];
    };


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
                    <Avatar
                        size='veryLarge'
                        customImage={recipientProfilePicture}
                    />

                    <Flex gap={activeTheme.spacing._0} justifyContent='center' alignItems='center'>
                        <Flex direction='row' alignItems='center' gap={activeTheme.spacing._0}>
                            <Text variant='body_Large'>{recipientName}</Text>

                            {isRecipientCertified && (
                                <Certification
                                    size={24}
                                    filled
                                    color={getCertificationColor(conversationContext?.certificationSlug)}
                                />
                            )}
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
                            onPress={() => console.log("Historique des Trocs avec " + recipientName)}
                            leftProps={{
                                variant: 'icon',
                                icon: <History size={24} color={activeTheme.colors.icon.primary} />,
                                leftText: `Historique des Trocs avec ${recipientName}`,
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

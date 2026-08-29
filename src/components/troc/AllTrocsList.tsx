import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";

import { useTheme, type Theme } from "@/src/lib/hooks/useTheme";
import { getDateText } from "@/src/lib/utils/date";
import { TrocMock } from "@/src/mock/trocs.mock";

import Flex from "#/Flex";
import Text from "#/Text";
import Button from "#/controls/Button";
import Avatar from "#/display/Avatar";
import Divider from "#/display/Divider";
import SearchArticle from "#/display/SearchArticle";

import { Arrowright, Close, Done, Pause } from "#/icons";

interface AllTrocsListProps {
    trocs: TrocMock[];
}

const getStatusIcon = (status: string, theme: Theme) => {
    switch (status) {
        case "pending":
            return <Pause size={32} color={theme.colors.icon.alert} />;
        case "accepted":
            return <Arrowright size={32} color={theme.colors.icon.success} />;
        case "rejected":
            return <Arrowright size={32} color={theme.colors.icon.danger} />;
        case "completed":
            return <Done size={32} color={theme.colors.icon.success} />;
        case "cancelled":
            return <Close size={32} color={theme.colors.icon.danger} />;
    }
}

export default function AllTrocsList({
    trocs,
}: AllTrocsListProps) {
    const { activeTheme } = useTheme();

    const trocStatusLabel = {
        pending: "en attente",
        accepted: "accepté",
        rejected: "refusé",
        completed: "complété",
        cancelled: "annulé",
    };

    const getGreyScale = (status: TrocMock['status']) => {
        switch (status) {
            case "pending":
                return true;
            case "accepted":
                return false;
            case "rejected":
                return false;
            case "completed":
                return false;
            case "cancelled":
                return true;
        }
    }

    const textColor = (status: TrocMock['status']) => {
        if (status === "rejected" || status === "cancelled") {
            return "secondary"
        }
        else {
            return "primary"
        }
    }

    const itemSeparatorComponent = () => {
        return (
            <Flex style={{ paddingVertical: activeTheme.spacing._200 }}>
                <Divider />
            </Flex>
        )
    }


    const renderItem = ({ item }: { item: TrocMock }) => {
        return (
            // Troc
            <Flex
                direction='column'
                gap={activeTheme.spacing._200}
                style={{ paddingHorizontal: activeTheme.spacing._200 }}
            >
                {/* Content */}
                <Flex gap={activeTheme.spacing._100}>
                    {/* Top */}
                    <Flex gap={activeTheme.spacing._200}>
                        {/* TODO: regarder qui a vraiment changé le statut du troc */}
                        <Text variant="body_Medium" type="primary">Le troc a été {trocStatusLabel[item.status]} par {item.username_initiator === 'xLeay' ? item.username_recipient : item.username_initiator}</Text>

                        {/* Articles */}
                        <Flex fullWidth direction="row" alignItems="center" gap={activeTheme.spacing._200}>
                            {/* Gauche */}
                            <Flex direction="column" fullWidth gap={activeTheme.spacing._100} style={{ flexShrink: 1 }}>
                                {/* Avatar */}
                                <Flex fullWidth direction="row" alignItems="center" gap={activeTheme.spacing._50}>
                                    <Avatar
                                        transition={0}
                                        size="small"
                                        customImage={`https://api.dicebear.com/10.x/dylan/svg?seed=${item.username_recipient}`}
                                        onPress={() => router.push(`/(protected)/user/${item.username_recipient}`)}
                                    />
                                    <Text variant="body_Medium" type={textColor(item.status)} numberOfLines={1} style={{ flexShrink: 1 }}>{item.username_recipient}</Text>
                                </Flex>

                                {/* Article */}
                                <Flex fullWidth direction="row" gap={activeTheme.spacing._100}>
                                    <SearchArticle
                                        imageSrc={item.image_initiator_article}
                                    />
                                    <Text variant="label_Large" type={textColor(item.status)} numberOfLines={2} style={{ flexShrink: 1 }}>{item.title_initiator_article}</Text>
                                </Flex>
                            </Flex>

                            <Flex style={{ flexShrink: 0 }}>
                                {getStatusIcon(item.status, activeTheme)}
                            </Flex>

                            {/* Droite */}
                            <Flex direction="column" fullWidth gap={activeTheme.spacing._100} style={{ flexShrink: 1 }}>
                                {/* Avatar */}
                                <Flex fullWidth direction="row" alignItems="center" gap={activeTheme.spacing._50}>
                                    <Avatar
                                        transition={0}
                                        size="small"
                                        customImage={`https://api.dicebear.com/10.x/dylan/svg?seed=${item.username_initiator}`}
                                        onPress={() => router.push(`/(protected)/user/${item.username_initiator}`)}
                                    />
                                    <Text variant="body_Medium" type={textColor(item.status)} numberOfLines={1} style={{ flexShrink: 1 }}>{item.username_initiator}</Text>
                                </Flex>

                                {/* Article */}
                                <Flex fullWidth direction="row" gap={activeTheme.spacing._100}>
                                    <SearchArticle
                                        imageSrc={item.image_recipient_article}
                                    />
                                    <Text variant="label_Large" type={textColor(item.status)} numberOfLines={2} style={{ flexShrink: 1 }}>{item.title_recipient_article}</Text>
                                </Flex>
                            </Flex>
                        </Flex>
                    </Flex>

                    {/* Bottom */}
                    <Text variant="body_Small" type="secondary">Proposition effectuée le <Text variant="label_Medium" type="primary">{getDateText(item.created_at.toString(), "date")}</Text></Text>
                </Flex>

                <Flex>
                    <Button label="Voir les détails" variant="secondary" onPress={() => router.push(`/(protected)/trocs/${item.id}/troc-details`)} />
                </Flex>
            </Flex>
        );
    };

    return (
        <FlashList
            key={'all-trocs'}
            data={trocs}
            renderItem={renderItem}
            ItemSeparatorComponent={itemSeparatorComponent}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            style={{ flex: 1, width: '100%' }}
            contentContainerStyle={{
                gap: activeTheme.spacing._200,
                paddingBottom: activeTheme.spacing._400,
            }}
            bounces={false}
        />
    );
}

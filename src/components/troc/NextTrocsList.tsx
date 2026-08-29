import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";

import { useTheme } from "@/src/lib/hooks/useTheme";
import { getTimeText } from "@/src/lib/utils/date";

import Flex from "#/Flex";
import Text from "#/Text";
import PressableOverlay from "#/controls/PressableOverlay";
import Avatar from "#/display/Avatar";
import BadgeStatus from "#/display/BadgeStatus";
import ImageRatio from "#/display/ImageRatio";

import { Calendar, Handdelivery, Location, Time } from "#/icons";

interface NextTrocItem {
    id: string;
    id_initiator_article: string;
    id_recipient_article: string;
    image_initiator_article: string;
    image_recipient_article: string;
    username_initiator: string;
    username_recipient: string;
    location_troc: string;
    troc_date: Date;
    troc_time: Date;
    troc_delivery_method: "hand_delivery" | "parcel_delivery"
}

interface NextTrocsListProps {
    trocs: NextTrocItem[];
    horizontal?: boolean;
}

export default function NextTrocsList({
    trocs,
    horizontal = true
}: NextTrocsListProps) {
    const { activeTheme } = useTheme();

    const deliveryMethodLabel = {
        hand_delivery: "Main propre",
        parcel_delivery: "Point relais",
    };

    const renderItem = ({ item }: { item: NextTrocItem }) => {
        return (
            // Troc
            <Flex
                direction='column'
                alignItems={horizontal ? 'center' : 'flex-start'}
                gap={activeTheme.spacing._100}
            >
                {/* Card */}
                <PressableOverlay
                    borderRadius={activeTheme.radius.card}
                    onPress={() => router.push(`/(protected)/trocs/${item.id}/troc-details`)}
                >
                    <Flex
                        gap={activeTheme.spacing._100}
                        style={{
                            padding: activeTheme.spacing._200,
                            backgroundColor: activeTheme.colors.surface.primary,
                            borderRadius: activeTheme.radius.card,
                            boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.25)',

                            width: 280
                        }}
                    >
                        {/* Articles */}
                        <Flex fullWidth direction="row" gap={activeTheme.spacing._100} style={{ height: 80 }}>
                            {[item.image_initiator_article, item.image_recipient_article].map((image, index) => (
                                <Flex key={index} style={{ flex: 1 }}>
                                    <ImageRatio
                                        source={image}
                                        ratio={'4:3'}
                                        style={{ height: 80, borderRadius: activeTheme.radius.default }}
                                        transition={0}
                                    />
                                </Flex>
                            ))}
                        </Flex>

                        {/* Nom */}
                        <Flex direction="row" alignItems='center' gap={activeTheme.spacing._100}>
                            <Text variant="body_Small" type="secondary">Échange avec</Text>
                            <Flex direction="row" alignItems='center' gap={activeTheme.spacing._50}>
                                <Avatar
                                    transition={0}
                                    size="small"
                                    customImage={`https://api.dicebear.com/10.x/dylan/svg?seed=${item.username_recipient}`}
                                    onPress={() => router.push(`/(protected)/user/${item.username_recipient}`)}
                                />
                                <Text variant="body_Large" type="primary" numberOfLines={1}>{item.username_recipient}</Text>
                            </Flex>
                        </Flex>

                        <Text variant="body_Large" type="primary" numberOfLines={1} style={{ flexShrink: 1 }}>{item.location_troc}</Text>
                    </Flex>
                </PressableOverlay>

                {/* Bottom */}
                <Flex direction="row" fullWidth alignItems="center" justifyContent="flex-start" gap={activeTheme.spacing._100}>
                    <BadgeStatus
                        label={item.troc_date.toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                        })}
                        icon={<Calendar />}
                        variant="neutral"
                    />
                    <Flex direction="row" alignItems="center" gap={activeTheme.spacing._50}>
                        <Time size={16} color={activeTheme.colors.text.secondary} />
                        <Text variant="body_Medium" type="secondary">{getTimeText(item.troc_time.toString())}</Text>
                    </Flex>

                    <Flex direction="row" alignItems="center" gap={activeTheme.spacing._50}>
                        {item.troc_delivery_method === "hand_delivery" ? <Handdelivery size={16} color={activeTheme.colors.text.secondary} /> : <Location size={16} color={activeTheme.colors.text.secondary} />}
                        <Text variant="body_Medium" type="secondary">{deliveryMethodLabel[item.troc_delivery_method]}</Text>
                    </Flex>
                </Flex>
            </Flex>
        );
    };

    return (
        <FlashList
            key={horizontal ? 'next-trocs-horizontal' : 'next-trocs-vertical'}
            data={trocs}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <Flex style={{ height: activeTheme.spacing._200, width: activeTheme.spacing._200 }} />}
            keyExtractor={(item) => item.id}
            horizontal={horizontal}
            showsHorizontalScrollIndicator={false}
            style={!horizontal ? { flex: 1, width: '100%' } : undefined}
            contentContainerStyle={{
                gap: activeTheme.spacing._0,
                paddingHorizontal: activeTheme.spacing._200,
                paddingTop: 1,
                paddingBottom: horizontal ? 0 : activeTheme.spacing._400,
            }}
            bounces={false}
        />
    );
}

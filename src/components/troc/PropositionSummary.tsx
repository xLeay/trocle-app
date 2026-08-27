import { useTheme } from '@/src/lib/hooks/useTheme';

import Switch from '#/controls/Switch';
import Avatar from '#/display/Avatar';
import Divider from '#/display/Divider';
import ImageRatio from '#/display/ImageRatio';
import Flex from '#/Flex';
import Text from '#/Text';

import { PropositionArticleItem } from '#/troc/PropositionArticle';
import { PropositionDeliveryMethod } from '#/troc/PropositionDelivery';

import { getDateText, getRelativeDateText, getTimeText } from '@/src/lib/utils/date';
import { LocationAddress, formatLocationAddress } from '@/src/lib/utils/geocoding';
import { getCategoryIcon, getStateIcon } from '@/src/lib/utils/product';

import { Calendar, Handdelivery, Info, Location, Time } from '#/icons';



interface PropositionSummaryProps {
    myUsername: string;
    targetUsername: string;
    initiatorArticle: PropositionArticleItem;
    receiverArticle: PropositionArticleItem;
    deliveryMethod: PropositionDeliveryMethod;
    selectedAddress: LocationAddress;
    deliveryDate: Date;
    deliveryTime: Date;
    additionalInfos: string;
    hasReadTheSummary?: boolean;
    onReadTheSummaryChange?: (hasReadTheSummary: boolean) => void;
}

interface SummaryArticleProps {
    isMe?: boolean;
    myUsername?: PropositionSummaryProps['myUsername'];
    targetUsername?: PropositionSummaryProps['targetUsername'];
    label: string;
    article: PropositionArticleItem;
}

function SummaryArticle({
    isMe,
    myUsername,
    targetUsername,
    label,
    article,
}: SummaryArticleProps) {
    const { activeTheme } = useTheme();

    return (
        <Flex fullWidth gap={activeTheme.spacing._200} style={{ paddingHorizontal: activeTheme.spacing._200 }}>
            {/* Utilisateur */}
            <Flex direction="row" alignItems="center" gap={activeTheme.spacing._100}>
                <Avatar
                    size="large"
                    customImage={`https://api.dicebear.com/10.x/dylan/svg?seed=${isMe ? myUsername : targetUsername}`}
                />
                <Text variant="body_Large" type="primary">{isMe ? `${myUsername} (toi)` : targetUsername}</Text>
            </Flex>

            {/* Article */}
            <Flex
                fullWidth
                direction="row"
                alignItems="flex-start"
                justifyContent="flex-start"
                gap={activeTheme.spacing._100}
            >
                {/* Image */}
                <Flex overflow="hidden" style={{ width: 160, borderRadius: activeTheme.radius.default }}>
                    <ImageRatio
                        ratio="cover"
                        source={article.image}
                    />
                </Flex>

                {/* Infos */}
                <Flex style={{ flex: 1 }} gap={activeTheme.spacing._100}>
                    {/* Top */}
                    <Flex direction="row" alignItems="center" justifyContent='center' gap={activeTheme.spacing._50}
                        style={{
                            paddingVertical: activeTheme.spacing._50,
                            paddingLeft: activeTheme.spacing._50,
                            paddingRight: activeTheme.spacing._100,
                            borderRadius: activeTheme.radius.default,
                            backgroundColor: activeTheme.colors.surface.blueLight,
                        }}
                    >
                        {getCategoryIcon(article.category, 16, activeTheme.colors.text.secondary)}
                        <Text variant="label_Medium" type="secondary">{article.category}</Text>
                    </Flex>

                    {/* Bottom */}
                    <Flex gap={activeTheme.spacing._100}>
                        {/* Nom + marque */}
                        <Flex>
                            <Text variant="title_Medium" type="primary">{article.title}</Text>
                            <Text variant="body_Medium" type="secondary">{article.brand}</Text>
                        </Flex>

                        {/* Etat */}
                        <Flex direction='row' alignItems='center' gap={activeTheme.spacing._50}>
                            <Text variant="body_Medium" type="secondary">
                                {article.state}
                            </Text>
                            {getStateIcon(article.state, 16, activeTheme.colors.text.secondary)}
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
}

export default function PropositionSummary({
    myUsername,
    targetUsername,
    initiatorArticle,
    receiverArticle,
    deliveryMethod,
    selectedAddress,
    deliveryDate,
    deliveryTime,
    additionalInfos,
    hasReadTheSummary,
    onReadTheSummaryChange,
}: PropositionSummaryProps) {
    const { activeTheme } = useTheme();

    const deliveryLabel =
        deliveryMethod === 'hand_delivery'
            ? 'En main propre'
            : 'En point relais';

    const deliveryDateTime = new Date(deliveryDate);

    deliveryDateTime.setHours(
        deliveryTime.getHours(),
        deliveryTime.getMinutes(),
        0,
        0,
    );

    return (
        <Flex fullWidth gap={activeTheme.spacing._400}>
            <Flex fullWidth gap={activeTheme.spacing._100} style={{ paddingHorizontal: activeTheme.spacing._200 }}>
                <Text variant="display_Small" type="primary">Récapitulatif</Text>
                <Text variant="body_Medium" type="secondary">Vérifie bien les informations avant d’envoyer ta proposition de troc à {targetUsername}.</Text>
            </Flex>

            <Flex fullWidth gap={activeTheme.spacing._200}>
                <SummaryArticle
                    isMe
                    myUsername={myUsername}
                    label="Tu proposes"
                    article={initiatorArticle}
                />

                <Divider padding />

                <SummaryArticle
                    targetUsername={targetUsername}
                    label={`${targetUsername} propose`}
                    article={receiverArticle}
                />
            </Flex>

            <Divider type='thick' />

            <Flex fullWidth gap={activeTheme.spacing._200} style={{ paddingHorizontal: activeTheme.spacing._200 }}>
                <Text variant="title_Large" type="primary">Livraison</Text>

                {/* Infos */}
                <Flex fullWidth gap={activeTheme.spacing._100}>
                    {/* Type */}
                    <Flex fullWidth direction='row' alignItems='flex-start' justifyContent='flex-start' gap={activeTheme.spacing._100}>
                        <Handdelivery color={activeTheme.colors.icon.primary} size={24} />
                        <Text variant="body_Large" type="primary" numberOfLines={2} style={{ flexShrink: 1 }}>{deliveryLabel}</Text>
                    </Flex>

                    {/* Adresse */}
                    <Flex fullWidth direction='row' alignItems='flex-start' justifyContent='flex-start' gap={activeTheme.spacing._100}>
                        <Location color={activeTheme.colors.icon.primary} size={24} />
                        <Text variant="body_Large" type="primary" numberOfLines={2} style={{ flexShrink: 1 }}>{formatLocationAddress(selectedAddress)}</Text>
                    </Flex>

                    {/* Date */}
                    <Flex fullWidth direction='row' alignItems='flex-start' justifyContent='flex-start' gap={activeTheme.spacing._100}>
                        <Calendar color={activeTheme.colors.icon.primary} size={24} />
                        <Text
                            variant="body_Large"
                            type="primary"
                            numberOfLines={2}
                            style={{ flexShrink: 1 }}
                        >{getDateText(deliveryDate.toString(), 'date')} (<Text variant="body_Large" type="brand">{getRelativeDateText(deliveryDateTime.toString())}</Text>)
                        </Text>
                    </Flex>

                    {/* Heure */}
                    <Flex fullWidth direction='row' alignItems='flex-start' justifyContent='flex-start' gap={activeTheme.spacing._100}>
                        <Time color={activeTheme.colors.icon.primary} size={24} />
                        <Text
                            variant="body_Large"
                            type="primary"
                            numberOfLines={2}
                            style={{ flexShrink: 1 }}
                        >{getTimeText(deliveryTime.toString())}</Text>
                    </Flex>

                    {/* Autres infos */}
                    {additionalInfos && (
                        <Flex fullWidth direction='row' alignItems='flex-start' justifyContent='flex-start' gap={activeTheme.spacing._100}>
                            <Info color={activeTheme.colors.icon.primary} size={24} />
                            <Text variant="body_Large" type="secondary" numberOfLines={3} style={{ flexShrink: 1 }}>{additionalInfos}</Text>
                        </Flex>
                    )}
                </Flex>
            </Flex>


            {/* Switch de validation */}
            <Flex
                fullWidth
                direction="row"
                alignItems="center"
                gap={activeTheme.spacing._100}
                style={{ paddingHorizontal: activeTheme.spacing._200 }}
            >
                <Switch
                    checked={hasReadTheSummary}
                    onValueChange={(value) => onReadTheSummaryChange?.(value)}
                />
                <Text variant="body_Medium" type="primary" numberOfLines={3} style={{ flexShrink: 1 }}>J’ai lu le récapitulatif et toutes les informations à propos de la proposition.</Text>
            </Flex>
        </Flex>
    );
}
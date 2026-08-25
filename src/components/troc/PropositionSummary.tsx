import { useTheme } from '@/src/lib/hooks/useTheme';

import ImageRatio from '#/display/ImageRatio';
import Flex from '#/Flex';
import Text from '#/Text';

import { PropositionArticleItem } from '#/troc/PropositionArticle';
import { PropositionDeliveryMethod } from '#/troc/PropositionDelivery';

interface PropositionSummaryProps {
    username: string;
    initiatorArticle: PropositionArticleItem;
    receiverArticle: PropositionArticleItem;
    deliveryMethod: PropositionDeliveryMethod;
}

interface SummaryArticleProps {
    label: string;
    article: PropositionArticleItem;
}

function SummaryArticle({
    label,
    article,
}: SummaryArticleProps) {
    const { activeTheme } = useTheme();

    return (
        <Flex fullWidth gap={activeTheme.spacing._100}>
            <Text variant="title_Small" type="secondary">
                {label}
            </Text>

            <Flex
                fullWidth
                direction="row"
                alignItems="center"
                gap={activeTheme.spacing._200}
                style={{
                    padding: activeTheme.spacing._100,
                    borderWidth: 1,
                    borderColor: activeTheme.colors.surface.divider,
                    borderRadius: activeTheme.radius.card,
                    backgroundColor: activeTheme.colors.surface.primary,
                }}
            >
                <Flex
                    overflow="hidden"
                    style={{
                        width: 80,
                        borderRadius: activeTheme.radius.default,
                    }}
                >
                    <ImageRatio
                        ratio="cover"
                        source={article.image}
                    />
                </Flex>

                <Flex style={{ flex: 1 }} gap={activeTheme.spacing._50}>
                    <Text variant="title_Small" type="primary">
                        {article.title}
                    </Text>

                    <Text variant="body_Small" type="secondary">
                        {article.brand}
                    </Text>
                </Flex>
            </Flex>
        </Flex>
    );
}

export default function PropositionSummary({
    username,
    initiatorArticle,
    receiverArticle,
    deliveryMethod,
}: PropositionSummaryProps) {
    const { activeTheme } = useTheme();

    const deliveryLabel =
        deliveryMethod === 'hand_delivery'
            ? 'Remise en main propre'
            : 'Envoi des articles';

    return (
        <Flex fullWidth gap={activeTheme.spacing._400}>
            <Flex fullWidth gap={activeTheme.spacing._100}>
                <Text variant="display_Small" type="primary">
                    Résumé de la proposition
                </Text>

                <Text variant="body_Medium" type="secondary">
                    Vérifie les informations avant d’envoyer ta proposition de
                    troc à {username}.
                </Text>
            </Flex>

            <Flex fullWidth gap={activeTheme.spacing._200}>
                <SummaryArticle
                    label="Tu proposes"
                    article={initiatorArticle}
                />

                <SummaryArticle
                    label={`${username} propose`}
                    article={receiverArticle}
                />

                <Flex fullWidth gap={activeTheme.spacing._100}>
                    <Text variant="title_Small" type="secondary">
                        Mode de remise
                    </Text>

                    <Flex
                        fullWidth
                        style={{
                            padding: activeTheme.spacing._200,
                            borderWidth: 1,
                            borderColor: activeTheme.colors.surface.divider,
                            borderRadius: activeTheme.radius.card,
                            backgroundColor:
                                activeTheme.colors.surface.primary,
                        }}
                    >
                        <Text variant="title_Small" type="primary">
                            {deliveryLabel}
                        </Text>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
}
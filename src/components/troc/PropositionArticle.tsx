import { useTheme } from '@/src/lib/hooks/useTheme';

import Button from '#/controls/Button';
import Radio from '#/controls/Radio';
import ImageRatio from '#/display/ImageRatio';
import Flex from '#/Flex';
import Grid from '#/Grid';
import Text from '#/Text';

import { Plus } from '#/icons';

export type PropositionArticleOwner = 'initiator' | 'receiver';

export interface PropositionArticleItem {
    id: string;
    image: string;
    title: string;
    brand: string;
}

interface PropositionArticleProps {
    owner: PropositionArticleOwner;
    username?: string;
    articles: PropositionArticleItem[];
    selectedArticleId: string | null;
    onSelectArticle: (articleId: string) => void;
    onAddArticle?: () => void;
}

export default function PropositionArticle({
    owner,
    username,
    articles,
    selectedArticleId,
    onSelectArticle,
    onAddArticle,
}: PropositionArticleProps) {
    const { activeTheme } = useTheme();

    const isInitiator = owner === 'initiator';

    const title = isInitiator
        ? 'Choisis un article'
        : `Choisis un article de ${username ?? "l'utilisateur"}`;

    const description = isInitiator
        ? `Parmi les articles que tu as sur Trocle, choisis-en un que vas troquer avec ${username ?? "l'utilisateur"}. Tu as juste à sélectionner celui que tu veux échanger.`
        : `Maintenant, choisis un des articles de ${username ?? "l'utilisateur"} que tu veux échanger avec celui que tu as sélectionné juste avant. Réalise ta sélection de la même façon.`;

    return (
        <Flex fullWidth gap={activeTheme.spacing._400}>
            <Flex fullWidth gap={activeTheme.spacing._100}>
                <Text variant="display_Small" type="primary">
                    {title}
                </Text>

                <Text variant="body_Medium" type="secondary">
                    {description}
                </Text>
            </Flex>

            <Flex fullWidth gap={activeTheme.spacing._200}>
                <Text variant="title_Small">
                    {articles.length} article{articles.length > 1 ? 's' : ''}
                </Text>

                <Grid
                    columns={2}
                    gap={activeTheme.spacing._200}
                    style={{ width: '100%' }}
                >
                    {articles.map((article) => {
                        const selected = selectedArticleId === article.id;

                        return (
                            <Flex
                                key={article.id}
                                gap={activeTheme.spacing._50}
                            >
                                <Flex
                                    fullWidth
                                    style={{
                                        position: 'relative',
                                        borderRadius: activeTheme.radius.default,
                                    }}
                                >
                                    <Flex
                                        fullWidth
                                        overflow="hidden"
                                        style={{
                                            borderRadius: activeTheme.radius.default,
                                        }}
                                    >
                                        <ImageRatio
                                            ratio="cover"
                                            source={article.image}
                                            onPress={() => onSelectArticle(article.id)}
                                        />
                                    </Flex>

                                    {selected && (
                                        <Flex
                                            pointerEvents="none"
                                            style={{
                                                position: 'absolute',
                                                top: -4,
                                                right: -4,
                                                bottom: -4,
                                                left: -4,
                                                borderWidth: 2,
                                                borderColor: activeTheme.colors.surface.brand,
                                                borderRadius: activeTheme.radius.card,
                                                backgroundColor: activeTheme.colors.surface.transparentContrast,
                                            }}
                                        />
                                    )}

                                    <Flex
                                        style={{
                                            position: 'absolute',
                                            right: activeTheme.spacing._100,
                                            top: activeTheme.spacing._100,
                                        }}
                                    >
                                        <Radio
                                            checked={selected}
                                            onValueChange={() =>
                                                onSelectArticle(article.id)
                                            }
                                        />
                                    </Flex>
                                </Flex>

                                <Flex gap={0}>
                                    <Text variant="label_Large">
                                        {article.title}
                                    </Text>

                                    <Text
                                        variant="body_Small"
                                        type="secondary"
                                    >
                                        {article.brand}
                                    </Text>
                                </Flex>
                            </Flex>
                        );
                    })}

                    {isInitiator && onAddArticle && (
                        <Flex
                            style={{ minHeight: 120 }}
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Button
                                variant="outlined"
                                label="Ajouter"
                                size="large"
                                icon={<Plus />}
                                iconPosition="right"
                                onPress={onAddArticle}
                            />
                        </Flex>
                    )}
                </Grid>
            </Flex>
        </Flex>
    );
}
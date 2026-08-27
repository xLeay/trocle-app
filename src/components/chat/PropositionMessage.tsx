import { useEffect, useState } from 'react';

import { useTheme } from '@/src/lib/hooks/useTheme';
import { getStateIcon } from '@/src/lib/utils/product';

import Flex from '#/Flex';
import Text from '#/Text';
import MessageLabel, { MessageLabelType } from '#/_partial/MessageLabel';
import Button from '#/controls/Button';
import PressableOverlay from '#/controls/PressableOverlay';
import Avatar from '#/display/Avatar';
import ImageRatio from '#/display/ImageRatio';

import { Troc } from '#/icons';


// TODO: tout mettre au propre au niveau des imports, des types etc
import { CATEGORY, PRODUCT_STATE } from '@/src/lib/utils/product';
import { PropositionArticleItem } from '../troc/PropositionArticle';

const MY_ARTICLE: PropositionArticleItem = {
    id: 'mine-1',
    image: 'https://www.cdiscount.com/pdt2/8/0/1/1/700x700/aaaap45801/rw/console-xbox-360-blanche--3.jpg',
    title: 'Xbox 360',
    brand: 'Microsoft',
    category: CATEGORY.gaming,
    state: PRODUCT_STATE.very_good,
}

const RECEIVER_ARTICLE: PropositionArticleItem = {
    id: 'receiver-2',
    image: 'https://m.media-amazon.com/images/I/61GcXE9lJ4L._AC_UF1000,1000_QL80_.jpg',
    title: 'Piano électrique',
    brand: 'Yamaha',
    category: CATEGORY.household_appliances,
    state: PRODUCT_STATE.good,
}


export interface PropositionMessageProps {
    type: 'me' | 'someone_else';
    status?: 'accepted' | 'pending' | 'rejected';
    latest?: boolean;
    label?: string;
    messageLabelType?: MessageLabelType;
    myUsername: string;
    otherUsername: string;
    onPress?: () => void;
    onLongPress?: () => void;
    onAcceptPress?: () => void;
    onRejectPress?: () => void;
}

function PropositionMessage({
    type = 'me',
    status = 'pending',
    latest,
    label,
    messageLabelType = 'hour',
    myUsername,
    otherUsername,
    onPress,
    onLongPress,
    onAcceptPress,
    onRejectPress
}: PropositionMessageProps) {
    const { activeTheme } = useTheme();

    const [showLabel, setShowLabel] = useState(latest);

    const isMe = type === 'me';

    const title = () => {
        switch (type) {
            case 'me':
                return 'Tu as lancé un troc !';
            case 'someone_else':
                return `${otherUsername} veut troquer !`;
            default:
                return 'Proposition de Troc';
        }
    };


    const renderPropositionContent = () => {
        switch (status) {
            case 'pending':
                return (
                    <Flex
                        gap={activeTheme.spacing._200}
                        style={{
                            minWidth: 200,
                            width: '95%',
                            padding: activeTheme.spacing._200,
                            borderRadius: activeTheme.radius.card,
                            backgroundColor: activeTheme.colors.surface.primary,
                            boxShadow: `0 2px 5px 1px rgba(0,0,0,0.25)`
                        }}
                    >
                        {/* Top */}
                        <Flex fullWidth direction='row'>
                            <Flex
                                direction='row'
                                alignItems='center'
                                overflow='hidden'
                                fullWidth
                                gap={activeTheme.spacing._100}
                                style={{ flexShrink: 1 }}
                            >
                                <Avatar size='small' customImage={undefined} />
                                <Text
                                    variant='label_Large'
                                    type='primary'
                                    numberOfLines={1}
                                    style={{ flexShrink: 1 }}
                                >
                                    {title()}
                                </Text>
                            </Flex>
                            <Button size='small' variant='ghost' label='Voir plus' />

                        </Flex>

                        {/* Content */}
                        <Flex fullWidth alignItems='center' gap={activeTheme.spacing._100}>
                            <ArticleDisplay article={MY_ARTICLE} />
                            <Troc size={40} filled color={activeTheme.colors.icon.brand} />
                            <ArticleDisplay article={RECEIVER_ARTICLE} />
                        </Flex>

                        {/* Actions */}
                        {!isMe && (
                            <Flex
                                fullWidth
                                direction='column'
                                gap={activeTheme.spacing._100}
                                style={{ paddingTop: activeTheme.spacing._100 }}
                            >
                                <Button
                                    fullWidth
                                    size='large'
                                    variant='secondary'
                                    label='Accepter le Troc'
                                    onPress={onAcceptPress}
                                />
                                <Button
                                    fullWidth
                                    size='large'
                                    variant='outlined'
                                    label='Refuser le Troc'
                                    onPress={onRejectPress}
                                />
                            </Flex>
                        )}

                    </Flex>

                )

            case 'accepted':
                return (
                    <Flex
                        gap={activeTheme.spacing._200}
                        style={{
                            maxWidth: 300,
                            padding: activeTheme.spacing._200,
                            borderRadius: activeTheme.radius.card,
                            backgroundColor: activeTheme.colors.surface.primary,
                            borderWidth: 1,
                            borderColor: activeTheme.colors.border.primary,
                        }}
                    >
                        {isMe ? (
                            <Text variant='body_Medium' type='primary'>Tu as accepté l'offre de Troc de {otherUsername} ! Tu peux la retrouver sur la page <Text variant='label_Large' type='brand'>Mes Trocs</Text>.</Text>
                        ) : (
                            <Text variant='body_Medium' type='primary'> {otherUsername} a accepté ton offre de Troc ! Tu peux la retrouver sur la page <Text variant='label_Large' type='brand'>Mes Trocs</Text>.</Text>
                        )}
                    </Flex>
                )

            case 'rejected':
                return (
                    <Flex
                        gap={activeTheme.spacing._200}
                        style={{
                            maxWidth: 300,
                            padding: activeTheme.spacing._200,
                            borderRadius: activeTheme.radius.card,
                            backgroundColor: activeTheme.colors.surface.primary,
                            borderWidth: 1,
                            borderColor: activeTheme.colors.border.primary,
                        }}
                    >
                        {isMe ? (
                            <Text variant='body_Medium' type='primary'>Tu as refusé l'offre de Troc de {otherUsername} !</Text>
                        ) : (
                            <Text variant='body_Medium' type='primary'> {otherUsername} a refusé ton offre de Troc !</Text>
                        )}
                    </Flex>
                )
            default:
                return (
                    <Text>Erreur</Text>
                )
        }
    };

    useEffect(() => {
        setShowLabel(latest);
    }, [latest]);

    return (
        <Flex
            gap={activeTheme.spacing._50}
            alignItems={isMe ? 'flex-end' : 'flex-start'}
        >

            <PressableOverlay
                onPress={onPress}
                onLongPress={onLongPress}
                borderRadius={activeTheme.radius.card}
            >
                {renderPropositionContent()}
            </PressableOverlay>

            {showLabel && (
                <MessageLabel
                    label={label}
                    type={messageLabelType}
                />
            )}
        </Flex>
    );
}


const ArticleDisplay = ({
    article,
}: {
    article: PropositionArticleItem;
}) => {
    const { activeTheme } = useTheme();

    return (
        <Flex
            fullWidth
            direction="row"
            alignItems="flex-start"
            justifyContent="flex-start"
            gap={activeTheme.spacing._100}
        >
            {/* Image */}
            <Flex overflow="hidden" style={{ width: 100, borderRadius: activeTheme.radius.default }}>
                <ImageRatio
                    ratio="cover"
                    source={article.image}
                />
            </Flex>

            {/* Infos */}
            <Flex style={{ flex: 1 }} gap={activeTheme.spacing._100}>
                {/* Bottom */}
                <Flex gap={activeTheme.spacing._100}>
                    {/* Nom + marque */}
                    <Flex>
                        <Text variant="body_Large" type="primary">{article.title}</Text>
                        <Text variant="body_Medium" type="secondary">{article.brand}</Text>
                        <Flex direction='row' alignItems='center' gap={activeTheme.spacing._50}>
                            <Text variant="body_Medium" type="secondary">{article.state}</Text>
                            {getStateIcon(article.state, 16, activeTheme.colors.text.secondary)}
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    )
}

export default PropositionMessage;
import { Stack } from 'expo-router';
import { useRef, useState } from 'react';
import { StyleSheet } from 'react-native';

import { useGoBack } from '@/src/lib/hooks/useGoBack';
import { useTheme } from '@/src/lib/hooks/useTheme';
import useTopAppBar from '@/src/lib/hooks/useTopAppBar';

import Flex from '#/Flex';
import Text from '#/Text';
import Button from '#/controls/Button';
import TextField from '#/controls/TextField';
import Divider from '#/display/Divider';
import Table from '#/display/Table';
import TopAppBar from '#/display/TopAppBar/TopAppBar';
import Radio from '#/controls/Radio';

import ModularBottomSheet from '#/display/ModularBottomSheet';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

import { Close, Arrowleft } from '#/icons';



// Exemple de données
// const categories = [
//     { id: 1, name: 'Jeux-videos', parentId: null },
//     { id: 2, name: 'Transports', parentId: null },
//     { id: 3, name: 'Vêtements', parentId: null },
//     { id: 4, name: 'Sport', parentId: null },
//     { id: 5, name: 'Nature', parentId: null },
//     { id: 6, name: 'Jouets et loisirs', parentId: null },
//     { id: 7, name: 'Art et culture', parentId: null },
//     { id: 8, name: 'Bricolage', parentId: null },
//     { id: 9, name: 'Musique', parentId: null },
//     { id: 10, name: 'Jeunesse', parentId: null },
//     { id: 11, name: 'Livres pour enfants', parentId: 10 },
//     { id: 12, name: 'Vêtements pour enfants', parentId: 10 },
//     { id: 13, name: 'Jouets éducatifs', parentId: 10 },
//     { id: 14, name: 'Jeux de société pour enfants', parentId: 10 },
//     { id: 15, name: 'Électronique', parentId: null },
//     { id: 16, name: 'Photographie', parentId: null },
//     { id: 17, name: 'Animaux', parentId: null },
//     { id: 18, name: 'Décoration', parentId: null },
//     { id: 19, name: 'Bijoux et accessoires', parentId: null },
//     { id: 20, name: 'Mobilier', parentId: null },
//     { id: 21, name: 'Divers', parentId: null },
// ];

const categories = [
    { id: 1, name: 'Informatique', parentId: null },
    { id: 2, name: 'Jeux-vidéos', parentId: 1 },
    { id: 3, name: 'PC Gamer', parentId: 2 },
    { id: 4, name: 'Consoles', parentId: 2 },

    { id: 5, name: 'Mode', parentId: null },
    { id: 6, name: 'Homme', parentId: 5 },
    { id: 7, name: 'Vêtements', parentId: 6 },
    { id: 8, name: 'Bas', parentId: 7 },
    { id: 9, name: 'Jeans', parentId: 8 },
    { id: 10, name: 'Shorts', parentId: 8 },
    { id: 11, name: 'Pantalons', parentId: 8 },

    { id: 12, name: 'Femme', parentId: 5 },
    { id: 13, name: 'Chaussures', parentId: 12 },
    { id: 14, name: 'Accessoires', parentId: 12 },

    { id: 15, name: 'Enfant', parentId: 5 },
    { id: 16, name: 'Jouets', parentId: 15 },
    { id: 17, name: 'Vêtements Enfant', parentId: 15 },

    { id: 18, name: 'Maison', parentId: null },
    { id: 19, name: 'Meubles', parentId: 18 },
    { id: 20, name: 'Déco', parentId: 18 },

    { id: 21, name: 'Culture', parentId: null },
    { id: 22, name: 'Livres', parentId: 21 },
    { id: 23, name: 'BD / Manga', parentId: 21 },
];

const productStates = [
    { id: 1, name: 'Comme neuf' },
    { id: 2, name: 'Très bon état' },
    { id: 3, name: 'Bon état' },
    { id: 4, name: 'Mauvais état' },
];



export default function CreationModal() {

    const { activeTheme } = useTheme();

    // Config de la top app bar
    const topAppBarConfig = "_small";
    const canGoBack = true;
    const onBack = useGoBack();

    const { left, center, right } = useTopAppBar(topAppBarConfig, {
        iconName: Close,
        canGoBack,
        onBack,
        label: 'Poste ton article',
    });

    // Les différents champs

    // Section 1
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    // Section 2
    const [tempSelectedCategory, setTempSelectedCategory] = useState<any>(null);
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const categorySheetRef = useRef<BottomSheetModal>(null);
    const [categoryStack, setCategoryStack] = useState<any[][]>([categories.filter((cat) => cat.parentId == null)]);
    const [categoryPath, setCategoryPath] = useState<any[]>([]);

    const [selectedProductState, setSelectedProductState] = useState<any>(null);
    const productStateSheetRef = useRef<BottomSheetModal>(null);
    const [productStateStack, setProductStateStack] = useState<any[][]>([productStates]);
    const [productStatePath, setProductStatePath] = useState<any[]>([]);


    const getChildren = (item: any, allData: any[]) =>
        allData.filter((cat: any) => cat.parentId === item.id);

    return (
        <Flex style={[styles.container, { backgroundColor: activeTheme.colors.surface.secondary }]}>
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
            {/* Content */}
            <Flex scroll border gap={activeTheme.spacing._400} style={{ paddingTop: activeTheme.spacing._200, width: '100%', flex: 1 }}>
                {/* Section */}
                <Flex gap={activeTheme.spacing._200} style={{ paddingHorizontal: activeTheme.spacing._200, width: '100%' }}>
                    <TextField
                        placeholder={'Pull gris, manette PS3'}
                        value={title}
                        onChangeText={(text) => setTitle(text)}
                        label={'Titre de l\'article *'}
                    />

                    <Divider type='thin' />

                    {/* Description */}
                    <Flex gap={activeTheme.spacing._50} style={{ width: '100%' }}>
                        <TextField
                            placeholder={'Jeu-vidéo rétro pas trop utilisé'}
                            value={description}
                            onChangeText={(text) => setDescription(text)}
                            label={'Description de l\'article *'}
                            maxLength={250}
                            multiline={true}
                            numberOfLines={3}
                        />
                        <Flex style={{ width: '100%' }} alignItems='flex-end'>
                            <Text variant='body_Small' type='secondary'>
                                {description.length}/250
                            </Text>
                        </Flex>
                    </Flex>
                </Flex>

                {/* Divider */}
                <Divider type='thick' />

                {/* Section */}
                <Flex gap={activeTheme.spacing._100} style={{ paddingHorizontal: activeTheme.spacing._0, width: '100%' }}>
                    <Table
                        leftProps={{
                            variant: 'empty',
                            leftText: 'Catégorie',
                        }}
                        rightProps={{
                            variant: 'text',
                            rightText: selectedCategory?.name || '',
                            active: true,
                        }}
                        onPress={() => {
                            categorySheetRef.current?.present()
                        }}
                    />

                    <Divider type='thin' />

                    <Table
                        leftProps={{
                            variant: 'empty',
                            leftText: 'État de l\'article',
                        }}
                        rightProps={{
                            variant: 'text',
                            rightText: selectedProductState?.name || '',
                            active: true,
                        }}
                        onPress={() => {
                            productStateSheetRef.current?.present()
                        }}
                    />
                </Flex>

                {/* Divider */}
                <Divider type='thick' />
            </Flex>


            <ModularBottomSheet
                ref={categorySheetRef}
                data={categories.filter((cat) => cat.parentId == null)}
                allData={categories}
                onClose={() => categorySheetRef.current?.dismiss()}
                onSelect={(item) => {
                    setTempSelectedCategory(item);
                }}
                getChildren={getChildren}
                renderRight={(item, selected, rightText) => {
                    const isLeaf = getChildren(item, categories).length === 0;
                    return {
                        variant: isLeaf ? 'radio' : 'text',
                        rightText: isLeaf ? '' : rightText,
                        active: isLeaf ? false : true,
                        radio: isLeaf ? (
                            <Radio
                                checked={tempSelectedCategory?.id === item.id}
                                onValueChange={() => {
                                    setTempSelectedCategory(item);
                                }}
                            />
                        ) : undefined,
                    };
                }}
                selectedId={tempSelectedCategory?.id}

                snapPoints={['50%']}
                enableDynamicSizing={false}
                topVariant='text + icon'
                title={
                    categoryPath.length > 0
                        ? categoryPath[categoryPath.length - 1]?.name
                        : 'Catégorie'
                }
                icon={categoryStack.length > 1 ? <Arrowleft /> : <Close />}
                iconPosition='right'
                showButtons
                buttons={[
                    <Button key="réinitialiser" label="Réinitialiser" variant="outlined" disabled={tempSelectedCategory == null} size='large' fullWidth onPress={() => {
                        setTempSelectedCategory(null);
                        setSelectedCategory(null);
                        categorySheetRef.current?.dismiss();
                    }} />,
                    <Button key="appliquer" label="Appliquer" variant="secondary" size='large' fullWidth onPress={() => {
                        setSelectedCategory(tempSelectedCategory);
                        categorySheetRef.current?.dismiss();
                        // TODO : Appliquer la catégorie
                    }} />,
                ]}
                onStackChange={(stack, path) => {
                    setCategoryStack(stack);
                    setCategoryPath(path);
                }}
            />

            <ModularBottomSheet
                ref={productStateSheetRef}
                data={productStates}
                allData={productStates}
                onClose={() => productStateSheetRef.current?.dismiss()}
                onSelect={(item) => {
                    setSelectedProductState(item);
                    productStateSheetRef.current?.dismiss();
                }}
                renderRight={(item, selected) => ({
                    variant: 'radio',
                    radio: <Radio checked={selected} onValueChange={() => { }} />,
                })}
                snapPoints={[]}
                topVariant='text + icon'
                title="État de l'article"
                icon={productStateStack.length > 1 ? <Arrowleft /> : <Close />}
                iconPosition='right'
                selectedId={selectedProductState?.id}
            />
        </Flex>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

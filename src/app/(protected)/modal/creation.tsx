import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Linking, Modal, Platform, StyleSheet } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { Pressable, Keyboard, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location'

import { useGoBack } from '@/src/lib/hooks/useGoBack';
import { useTheme } from '@/src/lib/hooks/useTheme';
import useTopAppBar from '@/src/lib/hooks/useTopAppBar';
import { useLocationStore } from '@/src/state/locationStore';
import { useSnackbarStore } from '@/src/state/snackbarStore';
import { usePhotoContext } from '#/context/PhotoContext';

import Flex from '#/Flex';
import Text from '#/Text';
import Button from '#/controls/Button';
import TextField from '#/controls/TextField';
import Divider from '#/display/Divider';
import Table from '#/display/Table';
import TopAppBar from '#/display/TopAppBar/TopAppBar';
import Radio from '#/controls/Radio';
import ModularBottomSheet from '#/display/ModularBottomSheet';
import ImageRatio from '#/display/ImageRatio';
import Fade from '#/miscellaneous/Fade';
import Tooltip from '#/display/Tooltip';

import { Close, Arrowleft, Mylocation, Photo, Plus, Image } from '#/icons';


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
    const { theme, activeTheme } = useTheme();
    const router = useRouter();
    const { addSnackbar } = useSnackbarStore();



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

    // Section 3
    const [estimatedPrice, setEstimatedPrice] = useState('');
    const { latitude, longitude, plainLocation, error, fetchLocation } = useLocationStore();
    const [location, setLocation] = useState('');


    // Section 4
    const photoContext = usePhotoContext();
    if (!photoContext) throw new Error("PhotoContext absent du provider");
    const { photos, setPhotos } = photoContext;
    const [loadingPhotos, setLoadingPhotos] = useState(false);
    const maxPhotos = 10;
    const gotPhotos = photos.length > 0;
    const [selectedPhotoType, setSelectedPhotoType] = useState<'camera' | 'library' | null>(null);
    const addPhotoSheetRef = useRef<BottomSheetModal>(null);

    // Section 5 (Validation)
    const [loading, setLoading] = useState(false);
    const formValid = useMemo(() => {
        return (
            title.length > 0 &&
            description.length > 0 &&
            selectedCategory &&
            selectedProductState &&
            estimatedPrice.length > 0 &&
            location.length > 0 &&
            photos.length > 0 &&
            photos.length <= maxPhotos
        );
    }, [title, description, selectedCategory, selectedProductState, estimatedPrice, location, photos]);

    // On récupère la localisation du store
    useEffect(() => {
        fetchLocation()
    }, [])

    const handleCreateArticle = () => {
        setLoading(true);
        // TODO : Créer l'article
        console.log('Création de l\'article');
        setLoading(false);
    }

    const handleLocationClick = async () => {
        if (plainLocation) {
            setLocation(`${plainLocation.city}, ${plainLocation.postalCode}`)
        }

        if (error) {
            console.log('La localisation n\'est pas disponible');

            const { status } = await Location.getForegroundPermissionsAsync()
            if (status !== 'granted') {
                const { status: newStatus } = await Location.requestForegroundPermissionsAsync()

                if (newStatus !== 'granted') {
                    return Alert.alert(
                        "Permission requise",
                        "L'accès à la localisation est nécessaire. Activez-la dans les réglages.",
                        [
                            { text: "Annuler", style: "cancel" },
                            {
                                text: "Ouvrir les réglages",
                                onPress: () => {
                                    const url = Platform.OS === 'ios' ? 'app-settings:' : undefined
                                    Linking.openSettings().catch(() => {
                                        if (url) Linking.openURL(url)
                                    })
                                }
                            }
                        ]
                    )
                }
            }
        }
    }


    const handleAddPhoto = async (type: 'camera' | 'library') => {
        if (photos.length >= maxPhotos) return;

        setLoadingPhotos(true);

        try {
            if (type === 'camera') {
                const { status } = await ImagePicker.requestCameraPermissionsAsync();
                if (status !== 'granted') {
                    alert('Permission caméra refusée');
                    return;
                }

                const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });

                if (!result.canceled) {
                    const manipulated = await ImageManipulator.manipulateAsync(
                        result.assets[0].uri,
                        [],
                        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
                    );
                    setPhotos([...photos, { ...result.assets[0], uri: manipulated.uri }]);
                }

            } else if (type === 'library') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Permission galerie refusée');
                    return;
                }

                const result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: 'images',
                    allowsMultipleSelection: true,
                    selectionLimit: maxPhotos - photos.length,
                    quality: 0.8,
                });

                if (!result.canceled) {
                    const processedAssets = await Promise.all(
                        result.assets.map(async (asset) => {
                            const manipulated = await ImageManipulator.manipulateAsync(
                                asset.uri,
                                [],
                                { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
                            );
                            return { ...asset, uri: manipulated.uri };
                        })
                    );
                    setPhotos([...photos, ...processedAssets]);
                }
            }
        } finally {
            setLoadingPhotos(false);
        }
    };



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
            <Flex scroll gap={activeTheme.spacing._400} style={{ paddingTop: activeTheme.spacing._200, width: '100%', flex: 1 }}>
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

                {/* Section */}
                <Flex gap={activeTheme.spacing._200} style={{ paddingHorizontal: activeTheme.spacing._200, width: '100%' }}>
                    <TextField
                        placeholder={'22'}
                        value={estimatedPrice}
                        onChangeText={(price) => setEstimatedPrice(price)}
                        label={'Estimation en Trocoins *'}
                        keyboardType={'numeric'}
                    />

                    <Text variant='body_Small' type='brand' textDecorationLine='underline' onPress={() => {
                        console.log('Aide à l\'estimation');
                    }}>Aide à l'estimation</Text>

                    <Divider type='thin' />

                    <Flex gap={activeTheme.spacing._50} style={{ width: '100%' }}>
                        <TextField
                            type='action'
                            action={() => {
                                console.log('handleLocationClick');
                                handleLocationClick();
                            }}
                            icon={<Mylocation color={activeTheme.colors.icon.primary} />}
                            placeholder={'Paris, France'}
                            value={location}
                            onChangeText={(text) => setLocation(text)}
                            label={'Localisation de l\'article *'}
                            editable={false}
                        />
                    </Flex>
                </Flex>

                {/* Divider */}
                <Divider type='thick' />

                {/* Section */}
                <Flex gap={activeTheme.spacing._200} style={{ paddingHorizontal: activeTheme.spacing._200, width: '100%' }}>
                    {/* Textes */}
                    <Flex gap={activeTheme.spacing._100}>
                        <Text variant='title_Large' type='primary'>Ajoute des photos à ton article</Text>
                        {!gotPhotos && (
                            <Text variant='body_Small' type='secondary'>Tu peux ajouter jusqu'à 10 photos. N'hésite pas, cela permet de mettre en valeur tes articles et augmenter ton nombre d'échanges.</Text>
                        )}
                    </Flex>

                    <Flex
                        direction={gotPhotos || loadingPhotos ? 'row' : 'column'}
                        style={{ width: gotPhotos || loadingPhotos ? '100%' : null }}>
                        {loadingPhotos ? (
                            <Flex alignItems="center" justifyContent="center" style={{ width: '100%', height: 100 }}>
                                <ActivityIndicator size="large" color={activeTheme.colors.icon.primary} />
                            </Flex>
                        ) : gotPhotos ? (
                            // Photos container
                            <Flex gap={activeTheme.spacing._100} style={{ width: '100%' }}>
                                <Flex direction='row'>
                                    {/* Scroll */}
                                    <Flex
                                        // overflow='hidden'
                                        // scroll
                                        direction='row'
                                        alignItems='center'
                                        gap={activeTheme.spacing._400}
                                        style={{
                                            width: '100%',
                                            borderTopRightRadius: activeTheme.radius.default,
                                            borderBottomRightRadius: activeTheme.radius.default,
                                        }}>

                                        {/* Photos */}
                                        <Flex
                                            direction='row'
                                            gap={activeTheme.spacing._200}
                                        >
                                            {photos.map((photo, index) => (
                                                <Flex key={index}>
                                                    <Pressable
                                                        onPress={() => {
                                                            router.push({
                                                                pathname: '/modal/productImage',
                                                                params: { uri: photo.uri, index }
                                                            });
                                                        }}
                                                        style={{
                                                            width: 127,
                                                        }}
                                                    >
                                                        <ImageRatio
                                                            ratio='cover'
                                                            source={{ uri: photo.uri }}
                                                            style={{
                                                                borderRadius: activeTheme.radius.default,
                                                            }}
                                                            contentFit="cover"
                                                            transition={1000}
                                                        />

                                                        <Flex
                                                            alignItems='center'
                                                            justifyContent='center'
                                                            style={{
                                                                position: 'absolute',
                                                                top: activeTheme.spacing._100,
                                                                right: activeTheme.spacing._100,
                                                                backgroundColor: activeTheme.colors.icon.invert,
                                                                height: 24,
                                                                width: 24,
                                                                borderRadius: 12,
                                                            }}
                                                        >
                                                            <Pressable onPress={() => {
                                                                setPhotos(photos.filter((_, i) => i !== index));
                                                            }}>
                                                                <Close color={activeTheme.colors.icon.primary} />
                                                            </Pressable>
                                                        </Flex>
                                                    </Pressable>
                                                </Flex>
                                            ))}
                                        </Flex>

                                        <Tooltip
                                            content='Ajouter des photos'
                                        >
                                            <Button
                                                variant='outlined'
                                                size='large'
                                                icon={<Plus />}
                                                onPress={() => {
                                                    Keyboard.dismiss();
                                                    addPhotoSheetRef.current?.present();
                                                }}
                                                disabled={photos.length >= maxPhotos}
                                            />
                                        </Tooltip>

                                        <Flex style={{ width: 0, height: 20 }} />
                                    </Flex>

                                    {photos.length >= 3 && (
                                        <Fade side='right' />
                                    )}
                                </Flex>

                                {/* Photos count */}
                                <Flex>
                                    <Text variant='body_Small' type='secondary'>{photos.length}/{maxPhotos}</Text>
                                </Flex>
                            </Flex>
                        ) : (
                            <Button
                                label='Ajouter photo'
                                variant='secondary'
                                size='large'
                                icon={<Photo />}
                                onPress={() => {
                                    Keyboard.dismiss();
                                    addPhotoSheetRef.current?.present();
                                }}
                            />
                        )}
                    </Flex>
                </Flex>

                {/* Divider */}
                <Divider type='thick' />

                {/* Section */}
                <Flex gap={activeTheme.spacing._200} style={{ paddingHorizontal: activeTheme.spacing._200, width: '100%' }}>
                    <Text variant='body_Large' type='secondary'>En postant mon article, j'accepte les <Text variant='title_Small' type='secondary' onPress={() => router.push('/terms-and-conditions')} style={{ textDecorationLine: 'underline' }}>conditions générales d'utilisations</Text> de Trocle.</Text>
                </Flex>

                <Flex style={{ height: activeTheme.spacing._1000 }} />
            </Flex>


            {/* Bottom */}
            <Flex style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                paddingHorizontal: activeTheme.spacing._200,
                paddingVertical: activeTheme.spacing._200,
                backgroundColor: activeTheme.colors.surface.secondary,
                borderTopWidth: 1,
                borderColor: activeTheme.colors.surface.divider,
            }}>
                <Button
                    label="Poster l'article"
                    variant="primary"
                    size="large"
                    fullWidth
                    disabled={!formValid || loading}
                    loading={loading}
                    onPress={handleCreateArticle}
                />
            </Flex>






            {/* Sheet de sélection de catégorie */}
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
                initialTitle='Catégorie'
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

            {/* Sheet de sélection d'état de l'article */}
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
                initialTitle="État de l'article"
                icon={productStateStack.length > 1 ? <Arrowleft /> : <Close />}
                iconPosition='right'
                selectedId={selectedProductState?.id}
            />

            {/* Sheet de sélection de photos */}
            <ModularBottomSheet
                ref={addPhotoSheetRef}
                data={[
                    { id: 'camera', name: 'Prendre une photo', leftIcon: <Photo />, leftVariant: 'icon' },
                    { id: 'library', name: 'Choisir une photo', leftIcon: <Image />, leftVariant: 'icon' },
                ]}
                allData={[]}
                onSelect={(item) => {
                    setSelectedPhotoType(item.id as 'camera' | 'library');
                    addPhotoSheetRef.current?.dismiss();
                    handleAddPhoto(item.id as 'camera' | 'library');
                }}
                renderRight={() => ({ variant: 'empty' })}
                selectedId={selectedPhotoType}
                snapPoints={['25%']}
                topVariant='handle'
                initialTitle=''
                iconPosition='left'
                onClose={() => {
                    setSelectedPhotoType(null);
                    addPhotoSheetRef.current?.dismiss();
                }}
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

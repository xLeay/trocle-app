import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Keyboard, Linking, Platform, Pressable, StyleSheet } from 'react-native';

import { usePhotoContext } from '#/context/PhotoContext';
import { useGoBack } from '@/src/lib/hooks/useGoBack';
import { useTheme } from '@/src/lib/hooks/useTheme';
import useTopAppBar from '@/src/lib/hooks/useTopAppBar';
import { useLocationStore } from '@/src/state/locationStore';
import { useSnackbarStore } from '@/src/state/snackbarStore';

import Flex from '#/Flex';
import Text from '#/Text';
import Button from '#/controls/Button';
import Radio from '#/controls/Radio';
import TextField from '#/controls/TextField';
import BottomSheet, { BottomSheetRef } from '#/display/BottomSheet';
import Divider from '#/display/Divider';
import ImageRatio from '#/display/ImageRatio';

import Table from '#/display/Table';
import Tooltip from '#/display/Tooltip';
import TopAppBar from '#/display/TopAppBar/TopAppBar';

import { Close, Image, Mylocation, Photo, Plus } from '#/icons';


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

interface Category {
    id: number;
    name: string;
    parentId: number | null;
}

const categories: Category[] = [
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
    { id: 21, name: 'Commodes', parentId: 19 },

    { id: 22, name: 'Culture', parentId: null },
    { id: 23, name: 'Livres', parentId: 22 },
    { id: 24, name: 'BD / Manga', parentId: 22 },
];

const productStates = [
    { id: 1, name: 'Comme neuf' },
    { id: 2, name: 'Très bon état' },
    { id: 3, name: 'Bon état' },
    { id: 4, name: 'Mauvais état' },
];



export default function CreationModal() {
    const { activeTheme } = useTheme();
    const router = useRouter();
    // const { addSnackbar } = useSnackbarStore();
    const addSnackbar = useSnackbarStore((state) => state.addSnackbar)


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
    const categorySheetRef = useRef<BottomSheetRef>(null);

    const [categoryPath, setCategoryPath] = useState<Category[]>([]);
    const currentParent = categoryPath.at(-1);
    const visibleCategories = categories.filter(
        (category) =>
            category.parentId === (currentParent?.id ?? null),
    );

    const handleCategoryPress = (category: Category) => {
        const children = categories.filter(
            (item) => item.parentId === category.id,
        );

        if (children.length > 0) {
            setCategoryPath((current) => [...current, category]);
            return;
        }

        setTempSelectedCategory(category);
    };

    const handleBack = () => {
        setCategoryPath((current) => current.slice(0, -1));
    };

    const [selectedProductState, setSelectedProductState] = useState<any>(null);
    const productStateSheetRef = useRef<BottomSheetRef>(null);

    // Section 3
    const [estimatedPrice, setEstimatedPrice] = useState('');
    // const { latitude, longitude, plainLocation, error, fetchLocation } = useLocationStore();
    const latitude = useLocationStore((state) => state.latitude)
    const longitude = useLocationStore((state) => state.longitude)
    const plainLocation = useLocationStore((state) => state.plainLocation)
    const error = useLocationStore((state) => state.error)
    const fetchLocation = useLocationStore((state) => state.fetchLocation)
    const [location, setLocation] = useState('');


    // Section 4
    const photoContext = usePhotoContext();
    if (!photoContext) throw new Error("PhotoContext absent du provider");
    const { photos, setPhotos } = photoContext;
    const [loadingPhotos, setLoadingPhotos] = useState(false);
    const maxPhotos = 10;
    const gotPhotos = photos.length > 0;
    const [selectedPhotoType, setSelectedPhotoType] = useState<'camera' | 'library' | null>(null);
    const photoSheetRef = useRef<BottomSheetRef>(null);

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
                                        scroll
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
                                                <Flex key={index} style={{ width: 127 }}>

                                                    <ImageRatio
                                                        ratio='cover'
                                                        source={{ uri: photo.uri }}
                                                        style={{
                                                            borderRadius: activeTheme.radius.default,
                                                        }}
                                                        contentFit="cover"
                                                        transition={1000}

                                                        onPress={() => {
                                                            router.push({
                                                                pathname: '/modal/product-image',
                                                                params: { uri: photo.uri, index }
                                                            });
                                                        }}
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
                                                    photoSheetRef.current?.present();
                                                }}
                                                disabled={photos.length >= maxPhotos}
                                            />
                                        </Tooltip>

                                        <Flex style={{ width: 0, height: 20 }} />
                                    </Flex>

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
                                    photoSheetRef.current?.present();
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
            <BottomSheet
                ref={categorySheetRef}
                headerVariant="text + icon"
                title={currentParent?.name ?? 'Catégorie'}
                canGoBack={categoryPath.length > 0}
                onBack={handleBack}
                onClose={() => setCategoryPath([])}
                actions={
                    <>
                        <Button
                            label="Réinitialiser"
                            variant="outlined"
                            size="large"
                            fullWidth
                            disabled={!tempSelectedCategory}
                            onPress={() => {
                                setTempSelectedCategory(null);
                                setSelectedCategory(null);
                            }}
                        />

                        <Button
                            label="Appliquer"
                            variant="secondary"
                            size="large"
                            fullWidth
                            onPress={() => {
                                setSelectedCategory(tempSelectedCategory);
                                categorySheetRef.current?.dismiss();
                            }}
                        />
                    </>
                }
            >
                {visibleCategories.map((category) => {
                    const hasChildren = categories.some(
                        (item) => item.parentId === category.id,
                    );

                    return (
                        <Table
                            key={category.id}
                            leftProps={{
                                leftText: category.name,
                            }}
                            rightProps={
                                hasChildren
                                    ? {
                                        variant: 'text',
                                        active: true,
                                        rightText: '',
                                    }
                                    : {
                                        variant: 'radio',
                                        radio: (
                                            <Radio
                                                checked={
                                                    tempSelectedCategory?.id ===
                                                    category.id
                                                }
                                                onValueChange={() =>
                                                    setTempSelectedCategory(category)
                                                }
                                            />
                                        ),
                                    }
                            }
                            onPress={() => handleCategoryPress(category)}
                        />
                    );
                })}
            </BottomSheet>



            {/* Sheet de sélection d'état de l'article */}
            <BottomSheet
                ref={productStateSheetRef}
                headerVariant="text + icon"
                title={'État de l\'article'}
                actions={
                    <>
                        <Button
                            label="Réinitialiser"
                            variant="outlined"
                            size="large"
                            fullWidth
                            disabled={!selectedProductState}
                            onPress={() => {
                                setSelectedProductState(null);
                            }}
                        />

                        <Button
                            label="Appliquer"
                            variant="secondary"
                            size="large"
                            fullWidth
                            onPress={() => {
                                productStateSheetRef.current?.dismiss();
                            }}
                        />
                    </>
                }
            >
                {productStates.map((state) => {
                    return (
                        <Table
                            key={state.id}
                            leftProps={{
                                leftText: state.name,
                            }}
                            rightProps={
                                {
                                    variant: 'radio',
                                    radio: (
                                        <Radio
                                            checked={
                                                selectedProductState?.id ===
                                                state.id
                                            }
                                            onValueChange={() =>
                                                setSelectedProductState(state)
                                            }
                                        />
                                    )
                                }
                            }
                            onPress={() => setSelectedProductState(state)}
                        />
                    );
                })}
            </BottomSheet>



            {/* Sheet de sélection de photos */}
            <BottomSheet
                ref={photoSheetRef}
                headerVariant="handle"
            >
                <Table
                    leftProps={{
                        leftText: 'Prendre une photo',
                        icon: <Photo />,
                        variant: 'icon',
                    }}
                    rightProps={{ variant: 'empty' }}
                    onPress={() => {
                        setSelectedPhotoType('camera');
                        photoSheetRef.current?.dismiss();
                        handleAddPhoto('camera');
                    }}
                />

                <Table
                    leftProps={{
                        leftText: 'Choisir une photo',
                        icon: <Image />,
                        variant: 'icon',
                    }}
                    rightProps={{ variant: 'empty' }}
                    onPress={() => {
                        setSelectedPhotoType('library');
                        photoSheetRef.current?.dismiss();
                        handleAddPhoto('library');
                    }}
                />
            </BottomSheet>
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

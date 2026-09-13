import { Stack, useRouter } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';

// HOOKS
import { usePhotoContext } from '#/context/PhotoContext';
import { useCategoryAttributeValues } from '@/src/lib/hooks/useCategoryAttributeValues';
import { useGoBack } from '@/src/lib/hooks/useGoBack';
import { useProductPhotos } from '@/src/lib/hooks/useProductPhotos';
import { useTheme } from '@/src/lib/hooks/useTheme';
import useTopAppBar from '@/src/lib/hooks/useTopAppBar';

// UTILS
import { LocationAddress, reverseGeocode } from '@/src/lib/utils/geocoding';

// STATE
import { useLocationStore } from '@/src/state/locationStore';
import { useSnackbarStore } from '@/src/state/snackbarStore';

// API
import { Category } from '@/src/lib/api/category';
import { State } from '@/src/lib/api/condition';

// QUERIES
import { useCategoryAttributes } from '@/src/queries/useCategoryQueries';
import { useCreateProduct } from '@/src/queries/useProductMutations';

// COMPONENTS BASIQUES
import Flex from '#/Flex';
import Text from '#/Text';
import Button from '#/controls/Button';
import TextField from '#/controls/TextField';
import { BottomSheetRef } from '#/display/BottomSheet';
import Divider from '#/display/Divider';
import Table from '#/display/Table';
import TopAppBar from '#/display/TopAppBar/TopAppBar';

// COMPONENTS METIERS
import BrandPickerSheet, { BrandSelection } from '#/brand/BrandPickerSheet';
import CategoryAttributesSheet from '#/category/CategoryAttributesSheet';
import CategoryPickerSheet from '#/category/CategoryPickerSheet';
import LocationAutocompleteField from '#/location/LocationAutocompleteField';
import PhotoPickerSheet from '#/photo/PhotoPickerSheet';
import CreationPhotosSection from '#/product/CreationPhotosSection';
import ProductStateSheet from '#/product/ProductStateSheet';

// ICÔNES
import { Close } from '#/icons';


export default function CreationModal() {
    const { activeTheme } = useTheme();
    const router = useRouter();
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
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const categorySheetRef = useRef<BottomSheetRef>(null);

    // Les attributs de la catégorie sélectionnée
    const { data: categoryAttributes = [] } = useCategoryAttributes(selectedCategory?.id ?? null);

    const {
        attributeValues,
        activeAttribute,
        setActiveAttribute,
        getAttributeText,
        setAttributeValue,
        toggleAttributeValue,
        clearAttributeValue,
        requiredAttributesValid,
    } = useCategoryAttributeValues(selectedCategory?.id, categoryAttributes);

    const attributeSheetRef = useRef<BottomSheetRef>(null);

    // L'état du produit (bon état, très bon état, etc.)
    const [selectedProductState, setSelectedProductState] = useState<State | null>(null);
    const productStateSheetRef = useRef<BottomSheetRef>(null);

    // La marque du produit
    const [selectedBrand, setSelectedBrand] = useState<BrandSelection | null>(null);

    const brandSheetRef = useRef<BottomSheetRef>(null);


    // Section 3
    const [selectedProductLocation, setSelectedProductLocation] = useState<LocationAddress | null>(null);
    const latitude = useLocationStore((state) => state.latitude)
    const longitude = useLocationStore((state) => state.longitude)
    const plainLocation = useLocationStore((state) => state.plainLocation)
    const fetchLocation = useLocationStore((state) => state.fetchLocation)
    const hasLocation = latitude !== null && longitude !== null;

    const locationLabel = plainLocation
        ? [plainLocation.city, plainLocation.postalCode]
            .filter(Boolean)
            .join(', ')
        : hasLocation
            ? 'Position actuelle'
            : '';


    // Section 4
    const photoContext = usePhotoContext();
    if (!photoContext) throw new Error("PhotoContext absent du provider");
    const {
        photos,
        setPhotos,
        loadingPhotos,
        maxPhotos,
        handleAddPhoto,
        removePhoto,
    } = useProductPhotos();
    const photoSheetRef = useRef<BottomSheetRef>(null);


    // Section 5 (Validation)
    const [loading, setLoading] = useState(false);
    const formValid = useMemo(() => {
        return (
            title.trim().length > 0 &&
            description.trim().length > 0 &&
            selectedCategory !== null &&
            requiredAttributesValid &&
            selectedProductState !== null &&
            selectedBrand !== null &&
            selectedProductLocation !== null &&
            photos.length > 0 &&
            photos.length <= maxPhotos
        );
    }, [
        title,
        description,
        selectedCategory,
        requiredAttributesValid,
        selectedProductState,
        selectedProductLocation,
        photos,
        maxPhotos,
    ]);


    // Creation du produit
    const createProductMutation = useCreateProduct();

    const handleCreateArticle = async () => {
        if (
            !formValid ||
            !selectedCategory ||
            !selectedProductState ||
            !selectedBrand
        ) {
            addSnackbar({
                message: 'Complète tous les champs obligatoires.',
                type: 'error',
                position: 'bottom',
            });

            return;
        }

        if (!selectedProductLocation) {
            addSnackbar({
                message: 'Ajoute une localisation à ton article.',
                type: 'error',
                position: 'bottom',
            });

            return;
        }

        createProductMutation.reset();

        try {
            const attributes = Object.entries(attributeValues).map(
                ([attributeId, value]) => ({
                    attributeId: Number(attributeId),
                    values: Array.isArray(value) ? value : [value],
                })
            );

            const productId = await createProductMutation.mutateAsync({
                input: {
                    title: title.trim(),
                    description: description.trim(),
                    categoryId: selectedCategory.id,
                    stateId: selectedProductState.id,
                    ...(selectedBrand.id !== null
                        ? { brandId: selectedBrand.id }
                        : { newBrandName: selectedBrand.name }),
                    attributes,
                    location: {
                        city: selectedProductLocation.city,
                        postcode: selectedProductLocation.postcode,
                        department: selectedProductLocation.department,
                        latitude: selectedProductLocation.latitude,
                        longitude: selectedProductLocation.longitude,
                    },
                },
                photos,
            });

            setPhotos([]);

            addSnackbar({
                message: 'Ton article a été publié !',
                type: 'success',
                position: 'bottom',
            });

            router.replace({
                pathname: '/product/[id]',
                params: {
                    id: productId,
                },
            });
        } catch (error) {
            console.error('Erreur création article :', error);

            addSnackbar({
                message:
                    error instanceof Error
                        ? error.message
                        : 'Impossible de publier ton article.',
                type: 'error',
                position: 'bottom',
            });
        }
    };


    const handleUseCurrentLocation = async () => {
        await fetchLocation();

        const {
            latitude: currentLatitude,
            longitude: currentLongitude,
            error: locationError,
        } = useLocationStore.getState();

        if (
            currentLatitude === null ||
            currentLongitude === null
        ) {
            addSnackbar({
                message:
                    locationError ??
                    'Impossible de récupérer ta position.',
                type: 'error',
                position: 'bottom',
            });

            return;
        }

        const address = await reverseGeocode(
            currentLatitude,
            currentLongitude
        );

        if (!address) {
            addSnackbar({
                message: 'Position trouvée, mais adresse indisponible.',
                type: 'warning',
                position: 'bottom',
            });

            return;
        }

        setSelectedProductLocation({
            ...address,
            name: address.city,
            label: [address.city, address.postcode]
                .filter(Boolean)
                .join(', '),
        });
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
                <Flex
                    gap={activeTheme.spacing._100}
                    style={{ paddingHorizontal: activeTheme.spacing._0, width: '100%' }}
                >
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

                    <Divider type='thin' />

                    <Table
                        leftProps={{
                            variant: 'empty',
                            leftText: 'Marque',
                        }}
                        rightProps={{
                            variant: 'text',
                            rightText: selectedBrand?.name ?? '',
                            active: selectedBrand !== null,

                        }}
                        onPress={() => {
                            brandSheetRef.current?.present();
                        }}
                    />

                    {categoryAttributes.map((attribute) => {
                        const label = `${attribute.name}${attribute.required ? ' *' : ''}`;

                        if (attribute.inputType === 'text') {
                            const currentValue = attributeValues[attribute.id];

                            return (
                                <React.Fragment key={attribute.id}>
                                    <Divider type="thin" />

                                    <Flex
                                        gap={activeTheme.spacing._100}
                                        style={{
                                            paddingHorizontal: activeTheme.spacing._200,
                                            width: '100%',
                                        }}
                                    >
                                        <TextField
                                            label={label}
                                            placeholder={`Renseigner ${attribute.name.toLowerCase()}`}
                                            value={
                                                typeof currentValue === 'string'
                                                    ? currentValue
                                                    : ''
                                            }
                                            onChangeText={(value) =>
                                                setAttributeValue(attribute.id, value)
                                            }
                                        />

                                        {attribute.unit && (
                                            <Text variant="body_Small" type="secondary">
                                                Unité : {attribute.unit}
                                            </Text>
                                        )}
                                    </Flex>
                                </React.Fragment>
                            );
                        }

                        if (
                            attribute.inputType === 'select' ||
                            attribute.inputType === 'multi_select'
                        ) {
                            return (
                                <React.Fragment key={attribute.id}>
                                    <Divider type="thin" />

                                    <Table
                                        leftProps={{
                                            variant: 'empty',
                                            leftText: label,
                                        }}
                                        rightProps={{
                                            variant: 'text',
                                            rightText: getAttributeText(attribute),
                                            active: Boolean(
                                                attributeValues[attribute.id]
                                            ),
                                        }}
                                        onPress={() => {
                                            setActiveAttribute(attribute);
                                            attributeSheetRef.current?.present();
                                        }}
                                    />
                                </React.Fragment>
                            );
                        }

                        return null;
                    })}
                </Flex>

                {/* Divider */}
                <Divider type='thick' />

                {/* Section */}
                <Flex
                    gap={activeTheme.spacing._200}
                    style={{ paddingHorizontal: activeTheme.spacing._200, width: '100%' }}
                >
                    {/* Feature Flag: Trocoins */}
                    {/* <TextField
                        placeholder={'22'}
                        value={estimatedPrice}
                        onChangeText={(price) => setEstimatedPrice(price)}
                        label={'Estimation en Trocoins *'}
                        keyboardType={'numeric'}
                    />

                    <Text variant='body_Small' type='brand' textDecorationLine='underline' onPress={() => {
                        console.log('Aide à l\'estimation');
                    }}>Aide à l'estimation</Text>

                    <Divider type='thin' /> */}

                    <Flex gap={activeTheme.spacing._50} style={{ width: '100%' }}>
                        <LocationAutocompleteField
                            label="Localisation de l’article *"
                            value={selectedProductLocation}
                            onChange={setSelectedProductLocation}
                            onUseCurrentLocation={handleUseCurrentLocation}
                        />
                    </Flex>
                </Flex>

                {/* Divider */}
                <Divider type='thick' />

                {/* Section Photos */}
                <CreationPhotosSection
                    photos={photos}
                    loadingPhotos={loadingPhotos}
                    maxPhotos={maxPhotos}
                    onAddPhotoPress={() => photoSheetRef.current?.present()}
                    onRemovePhoto={removePhoto}
                />

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
                    disabled={!formValid || createProductMutation.isPending}
                    loading={createProductMutation.isPending}
                    onPress={handleCreateArticle}
                />
            </Flex>




            {/* Sheet de sélection de catégorie */}
            <CategoryPickerSheet
                sheetRef={categorySheetRef}
                value={selectedCategory}
                onChange={setSelectedCategory}
            />

            {/* Sheet de sélection d'état de l'article */}
            <ProductStateSheet
                sheetRef={productStateSheetRef}
                value={selectedProductState}
                onChange={setSelectedProductState}
            />

            {/* Sheet de la sélection de la marque de l'article */}
            <BrandPickerSheet
                sheetRef={brandSheetRef}
                value={selectedBrand}
                onChange={setSelectedBrand}
            />

            {/* Sheets de sélection des attributs du produit */}
            <CategoryAttributesSheet
                sheetRef={attributeSheetRef}
                attribute={activeAttribute}
                values={attributeValues}
                onSetValue={setAttributeValue}
                onToggleValue={toggleAttributeValue}
                onClearValue={clearAttributeValue}
            />

            {/* Sheet de sélection de photos */}
            <PhotoPickerSheet
                sheetRef={photoSheetRef}
                onSelectCamera={() => handleAddPhoto('camera')}
                onSelectLibrary={() => handleAddPhoto('library')}
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

import DateTimePicker from '@expo/ui/community/datetime-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

import { useTheme } from '@/src/lib/hooks/useTheme';
import { useLocationStore } from '@/src/state/locationStore';

import { formatLocationAddress } from '@/src/lib/utils/geocoding';

import Button from '#/controls/Button';
import PressableOverlay from '#/controls/PressableOverlay';
import Radio from '#/controls/Radio';
import TextField from '#/controls/TextField';
import Divider from '#/display/Divider';
import Table from '#/display/Table';
import Flex from '#/Flex';
import Text from '#/Text';

import { Calendar, Edit, Handdelivery, Location, Map, Plus, Time } from '#/icons';

export type PropositionDeliveryMethod =
    | 'hand_delivery'
    | 'parcel_delivery';

interface PropositionDeliveryProps {
    value: PropositionDeliveryMethod | null;
    onChange: (method: PropositionDeliveryMethod) => void;
    selectedDate: Date | null;
    onChangeDate: (date: Date) => void;
    selectedTime: Date | null;
    onChangeTime: (time: Date) => void;
    additionalInfos: string;
    onChangeAdditionalInfos: (value: string) => void;
}

interface DeliveryOptionProps {
    title: string;
    description?: string;
    selected: boolean;
    icon: React.ReactNode;
    disabledOption?: boolean;
    onPress: () => void;
}

export type DeliveryDetailType =
    | 'address'
    | 'date'
    | 'time'
    | 'additional_infos';

interface DeliveryDetailProps {
    type: DeliveryDetailType;
    emptyDetail: boolean;
    valueAddress?: string;
    valueDate?: string;
    valueTime?: string;
    valueAdditionalInfos?: string;
    onChangeAdditionalInfos?: (text: string) => void;
    detailOnPress: () => void;
}

function DeliveryOption({
    title,
    description,
    selected,
    icon,
    onPress,
    disabledOption = false
}: DeliveryOptionProps) {
    const { activeTheme } = useTheme();

    return (
        <Flex fullWidth style={{ padding: activeTheme.spacing._50 }}>
            <Table
                leftProps={{
                    variant: 'icon',
                    icon: icon,
                    leftText: title,
                    legendText: description,

                    leftTextType: disabledOption ? 'placeholder' : undefined,
                    legendTextType: disabledOption ? 'placeholder' : undefined,
                }}
                rightProps={{
                    variant: 'radio',
                    radio: <Radio onValueChange={onPress} checked={selected} disabled={disabledOption} />
                }}
                isPressable={!disabledOption}
                onPress={onPress}
            />
            {disabledOption &&
                <Text variant='body_Small' type='info' style={{ paddingLeft: activeTheme.spacing._100 }}>La livraison en point relais sera disponible à l'avenir !</Text>
            }
        </Flex>
    );
}

function DeliveryDetail({
    type,
    emptyDetail,
    valueAddress,
    valueDate,
    valueTime,
    valueAdditionalInfos,
    onChangeAdditionalInfos,
    detailOnPress,
}: DeliveryDetailProps) {
    const { activeTheme } = useTheme();

    const iconColor = emptyDetail ? activeTheme.colors.text.placeholder : activeTheme.colors.icon.primary;

    const detailType = () => {
        switch (type) {
            case 'address':
                return 'Choisir une adresse';
            case 'date':
                return 'Choisir la date du rendez-vous';
            case 'time':
                return 'Choisir l’heure du rendez-vous';
            case 'additional_infos':
                return 'Informations supplémentaire (facultatif)';
        }
    }

    const detailValue = () => {
        switch (type) {
            case 'address':
                return valueAddress;
            case 'date':
                return valueDate;
            case 'time':
                return valueTime;
            case 'additional_infos':
                return valueAdditionalInfos;
        }
    }

    const detailIcon = () => {
        switch (type) {
            case 'address':
                return <Location size={24} color={iconColor} />;
            case 'date':
                return <Calendar size={24} color={iconColor} />;
            case 'time':
                return <Time size={24} color={iconColor} />;
        }
    }

    if (type === 'additional_infos') {
        return (
            <Flex
                fullWidth
                direction='column'
                gap={activeTheme.spacing._100}
                style={{
                    paddingHorizontal: activeTheme.spacing._200,
                    paddingBottom: activeTheme.spacing._200
                }}
            >
                <Text variant='body_Small' type={emptyDetail ? 'placeholder' : 'primary'}>{detailType()}</Text>

                {/* Bas */}
                <Flex>
                    <TextField
                        value={valueAdditionalInfos}
                        onChangeText={onChangeAdditionalInfos ?? (() => { })}
                        placeholder={'Devant la mairie...'}
                    />
                </Flex>
            </Flex>
        );
    }

    return (
        <PressableOverlay
            onPress={detailOnPress}
            borderRadius={activeTheme.radius.card}
            style={{
                backgroundColor: activeTheme.colors.surface.primary,
                padding: activeTheme.spacing._200,
                width: '100%',
                minWidth: 0
            }}
        >
            <Flex
                direction="row"
                alignItems="center"
                gap={10}
                style={{
                    flex: 1
                }}
            >
                {/* Gauche */}
                <Flex
                    fullWidth
                    direction="row"
                    alignItems="flex-start"
                    gap={activeTheme.spacing._100}
                    style={{
                        flex: 1,
                        minWidth: 0,
                    }}
                >
                    <Flex style={{ flexShrink: 0 }}>
                        {detailIcon()}
                    </Flex>

                    <Text
                        variant="body_Medium"
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        type={emptyDetail ? 'placeholder' : 'primary'}
                        style={{
                            flexGrow: 1,
                            flexShrink: 1,
                            minWidth: 0,
                        }}
                    >
                        {emptyDetail ? detailType() : detailValue()}
                    </Text>
                </Flex>

                {/* Droite */}
                <Flex
                    alignItems="center"
                    justifyContent="center"
                    style={{
                        flexShrink: 0,
                    }}
                >
                    {emptyDetail ? (
                        <Plus size={24} color={activeTheme.colors.icon.primary} />
                    ) : (
                        <Edit size={24} color={activeTheme.colors.icon.primary} />
                    )}
                </Flex>
            </Flex>
        </PressableOverlay>
    );
}

export default function PropositionDelivery({
    value,
    onChange,
    selectedDate,
    onChangeDate,
    selectedTime,
    onChangeTime,
    additionalInfos,
    onChangeAdditionalInfos,
}: PropositionDeliveryProps) {
    const { theme, activeTheme } = useTheme();

    // const { trocPropositionSelectedAddress } = useLocationStore();
    const trocPropositionSelectedAddress = useLocationStore((state) => state.trocPropositionSelectedAddress)
    const [pickerMode, setPickerMode] = useState<'date' | 'time' | null>(null);

    const pickerValue =
        pickerMode === 'date'
            ? (selectedDate ?? new Date())
            : (selectedTime ?? new Date());

    const now = new Date();

    const isDeliveryToday =
        selectedDate?.getFullYear() === now.getFullYear() &&
        selectedDate?.getMonth() === now.getMonth() &&
        selectedDate?.getDate() === now.getDate();

    const minimumPickerDate =
        pickerMode === 'date'
            ? now
            : pickerMode === 'time' && isDeliveryToday
                ? now
                : undefined;


    return (
        <Flex fullWidth gap={activeTheme.spacing._400} style={{ paddingHorizontal: activeTheme.spacing._200 }}>
            <Flex fullWidth gap={activeTheme.spacing._100}>
                <Text variant="display_Small" type="primary">
                    Comment tu veux faire l’échange ?
                </Text>

                <Text variant="body_Medium" type="secondary">
                    Tu as maintenant le choix entre le point relais ou l’échange en main propre, vois ce qui est le plus pratique pour toi !
                </Text>
            </Flex>

            {/* Section */}
            <Flex fullWidth gap={activeTheme.spacing._400}>

                {/* Section livraison */}
                <Flex fullWidth gap={activeTheme.spacing._100}>
                    <Text variant='body_Small' type='secondary'>Options de l’échange</Text>
                    <Flex fullWidth border borderColor={activeTheme.colors.border.primary} gap={0}
                        style={{
                            borderRadius: activeTheme.radius.card,
                            backgroundColor: activeTheme.colors.surface.primary
                        }}
                    >
                        <DeliveryOption
                            title="En main propre"
                            selected={value === 'hand_delivery'}
                            icon={<Handdelivery size={24} color={activeTheme.colors.icon.primary} />}
                            onPress={() => onChange('hand_delivery')}
                        />

                        <Divider />

                        <DeliveryOption
                            title="En point relais"
                            description="À partir de 2€"
                            selected={value === 'parcel_delivery'}
                            icon={<Location size={24} color={activeTheme.colors.text.placeholder} />}
                            onPress={() => onChange('parcel_delivery')}
                            disabledOption={true}
                        />
                    </Flex>
                </Flex>

                {/* Section livraison */}
                {value && (
                    <Flex fullWidth gap={activeTheme.spacing._100}>
                        <Text variant='body_Small' type='secondary'>Détails sur l’échange <Text variant='body_Small' type='danger'>*</Text></Text>
                        {value === 'parcel_delivery' ? (
                            <Button
                                fullWidth
                                variant='secondary'
                                size='large'
                                icon={<Map size={24} />}
                                label='Choisir un point relais'
                                disabled={true}
                            />
                        ) : (
                            <Flex fullWidth border borderColor={activeTheme.colors.border.primary} gap={activeTheme.spacing._0}
                                style={{
                                    borderRadius: activeTheme.radius.card,
                                    backgroundColor: activeTheme.colors.surface.primary,
                                    // padding: activeTheme.spacing._200,
                                    overflow: "hidden"
                                }}
                            >
                                <DeliveryDetail
                                    type='address'
                                    emptyDetail={!trocPropositionSelectedAddress}
                                    valueAddress={
                                        trocPropositionSelectedAddress
                                            ? formatLocationAddress(trocPropositionSelectedAddress)
                                            : undefined
                                    }
                                    detailOnPress={() => {
                                        router.push({
                                            pathname: '/(protected)/trocs/location-map',
                                        })
                                    }}
                                />
                                <DeliveryDetail
                                    type='date'
                                    emptyDetail={!selectedDate}
                                    valueDate={selectedDate?.toLocaleDateString('fr-FR')}
                                    detailOnPress={() => setPickerMode('date')}
                                />
                                <DeliveryDetail
                                    type="time"
                                    emptyDetail={!selectedTime}
                                    valueTime={selectedTime?.toLocaleTimeString('fr-FR', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                    detailOnPress={() => setPickerMode('time')}
                                />
                                <DeliveryDetail
                                    type='additional_infos'
                                    emptyDetail={true}
                                    detailOnPress={() => { }}
                                    valueAdditionalInfos={additionalInfos}
                                    onChangeAdditionalInfos={onChangeAdditionalInfos}
                                />
                            </Flex>
                        )}
                    </Flex>
                )}

            </Flex>


            {pickerMode && (
                <DateTimePicker
                    key={pickerMode}
                    value={pickerValue}
                    mode={pickerMode}
                    is24Hour={true}
                    minimumDate={minimumPickerDate}
                    onDismiss={() => setPickerMode(null)}
                    onValueChange={(_, value) => {
                        if (pickerMode === 'date') {
                            const date = new Date(value);
                            date.setHours(0, 0, 0, 0);
                            onChangeDate(date);
                        }

                        if (pickerMode === 'time') {
                            const time = new Date(value);

                            // Toujours arrondir vers le prochain créneau de 15 min.
                            const roundedMinutes = Math.ceil(time.getMinutes() / 15) * 15;
                            time.setMinutes(roundedMinutes, 0, 0);

                            // On combine la date choisie et l'heure choisie.
                            const selectedDateTime = new Date(selectedDate ?? new Date());

                            selectedDateTime.setHours(
                                time.getHours(),
                                time.getMinutes(),
                                0,
                                0,
                            );

                            // Refuse une heure déjà passée.
                            if (selectedDateTime <= new Date()) {
                                // TODO: Tous les Alertes, mettre mon composant
                                Alert.alert(
                                    'Horaire indisponible',
                                    'Tu ne peux pas choisir une heure déjà passée.',
                                );
                                setPickerMode(null);
                                return;
                            }

                            onChangeTime(time);
                            setPickerMode(null);
                        }

                        setPickerMode(null);
                    }}

                    themeVariant={theme}
                />
            )}
        </Flex>
    );
}

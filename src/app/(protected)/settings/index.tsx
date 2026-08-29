import { router, Stack } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { useTheme } from '@/src/lib/hooks/useTheme';
import useTopAppBar from '@/src/lib/hooks/useTopAppBar';
import { useAuthStore } from '@/src/state/authStore';

import CustomSafeAreaView from '#/CustomSafeAreaView';
import Flex from '#/Flex';
import Text from '#/Text';
import SearchBar from '#/bars/SearchBar';
import Divider from '#/display/Divider';
import Table from '#/display/Table';
import TopAppBar from '#/display/TopAppBar/TopAppBar';

import {
    Accessibility,
    Ad,
    Appearance,
    Arrowleft,
    Block,
    Book,
    Bug,
    Chevronright,
    Cookies,
    Data,
    Ecology,
    Lock,
    Logout,
    Notification,
    Phone,
    Preferences,
    Question,
    Wallet,
} from '#/icons';


type SettingsItem = {
    leftText: string;
    leftTextVariant?: 'body_Medium' | 'body_Regular';
    legendText?: string;
    legendTextVariant?: 'body_Medium' | 'body_Regular';
    icon?: React.ComponentType<{ size?: number; color?: string; }> | null;
    iconColor?: string;
    href: string;
    rightText?: string | undefined;
    leftTextType?: 'primary' | 'danger';
    onPress?: string | (() => any);
}

type SettingsSection = {
    title?: string;
    items: SettingsItem[];
}

const settingsSections: SettingsSection[] = [
    {
        title: "Gestion du compte",
        items: [
            { leftText: "Nom d'utilisateur", legendText: "@xLeay", href: "/settings/username", icon: null },
            { leftText: "Email", legendText: "mon-email@gmail.com", href: "/settings/email", icon: null },
            { leftText: "Téléphone", legendText: "0123456789", href: "/settings/phone", icon: null },
            { leftText: "Date de naissance", legendText: "1 janvier 1970", href: "/settings/birthdate", icon: null },
            { leftText: "Mot de passe", href: "/settings/password", icon: null },
        ],
    },
    {
        title: "Général",
        items: [
            { leftText: "Pourquoi utiliser Trocle", href: "/settings/why-trocle", icon: Ecology, iconColor: 'brand' },
            { leftText: "Notifications", href: "/settings/notifications", icon: Notification },
            { leftText: "Mes préférences", href: "/settings/preferences", icon: Preferences },
            { leftText: "Paiements", href: "/settings/payments", icon: Wallet },
        ],
    },
    {
        title: "Accessibilité et affichage",
        items: [
            { leftText: "Paramètres d’accessibilité", href: "/settings/accessibility", icon: Accessibility },
            { leftText: "Apparence", href: "/settings/appearance", icon: Appearance },
        ],
    },
    {
        title: "Confidentialité et autorisations",
        items: [
            { leftText: "Cookies", href: "/settings/cookies", icon: Cookies },
            { leftText: "Utilisation des données", href: "/settings/data", icon: Data },
            { leftText: "Autorisations de l’appareil", href: "/settings/permissions", icon: Phone },
            { leftText: "Connexions", href: "/settings/connections", icon: Lock },
            { leftText: "Utilisateurs bloqués", href: "/settings/block", icon: Block, rightText: "3" },
            { leftText: "Préférences de publicité", href: "/settings/ads", icon: Ad },
        ],
    },
    {
        title: "Informations additionnelles",
        items: [
            { leftText: "Informations légales", href: "/settings/legal", icon: Book },
            { leftText: "À propos", href: "/settings/about", icon: Question },
            { leftText: "Signalement de bug", href: "/settings/bug", icon: Bug },
        ],
    },
    {
        items: [
            { leftText: "Déconnexion", leftTextType: 'danger', icon: Logout, iconColor: 'danger', href: "/settings/legal", onPress: "signOut" },
        ],
    },
];

export default function Settings() {
    const { activeTheme } = useTheme();

    // Config de la top app bar
    const canGoBack = router.canGoBack();
    const onBack = () => { canGoBack && router.back() };

    const { left, center, right } = useTopAppBar('_small', {
        iconName: Arrowleft,
        canGoBack,
        onBack,
        label: 'Paramètres',
    });

    // const { signOut, loading } = useAuthStore()
    const signOut = useAuthStore((state) => state.signOut)
    const loading = useAuthStore((state) => state.loading)

    const [search, setSearch] = useState('');

    const normalizeText = (text: string) =>
        text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const filteredSections = useMemo(() => {
        const query = normalizeText(search.trim());

        if (!query) return settingsSections;

        return settingsSections
            .map((section) => {
                // Sécurité si section.title n'est pas défini (ex: section Déconnexion)
                const titleMatches = section.title
                    ? normalizeText(section.title).includes(query)
                    : false;

                // Si le titre match, on garde toute la section
                if (titleMatches) {
                    return section;
                }

                // Filtrage des items avec la fonction normalizeText
                const filteredItems = section.items.filter((item) =>
                    normalizeText(item.leftText).includes(query)
                );

                return { ...section, items: filteredItems };
            })
            // On vire les sections vides
            .filter((section) => section.items.length > 0);
    }, [search]);

    return (
        <CustomSafeAreaView style={{ backgroundColor: activeTheme.colors.surface.secondary }}>
            <Stack.Screen
                options={{
                    headerShown: true,
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
            <ScrollView
                style={{ backgroundColor: activeTheme.colors.surface.secondary, flex: 1 }}
                contentContainerStyle={{ gap: activeTheme.spacing._100 }}
                stickyHeaderIndices={[0]}
                bounces={false}
                overScrollMode='never'
            >

                {/* Top */}
                <Flex
                    style={{
                        backgroundColor: activeTheme.colors.surface.secondary,
                        paddingHorizontal: activeTheme.spacing._200,
                        paddingTop: activeTheme.spacing._0,
                        paddingBottom: activeTheme.spacing._200,
                        borderBottomWidth: 1,
                        borderBottomColor: activeTheme.colors.border.primary
                    }}
                >
                    <SearchBar
                        onChangeText={setSearch}
                        value={search}
                        placeholder='Notifications, Apparence...'
                    />
                </Flex>

                {/* Sections de settings */}
                <Flex fullWidth gap={activeTheme.spacing._100}>
                    {filteredSections.map((section, index) => (
                        <React.Fragment key={`${section.title}-${index}`}>
                            {/* Section */}
                            <Flex fullWidth gap={activeTheme.spacing._200}>
                                {/* Label section */}
                                {section.title && (
                                    <Text variant='body_Medium' type='secondary' containerStyle={{ paddingLeft: activeTheme.spacing._200 }}>{section.title}</Text>
                                )}

                                {/* Pages */}
                                <Flex fullWidth gap={activeTheme.spacing._50}>
                                    {section.items.map((item, index) => (
                                        <Table
                                            key={`${item.href}-${index}`}
                                            leftProps={{
                                                variant: item.legendText ? 'empty' : 'icon',
                                                leftText: item.leftText,
                                                legendText: item.legendText,
                                                leftTextType: item.leftTextType,
                                                icon: item.icon ? <item.icon
                                                    size={24}
                                                    color={activeTheme.colors.icon[item.iconColor as keyof typeof activeTheme.colors.icon] || activeTheme.colors.icon.primary} /> : null,
                                            }}
                                            rightProps={{
                                                variant: item.rightText ? 'text' : ((item.legendText || item.leftTextType === 'danger') ? 'empty' : 'icon'),
                                                rightText: item.rightText,
                                                icon: <Chevronright size={24} color={activeTheme.colors.icon.primary} />
                                            }}
                                            onPress={() => {
                                                if (item.onPress === 'signOut') signOut()
                                                else if (item.href) router.push(item.href)
                                            }}
                                        />
                                    ))}
                                </Flex>
                            </Flex>
                            <Divider />
                        </React.Fragment>
                    ))}

                    {filteredSections.length === 0 && (
                        <Text variant='body_Medium' type='secondary' containerStyle={{ paddingLeft: activeTheme.spacing._200 }}>Aucun résultat</Text>
                    )}

                </Flex>
            </ScrollView>
        </CustomSafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
    },
});



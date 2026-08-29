// import { Href, Link, router } from 'expo-router';
// import { Drawer, DrawerContentScrollView, useDrawerStatus } from 'expo-router/drawer';
// import React, { useEffect, useState } from 'react';
// import { StyleSheet } from 'react-native';
// import Animated, { Easing, FadeInRight } from 'react-native-reanimated';

// import { useTheme } from '@/src/lib/hooks/useTheme';

// import CustomSafeAreaView from '#/CustomSafeAreaView';

// import Flex from '#/Flex';
// import Text from '#/Text';
// import Avatar from '#/display/Avatar';
// import Divider from '#/display/Divider';
// import Table from '#/display/Table';
// import Fade from '#/miscellaneous/Fade';

// import { Assistance, Donate, Heart, History, Moon, Profile, Settings, Star0, Sun, Troc } from '#/icons';


// type DrawerItemProps = {
//     href: Href;
//     label: string;
//     icon: React.ReactNode;
//     rightProps?: React.ComponentProps<typeof Table>['rightProps'];
// };

// function DrawerItem({
//     href,
//     label,
//     icon,
//     rightProps = { variant: 'empty' },
// }: DrawerItemProps) {
//     return (
//         <Link href={href} asChild>
//             <Table
//                 leftProps={{
//                     variant: 'icon',
//                     leftText: label,
//                     icon,
//                 }}
//                 rightProps={rightProps}
//             />
//         </Link>
//     );
// }

// const avatarImage = require('@/assets/icon.png');
// const userNameMock = 'xLeay';

// const mainItems = [
//     {
//         href: `/user/${userNameMock}`,
//         label: 'Mon profil',
//         icon: <Profile />,
//     },
//     // FEATURE FLAG : Premium/Shop/Abonnement
//     // {
//     //     href: '/shop/premium',
//     //     label: 'Premium',
//     //     icon: <Subscription />,
//     // },
//     {
//         href: '/favorites',
//         label: 'Favoris',
//         icon: <Heart />,
//     },
//     {
//         href: '/evaluations',
//         label: 'Évaluations',
//         icon: <Star0 />,
//     },
//     {
//         href: '/trocs',
//         label: 'Mes trocs',
//         icon: <Troc />,
//         rightProps: {
//             variant: 'text',
//             active: true,
//             rightText: '14 nov.',
//             chevron: false,
//         },
//     },
//     {
//         href: '/history',
//         label: 'Historique',
//         icon: <History />,
//     },
// ] satisfies DrawerItemProps[];

// const secondaryItems = [
//     {
//         href: '/support/help-center',
//         label: "Centre d'assistance",
//         icon: <Assistance />,
//     },
//     // TODO: Faire un système de donation
//     {
//         href: '/support/support-us',
//         label: 'Nous soutenir',
//         icon: <Donate />,
//     },
//     {
//         href: '/settings',
//         label: 'Paramètres',
//         icon: <Settings />,
//     },
// ] satisfies DrawerItemProps[];

// const CustomDrawer = React.memo((props: any) => {
//     const { activeTheme } = useTheme();

//     const drawerStatus = useDrawerStatus();
//     const [showContent, setShowContent] = useState(false);

//     useEffect(() => {
//         if (drawerStatus === 'open') {
//             const idleCallbackId = requestIdleCallback(() => {
//                 setShowContent(true);
//             }, { timeout: 250 });

//             return () => cancelIdleCallback(idleCallbackId);
//         }

//         setShowContent(false);
//     }, [drawerStatus]);

//     return (
//         <DrawerContentScrollView
//             contentContainerStyle={[styles.drawerContentContainer, {}]}
//             style={[styles.drawerContent, { backgroundColor: activeTheme.colors.surface.secondary }]}
//             {...props}
//         >
//             {showContent && (
//                 <Animated.View
//                     entering={FadeInRight
//                         .duration(375)
//                         .easing(Easing.out(Easing.quad))}
//                     style={{ flex: 1 }}
//                 >
//                     <DrawerContent />
//                 </Animated.View>
//             )}
//         </DrawerContentScrollView>
//     );
// });

// const DrawerContent = React.memo(() => {
//     const { theme, activeTheme, toggleTheme } = useTheme();

//     return (
//         <Flex gap={32} style={{ flex: 1 }}>
//             {/* Section */}
//             <Flex gap={16} style={{ flex: 1, width: '100%', paddingBottom: 16 }}>
//                 {/* Top */}
//                 <Flex gap={4} style={{ width: '100%', paddingTop: 16, paddingHorizontal: 16 }}>
//                     <Flex gap={4} alignItems='flex-start' style={{ width: '100%', paddingHorizontal: 16 }}>
//                         <Avatar size="medium" customImage={avatarImage} transition={0} onPress={() => {
//                             router.push(`user/${userNameMock}`);
//                         }} />
//                         <Flex>
//                             <Text variant='title_Small'>{userNameMock}</Text>
//                         </Flex>
//                         <Flex direction='row' alignItems='center' gap={8}>
//                             <Link href={`/user/${userNameMock}/followers`}>
//                                 <Flex gap={4} direction='row'>
//                                     <Text variant='label_Large'>12</Text>
//                                     <Text variant='body_Medium' type='secondary'>Abonnés</Text>
//                                 </Flex>
//                             </Link>

//                             <Flex style={{ width: 3, height: 3, backgroundColor: activeTheme.colors.text.secondary, borderRadius: 3 }} />

//                             <Link href={`/user/${userNameMock}/following`}>
//                                 <Flex gap={4} direction='row'>
//                                     <Text variant='label_Large'>18</Text>
//                                     <Text variant='body_Medium' type='secondary'>Abonnements</Text>
//                                 </Flex>
//                             </Link>
//                         </Flex>
//                     </Flex>
//                     <Divider padding style={{ marginTop: 16 }} />
//                 </Flex>

//                 <Flex style={styles.container}>
//                     <Flex scroll gap={activeTheme.spacing._100} style={styles.scrollContainer}>
//                         <Flex style={styles.tableContainer}>
//                             {mainItems.map((item) => (
//                                 <DrawerItem
//                                     key={item.href}
//                                     {...item}
//                                 />
//                             ))}
//                         </Flex>

//                         <Divider padding />

//                         <Flex style={styles.tableContainer}>
//                             {secondaryItems.map((item) => (
//                                 <DrawerItem
//                                     key={item.href}
//                                     {...item}
//                                 />
//                             ))}
//                         </Flex>
//                     </Flex>

//                     <Fade side="bottom" />
//                 </Flex>
//             </Flex>

//             <Flex style={{ paddingVertical: 16, width: '100%' }}>
//                 <Flex style={[styles.tableContainer]}>
//                     <Table
//                         leftProps={{
//                             variant: 'icon',
//                             leftText: theme === 'light' ? 'Mode clair' : 'Mode sombre',
//                             icon: theme === 'light' ? <Sun /> : <Moon filled />,
//                         }}
//                         rightProps={{
//                             variant: 'empty',
//                         }}
//                         onPress={() => {
//                             toggleTheme();
//                         }}
//                     />
//                 </Flex>
//             </Flex>
//         </Flex>
//     );
// });


// export default function Layout() {
//     const { activeTheme } = useTheme();

//     return (
//         <CustomSafeAreaView edges={['bottom', 'left', 'right', 'top']} style={{ backgroundColor: activeTheme.colors.surface.secondary }}>
//             <Drawer
//                 defaultStatus="closed"
//                 screenOptions={{
//                     headerShown: false,
//                     drawerStyle: {
//                         backgroundColor: 'transparent',
//                         width: '85%',
//                     },
//                     drawerPosition: 'right',
//                     overlayColor: 'rgba(0,0,0,0.6)',
//                     swipeEdgeWidth: 40,
//                     swipeMinDistance: 40,
//                 }}
//                 drawerContent={(props) => <CustomDrawer {...props} />}
//             />
//         </CustomSafeAreaView>
//     );
// }

// const styles = StyleSheet.create({
//     drawer: {
//     },
//     drawerContentContainer: {
//         flex: 1,
//         // backgroundColor: 'rgba(8, 82, 112, 0.1)',

//         paddingTop: 0,
//         paddingBottom: 0,
//         paddingInlineStart: 0,
//         paddingInlineEnd: 0,
//     },
//     drawerContent: {
//         // borderWidth: 2,
//         // borderColor: 'green',
//     },
//     container: {
//         width: '100%',
//         flex: 1,
//         position: 'relative',
//     },
//     scrollContainer: {
//         width: '100%',
//         flex: 1,
//         position: 'relative',
//     },
//     tableContainer: {
//         width: '100%',
//         paddingInline: 16,
//     },
// });





import { Href, Link, router } from 'expo-router';
import { Drawer, DrawerContentScrollView } from 'expo-router/drawer';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/src/lib/hooks/useTheme';

import CustomSafeAreaView from '#/CustomSafeAreaView';

import Flex from '#/Flex';
import Text from '#/Text';
import Avatar from '#/display/Avatar';
import Divider from '#/display/Divider';
import Table from '#/display/Table';
import Fade from '#/miscellaneous/Fade';

import { Assistance, Donate, Heart, History, Moon, Profile, Settings, Star0, Sun, Troc } from '#/icons';

type DrawerItemProps = {
    href: Href;
    label: string;
    icon: React.ReactNode;
    rightProps?: React.ComponentProps<typeof Table>['rightProps'];
};

const DrawerItem = React.memo(({
    href,
    label,
    icon,
    rightProps = { variant: 'empty' },
}: DrawerItemProps) => {
    return (
        <Link href={href} asChild>
            <Table
                leftProps={{
                    variant: 'icon',
                    leftText: label,
                    icon,
                }}
                rightProps={rightProps}
            />
        </Link>
    );
});

const avatarImage = require('@/assets/icon.png');
const userNameMock = 'xLeay';

// Extraction statique hors du composant
const mainItems: DrawerItemProps[] = [
    {
        href: `/user/${userNameMock}`,
        label: 'Mon profil',
        icon: <Profile />,
    },
    // FEATURE FLAG : Premium/Shop/Abonnement
    // {
    //     href: '/shop/premium',
    //     label: 'Premium',
    //     icon: <Subscription />,
    // },
    {
        href: '/favorites',
        label: 'Favoris',
        icon: <Heart />,
    },
    {
        href: '/evaluations',
        label: 'Évaluations',
        icon: <Star0 />,
    },
    {
        href: '/trocs',
        label: 'Mes trocs',
        icon: <Troc />,
        rightProps: {
            variant: 'text',
            active: true,
            rightText: '14 nov.',
            chevron: false,
        },
    },
    {
        href: '/history',
        label: 'Historique',
        icon: <History />,
    },
];

const secondaryItems: DrawerItemProps[] = [
    {
        href: '/support/help-center',
        label: "Centre d'assistance",
        icon: <Assistance />,
    },
    {
        href: '/support/support-us',
        label: 'Nous soutenir',
        icon: <Donate />,
    },
    {
        href: '/settings',
        label: 'Paramètres',
        icon: <Settings />,
    },
];

// Contenu interne mémoïsé
const DrawerContent = React.memo(() => {
    const { theme, activeTheme, toggleTheme } = useTheme();

    return (
        <Flex gap={32} style={styles.fullFlex}>
            <Flex gap={16} style={[styles.fullFlex, { width: '100%', paddingBottom: 16 }]}>
                {/* Top Header */}
                <Flex gap={4} style={{ width: '100%', paddingTop: 16, paddingHorizontal: 16 }}>
                    <Flex gap={4} alignItems='flex-start' style={{ width: '100%', paddingHorizontal: 16 }}>
                        <Avatar
                            size="medium"
                            customImage={avatarImage}
                            transition={0}
                            onPress={() => router.push(`user/${userNameMock}`)}
                        />
                        <Flex>
                            <Text variant='title_Small'>{userNameMock}</Text>
                        </Flex>
                        <Flex direction='row' alignItems='center' gap={8}>
                            <Link href={`/user/${userNameMock}/followers`}>
                                <Flex gap={4} direction='row'>
                                    <Text variant='label_Large'>12</Text>
                                    <Text variant='body_Medium' type='secondary'>Abonnés</Text>
                                </Flex>
                            </Link>

                            <View style={[styles.dot, { backgroundColor: activeTheme.colors.text.secondary }]} />

                            <Link href={`/user/${userNameMock}/following`}>
                                <Flex gap={4} direction='row'>
                                    <Text variant='label_Large'>18</Text>
                                    <Text variant='body_Medium' type='secondary'>Abonnements</Text>
                                </Flex>
                            </Link>
                        </Flex>
                    </Flex>
                    <Divider padding style={{ marginTop: 16 }} />
                </Flex>

                {/* Listes d'items */}
                <Flex style={styles.container}>
                    <Flex scroll gap={activeTheme.spacing._100} style={styles.scrollContainer}>
                        <Flex style={styles.tableContainer}>
                            {mainItems.map((item) => (
                                <DrawerItem key={item.href.toString()} {...item} />
                            ))}
                        </Flex>

                        <Divider padding />

                        <Flex style={styles.tableContainer}>
                            {secondaryItems.map((item) => (
                                <DrawerItem key={item.href.toString()} {...item} />
                            ))}
                        </Flex>
                    </Flex>

                    <Fade side="bottom" />
                </Flex>
            </Flex>

            {/* Switcher Mode Sombre / Mode Clair */}
            <Flex style={styles.bottomSection}>
                <Flex style={styles.tableContainer}>
                    <Table
                        leftProps={{
                            variant: 'icon',
                            leftText: theme === 'light' ? 'Mode clair' : 'Mode sombre',
                            icon: theme === 'light' ? <Sun /> : <Moon filled />,
                        }}
                        rightProps={{ variant: 'empty' }}
                        onPress={toggleTheme}
                    />
                </Flex>
            </Flex>
        </Flex>
    );
});

// Enveloppe CustomDrawer nettoyée des hooks de délai JS
const CustomDrawer = React.memo((props: any) => {
    const { activeTheme } = useTheme();

    return (
        <DrawerContentScrollView
            bounces={false}
            removeClippedSubviews={true}
            contentContainerStyle={styles.drawerContentContainer}
            style={[styles.drawerContent, { backgroundColor: activeTheme.colors.surface.secondary }]}
            {...props}
        >
            <DrawerContent />
        </DrawerContentScrollView>
    );
});

export default function Layout() {
    const { activeTheme } = useTheme();

    // ScreenOptions mémorisées pour éviter la ré-évaluation du bridge natif
    const screenOptions = useMemo(() => ({
        headerShown: false,
        drawerType: 'front' as const, // Forcer l'effet 'front' style Twitter/X
        unmountOnBlur: false, // Ne PAS démonter le drawer
        freezeOnBlur: true, // Gèle le rendu de l'arbre quand masqué pour économiser la RAM
        drawerStyle: {
            backgroundColor: activeTheme.colors.surface.secondary,
            width: '85%' as const,
        },
        drawerPosition: 'right' as const,
        overlayColor: 'rgba(0,0,0,0.6)',
        swipeEdgeWidth: 40,
        swipeMinDistance: 40,
    }), [activeTheme.colors.surface.secondary]);

    return (
        <CustomSafeAreaView edges={['bottom', 'left', 'right', 'top']} style={{ backgroundColor: activeTheme.colors.surface.secondary }}>
            <Drawer
                defaultStatus="closed"
                screenOptions={screenOptions}
                drawerContent={(props) => <CustomDrawer {...props} />}
            />
        </CustomSafeAreaView>
    );
}

const styles = StyleSheet.create({
    fullFlex: {
        flex: 1,
    },
    drawerContentContainer: {
        flexGrow: 1,
        paddingTop: 0,
        paddingBottom: 0,
        paddingInlineStart: 0,
        paddingInlineEnd: 0,
    },
    drawerContent: {
        flex: 1,
    },
    container: {
        width: '100%',
        flex: 1,
        position: 'relative',
    },
    scrollContainer: {
        width: '100%',
        flex: 1,
        position: 'relative',
    },
    tableContainer: {
        width: '100%',
        paddingInline: 16,
    },
    bottomSection: {
        paddingVertical: 16,
        width: '100%',
    },
    dot: {
        width: 3,
        height: 3,
        borderRadius: 3,
    },
});
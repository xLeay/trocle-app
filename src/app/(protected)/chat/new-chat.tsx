import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import { useState } from "react";

import { useTheme } from "@/src/lib/hooks/useTheme";
import useTopAppBar from '@/src/lib/hooks/useTopAppBar';

import SearchBar from "#/bars/SearchBar";
import CustomSafeAreaView from "#/CustomSafeAreaView";
import Table from "#/display/Table";
import TopAppBar from "#/display/TopAppBar/TopAppBar";
import Flex from "#/Flex";

import { Arrowleft } from "#/icons";

const USERS = [
    {
        id: '1',
        name: 'John Doe',
        avatar: 'https://api.dicebear.com/10.x/dylan/svg?seed=Felix',
    },
    {
        id: '2',
        name: 'Jane Doe',
        avatar: 'https://api.dicebear.com/10.x/dylan/svg?seed=Felix',
    },
    {
        id: '3',
        name: 'John Doe',
        avatar: 'https://api.dicebear.com/10.x/dylan/svg?seed=Felix',
    },
    {
        id: '4',
        name: 'Jane Doe',
        avatar: 'https://api.dicebear.com/10.x/dylan/svg?seed=Felix',
    },
];

export default function NewChatScreen() {
    const { activeTheme } = useTheme();

    const canGoBack = router.canGoBack();
    const onBack = () => { canGoBack && router.back() };

    const { left, center, right } = useTopAppBar("_small", {
        // Nécessite : canGoBack: boolean, onBack: function, label: string, iconName: string, iconColor: string
        canGoBack,
        onBack,
        label: 'Message privé',
        iconName: Arrowleft,
        iconColor: activeTheme.colors.component.button.secondary,
    });


    // TODO: Faire la recherche d'utilisateur depuis la bdd pour créer un nouveau chat
    const [search, setSearch] = useState('');
    const [users, setUsers] = useState(USERS);


    const handleNewChat = (user: any) => {
        console.log(user);

        router.push({
            pathname: '/(protected)/chat/[chatId]',
            params: {
                chatId: user.id,
            },
        });
    }

    return (
        <CustomSafeAreaView style={{ backgroundColor: activeTheme.colors.surface.secondary }}>
            <TopAppBar
                left={left}
                center={center}
                right={right}
            />

            <Flex
                fullWidth
                gap={activeTheme.spacing._200}
                style={{
                    flex: 1,
                    paddingTop: activeTheme.spacing._100,
                }}
            >
                <Flex fullWidth style={{ paddingHorizontal: activeTheme.spacing._200 }}>
                    <SearchBar placeholder="Utilisateur" value={search} onChangeText={setSearch} />
                </Flex>

                <Flex
                    fullWidth
                    alignItems="stretch"
                    gap={activeTheme.spacing._0}
                    style={{ flex: 1 }}
                >
                    <FlashList
                        data={users}
                        renderItem={({ item, index }) => (
                            <Table
                                onPress={() => handleNewChat(item)}
                                leftProps={{
                                    variant: 'avatar',
                                    src: item.avatar,
                                    leftText: item.name,
                                }}
                            />
                        )}
                        keyExtractor={(item) => item.id}
                    />
                </Flex>
            </Flex>

        </CustomSafeAreaView>
    );
}


import { StyleSheet } from "react-native";

import Flex from "#/Flex";
import ImageRatio from "#/display/ImageRatio";

import { useTheme } from "@/src/lib/hooks/useTheme";

import { Search } from "#/icons";



interface SearchArticleProps {
    article?: boolean;
    imageSrc?: string;
    grayScale?: boolean;
}

const SearchArticle = ({
    article = true,
    imageSrc,
    grayScale = false,
}: SearchArticleProps) => {
    const { activeTheme } = useTheme();

    return (
        <Flex style={styles.container}>
            {article ? (
                <ImageRatio
                    ratio="1:1"
                    source={imageSrc}
                    style={{ backgroundColor: activeTheme.colors.surface.primary, borderRadius: activeTheme.radius.default }}
                    grayScale={grayScale}
                />
            ) : (
                <Flex border borderColor={activeTheme.colors.surface.divider} style={{ backgroundColor: activeTheme.colors.surface.primary, borderRadius: activeTheme.radius.full }}>
                    <Search size={24} color={activeTheme.colors.surface.field} />
                </Flex>
            )}
        </Flex>
    );
};

export default SearchArticle;

const styles = StyleSheet.create({
    container: {
        width: 40,
        height: 40
    },
});

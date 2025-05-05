import Text from "#/Text";
import Flex from "#/Flex"

export default function SuggestedUserProductsBlock() {
    return <Flex
        alignItems="center"
        justifyContent="center"
        style={{ height: 100, width: '100%', backgroundColor: 'lightgreen' }}>
        <Text variant="title_Large">Tu pourrais être intéressé</Text>
    </Flex>;
}
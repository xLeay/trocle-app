import Text from "#/Text";
import Flex from "#/Flex"

export default function SuggestedUsersBlock() {
    return <Flex
        alignItems="center"
        justifyContent="center"
        style={{ height: 100, width: '100%', backgroundColor: 'lightblue' }}>
        <Text variant="title_Large">Troclers à suivre</Text>
    </Flex>;
}
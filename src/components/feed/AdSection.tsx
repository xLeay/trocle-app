import Text from "#/Text";
import Flex from "#/Flex"

export default function AdSection() {
    return <Flex
        alignItems="center"
        justifyContent="center"
        style={{ height: 100, width: '100%', backgroundColor: 'gold' }}>
        <Text variant="title_Large">PUB</Text>
    </Flex>;
}
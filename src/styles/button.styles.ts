import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    animatedView: {
        alignItems: 'center',
        alignSelf: 'center',

        // borderWidth: 1,
        // borderColor: 'red',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
        // width: '100%',

        // borderWidth: 1,
        // borderColor: 'blue',
    },
    fullWidth: {
        width: '100%',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // flex: 1,

        // borderWidth: 2,
        // borderColor: 'green',
    },
    iconLeft: {
        flexDirection: 'row',
    },
    iconRight: {
        flexDirection: 'row-reverse',
    },
    text: {
        marginHorizontal: 8,

        // borderWidth: 1,
        // borderColor: 'purple',
    },

    // Size styles for default buttons
    // Size styles for default buttons
    smallButtonDefault: {
        minWidth: 90,
        height: 32,
    },
    smallButtonRadius: {
        borderRadius: 32 * 0.45,
    },
    largeButtonDefault: {
        minWidth: 120,
        height: 48,
    },
    largeButtonRadius: {
        borderRadius: 48 * 0.45,
    },

    // Size styles for Icon buttons
    // Size styles for Icon buttons
    smallIconButton: {
        width: 32,
        height: 32,
        paddingHorizontal: 0,
    },
    smallIconButtonRadius: {
        borderRadius: 32 / 2,
    },
    largeIconButton: {
        width: 40,
        height: 40,
        paddingHorizontal: 0,
    },
    largeIconButtonRadius: {
        borderRadius: 40 / 2,
    },
    FABButton: {
        height: 56,
        width: 56,
        paddingHorizontal: 0,
    },
    FABRadius: {
        borderRadius: 56 / 2,
    },
    FABShadow: {
        // shadowColor: 'rgba(0, 0, 0, 0.5)',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.8,
        // shadowRadius: 6,
        // elevation: 10,

        boxShadow: '0 3px 7px 2px rgba(0, 0, 0, 0.25)'
    },
});

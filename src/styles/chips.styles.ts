import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    animatedView: {
        alignItems: 'center',
        alignSelf: 'center',

        // borderWidth: 1,
        // borderColor: 'red',
    },
    chip: {
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

    // Size styles for default chips
    // Size styles for default chips
    smallChipDefault: {
        minWidth: 32,
        height: 32,
    },
    smallChipRadius: {
        borderRadius: 32 * 0.375,
    },
    largeChipDefault: {
        minWidth: 48,
        height: 48,
    },
    largeChipRadius: {
        borderRadius: 48 * 0.375,
    },

    // Size styles for Icon chips
    // Size styles for Icon chips
    smallIconChip: {
        width: 32,
        height: 32,
        paddingHorizontal: 0,
    },
    smallIconChipRadius: {
        borderRadius: 32 * 0.5,
    },
    largeIconChip: {
        width: 48,
        height: 48,
        paddingHorizontal: 0,
    },
    largeIconChipRadius: {
        borderRadius: 48 * 0.375,
    },
});

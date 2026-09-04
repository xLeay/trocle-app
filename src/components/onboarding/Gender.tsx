
import { useTheme } from '@/src/lib/hooks/useTheme';

import Chip from '#/controls/Chip';
import TextField from '#/controls/TextField';
import Flex from '#/Flex';


type GenderType = 'male' | 'female' | 'other';

interface GenderProps {
    value: GenderType | null;
    onChange: (gender: GenderType) => void;
    otherValue: string;
    onChangeOtherValue: (otherValue: string) => void;
}

function Gender({
    value,
    onChange,
    otherValue,
    onChangeOtherValue,
}: GenderProps) {
    const { activeTheme } = useTheme();

    return (
        <Flex fullWidth gap={activeTheme.spacing._200}>
            <Flex
                direction='row'
                gap={activeTheme.spacing._200}
                style={{
                    flexWrap: 'wrap'
                }}
            >
                <Chip
                    large
                    chipStyle='outlined'
                    label="👨 Homme"
                    selected={value === 'male'}
                    onPress={() => onChange('male')}
                />

                <Chip
                    large
                    chipStyle='outlined'
                    label="👩 Femme"
                    selected={value === 'female'}
                    onPress={() => onChange('female')}
                />

                <Chip
                    large
                    chipStyle='outlined'
                    label="⭐ Préciser"
                    selected={value === 'other'}
                    onPress={() => onChange('other')}
                />
            </Flex>

            {value === 'other' && (
                <TextField
                    value={otherValue}
                    onChangeText={onChangeOtherValue}
                    placeholder="Autre"
                />
            )}
        </Flex>
    );
}

export default Gender;
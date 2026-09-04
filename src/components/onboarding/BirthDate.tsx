import DateTimePicker from '@expo/ui/community/datetime-picker';
import { useState } from 'react';

import { useTheme } from '@/src/lib/hooks/useTheme';

import Button from '#/controls/Button';
import Flex from '#/Flex';
import Text from '#/Text';

import { Edit } from '#/icons';

interface BirthDateProps {
    value: Date | null;
    onChange: (date: Date) => void;
    minimumAge?: number;
    maximumAge?: number;
}

function getAge(birthDate: Date) {
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    const birthdayNotReached =
        today.getMonth() < birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() &&
            today.getDate() < birthDate.getDate());

    if (birthdayNotReached) age--;

    return age;
}

function getDateYearsAgo(years: number) {
    const date = new Date();
    date.setFullYear(date.getFullYear() - years);
    return date;
}

function BirthDate({
    value,
    onChange,
    minimumAge = 18,
    maximumAge = 100,
}: BirthDateProps) {
    const { activeTheme, theme } = useTheme();

    const [pickerMode, setPickerMode] = useState<'date' | null>(null);

    const latestAllowedDate = getDateYearsAgo(minimumAge);
    const earliestAllowedDate = getDateYearsAgo(maximumAge);
    const selectedDate = value ?? latestAllowedDate;
    const age = getAge(selectedDate);

    const dateButton = () => {
        if (value) {
            return (
                <Button
                    variant="tertiary"
                    size="large"
                    icon={<Edit />}
                    onPress={() => setPickerMode('date')}
                />
            );
        } else {
            return (
                <Button
                    label="Choisir ma date de naissance"
                    variant="tertiary"
                    size="large"
                    fullWidth
                    onPress={() => setPickerMode('date')}
                />
            );
        }
    };

    return (
        <Flex fullWidth gap={activeTheme.spacing._200}>


            <Flex
                direction={value ? 'row' : 'column'}
                alignItems={value ? 'center' : 'flex-start'}
                justifyContent={value ? 'space-between' : 'flex-end'}
                gap={activeTheme.spacing._100}
                fullWidth
            >
                {value && (
                    <Text variant="title_Large" type="primary">
                        {selectedDate.toLocaleDateString('FR-fr', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })} <Text variant='body_Large' type='secondary'>({age} ans)</Text>
                    </Text>
                )}

                {dateButton()}
            </Flex>

            {pickerMode && (
                <DateTimePicker
                    key={pickerMode}
                    value={selectedDate}
                    mode={pickerMode}
                    minimumDate={earliestAllowedDate}
                    maximumDate={latestAllowedDate}
                    onDismiss={() => setPickerMode(null)}
                    onValueChange={(_, nextDate) => {
                        if (!nextDate) {
                            setPickerMode(null);
                            return;
                        }

                        const date = new Date(nextDate);
                        date.setHours(12, 0, 0, 0);

                        onChange(date);
                        setPickerMode(null);
                    }}
                    themeVariant={theme}
                />
            )}

        </Flex>
    );
}

export default BirthDate;
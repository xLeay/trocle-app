export type DateFormat =
    | 'dateTime'
    | 'date'
    | 'monthYear';

export const getDateText = (
    dateString: string,
    format: DateFormat = 'dateTime',
): string => {
    const date = new Date(dateString);

    if (format === 'monthYear') {
        const value = date.toLocaleDateString('fr-FR', {
            month: 'long',
            year: 'numeric',
        });

        return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
    }

    if (format === 'date') {
        const value = date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });

        return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
    }

    const now = new Date();

    const isSameDay =
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth() &&
        date.getDate() === now.getDate();

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    const isYesterday =
        date.getFullYear() === yesterday.getFullYear() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getDate() === yesterday.getDate();

    const time = date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
    });

    if (isSameDay) {
        return `Aujourd'hui à ${time}`;
    }

    if (isYesterday) {
        return `Hier à ${time}`;
    }

    const fullDate = getDateText(dateString, 'date');

    return `Le ${fullDate} à ${time}`;
};
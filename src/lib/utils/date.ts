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


/**
 * Formate une date en heure française.
 *
 * @example
 * getTimeText('2026-08-27T00:30:00');
 * // "00h30"
 *
 * @example
 * getTimeText('2026-08-27T14:05:00');
 * // "14h05"
 *
 * @param dateString - Date au format ISO, par exemple : "2026-08-27T14:30:00".
 * @returns L'heure au format français `"HHhmm"`.
 */
export const getTimeText = (dateString: string): string => {
    const date = new Date(dateString);

    return date
        .toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
            hourCycle: 'h23',
        })
        .replace(':', 'h');
};


type RelativeDateFormat = 'sentence' | 'compact';

type GetRelativeDateTextOptions = {
    format?: RelativeDateFormat;
    capitalize?: boolean;
};

/**
 * Retourne un texte relatif à une date par rapport à maintenant.
 *
 * @example
 * getRelativeDateText(date);
 * // "il y a 8 jours" ou "dans 8 jours"
 *
 * @example
 * getRelativeDateText(date, { capitalize: true });
 * // "Il y a 8 jours"
 *
 * @example
 * getRelativeDateText(date, { format: 'compact' });
 * // "8h" ou "8j"
 *
 * @param dateString - Date au format ISO, par exemple : "2026-08-27T14:30:00".
 * @param options - Options de formatage du texte.
 * @param options.format - `"sentence"` (défaut) pour une phrase complète,
 * ou `"compact"` pour un affichage court, pratique dans un post.
 * @param options.capitalize - Met la première lettre en majuscule.
 * Désactivé par défaut pour pouvoir insérer le texte au milieu d’une phrase.
 * @returns Un texte relatif, par exemple `"il y a 8h"`, `"dans 3 jours"` ou `"8j"`.
 */
export const getRelativeDateText = (
    dateString: string,
    {
        format = 'sentence',
        capitalize = false,
    }: GetRelativeDateTextOptions = {},
): string => {
    const date = new Date(dateString);
    const now = new Date();

    const diffInMs = date.getTime() - now.getTime();
    const isFuture = diffInMs > 0;

    const diffInHours = Math.floor(Math.abs(diffInMs) / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (format === 'compact') {
        if (diffInHours < 1) return 'maintenant';
        if (diffInDays < 1) return `${diffInHours}h`;

        return `${diffInDays}j`;
    }

    let text: string;

    if (diffInHours < 1) {
        text = 'à l’instant';
    } else if (diffInDays < 1) {
        text = isFuture ? `dans ${diffInHours}h` : `il y a ${diffInHours}h`;
    } else {
        text = isFuture
            ? `dans ${diffInDays} jours`
            : `il y a ${diffInDays} jours`;
    }

    return capitalize ? text.charAt(0).toUpperCase() + text.slice(1) : text;
};
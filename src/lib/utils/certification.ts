export const CERTIFICATIONS = {
    'email-verified': {
        color: null,
        label: 'Email vérifié',
    },
    'phone-verified': {
        color: null,
        label: 'Téléphone vérifié',
    },
    'trocle-plus': {
        color: 'brand',
        label: 'Trocle+',
    },
    moderation: {
        color: 'accent',
        label: 'Modération',
    },
    company: {
        color: 'blue',
        label: 'Entreprise',
    },
} as const;

export type CertificationSlug = keyof typeof CERTIFICATIONS;
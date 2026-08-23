export interface Category {
    id: number;
    name: string;
    parentId: number | null;
}

export interface FilterOption {
    id: string | number;
    name: string;
    value: string | number;
}

export interface SortOption {
    id: string;
    name: string;
    value: 'relevance' | 'recent' | 'price_asc' | 'price_desc';
}

export const SORT_OPTIONS: SortOption[] = [
    { id: 'sort_relevance', name: 'Pertinence', value: 'relevance' },
    { id: 'sort_recent', name: 'Les plus récents', value: 'recent' },
    { id: 'sort_price_asc', name: 'Prix le plus bas', value: 'price_asc' },
    { id: 'sort_price_desc', name: 'Prix le plus haut', value: 'price_desc' },
];

export const CATEGORIES: Category[] = [
    // --- INFORMATIQUE & HIGH-TECH ---
    { id: 1, name: 'Informatique & High-Tech', parentId: null },
    { id: 2, name: 'Jeux vidéo & Consoles', parentId: 1 },
    { id: 3, name: 'PC Gamer', parentId: 2 },
    { id: 4, name: 'Consoles', parentId: 2 },
    { id: 5, name: 'Jeux', parentId: 2 },
    { id: 6, name: 'Smartphones & Tablettes', parentId: 1 },
    { id: 7, name: 'Smartphones', parentId: 6 },
    { id: 8, name: 'Tablettes', parentId: 6 },
    { id: 9, name: 'Accessoires High-Tech', parentId: 1 },
    { id: 10, name: 'Audio & Casques', parentId: 9 },

    // --- MODE ---
    { id: 11, name: 'Mode', parentId: null },
    // Homme
    { id: 12, name: 'Homme', parentId: 11 },
    { id: 13, name: 'Vêtements Homme', parentId: 12 },
    { id: 14, name: 'Bas', parentId: 13 },
    { id: 15, name: 'Jeans', parentId: 14 },
    { id: 16, name: 'Shorts', parentId: 14 },
    { id: 17, name: 'Pantalons', parentId: 14 },
    { id: 18, name: 'Hauts', parentId: 13 },
    { id: 19, name: 'T-shirts', parentId: 18 },
    { id: 20, name: 'Pulls & Sweat-shirts', parentId: 18 },
    { id: 21, name: 'Chaussures Homme', parentId: 12 },
    { id: 22, name: 'Baskets / Sneakers', parentId: 21 },
    // Femme
    { id: 23, name: 'Femme', parentId: 11 },
    { id: 24, name: 'Vêtements Femme', parentId: 23 },
    { id: 25, name: 'Robes & Jupes', parentId: 24 },
    { id: 26, name: 'Manteaux & Vestes', parentId: 24 },
    { id: 27, name: 'Chaussures Femme', parentId: 23 },
    { id: 28, name: 'Sacs & Accessoires', parentId: 23 },
    // Enfant
    { id: 29, name: 'Enfant & Bébé', parentId: 11 },
    { id: 30, name: 'Vêtements Enfant', parentId: 29 },
    { id: 31, name: 'Jouets', parentId: 29 },

    // --- MAISON & DÉCO ---
    { id: 32, name: 'Maison & Déco', parentId: null },
    { id: 33, name: 'Meubles', parentId: 32 },
    { id: 34, name: 'Commodes & Armoires', parentId: 33 },
    { id: 35, name: 'Tables & Chaises', parentId: 33 },
    { id: 36, name: 'Canapés & Fauteuils', parentId: 33 },
    { id: 37, name: 'Décoration', parentId: 32 },
    { id: 38, name: 'Luminaires', parentId: 37 },
    { id: 39, name: 'Linge de maison', parentId: 32 },

    // --- CULTURE & LOISIRS ---
    { id: 40, name: 'Culture & Entertainment', parentId: null },
    { id: 41, name: 'Livres', parentId: 40 },
    { id: 42, name: 'Manga & BD', parentId: 41 },
    { id: 43, name: 'Romans', parentId: 41 },
    { id: 44, name: 'Musique & Vinyles', parentId: 40 },
    { id: 45, name: 'Cartes de collection', parentId: 40 },

    // --- SPORT & LOISIRS ---
    { id: 46, name: 'Sport & Extérieur', parentId: null },
    { id: 47, name: 'Équipement de sport', parentId: 46 },
    { id: 48, name: 'Vélos & Trottinettes', parentId: 46 },
];

export const CONDITIONS: FilterOption[] = [
    { id: 'cond_new', name: 'Neuf avec étiquette', value: 'new_with_tag' },
    { id: 'cond_like_new', name: 'Très bon état', value: 'like_new' },
    { id: 'cond_good', name: 'Bon état', value: 'good' },
    { id: 'cond_fair', name: 'État correct', value: 'fair' },
];

export const COLORS: FilterOption[] = [
    { id: 'col_black', name: 'Noir', value: '#000000' },
    { id: 'col_white', name: 'Blanc', value: '#FFFFFF' },
    { id: 'col_grey', name: 'Gris', value: '#808080' },
    { id: 'col_navy', name: 'Bleu marine', value: '#000080' },
    { id: 'col_blue', name: 'Bleu', value: '#0000FF' },
    { id: 'col_red', name: 'Rouge', value: '#FF0000' },
    { id: 'col_green', name: 'Vert', value: '#008000' },
    { id: 'col_beige', name: 'Beige', value: '#F5F5DC' },
    { id: 'col_brown', name: 'Marron', value: '#A52A2A' },
    { id: 'col_pink', name: 'Rose', value: '#FFC0CB' },
    { id: 'col_purple', name: 'Violet', value: '#800080' },
    { id: 'col_multicolor', name: 'Multicolore', value: 'multicolor' },
];

export const SIZES: FilterOption[] = [
    { id: 'size_xxs', name: 'XXS', value: 'XXS' },
    { id: 'size_xs', name: 'XS', value: 'XS' },
    { id: 'size_s', name: 'S', value: 'S' },
    { id: 'size_m', name: 'M', value: 'M' },
    { id: 'size_l', name: 'L', value: 'L' },
    { id: 'size_xl', name: 'XL', value: 'XL' },
    { id: 'size_xxl', name: 'XXL', value: 'XXL' },
    { id: 'size_3xl', name: '3XL', value: '3XL' },
];

// Regroupement global des filtres
export const FILTERS = {
    sort: SORT_OPTIONS,
    categories: CATEGORIES,
    conditions: CONDITIONS,
    colors: COLORS,
    sizes: SIZES,
};
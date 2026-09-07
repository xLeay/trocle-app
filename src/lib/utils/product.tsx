import { Basketball, Bike, Books, Box, Circle, Controller, Dress, Electronics, Fridge, Kid, Lamp, Motorbikehelmet, Pet, Puzzle, State1, State2, State3, State4, Tshirt, Wheelbarrow } from '#/icons';

// TODO: catégories et states en vif, à retirer
export enum PRODUCT_STATE {
    brand_new = "Comme neuf",
    very_good = "Très bon état",
    good = "Bon état",
    bad = "Mauvais état",
}

export const BIG_CATEGORY = {
    "accessoires-pour-animaux": "Accessoires pour animaux",
    "auto-et-moto": "Auto & moto",
    "bricolage-et-jardin": "Bricolage & jardin",
    "electromenager": "Électroménager",
    "electronique": "Électronique",
    "enfant": "Enfant",
    "femme": "Femme",
    "homme": "Homme",
    "jeux-video-et-consoles": "Jeux vidéo & consoles",
    "jeux-loisirs-et-collections": "Jeux, loisirs & collections",
    "livres-musique-et-films": "Livres, musique & films",
    "maison-et-decoration": "Maison & décoration",
    "sport-et-plein-air": "Sport & plein air",
    "velos-et-mobilite": "Véhicules & mobilité",
    "autres-objets": "Autres objets"
}

export const getStateIcon = (state: PRODUCT_STATE, size = 20, color?: string) => {
    switch (state) {
        case PRODUCT_STATE.brand_new:
            return <State1 size={size} color={color} />;
        case PRODUCT_STATE.very_good:
            return <State2 size={size} color={color} />;
        case PRODUCT_STATE.good:
            return <State3 size={size} color={color} />;
        case PRODUCT_STATE.bad:
            return <State4 size={size} color={color} />;
    }
};

export const getCategoryIcon = (category: keyof typeof BIG_CATEGORY, size = 20, color?: string) => {
    switch (category) {
        case "accessoires-pour-animaux":
            return <Pet size={size} color={color} />;
        case "auto-et-moto":
            return <Motorbikehelmet size={size} color={color} />;
        case "bricolage-et-jardin":
            return <Wheelbarrow size={size} color={color} />;
        case "electromenager":
            return <Fridge size={size} color={color} />;
        case "electronique":
            return <Electronics size={size} color={color} />;
        case "enfant":
            return <Kid size={size} color={color} />;
        case "femme":
            return <Dress size={size} color={color} />;
        case "homme":
            return <Tshirt size={size} color={color} />;
        case "jeux-video-et-consoles":
            return <Controller size={size} color={color} />;
        case "jeux-loisirs-et-collections":
            return <Puzzle size={size} color={color} />;
        case "livres-musique-et-films":
            return <Books size={size} color={color} />;
        case "maison-et-decoration":
            return <Lamp size={size} color={color} />;
        case "sport-et-plein-air":
            return <Basketball size={size} color={color} />;
        case "velos-et-mobilite":
            return <Bike size={size} color={color} />;
        case "autres-objets":
            return <Box size={size} color={color} />;

        default:
            return <Circle size={size} color={color} />;
    }
};
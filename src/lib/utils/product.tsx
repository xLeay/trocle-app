import { Basketball, Controller, Fridge, Scooter, State1, State2, State3, State4, Toy, Tshirt } from '#/icons';

// TODO: catégories et states en vif, à retirer
export enum PRODUCT_STATE {
    brand_new = "Comme neuf",
    very_good = "Très bon état",
    good = "Bon état",
    bad = "Mauvais état",
}

export enum CATEGORY {
    gaming = "Jeux-vidéos",
    household_appliances = "Électroménager",
    transports = "Transports",
    clothing = "Vêtements",
    sports = "Sports",
    toys = "Jouets",
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

export const getCategoryIcon = (category: CATEGORY, size = 20, color?: string) => {
    switch (category) {
        case CATEGORY.gaming:
            return <Controller size={size} color={color} />;
        case CATEGORY.household_appliances:
            return <Fridge size={size} color={color} />;
        case CATEGORY.transports:
            return <Scooter size={size} color={color} />;
        case CATEGORY.clothing:
            return <Tshirt size={size} color={color} />;
        case CATEGORY.sports:
            return <Basketball size={size} color={color} />;
        case CATEGORY.toys:
            return <Toy size={size} color={color} />;
    }
};
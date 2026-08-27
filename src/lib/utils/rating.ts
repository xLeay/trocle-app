export const getStarValue = (rating: number, index: number) => {
    const value = rating - index;

    if (value >= 0.75) return 1;
    if (value >= 0.25) return 0.5;
    return 0;
};
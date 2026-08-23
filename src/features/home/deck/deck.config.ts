export type CardLayer = 'a' | 'b';

export type SwipeAction = 'pass' | 'reroll' | 'like';

export const IMAGE_DURATION = 5000;

export const SCALE_DURATION = 200;
export const NEXT_CARD_SCALE = 0.94;

export const SWIPE_DURATION = 250;
export const CARD_SWIPE_DEGREE = 30;

export const SWIPE_THRESHOLD_RATIO = 0.45;
export const SWIPE_THRESHOLD_VELOCITY = 900;

export const WIDTH_MULTIPLIER = 1.3;
export const HEIGHT_MULTIPLIER = 1.1;

export const getOtherLayer = (layer: CardLayer): CardLayer =>
    layer === 'a' ? 'b' : 'a';
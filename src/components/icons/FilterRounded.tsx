
import { createSinglePathSVG } from './iconsTemplate';

const filledPath = `M10.75 13.167v5.084a.74.74 0 0 0 .168.473l.996 1.244a.75.75 0 0 0 1.326-.593 1 1 0 0 0 .01-.125v-6.083l6.578-7.938a.75.75 0 0 0 0-.956A.75.75 0 0 0 19.25 4H4.75a.749.749 0 0 0-.577 1.229z`;

const strokePath = `M10.75 13.167v5.084a.74.74 0 0 0 .168.473l.996 1.244a.75.75 0 0 0 1.326-.593 1 1 0 0 0 .01-.125v-6.083l6.578-7.938a.75.75 0 0 0 0-.956A.75.75 0 0 0 19.25 4H4.75a.749.749 0 0 0-.577 1.229zM6.345 5.5 12 12.325 17.655 5.5z`;

const FilterRounded = createSinglePathSVG({ filledPath, strokePath });
export default FilterRounded;

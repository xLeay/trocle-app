
import { createSinglePathSVG } from './iconsTemplate';

const filledPath = `M18.642 16.46a8 8 0 1 0-1.703 1.833l2.713 2.712a1.25 1.25 0 0 0 1.767-1.767zM12 17.6a5.6 5.6 0 1 1 0-11.2 5.6 5.6 0 0 1 0 11.2`;

const strokePath = `M18.19 17.069a8 8 0 1 0-1.055 1.066l2.693 2.693a.75.75 0 0 0 1.061-1.06zM12 18.64a6.64 6.64 0 1 1 0-13.28 6.64 6.64 0 0 1 0 13.28`;

const SearchRounded = createSinglePathSVG({ filledPath, strokePath });
export default SearchRounded;

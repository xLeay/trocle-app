
import { createMultiPathSVG } from './iconsTemplate';

const filledPaths = [
  
];

const strokePaths = [
  "M12 11a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 12 11M12.75 8.75a.75.75 0 0 0-1.5 0v.5a.75.75 0 0 0 1.5 0z",
  "M20 12a8 8 0 1 1-16 0 8 8 0 0 1 16 0M5.496 12a6.504 6.504 0 1 0 13.008 0 6.504 6.504 0 0 0-13.008 0"
];

const InfoRounded = createMultiPathSVG({ filledPaths, strokePaths });
export default InfoRounded;

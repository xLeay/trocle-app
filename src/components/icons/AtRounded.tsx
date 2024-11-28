
import { createMultiPathSVG } from './iconsTemplate';

const filledPaths = [
  
];

const strokePaths = [
  "M12 4a8 8 0 0 1 8 8v1.25a2.75 2.75 0 0 1-5.071 1.475A4 4 0 1 1 16 12v1.25a1.25 1.25 0 1 0 2.499 0V12a6.5 6.5 0 1 0-6.5 6.5h3.25a.75.75 0 0 1 0 1.5H12a8 8 0 1 1 0-16m2.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"
];

const AtRounded = createMultiPathSVG({ filledPaths, strokePaths });
export default AtRounded;

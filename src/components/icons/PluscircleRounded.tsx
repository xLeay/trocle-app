
import { createMultiPathSVG } from './iconsTemplate';

const filledPaths: string[] = [
  
];

const strokePaths: string[] = [
  "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18m0-3.25a.75.75 0 0 1-.75-.75v-4.25H7a.75.75 0 0 1 0-1.5h4.25V7a.75.75 0 0 1 1.5 0v4.25H17a.75.75 0 0 1 0 1.5h-4.25V17a.75.75 0 0 1-.75.75"
];

const PluscircleRounded = createMultiPathSVG({ filledPaths, strokePaths });
export default PluscircleRounded;

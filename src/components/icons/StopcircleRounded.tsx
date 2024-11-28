
import { createMultiPathSVG } from './iconsTemplate';

const filledPaths = [
  
];

const strokePaths = [
  "M10 9a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1z",
  "M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16m0-1.496a6.504 6.504 0 1 1 0-13.008 6.504 6.504 0 0 1 0 13.008"
];

const StopcircleRounded = createMultiPathSVG({ filledPaths, strokePaths });
export default StopcircleRounded;

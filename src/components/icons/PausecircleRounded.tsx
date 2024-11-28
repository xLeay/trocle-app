
import { createMultiPathSVG } from './iconsTemplate';

const filledPaths = [
  
];

const strokePaths = [
  "M9.5 10a1 1 0 0 1 2 0v4a1 1 0 1 1-2 0zM13.5 9a1 1 0 0 0-1 1v4a1 1 0 1 0 2 0v-4a1 1 0 0 0-1-1",
  "M20 12a8 8 0 1 1-16 0 8 8 0 0 1 16 0M5.496 12a6.504 6.504 0 1 0 13.008 0 6.504 6.504 0 0 0-13.008 0"
];

const PausecircleRounded = createMultiPathSVG({ filledPaths, strokePaths });
export default PausecircleRounded;

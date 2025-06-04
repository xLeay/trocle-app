
import { createMultiPathSVG } from './iconsTemplate';

const filledPaths: string[] = [
  
];

const strokePaths: string[] = [
  "M20 12a8 8 0 1 1-16 0 8 8 0 0 1 16 0M5.496 12a6.504 6.504 0 1 0 13.008 0 6.504 6.504 0 0 0-13.008 0",
  "M10.472 8.033a.75.75 0 0 0-.972.727v6.48a.747.747 0 0 0 .697.758.75.75 0 0 0 .485-.134l4.727-3.235A.74.74 0 0 0 15.75 12a.75.75 0 0 0-.341-.629l-4.727-3.234a.8.8 0 0 0-.21-.104"
];

const PlaycircleRounded = createMultiPathSVG({ filledPaths, strokePaths });
export default PlaycircleRounded;

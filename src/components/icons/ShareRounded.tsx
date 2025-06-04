
import { createMultiPathSVG } from './iconsTemplate';

const filledPaths: string[] = [
  
];

const strokePaths: string[] = [
  "M17 10a3 3 0 1 0-2.934-2.371L9.263 10.03a3 3 0 1 0 0 3.94l4.803 2.402a3 3 0 1 0 .671-1.341l-4.803-2.402a3 3 0 0 0 0-1.258l4.803-2.401C15.287 9.6 16.097 10 17 10m0-1.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3M5.5 12a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0m10 5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0"
];

const ShareRounded = createMultiPathSVG({ filledPaths, strokePaths });
export default ShareRounded;

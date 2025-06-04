
import { createMultiPathSVG } from './iconsTemplate';

const filledPaths: string[] = [
  
];

const strokePaths: string[] = [
  "M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16m0-1.496A6.504 6.504 0 0 1 6.896 7.968l9.136 9.136a6.48 6.48 0 0 1-4.032 1.4m5.094-2.46a6.504 6.504 0 0 0-9.138-9.138z"
];

const BlockRounded = createMultiPathSVG({ filledPaths, strokePaths });
export default BlockRounded;

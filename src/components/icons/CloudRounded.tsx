
import { createMultiPathSVG } from './iconsTemplate';

const filledPaths: string[] = [
  
];

const strokePaths: string[] = [
  "M17 11a5 5 0 0 0-9.92-.893A4 4 0 0 0 8 18h9a3 3 0 0 0 1-.172l.012-.004a2.998 2.998 0 0 0 1.11-4.945A3 3 0 0 0 17 12zm1.06 2.94A1.5 1.5 0 0 0 17 13.5a.75.75 0 0 1-1.5 0V11a3.5 3.5 0 0 0-6.854-1H9a.75.75 0 0 1 0 1.5H8a2.5 2.5 0 0 0 0 5h9a1.5 1.5 0 0 0 1.06-2.56"
];

const CloudRounded = createMultiPathSVG({ filledPaths, strokePaths });
export default CloudRounded;

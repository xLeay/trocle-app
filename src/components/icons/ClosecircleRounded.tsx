
import { createMultiPathSVG } from './iconsTemplate';

const filledPaths: string[] = [
  
];

const strokePaths: string[] = [
  "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18M7.47 7.47a.75.75 0 0 1 1.06 0L12 10.94l3.47-3.47a.75.75 0 1 1 1.06 1.06L13.06 12l3.47 3.47a.75.75 0 1 1-1.06 1.06L12 13.06l-3.47 3.47a.75.75 0 0 1-1.06-1.06L10.94 12 7.47 8.53a.75.75 0 0 1 0-1.06"
];

const ClosecircleRounded = createMultiPathSVG({ filledPaths, strokePaths });
export default ClosecircleRounded;

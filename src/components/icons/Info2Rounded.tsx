
import { createMultiPathSVG } from './iconsTemplate';

const filledPaths: string[] = [
  
];

const strokePaths: string[] = [
  "M12 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2M11.25 18.25a.75.75 0 0 0 1.5 0v-8a.75.75 0 0 0-1.5 0z"
];

const Info2Rounded = createMultiPathSVG({ filledPaths, strokePaths });
export default Info2Rounded;

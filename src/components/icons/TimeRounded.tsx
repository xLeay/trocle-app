
import { createMultiPathSVG } from './iconsTemplate';

const filledPaths: string[] = [
  
];

const strokePaths: string[] = [
  "M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16m0-1.496a6.504 6.504 0 1 1 0-13.008 6.504 6.504 0 0 1 0 13.008M12 7.25a.75.75 0 0 1 .75.75v3.69l1.902 1.901a.75.75 0 0 1-1.061 1.06l-2.121-2.12a.75.75 0 0 1-.22-.531V8a.75.75 0 0 1 .75-.75"
];

const TimeRounded = createMultiPathSVG({ filledPaths, strokePaths });
export default TimeRounded;

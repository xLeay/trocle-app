
import { createMultiPathSVG } from './iconsTemplate';

const filledPaths: string[] = [
  
];

const strokePaths: string[] = [
  "m15.78 5.22 2.75 2.75a.75.75 0 0 1 0 1.06l-2.75 2.75a.75.75 0 1 1-1.06-1.06l1.47-1.47h-5.44v-.004a4.004 4.004 0 0 0 0 8.008v-.004h3.75a.75.75 0 0 1 0 1.5h-3.75a5.5 5.5 0 0 1 0-11h5.44l-1.47-1.47a.75.75 0 0 1 1.06-1.06"
];

const RedoRounded = createMultiPathSVG({ filledPaths, strokePaths });
export default RedoRounded;

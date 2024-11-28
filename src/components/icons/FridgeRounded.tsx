
import { createMultiPathSVG } from './iconsTemplate';

const filledPaths = [
  
];

const strokePaths = [
  "M8 8a.75.75 0 0 0 1.5 0V7A.75.75 0 0 0 8 7zM8.75 15.25A.75.75 0 0 1 8 14.5v-2a.75.75 0 0 1 1.5 0v2a.75.75 0 0 1-.75.75",
  "M5 6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2zm2-.5h10a.5.5 0 0 1 .5.5v3.5h-11V6a.5.5 0 0 1 .5-.5M6.5 11v7a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5v-7z"
];

const FridgeRounded = createMultiPathSVG({ filledPaths, strokePaths });
export default FridgeRounded;

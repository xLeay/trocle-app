
import { createMultiPathSVG } from './iconsTemplate';

const filledPaths: string[] = [
  
];

const strokePaths: string[] = [
  "M12 17a.75.75 0 0 0 .75-.75v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5c0 .414.336.75.75.75",
  "M6 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm12 1.5H6a.5.5 0 0 0-.5.5v12a.5.5 0 0 0 .5.5h12a.5.5 0 0 0 .5-.5V6a.5.5 0 0 0-.5-.5"
];

const PlussquaredRounded = createMultiPathSVG({ filledPaths, strokePaths });
export default PlussquaredRounded;

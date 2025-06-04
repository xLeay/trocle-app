
import { createMultiPathSVG } from './iconsTemplate';

const filledPaths: string[] = [
  
];

const strokePaths: string[] = [
  "M6.75 4A2.75 2.75 0 0 0 4 6.75v10.5A2.75 2.75 0 0 0 6.75 20h10.5A2.75 2.75 0 0 0 20 17.25v-3.5a.75.75 0 0 0-1.5 0v3.5c0 .69-.56 1.25-1.25 1.25H6.75c-.69 0-1.25-.56-1.25-1.25V6.75c0-.69.56-1.25 1.25-1.25h3.5a.75.75 0 0 0 0-1.5z",
  "M14.75 4a.75.75 0 0 0 0 1.5h2.69l-6.22 6.22a.75.75 0 1 0 1.06 1.06l6.22-6.22v2.69a.75.75 0 0 0 1.5 0v-4.5a.75.75 0 0 0-.75-.75z"
];

const OpeninnewRounded = createMultiPathSVG({ filledPaths, strokePaths });
export default OpeninnewRounded;

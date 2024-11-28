
import { createMultiPathSVG } from './iconsTemplate';

const filledPaths = [
  
];

const strokePaths = [
  "M16 16v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2V5.95A1.95 1.95 0 0 1 9.95 4h8.1A1.95 1.95 0 0 1 20 5.95v8.1A1.95 1.95 0 0 1 18.05 16zm-2 2.5H6a.5.5 0 0 1-.5-.5v-8a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-.5.5M9.5 8V5.95a.45.45 0 0 1 .45-.45h8.1a.45.45 0 0 1 .45.45v8.1a.45.45 0 0 1-.45.45H16V10a2 2 0 0 0-2-2z"
];

const CopyRounded = createMultiPathSVG({ filledPaths, strokePaths });
export default CopyRounded;

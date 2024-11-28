
import { createMultiPathSVG } from './iconsTemplate';

const filledPaths = [
  
];

const strokePaths = [
  "M7.75 16h2a.75.75 0 0 0 0-1.5H8a2.5 2.5 0 0 1 0-5h1.75a.75.75 0 0 0 0-1.5h-2a.8.8 0 0 0-.19.024 4 4 0 0 0 0 7.952q.09.024.19.024M16.25 8h-2a.75.75 0 0 0 0 1.5H16a2.5 2.5 0 1 1 0 5h-1.75a.75.75 0 0 0 0 1.5h2q.1 0 .19-.024A4 4 0 0 0 20 12a4 4 0 0 0-3.56-3.976.8.8 0 0 0-.19-.024",
  "M8.75 11.25a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5z"
];

const LinkRounded = createMultiPathSVG({ filledPaths, strokePaths });
export default LinkRounded;

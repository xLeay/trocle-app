
import { createMultiPathSVG } from './iconsTemplate';

const filledPaths = [
  
];

const strokePaths = [
  "M10.5 19.25a.75.75 0 0 1-1.5 0V4.75a.75.75 0 0 1 1.5 0zM5.5 19.25a.75.75 0 0 1-1.5 0v-7.5a.75.75 0 0 1 1.5 0zM14.5 20a.75.75 0 0 0 .75-.75v-4.5a.75.75 0 0 0-1.5 0v4.5c0 .414.336.75.75.75M20 19.25a.75.75 0 0 1-1.5 0v-9.5a.75.75 0 0 1 1.5 0z"
];

const DataRounded = createMultiPathSVG({ filledPaths, strokePaths });
export default DataRounded;

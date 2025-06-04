
import { createMultiPathSVG } from './iconsTemplate';

const filledPaths: string[] = [
  "M13.5 5.5a1.5 1.5 0 0 1-.75 1.3V8H14a5 5 0 0 1 5 5h.5a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H19v1a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-1h-.5a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1H5a5 5 0 0 1 5-5h1.25V6.8a1.5 1.5 0 1 1 2.25-1.3M11 14.75a1.75 1.75 0 1 1-3.5 0 1.75 1.75 0 0 1 3.5 0m3.75 1.75a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5"
];

const strokePaths: string[] = [
  "M9.25 16.5a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5M16.5 14.75a1.75 1.75 0 1 1-3.5 0 1.75 1.75 0 0 1 3.5 0",
  "M13.5 5.5a1.5 1.5 0 0 1-.75 1.3V8H14a5 5 0 0 1 5 5h.5a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H19v1a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-1h-.5a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1H5a5 5 0 0 1 5-5h1.25V6.8a1.5 1.5 0 1 1 2.25-1.3m-7 7.5A3.5 3.5 0 0 1 10 9.5h4a3.5 3.5 0 0 1 3.5 3.5v5a.5.5 0 0 1-.5.5H7a.5.5 0 0 1-.5-.5z"
];

const ToyRounded = createMultiPathSVG({ filledPaths, strokePaths });
export default ToyRounded;

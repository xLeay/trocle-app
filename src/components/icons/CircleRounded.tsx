
import { createMultiPathSVG } from './iconsTemplate';

const filledPaths: string[] = [
    "M20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12Z"
];

const strokePaths: string[] = [
    "M20 12a8 8 0 1 1-16 0 8 8 0 0 1 16 0M5.496 12a6.504 6.504 0 1 0 13.008 0 6.504 6.504 0 0 0-13.008 0"
];

const CircleRounded = createMultiPathSVG({ filledPaths, strokePaths });
export default CircleRounded;

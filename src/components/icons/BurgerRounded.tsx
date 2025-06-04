
import { createMultiPathSVG } from './iconsTemplate';

const filledPaths: string[] = [
  
];

const strokePaths: string[] = [
  "M4 5.75c0 .414.336.75.75.75h14.5a.75.75 0 0 0 0-1.5H4.75a.75.75 0 0 0-.75.75M4 18.25a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H4.75a.75.75 0 0 1-.75-.75M4 12.25a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H4.75a.75.75 0 0 1-.75-.75"
];

const BurgerRounded = createMultiPathSVG({ filledPaths, strokePaths });
export default BurgerRounded;

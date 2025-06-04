
import { createMultiPathSVG } from './iconsTemplate';

const filledPaths: string[] = [
  
];

const strokePaths: string[] = [
  "M15.954 15.278c-.023.189.157.343.333.27A6.002 6.002 0 0 0 14 4a6 6 0 0 0-5.549 3.713c-.072.176.082.356.271.333Q9.105 8.001 9.5 8a6.5 6.5 0 0 1 6.454 7.278",
  "M9.5 20a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11m0-1.375a4.125 4.125 0 1 1 0-8.25 4.125 4.125 0 0 1 0 8.25"
];

const AnimationRounded = createMultiPathSVG({ filledPaths, strokePaths });
export default AnimationRounded;

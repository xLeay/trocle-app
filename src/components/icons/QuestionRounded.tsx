
import { createMultiPathSVG } from './iconsTemplate';

const filledPaths: string[] = [
  
];

const strokePaths: string[] = [
  "M12.75 16.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0M11.522 9.595A1.25 1.25 0 1 1 12 12a.75.75 0 0 0-.75.75V14a.75.75 0 0 0 1.5 0v-.604a2.751 2.751 0 1 0-3.5-2.646.75.75 0 0 0 1.5 0 1.25 1.25 0 0 1 .772-1.155",
  "M20 12a8 8 0 1 1-16 0 8 8 0 0 1 16 0M5.496 12a6.504 6.504 0 1 0 13.008 0 6.504 6.504 0 0 0-13.008 0"
];

const QuestionRounded = createMultiPathSVG({ filledPaths, strokePaths });
export default QuestionRounded;

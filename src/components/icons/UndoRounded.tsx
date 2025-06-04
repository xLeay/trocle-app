
import { createMultiPathSVG } from './iconsTemplate';

const filledPaths: string[] = [
  
];

const strokePaths: string[] = [
  "M8.22 5.22 5.47 7.97a.75.75 0 0 0 0 1.06l2.75 2.75a.75.75 0 0 0 1.06-1.06L7.81 9.25h5.44v-.004a4.004 4.004 0 0 1 0 8.008v-.004H9.5a.75.75 0 0 0 0 1.5h3.75a5.5 5.5 0 0 0 0-11H7.81l1.47-1.47a.75.75 0 0 0-1.06-1.06"
];

const UndoRounded = createMultiPathSVG({ filledPaths, strokePaths });
export default UndoRounded;

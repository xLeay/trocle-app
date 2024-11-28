
import { createMultiPathSVG } from './iconsTemplate';

const filledPaths = [
  
];

const strokePaths = [
  "M4.014 7.762A2 2 0 0 0 4 8v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8q0-.12-.014-.238A2 2 0 0 0 18 6H6a2 2 0 0 0-1.986 1.762M5.5 9v7a.5.5 0 0 0 .5.5h12a.5.5 0 0 0 .5-.5V9z",
  "m7.22 11.28 1.484 1.485L7.25 14.22a.75.75 0 1 0 1.06 1.06l1.97-1.97a.75.75 0 0 0 .22-.545.75.75 0 0 0-.22-.545l-2-2a.75.75 0 1 0-1.06 1.06M12.75 13.5a.75.75 0 0 0 0 1.5h3.5a.75.75 0 0 0 0-1.5z"
];

const TerminalRounded = createMultiPathSVG({ filledPaths, strokePaths });
export default TerminalRounded;

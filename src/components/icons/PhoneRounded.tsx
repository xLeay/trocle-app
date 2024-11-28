
import { createMultiPathSVG } from './iconsTemplate';

const filledPaths = [
  "M5.5 5.75A2.75 2.75 0 0 1 8.25 3h7.5a2.75 2.75 0 0 1 2.75 2.75v12.5A2.75 2.75 0 0 1 15.75 21h-7.5a2.75 2.75 0 0 1-2.75-2.75zm3.75 12A.75.75 0 0 1 10 17h4a.75.75 0 0 1 0 1.5h-4a.75.75 0 0 1-.75-.75"
];

const strokePaths = [
  "M10 17a.75.75 0 0 0 0 1.5h4a.75.75 0 0 0 0-1.5z",
  "M8.25 3A2.75 2.75 0 0 0 5.5 5.75v12.5A2.75 2.75 0 0 0 8.25 21h7.5a2.75 2.75 0 0 0 2.75-2.75V5.75A2.75 2.75 0 0 0 15.75 3zM7 5.75c0-.69.56-1.25 1.25-1.25h7.5c.69 0 1.25.56 1.25 1.25v12.5c0 .69-.56 1.25-1.25 1.25h-7.5c-.69 0-1.25-.56-1.25-1.25z"
];

const PhoneRounded = createMultiPathSVG({ filledPaths, strokePaths });
export default PhoneRounded;

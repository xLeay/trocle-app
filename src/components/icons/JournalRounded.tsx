
import { createMultiPathSVG } from './iconsTemplate';

const filledPaths: string[] = [
  
];

const strokePaths: string[] = [
  "M10 13.75a.75.75 0 0 1 .75-.75h5.75a.75.75 0 0 1 0 1.5h-5.75a.75.75 0 0 1-.75-.75M13.75 9.5a.75.75 0 0 0 0 1.5h2.75a.75.75 0 0 0 0-1.5zM10 10.25a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1-.75-.75",
  "M9 4a1.75 1.75 0 0 0-1.75 1.75v.5h-2C4.56 6.25 4 6.81 4 7.5v10.125a2.375 2.375 0 0 0 2.5 2.372V20h10.75A2.75 2.75 0 0 0 20 17.25V5.75A1.75 1.75 0 0 0 18.25 4zM7.25 17.625V7.75H5.5v9.875a.875.875 0 0 0 1.75 0m1.5.875h8.5c.69 0 1.25-.56 1.25-1.25V5.75a.25.25 0 0 0-.25-.25H9a.25.25 0 0 0-.25.25z"
];

const JournalRounded = createMultiPathSVG({ filledPaths, strokePaths });
export default JournalRounded;


import { createMultiPathSVG } from './iconsTemplate';

const filledPaths: string[] = [
  
];

const strokePaths: string[] = [
  "M12.75 4.75C12.75 4 12 4 12 4s-.75 0-.75.75v8.69l-2.72-2.72a.75.75 0 0 0-1.06 1.06l3.823 3.824a1 1 0 0 0 1.414 0l3.823-3.824a.75.75 0 1 0-1.06-1.06l-2.72 2.72z",
  "M5.5 15.75a.75.75 0 0 0-1.5 0v1.5A2.75 2.75 0 0 0 6.75 20h10.5A2.75 2.75 0 0 0 20 17.25v-1.5a.75.75 0 0 0-1.5 0v1.5c0 .69-.56 1.25-1.25 1.25H6.75c-.69 0-1.25-.56-1.25-1.25z"
];

const DownloadRounded = createMultiPathSVG({ filledPaths, strokePaths });
export default DownloadRounded;

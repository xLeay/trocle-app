
import { createMultiPathSVG } from './iconsTemplate';

const filledPaths: string[] = [
  
];

const strokePaths: string[] = [
  "M12.75 15.75a.75.75 0 0 0-1.5 0v.5a.75.75 0 0 0 1.5 0zM12.75 8.75a.75.75 0 0 0-1.5 0v4.5a.75.75 0 0 0 1.5 0z",
  "M13.789 5.078c-.737-1.474-2.84-1.474-3.578 0L4.197 17.106A2 2 0 0 0 5.986 20h12.028a2 2 0 0 0 1.789-2.894zm4.672 12.698L12.447 5.75a.5.5 0 0 0-.894 0L5.539 17.776a.5.5 0 0 0 .447.724h12.028a.5.5 0 0 0 .447-.724"
];

const AlertRounded = createMultiPathSVG({ filledPaths, strokePaths });
export default AlertRounded;

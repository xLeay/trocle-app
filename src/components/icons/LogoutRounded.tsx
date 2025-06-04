
import { createMultiPathSVG } from './iconsTemplate';

const filledPaths: string[] = [
  
];

const strokePaths: string[] = [
  "M7.75 15.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5",
  "M5 5.75C5 4.784 5.784 4 6.75 4h7.5c.966 0 1.75.784 1.75 1.75v3.5a.75.75 0 0 1-1.5 0v-3.5a.25.25 0 0 0-.25-.25H9.284l.677.3A1.75 1.75 0 0 1 11 7.4v11.1h3.25a.25.25 0 0 0 .25-.25v-3.5a.75.75 0 0 1 1.5 0v3.5A1.75 1.75 0 0 1 14.25 20h-3.273a1.75 1.75 0 0 1-2.438 1.31l-2.5-1.11A1.75 1.75 0 0 1 5 18.6zm1.852.31a.25.25 0 0 0-.352.229V18.6a.25.25 0 0 0 .148.229l2.5 1.11a.25.25 0 0 0 .352-.228V7.4a.25.25 0 0 0-.148-.229z",
  "M18.53 9.22a.75.75 0 1 0-1.06 1.06l.97.97h-4.69a.75.75 0 0 0 0 1.5h4.69l-.97.97a.75.75 0 1 0 1.06 1.06l2.25-2.25a.75.75 0 0 0 0-1.06z"
];

const LogoutRounded = createMultiPathSVG({ filledPaths, strokePaths });
export default LogoutRounded;

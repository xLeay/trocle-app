
import { createMultiPathSVG } from './iconsTemplate';

const filledPaths: string[] = [
  
];

const strokePaths: string[] = [
  "M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8m0-1.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5",
  "M3 12q0 .112.032.216C4.269 16.593 8.174 18.75 12 18.75s7.731-2.157 8.968-6.534a.75.75 0 0 0 0-.432C19.731 7.407 15.827 5.25 12 5.25s-7.73 2.157-8.968 6.534A.8.8 0 0 0 3 12m1.532 0C5.61 15.48 8.767 17.25 12 17.25s6.39-1.77 7.468-5.25C18.39 8.52 15.233 6.75 12 6.75S5.61 8.52 4.532 12"
];

const EyeRounded = createMultiPathSVG({ filledPaths, strokePaths });
export default EyeRounded;

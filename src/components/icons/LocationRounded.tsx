
import { createMultiPathSVG } from './iconsTemplate';

const filledPaths: string[] = [
  "M12.58 20.782C14.26 19.368 19 14.938 19 10a7 7 0 1 0-14 0c0 4.938 4.741 9.368 6.42 10.782.34.286.82.286 1.16 0M14 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0"
];

const strokePaths: string[] = [
  "M12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4",
  "M19 10c0 4.938-4.741 9.368-6.42 10.782a.89.89 0 0 1-1.16 0C9.74 19.368 5 14.938 5 10a7 7 0 0 1 14 0m-1.5 0c0 2.006-.976 4.034-2.29 5.825-1.11 1.512-2.372 2.736-3.21 3.476-.838-.74-2.1-1.964-3.21-3.476C7.476 14.034 6.5 12.006 6.5 10a5.5 5.5 0 1 1 11 0"
];

const LocationRounded = createMultiPathSVG({ filledPaths, strokePaths });
export default LocationRounded;

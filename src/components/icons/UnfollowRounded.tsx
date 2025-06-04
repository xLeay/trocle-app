
import { createMultiPathSVG } from './iconsTemplate';

const filledPaths: string[] = [
  "M9.965 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M16.927 19.266c.042.404-.29.734-.697.734H3.7c-.406 0-.739-.33-.696-.734a7 7 0 0 1 13.923 0",
  "M17.5 10.5h2.75a.75.75 0 0 1 0 1.5h-4a.75.75 0 0 1 0-1.5z"
];

const strokePaths: string[] = [
  "M9.965 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8m0-1.48a2.52 2.52 0 1 1 0-5.04 2.52 2.52 0 0 1 0 5.04M16.927 19.266c.042.404-.29.734-.697.734H3.7c-.406 0-.739-.33-.696-.734a7 7 0 0 1 13.923 0m-1.64-.766a5.53 5.53 0 0 0-10.645 0z",
  "M17.5 10.5h2.75a.75.75 0 0 1 0 1.5h-4a.75.75 0 0 1 0-1.5z"
];

const UnfollowRounded = createMultiPathSVG({ filledPaths, strokePaths });
export default UnfollowRounded;

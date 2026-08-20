
import { createMultiPathSVG } from './iconsTemplate';

const filledPaths: string[] = [

];

const strokePaths: string[] = [
    "M19.25 11.25C19.6642 11.25 20 11.5858 20 12C20 12.4142 19.6642 12.75 19.25 12.75H4.75C4.33579 12.75 4 12.4142 4 12C4 11.5858 4.33579 11.25 4.75 11.25H19.25Z"
];

const RemoveRounded = createMultiPathSVG({ filledPaths, strokePaths });
export default RemoveRounded;

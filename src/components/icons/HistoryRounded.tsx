
import { createMultiPathSVG } from './iconsTemplate';

const filledPaths = [
  
];

const strokePaths = [
  "M12 20A8 8 0 1 0 5.5 7.336V4.75a.75.75 0 0 0-1.5 0v4.5c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5H6.517a6.504 6.504 0 1 1-.979 4.247c-.046-.41-.377-.747-.79-.747s-.751.336-.713.747A8 8 0 0 0 12 20",
  "M12.75 8a.75.75 0 0 0-1.5 0v4a.75.75 0 0 0 .22.53l2.121 2.122a.75.75 0 0 0 1.06-1.061l-1.901-1.902z"
];

const HistoryRounded = createMultiPathSVG({ filledPaths, strokePaths });
export default HistoryRounded;

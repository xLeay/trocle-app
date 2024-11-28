
import { createSinglePathSVG } from './iconsTemplate';

const filledPath = `M6 8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2z`;

const strokePath = `M8 6.75h8c.69 0 1.25.56 1.25 1.25v8c0 .69-.56 1.25-1.25 1.25H8c-.69 0-1.25-.56-1.25-1.25V8c0-.69.56-1.25 1.25-1.25Z`;

const StopRounded = createSinglePathSVG({ filledPath, strokePath });
export default StopRounded;

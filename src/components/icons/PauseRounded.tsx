
import { createSinglePathSVG } from './iconsTemplate';

const filledPath = `M9 6a2 2 0 0 0-2 2v8a2 2 0 1 0 4 0V8a2 2 0 0 0-2-2M15 6a2 2 0 0 0-2 2v8a2 2 0 1 0 4 0V8a2 2 0 0 0-2-2`;

const strokePath = `M7 8a2 2 0 1 1 4 0v8a2 2 0 1 1-4 0zm2.5 0v8a.5.5 0 0 1-1 0V8a.5.5 0 0 1 1 0M13 8a2 2 0 1 1 4 0v8a2 2 0 1 1-4 0zm2.5 0v8a.5.5 0 0 1-1 0V8a.5.5 0 0 1 1 0`;

const PauseRounded = createSinglePathSVG({ filledPath, strokePath });
export default PauseRounded;

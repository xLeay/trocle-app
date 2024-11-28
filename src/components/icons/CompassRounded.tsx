
import { createSinglePathSVG } from './iconsTemplate';

const filledPath = `M20 12a8 8 0 1 1-16 0 8 8 0 0 1 16 0M9.85 10.551a1 1 0 0 1 .701-.701l4.105-1.12a.5.5 0 0 1 .614.614l-1.12 4.105a1 1 0 0 1-.701.701l-4.105 1.12a.5.5 0 0 1-.614-.614zM12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2`;

const strokePath = `M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16m0-1.496a6.504 6.504 0 1 1 0-13.008 6.504 6.504 0 0 1 0 13.008m-2.15-7.953a1 1 0 0 1 .701-.701l4.105-1.12a.5.5 0 0 1 .614.614l-1.12 4.105a1 1 0 0 1-.701.701l-4.105 1.12a.5.5 0 0 1-.614-.614zM13 12a1 1 0 1 1-2 0 1 1 0 0 1 2 0`;

const CompassRounded = createSinglePathSVG({ filledPath, strokePath });
export default CompassRounded;

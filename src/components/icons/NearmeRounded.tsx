
import { createSinglePathSVG } from './iconsTemplate';

const filledPath = `M4.495 9.295a.747.747 0 0 0-.45.96.75.75 0 0 0 .385.423l6.008 2.884 2.883 6.006a.75.75 0 0 0 1.004.358.75.75 0 0 0 .383-.427l5.245-14.49a.75.75 0 0 0-.173-.79.75.75 0 0 0-.79-.173z`;

const strokePath = `M4.495 9.295a.747.747 0 0 0-.45.96.75.75 0 0 0 .385.423l6.008 2.884 2.883 6.006a.75.75 0 0 0 1.004.358.75.75 0 0 0 .383-.427l5.245-14.49a.75.75 0 0 0-.173-.79.75.75 0 0 0-.79-.173zm9.408 8.02L18 6 6.685 10.097l4.634 2.224a.75.75 0 0 1 .36.36z`;

const NearmeRounded = createSinglePathSVG({ filledPath, strokePath });
export default NearmeRounded;

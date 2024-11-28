
import { createSinglePathSVG } from './iconsTemplate';

const filledPath = `M8.16 6.286A.75.75 0 0 0 8 6.76v10.48a.748.748 0 0 0 .97.727.8.8 0 0 0 .209-.102l7.728-5.234A.75.75 0 0 0 17.25 12a.75.75 0 0 0-.343-.63L9.179 6.135a.747.747 0 0 0-1.018.151`;

const strokePath = `M8.16 6.286A.75.75 0 0 0 8 6.76v10.48a.748.748 0 0 0 .97.727.8.8 0 0 0 .209-.102l7.728-5.234A.75.75 0 0 0 17.25 12a.75.75 0 0 0-.343-.63L9.179 6.135a.747.747 0 0 0-1.018.151M9.5 8.164v7.672L15.163 12z`;

const PlayRounded = createSinglePathSVG({ filledPath, strokePath });
export default PlayRounded;

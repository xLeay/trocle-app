
import { createSinglePathSVG } from './iconsTemplate';

const filledPath = `m5.5 9.46 12.044-5.308A1.75 1.75 0 0 1 20 5.754v12.493a1.75 1.75 0 0 1-2.456 1.6L14.4 18.463a3.5 3.5 0 0 1-6.304-2.773l.001-.005L5.5 14.54V15A.75.75 0 0 1 4 15V9a.75.75 0 0 1 1.5 0zm4.01 6.848a1.998 1.998 0 0 0 3.474 1.53z`;

const strokePath = `m5.5 9.46 12.044-5.308A1.75 1.75 0 0 1 20 5.754v12.493a1.75 1.75 0 0 1-2.456 1.6L14.4 18.463a3.5 3.5 0 0 1-6.304-2.773l.001-.005L5.5 14.54V15A.75.75 0 0 1 4 15V9a.75.75 0 0 1 1.5 0zm12.65-3.935a.25.25 0 0 1 .35.229v12.493a.25.25 0 0 1-.35.228L5.5 12.901v-1.802zM9.51 16.307a1.998 1.998 0 0 0 3.474 1.531z`;

const AdRounded = createSinglePathSVG({ filledPath, strokePath });
export default AdRounded;

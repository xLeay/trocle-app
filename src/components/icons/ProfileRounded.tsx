
import { createSinglePathSVG } from './iconsTemplate';

const filledPath = `M16 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0m2.265 12c.406 0 .74-.33.697-.734a7 7 0 0 0-13.923 0c-.043.404.29.734.696.734h12.53`;

const strokePath = `M16 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0M9.48 8a2.52 2.52 0 1 0 5.04 0 2.52 2.52 0 0 0-5.04 0m8.785 12c.406 0 .74-.33.697-.734a7 7 0 0 0-13.923 0c-.043.404.29.734.696.734h12.53m-2.354-3.91a5.53 5.53 0 0 1 1.412 2.41H6.678a5.53 5.53 0 0 1 9.233-2.41`;

const ProfileRounded = createSinglePathSVG({ filledPath, strokePath });
export default ProfileRounded;

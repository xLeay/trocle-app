
import { createSinglePathSVG } from './iconsTemplate';

const filledPath = `M11.428 4.399a1 1 0 0 1 1.144 0l6 4.183a1 1 0 0 1 .428.82V19a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1v-4.065a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1V19a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V9.403a1 1 0 0 1 .428-.82z`;

const strokePath = `M12 5.632 6.5 9.52v8.96h2v-3.616c0-1.4 1.12-2.534 2.5-2.534h2c1.38 0 2.5 1.135 2.5 2.534v3.615h2V9.52zm.572-1.45a.99.99 0 0 0-1.144 0l-6 4.242c-.268.19-.428.5-.428.831v9.731C5 19.546 5.448 20 6 20h3c.552 0 1-.454 1-1.014v-4.122c0-.56.448-1.013 1-1.013h2c.552 0 1 .454 1 1.013v4.122c0 .56.448 1.014 1 1.014h3c.552 0 1-.454 1-1.014v-9.73c0-.332-.16-.643-.428-.832z`;

const HomeRounded = createSinglePathSVG({ filledPath, strokePath });
export default HomeRounded;

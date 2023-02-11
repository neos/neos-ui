import {themr} from '@friendsofreactjs/react-css-themr';
import identifiers from '../identifiers';

import Bar from './bar';
import style from './style.css';

export default themr(identifiers.bar, style)(Bar);

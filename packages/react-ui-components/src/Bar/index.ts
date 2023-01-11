import {themr} from '@friendsofreactjs/react-css-themr';
import identifiers from '../identifiers';

import Bar from './bar';
import style from './style.scss';

export default themr(identifiers.bar, style)(Bar);

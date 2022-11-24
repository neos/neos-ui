import {themr} from '@friendsofreactjs/react-css-themr';
import identifiers from '../identifiers';

import Label from './label';
import style from './style.scss';

export default themr(identifiers.label, style)(Label);

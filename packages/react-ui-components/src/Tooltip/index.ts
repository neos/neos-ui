import {themr} from '@friendsofreactjs/react-css-themr';

import identifiers from '../identifiers';
import style from './style.css';
import Tooltip from './tooltip';

export default themr(identifiers.tooltip, style)(Tooltip);

import {themr} from '@friendsofreactjs/react-css-themr';

import identifiers from '../identifiers';
import Dialog from './dialog';
import style from './style.module.css';

export default themr(identifiers.dialog, style)(Dialog);

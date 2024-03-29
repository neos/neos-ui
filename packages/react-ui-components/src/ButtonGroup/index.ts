import {themr} from '@friendsofreactjs/react-css-themr';

import identifiers from '../identifiers';
import ButtonGroup from './buttonGroup';
import style from './style.module.css';

export default themr(identifiers.buttonGroup, style)(ButtonGroup);

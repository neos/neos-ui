import {themr} from '@friendsofreactjs/react-css-themr';
import identifiers from '../identifiers';

import Button from './button';
import style from './style.scss';

export default themr(identifiers.button, style)(Button);

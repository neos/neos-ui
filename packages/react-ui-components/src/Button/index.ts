import {themr} from '@friendsofreactjs/react-css-themr';
import identifiers from '../identifiers';

import Button from './button';
import style from './style.css';

export default themr(identifiers.button, style)(Button);

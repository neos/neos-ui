import {themr} from '@friendsofreactjs/react-css-themr';
import identifiers from '../identifiers';
import style from './style.css';
import Bar from './bar';

export default themr(identifiers.bar, style)(Bar);

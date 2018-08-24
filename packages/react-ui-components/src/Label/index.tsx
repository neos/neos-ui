import {themr} from '@friendsofreactjs/react-css-themr';
import identifiers from '../identifiers';
import style from './style.css';
import Label from './label';

export default themr(identifiers.label, style)(Label);

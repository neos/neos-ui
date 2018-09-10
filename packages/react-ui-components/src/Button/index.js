import {themr} from '@friendsofreactjs/react-css-themr';
import identifiers from '../identifiers';
import style from './style.css';
import Button from './button';

export default themr(identifiers.button, style)(Button);

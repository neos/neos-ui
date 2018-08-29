import {themr} from '@friendsofreactjs/react-css-themr';
import identifiers from '../identifiers';
import Label from './label';

const style = require('./style.css');

export default themr(identifiers.label, style)(Label);

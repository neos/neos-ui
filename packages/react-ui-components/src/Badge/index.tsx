import {themr} from '@friendsofreactjs/react-css-themr';
import identifiers from './../identifiers';
import Badge from './badge';

const style = require('./style.css');

export default themr(identifiers.badge, style)(Badge);

import {themr} from '@friendsofreactjs/react-css-themr';
import identifiers from '../identifiers';

import Label from './label';

// tslint:disable-next-line:no-var-requires
const style = require('./style.css');

export default themr(identifiers.label, style)(Label);

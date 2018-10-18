import {themr} from '@friendsofreactjs/react-css-themr';
import identifiers from '../identifiers';

import Dialog from './dialog';

// tslint:disable-next-line:no-var-requires
const style = require('./style.css');

export default themr(identifiers.dialog, style)(Dialog);

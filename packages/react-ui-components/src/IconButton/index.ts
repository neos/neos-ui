import {themr} from '@friendsofreactjs/react-css-themr';
import identifiers from '../identifiers';

import IconButton from './iconButton';

// tslint:disable-next-line:no-var-requires
const style = require('./style.css');

export default themr(identifiers.iconButton, style)(IconButton);

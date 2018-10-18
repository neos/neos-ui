import {themr} from '@friendsofreactjs/react-css-themr';
import identifiers from '../identifiers';

import CheckBox from './checkBox';

// tslint:disable-next-line:no-var-requires
const style = require('./style.css');

export default themr(identifiers.checkBox, style)(CheckBox);

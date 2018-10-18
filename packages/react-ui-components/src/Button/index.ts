import {themr} from '@friendsofreactjs/react-css-themr';
import identifiers from '../identifiers';

import Button from './button';

// tslint:disable-next-line:no-var-requires
const style = require('./style.css');

export default themr(identifiers.button, style)(Button);

import {themr} from '@friendsofreactjs/react-css-themr';
import identifiers from '../identifiers';

import ButtonGroup from './buttonGroup';

// tslint:disable-next-line:no-var-requires
const style = require('./style.css');

export default themr(identifiers.buttonGroup, style)(ButtonGroup);

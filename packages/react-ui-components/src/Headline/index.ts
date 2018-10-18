import {themr} from '@friendsofreactjs/react-css-themr';
import identifiers from '../identifiers';

import Headline from './headline';

// tslint:disable-next-line:no-var-requires
const style = require('./style.css');

export default themr(identifiers.headline, style)(Headline);

import {themr} from '@friendsofreactjs/react-css-themr';
import identifiers from '../identifiers';

import Headline from './headline';
import style from './style.module.css';

export default themr(identifiers.headline, style)(Headline);

import {themr} from '@friendsofreactjs/react-css-themr';
import identifiers from '../identifiers';
import style from './style.css';
import Headline from './headline';

export default themr(identifiers.headline, style)(Headline);

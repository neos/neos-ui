import {themr} from '@friendsofreactjs/react-css-themr';
import keydown from 'react-keydown';

import {keys} from './config';
import identifiers from '../identifiers';
import SelectBox from './selectBox';

import style from './style.css';

const ThemedSelectBox = themr(identifiers.selectBox, style)(SelectBox);
const WithKeys = keydown(keys)(ThemedSelectBox);

export default WithKeys;

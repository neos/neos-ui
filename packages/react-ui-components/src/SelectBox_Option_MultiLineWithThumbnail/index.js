/* eslint-disable camelcase, react/jsx-pascal-case */
import {themr} from '@friendsofreactjs/react-css-themr';
import identifiers from '../identifiers';
import style from './style.css';

import SelectBox_Option_MultiLineWithThumbnail from './selectBox_Option_MultiLineWithThumbnail';

const ThemedSelectBox_Option_MultiLineWithThumbnail = themr(identifiers.selectBox_Option_MultiLineWithThumbnail, style)(SelectBox_Option_MultiLineWithThumbnail);

export default ThemedSelectBox_Option_MultiLineWithThumbnail;

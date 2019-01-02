/* eslint-disable camelcase, react/jsx-pascal-case */
import {themr} from '@friendsofreactjs/react-css-themr';
import identifiers from '../identifiers';
import style from './style.css';
import MultiSelectBox from './multiSelectBox';

const ThemedMultiSelectBox = themr(identifiers.multiSelectBox, style)(MultiSelectBox);

export default ThemedMultiSelectBox;

/* eslint-disable camelcase, react/jsx-pascal-case */
import {themr} from 'react-css-themr';
import identifiers from './../identifiers.js';
import style from './style.css';

import SelectBox_Header from './selectBox_Header';

const ThemedSelectBox_Header = themr(identifiers.selectBox_Header, style)(SelectBox_Header);

//
// Dependency injection
//
import injectProps from './../_lib/injectProps.js';
import Icon from './../Icon/index';
import IconButton from './../IconButton/index';

export default injectProps({
    Icon,
    IconButton
})(ThemedSelectBox_Header);

/* eslint-disable camelcase, react/jsx-pascal-case */
import {themr} from 'react-css-themr';
import identifiers from './../identifiers.js';
import style from './style.css';

import SelectBox_HeaderWithSearchInput from './selectBox_HeaderWithSearchInput';

const ThemedSelectBox_HeaderWithSearchInput = themr(identifiers.selectBox_HeaderWithSearchInput, style)(SelectBox_HeaderWithSearchInput);

//
// Dependency injection
//
import injectProps from './../_lib/injectProps.js';
import Icon from './../Icon/index';
import TextInput from './../TextInput/index';

export default injectProps({
    Icon,
    TextInput,
})(ThemedSelectBox_HeaderWithSearchInput);


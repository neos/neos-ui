/* eslint-disable camelcase, react/jsx-pascal-case */
import {themr} from 'react-css-themr';
import keydown from 'react-keydown';
import identifiers from './../identifiers.js';
import style from './style.css';
import {keys} from './config.js';
import SelectBox from './selectBox.js';

const ThemedSelectBox = themr(identifiers.selectBox, style)(SelectBox);
const WithKeys = keydown(keys)(ThemedSelectBox);

//
// Dependency injection
//
import injectProps from './../_lib/injectProps.js';
import DropDown from './../DropDown/index';
import SelectBox_Header from './../SelectBox_Header/index';
import SelectBox_HeaderWithSearchInput from './../SelectBox_HeaderWithSearchInput/index';
import SelectBox_ListPreview from './../SelectBox_ListPreview/index';

export default injectProps({
    DropDown,
    SelectBox_Header,
    SelectBox_HeaderWithSearchInput,
    SelectBox_ListPreview
})(WithKeys);


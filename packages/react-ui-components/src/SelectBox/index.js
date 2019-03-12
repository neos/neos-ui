/* eslint-disable camelcase, react/jsx-pascal-case */
import {themr} from '@friendsofreactjs/react-css-themr';
import keydown from 'react-keydown';
import identifiers from '../identifiers';
import style from './style.css';
import {keys} from './config';
import SelectBox from './selectBox';

const ThemedSelectBox = themr(identifiers.selectBox, style)(SelectBox);
const WithKeys = keydown(keys)(ThemedSelectBox);

//
// Dependency injection
//
import injectProps from './../_lib/injectProps';
import DropDown from './../DropDown';
import SelectBox_Header from './../SelectBox_Header';
import SelectBox_HeaderWithSearchInput from './../SelectBox_HeaderWithSearchInput';
import SelectBox_ListPreview from './../SelectBox_ListPreview';

export default injectProps({
    DropDown,
    SelectBox_Header,
    SelectBox_HeaderWithSearchInput,
    SelectBox_ListPreview
})(WithKeys);

/* eslint-disable camelcase, react/jsx-pascal-case */
import {themr} from '@friendsofreactjs/react-css-themr';
import identifiers from '../identifiers';
import style from './style.css';

import SelectBox_HeaderWithSearchInput from './selectBox_HeaderWithSearchInput';

const ThemedSelectBox_HeaderWithSearchInput = themr(identifiers.selectBox_HeaderWithSearchInput, style)(SelectBox_HeaderWithSearchInput);

//
// Dependency injection
//
import injectProps from './../_lib/injectProps';
import Icon from './../Icon';
import TextInput from './../TextInput';
import IconButton from './../IconButton';

export default injectProps({
    Icon,
    TextInput,
    IconButton
})(ThemedSelectBox_HeaderWithSearchInput);

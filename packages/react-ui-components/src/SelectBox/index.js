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
import Icon from './../Icon/index';
import IconButton from './../IconButton/index';
import TextInput from './../TextInput/index';

export default injectProps({
    DropDownComponent: DropDown,
    IconComponent: Icon,
    IconButtonComponent: IconButton,
    TextInputComponent: TextInput
})(WithKeys);

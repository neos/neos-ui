import {themr} from 'react-css-themr';
import identifiers from './../identifiers.js';
import style from '../SelectBox/style.css';
import SearchableSelectBox from './searchableSelectBox.js';

const ThemedSearchableSelectBox = themr(identifiers.selectBox, style)(SearchableSelectBox);

//
// Dependency injection
//
import injectProps from './../_lib/injectProps.js';
import DropDown from './../DropDown/index';
import Icon from './../Icon/index';
import TextInput from './../TextInput/index';

export default injectProps({
    DropDownComponent: DropDown,
    IconComponent: Icon,
    InputComponent: TextInput
})(ThemedSearchableSelectBox);

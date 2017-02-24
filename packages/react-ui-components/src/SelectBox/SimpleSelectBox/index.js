import {themr} from 'react-css-themr';
import identifiers from './../../identifiers.js';
import style from '../style.css';
import SimpleSelectBox from './simpleSelectBox.js';

const ThemedSimpleSelectBox = themr(identifiers.selectBox, style)(SimpleSelectBox);

//
// Dependency injection
//
import injectProps from './../../_lib/injectProps.js';
import DropDown from './../../DropDown/index';
import Icon from './../../Icon/index';

export default injectProps({
    DropDownComponent: DropDown,
    IconComponent: Icon,
})(ThemedSimpleSelectBox);

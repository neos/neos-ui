import {themr} from 'react-css-themr';
import keydown from 'react-keydown';
import identifiers from './../identifiers.js';
import style from '../SelectBox/style.css'; // TODO: use local styles only
import SelectBoxSelector from './selectBoxSelector.js';

const ThemedSelectBoxSelector = themr(identifiers.selectBoxSelector, style)(SelectBoxSelector);

//
// Dependency injection
//
import injectProps from './../_lib/injectProps.js';
import DropDown from './../DropDown/index';
import Icon from './../Icon/index';

export default injectProps({
    DropDownComponent: DropDown,
    IconComponent: Icon,
})(ThemedSelectBoxSelector);


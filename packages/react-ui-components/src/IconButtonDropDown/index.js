import {themr} from 'react-css-themr';
import identifiers from './../identifiers.js';
import style from './style.css';
import IconButtonDropDown from './iconButtonDropDown.js';

const ThemedIconButtonDropDown = themr(identifiers.iconButtonDropDown, style)(IconButtonDropDown);

//
// Dependency injection
//
import injectProps from './../_lib/injectProps.js';
import Icon from './../icon/index';
import Button from './../button/index';

export default injectProps({
    IconComponent: Icon,
    ButtonComponent: Button
})(ThemedIconButtonDropDown);

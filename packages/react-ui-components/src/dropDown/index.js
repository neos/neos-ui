import {themr} from 'react-css-themr';
import identifiers from './../identifiers.js';
import style from './style.css';
import DropDown, {
    Header,
    Contents
} from './dropDown.js';

const ThemedDropDown = themr(identifiers.dropDown, style)(DropDown);
const ThemedDropDownHeader = themr(identifiers.dropDownHeader, style)(Header);
const ThemedDropDownContents = themr(identifiers.dropDownContents, style)(Contents);

//
// Dependency injection
//
import injectProps from './../_lib/injectProps.js';
import Icon from './../icon/index';

ThemedDropDown.Header = injectProps({
    IconComponent: Icon
})(ThemedDropDownHeader);
ThemedDropDown.Contents = ThemedDropDownContents;

export default ThemedDropDown;

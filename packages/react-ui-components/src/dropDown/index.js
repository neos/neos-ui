import {themr} from 'react-css-themr';
import identifiers from './../identifiers.js';
import style from './style.css';
import DropDown, {
    Header,
    Contents
} from './dropDown.js';

const ThemedDropDown = themr(identifiers.dropDown, style)(DropDown);
ThemedDropDown.Header = themr(identifiers.dropDownHeader, style)(Header);
ThemedDropDown.Contents = themr(identifiers.dropDownContents, style)(Contents);

export default ThemedDropDown;

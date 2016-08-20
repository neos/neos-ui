import {themr} from 'react-css-themr';
import identifiers from './../identifiers.js';
import style from './style.css';
import ContextDropDownWrapper, {
    ContextDropDownHeader,
    ContextDropDownContents
} from './wrapper.js';

const DropDown = themr(identifiers.dropDown, style)(ContextDropDownWrapper);
const DropDownHeader = themr(identifiers.dropDownHeader, style)(ContextDropDownHeader);
const DropDownContents = themr(identifiers.dropDownContents, style)(ContextDropDownContents);

//
// Dependency injection
//
import injectProps from './../_lib/injectProps.js';
import Icon from './../Icon/index';

DropDown.Header = injectProps({
    IconComponent: Icon
})(DropDownHeader);
DropDown.Contents = DropDownContents;

export default DropDown;

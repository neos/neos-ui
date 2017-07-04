import {themr} from 'react-css-themr';
import identifiers from './../identifiers.js';
import style from './style.css';
import ContextDropDownWrapper, {
    StatelessDropDownWrapper,
    ContextDropDownHeader,
    ContextDropDownContents
} from './wrapper.js';

const DropDown = themr(identifiers.dropDown, style)(ContextDropDownWrapper);
const StatelessDropDown = themr(identifiers.dropDown, style)(StatelessDropDownWrapper);
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
DropDown.Stateless = StatelessDropDown;
export default DropDown;

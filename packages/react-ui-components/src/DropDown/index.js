import {themr} from '@friendsofreactjs/react-css-themr';
import identifiers from '../identifiers';
import style from './style.css';
import ContextDropDownWrapper, {
    StatelessDropDownWrapper,
    ContextDropDownHeader,
    ContextDropDownContents
} from './wrapper';

const DropDown = themr(identifiers.dropDown, style)(ContextDropDownWrapper);
const StatelessDropDown = themr(identifiers.dropDown, style)(StatelessDropDownWrapper);
const DropDownHeader = themr(identifiers.dropDownHeader, style)(ContextDropDownHeader);
const DropDownContents = themr(identifiers.dropDownContents, style)(ContextDropDownContents);

//
// Dependency injection
//
import injectProps from './../_lib/injectProps';
import Icon from './../Icon';

DropDown.Header = injectProps({
    IconComponent: Icon
})(DropDownHeader);
DropDown.Contents = DropDownContents;
DropDown.Stateless = StatelessDropDown;
export default DropDown;

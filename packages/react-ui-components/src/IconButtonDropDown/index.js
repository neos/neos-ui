import {themr} from '@friendsofreactjs/react-css-themr';
import identifiers from '../identifiers';
import style from './style.css';
import IconButtonDropDown from './iconButtonDropDown';

const ThemedIconButtonDropDown = themr(identifiers.iconButtonDropDown, style)(IconButtonDropDown);

// TODO: why here?
//
// Dependency injection
//
import injectProps from './../_lib/injectProps';
import Icon from './../Icon';
import Button from './../Button';

export default injectProps({
    IconComponent: Icon,
    ButtonComponent: Button
})(ThemedIconButtonDropDown);

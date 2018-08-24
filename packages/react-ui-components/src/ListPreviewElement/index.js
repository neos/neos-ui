import {themr} from '@friendsofreactjs/react-css-themr';
import identifiers from './../identifiers';
import style from './style.css';
import ListPreviewElement from './listPreviewElement';

const ThemedListPreviewElement = themr(identifiers.listPreviewElement, style)(ListPreviewElement);

//
// Dependency injection
//
import injectProps from './../_lib/injectProps.js';
import Icon from './../Icon/index';

export default injectProps({
    Icon
})(ThemedListPreviewElement);


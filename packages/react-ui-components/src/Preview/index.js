import {themr} from 'react-css-themr';
import identifiers from './../identifiers.js';
import style from './style.css';
import Preview from './preview';

const ThemedPreview = themr(identifiers.preview, style)(Preview);

//
// Dependency injection
//
import injectProps from './../_lib/injectProps.js';
import Icon from './../Icon/index';

export default injectProps({
    IconComponent: Icon
})(ThemedPreview);


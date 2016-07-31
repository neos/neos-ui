import './fontAwesome/font-face.css';
import icons from './fontAwesome/icons.css';
import {themr} from 'react-css-themr';
import identifiers from './../identifiers.js';
import injectProps from './../_lib/injectProps.js';
import {makeValidateId, makeGetClassName} from './../_lib/fontAwesome.js';
import style from './style.css';
import Icon from './icon.js';

const ThemedIcon = themr(identifiers.icon, style)(Icon);

export default injectProps({
    iconMap: icons,
    _makeValidateId: makeValidateId,
    _makeGetClassName: makeGetClassName
})(ThemedIcon);

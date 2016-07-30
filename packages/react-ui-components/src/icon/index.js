import './fontAwesome/font-face.css';
import icons from './fontAwesome/icons.css';
import {themr} from 'react-css-themr';
import identifiers from './../identifiers.js';
import injectProps from './../_lib/injectProps.js';
import {makeValidateId, makeGetClassName} from './../_lib/fontAwesome.js';
import style from './style.css';
import Icon from './icon.js';

const validateId = makeValidateId(icons);
const getClassName = makeGetClassName(icons);

const ThemedIcon = themr(identifiers.icon, style)(Icon);

export default injectProps({
    validateIconId: validateId,
    getIconClassName: getClassName
})(ThemedIcon);

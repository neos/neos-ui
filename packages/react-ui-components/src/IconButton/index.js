import {themr} from 'react-css-themr';
import identifiers from './../identifiers.js';
import style from './style.css';
import IconButton from './iconButton.js';

const ThemedIconButton = themr(identifiers.iconButton, style)(IconButton);

//
// Dependency injection
//
import injectProps from './../_lib/injectProps.js';
import Icon from './../Icon/index';
import Button from './../Button/index';
import Tooltip from './../Tooltip/index';

export default injectProps({
    IconComponent: Icon,
    ButtonComponent: Button,
    TooltipComponent: Tooltip
})(ThemedIconButton);

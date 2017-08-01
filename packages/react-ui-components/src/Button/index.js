import {themr} from 'react-css-themr';
import identifiers from './../identifiers.js';
import style from './style.css';
import Button from './button.js';

const ThemedButton = themr(identifiers.button, style)(Button);

import injectProps from './../_lib/injectProps.js';
import Tooltip from '../Tooltip/index';

export default injectProps({
    TooltipComponent: Tooltip
})(ThemedButton);

import {themr} from 'react-css-themr';
import identifiers from './../identifiers.js';
import style from './style.css';
import TooltipContainer from './TooltipContainer.js';

const ThemedTooltipContainer = themr(identifiers.tooltipContainer, style)(TooltipContainer);

import injectProps from './../_lib/injectProps.js';
import Tooltip from '../Tooltip/index';

export default injectProps({
    TooltipComponent: Tooltip
})(ThemedTooltipContainer);

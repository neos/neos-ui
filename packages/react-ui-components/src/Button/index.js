import {themr} from 'react-css-themr';
import identifiers from './../identifiers.js';
import style from './style.css';
import Button from './button.js';
import injectProps from './../_lib/injectProps.js';
import TooltipContainer from '../TooltipContainer';

const ThemedButton = themr(identifiers.button, style)(Button);

export default injectProps({
    TooltipContainerComponent: TooltipContainer
})(ThemedButton);

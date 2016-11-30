import {themr} from 'react-css-themr';
import identifiers from './../identifiers.js';
import style from './style.css';
import TextArea from './textArea.js';

const ThemedTextArea = themr(identifiers.textArea, style)(TextArea);

//
// Dependency injection
//
import injectProps from './../_lib/injectProps.js';
import Tooltip from '../Tooltip/index';

export default injectProps({
    TooltipComponent: Tooltip
})(ThemedTextArea);

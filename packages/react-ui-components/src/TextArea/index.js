import {themr} from 'react-css-themr';
import identifiers from './../identifiers.js';
import style from './style.css';
import TextArea from './textArea.js';
import withValidationResultRendering from './../_lib/withValidationResultRendering.js';

const ThemedTextArea = themr(identifiers.textArea, style)(TextArea);
const TextAreaWithValidationResultRendering = withValidationResultRendering(ThemedTextArea);

export default TextAreaWithValidationResultRendering;

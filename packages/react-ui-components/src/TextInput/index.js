import {themr} from 'react-css-themr';
import identifiers from './../identifiers.js';
import style from './style.css';
import TextInput from './textInput.js';
import withValidationResultRendering from './../_lib/withValidationResultRendering.js';

const ThemedTextInput = themr(identifiers.textInput, style)(TextInput);
const TextInputWithValidationResultRendering = withValidationResultRendering(ThemedTextInput);

export default TextInputWithValidationResultRendering;

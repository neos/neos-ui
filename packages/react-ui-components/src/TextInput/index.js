import {themr} from 'react-css-themr';
import identifiers from './../identifiers.js';
import style from './style.css';
import TextInput from './textInput.js';

const ThemedTextInput = themr(identifiers.textInput, style)(TextInput);

export default ThemedTextInput;

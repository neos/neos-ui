import {themr} from '@friendsofreactjs/react-css-themr';
import identifiers from '../identifiers';
import style from './style.css';
import TextInput from './textInput';

const ThemedTextInput = themr(identifiers.textInput, style)(TextInput);

export default ThemedTextInput;

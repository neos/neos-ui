import {themr} from '@friendsofreactjs/react-css-themr';
import identifiers from '../identifiers';
import TextInput from './textInput';
import style from './style.css';


const ThemedTextInput = themr(identifiers.textInput, style)(TextInput);

export default ThemedTextInput;

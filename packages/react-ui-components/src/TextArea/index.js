import {themr} from 'react-css-themr';
import identifiers from './../identifiers.js';
import style from './style.css';
import TextArea from './textArea.js';

const ThemedTextArea = themr(identifiers.textArea, style)(TextArea);

export default ThemedTextArea;

import {themr} from '@friendsofreactjs/react-css-themr';
import identifiers from './../identifiers';
import style from './style.css';
import TextArea from './textArea.js';

const ThemedTextArea = themr(identifiers.textArea, style)(TextArea);

export default ThemedTextArea;

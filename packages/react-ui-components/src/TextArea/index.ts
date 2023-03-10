import {themr} from '@friendsofreactjs/react-css-themr';
import identifiers from '../identifiers';
import style from './style.module.css';
import TextArea from './textArea';

const ThemedTextArea = themr(identifiers.textArea, style)(TextArea);

export default ThemedTextArea;

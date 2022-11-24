import {themr} from '@friendsofreactjs/react-css-themr';

import identifiers from '../identifiers';
import TextInput from './textInput';
import style from './style.scss';


export default themr(identifiers.textInput, style)(TextInput);

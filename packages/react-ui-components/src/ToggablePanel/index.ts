import {themr} from '@friendsofreactjs/react-css-themr';
import identifiers from '../identifiers';
import style from './style.css';
import ToggablePanel from './toggablePanel';

export default themr(identifiers.toggablePanel, style)(ToggablePanel);

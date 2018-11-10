import {themr} from '@friendsofreactjs/react-css-themr';
import identifiers from '../identifiers';
import {Contents} from './toggablePanel';
import style from './style.css';

export default themr(identifiers.toggablePanelContents, style)(Contents);

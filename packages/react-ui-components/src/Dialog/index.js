import {themr} from '@friendsofreactjs/react-css-themr';
import identifiers from '../identifiers';
import style from './style.css';
import Dialog from './dialog';

const ThemedDialog = themr(identifiers.dialog, style)(Dialog);

//
// Dependency injection
//
import injectProps from './../_lib/injectProps';
import IconButton from './../IconButton';

export default injectProps({
    IconButtonComponent: IconButton
})(ThemedDialog);

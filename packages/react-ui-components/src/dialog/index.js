import {themr} from 'react-css-themr';
import identifiers from './../identifiers.js';
import style from './style.css';
import Dialog from './dialog.js';

const ThemedDialog = themr(identifiers.dialog, style)(Dialog);

//
// Dependency injection
//
import injectProps from './../_lib/injectProps.js';
import IconButton from './../iconButton/index';
import Portal from './../portal/index';

export default injectProps({
    PortalComponent: Portal,
    IconButtonComponent: IconButton
})(ThemedDialog);

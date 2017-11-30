import {themr} from 'react-css-themr';
import identifiers from './../identifiers.js';
import style from './style.css';
import MultiSelectBox from './multiSelectBox.js';

const ThemedMultiSelectBox = themr(identifiers.multiSelectBox, style)(MultiSelectBox);

//
// Dependency injection
//
import injectProps from './../_lib/injectProps.js';
import SelectBox from './../SelectBox/index';
import SelectBox_ListPreviewSortable from './../SelectBox_ListPreviewSortable/index';
import Icon from './../Icon/index';
import IconButton from './../IconButton/index';

export default injectProps({
    IconComponent: Icon,
    IconButtonComponent: IconButton,
    SelectBox,
    SelectBox_ListPreviewSortable
})(ThemedMultiSelectBox);

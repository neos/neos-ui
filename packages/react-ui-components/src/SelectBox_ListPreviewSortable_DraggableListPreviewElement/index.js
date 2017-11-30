import {themr} from 'react-css-themr';
import identifiers from './../identifiers.js';
import style from './style.css';

import SelectBox_ListPreviewSortable_DraggableListPreviewElement from './SelectBox_ListPreviewSortable_DraggableListPreviewElement';

const ThemedSelectBox_ListPreviewSortable_DraggableListPreviewElement = themr(identifiers.selectBox_ListPreviewSortable_DraggableListPreviewElement, style)(SelectBox_ListPreviewSortable_DraggableListPreviewElement);

//
// Dependency injection
//
import injectProps from './../_lib/injectProps.js';
import Icon from './../Icon/index';
import IconButton from './../IconButton/index';

export default injectProps({
    Icon,
    IconButton,
})(ThemedSelectBox_ListPreviewSortable_DraggableListPreviewElement);

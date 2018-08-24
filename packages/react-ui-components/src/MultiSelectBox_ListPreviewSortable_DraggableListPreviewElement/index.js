/* eslint-disable camelcase, react/jsx-pascal-case */
import {themr} from '@friendsofreactjs/react-css-themr';
import identifiers from './../identifiers';
import style from './style.css';

import MultiSelectBox_ListPreviewSortable_DraggableListPreviewElement from './multiSelectBox_ListPreviewSortable_DraggableListPreviewElement';

const ThemedMultiSelectBox_ListPreviewSortable_DraggableListPreviewElement = themr(identifiers.multiSelectBox_ListPreviewSortable_DraggableListPreviewElement, style)(MultiSelectBox_ListPreviewSortable_DraggableListPreviewElement);

//
// Dependency injection
//
import injectProps from './../_lib/injectProps.js';
import Icon from './../Icon/index';
import IconButton from './../IconButton/index';

export default injectProps({
    Icon,
    IconButton
})(ThemedMultiSelectBox_ListPreviewSortable_DraggableListPreviewElement);

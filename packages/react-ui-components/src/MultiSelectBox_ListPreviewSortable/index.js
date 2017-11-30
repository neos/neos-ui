/* eslint-disable camelcase, react/jsx-pascal-case */
import MultiSelectBox_ListPreviewSortable from './multiSelectBox_ListPreviewSortable';
//
// Dependency injection
//
import injectProps from './../_lib/injectProps.js';
import SelectBox_ListPreviewUngrouped from './../SelectBox_ListPreviewUngrouped/index';

export default injectProps({
    SelectBox_ListPreviewUngrouped
})(MultiSelectBox_ListPreviewSortable);

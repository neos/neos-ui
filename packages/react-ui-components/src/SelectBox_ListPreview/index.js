/* eslint-disable camelcase, react/jsx-pascal-case */
import SelectBox_ListPreview from './selectBox_ListPreview';

//
// Dependency injection
//
import injectProps from './../_lib/injectProps.js';
import SelectBox_CreateNew from './../SelectBox_CreateNew/index';
import SelectBox_ListPreviewUngrouped from './../SelectBox_ListPreviewUngrouped/index';

export default injectProps({
    SelectBox_CreateNew,
    SelectBox_ListPreviewUngrouped
})(SelectBox_ListPreview);




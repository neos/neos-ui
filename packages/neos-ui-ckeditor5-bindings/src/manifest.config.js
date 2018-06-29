import CkEditorConfigRegistry from './registry/CkEditorConfigRegistry';
import {$add, $get, $or} from 'plow-js';

import NeosPlaceholder from './plugins/neosPlaceholder';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline';
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import Link from '@ckeditor/ckeditor5-link/src/link';
import List from '@ckeditor/ckeditor5-list/src/list';
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';
import Table from '@ckeditor/ckeditor5-table/src/table';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';

const addPlugin = (Plugin, isEnabled) => (ckEditorConfiguration, {editorOptions}) => {
    if (!isEnabled || isEnabled(editorOptions)) {
        ckEditorConfiguration.plugins = ckEditorConfiguration.plugins || [];
        return $add('plugins', Plugin, ckEditorConfiguration);
    }
    return ckEditorConfiguration;
};

//
// Create richtext editing toolbar registry
//
export default ckEditorRegistry => {
    const config = ckEditorRegistry.set('config', new CkEditorConfigRegistry(`
        Contains custom config for CkEditor

        In CKE all things are configured via a single configuration object: plugins, custom configs, etc (@see https://docs.ckeditor.com/ckeditor5/latest/builds/guides/integration/configuration.html)
        This registry allows to register a custom configuration processor that takes a configuration object, modifies it and returns a new one. Example:

        config.set('doSmthWithConfig' ckeConfig => {
            ckeConfig.mySetting = true;
            return ckeConfig;
        })

        That is all you need to know about configuring CKE in Neos,
        refer to CKeditor5 documentationfor more details on what you can do with it: https://docs.ckeditor.com/ckeditor5/latest/index.html
    `));

    //
    // Base CKE configuration
    //
    config.set('baseConfiguration', (ckEditorConfiguration, {globalRegistry, editorOptions, userPreferences}) => {
        const i18nRegistry = globalRegistry.get('i18n');
        return Object.assign(ckEditorConfiguration, {
            language: String($get('interfaceLanguage', userPreferences)),
            neosPlaceholder: unescape(i18nRegistry.translate($get('placeholder', editorOptions) || ''))
        });
    });

    //
    // Add plugins
    //
    config.set('essentials', addPlugin(Essentials));
    config.set('neosPlaceholder', addPlugin(NeosPlaceholder));
    config.set('paragraph', addPlugin(Paragraph));
    config.set('bold', addPlugin(Bold, $get('formatting.strong')));
    config.set('italic', addPlugin(Italic, $get('formatting.em')));
    config.set('underline', addPlugin(Underline, $get('formatting.underline')));
    config.set('strikethrough', addPlugin(Strikethrough, $get('formatting.strikethrough')));
    config.set('link', addPlugin(Link, $get('formatting.a')));
    config.set('table', addPlugin(Table, i => $get('formatting.table', i)));
    config.set('tableBaloonToolbar', addPlugin(TableToolbar, i => $get('formatting.table', i)));
    config.set('list', addPlugin(List, $or(
        $get('formatting.ul'),
        $get('formatting.ol')
    )));
    config.set('alignment', addPlugin(Alignment, $or(
        $get('formatting.left'),
        $get('formatting.center'),
        $get('formatting.right'),
        $get('formatting.justify')
    )));
    config.set('heading', addPlugin(Heading, $or(
        $get('formatting.h1'),
        $get('formatting.h2'),
        $get('formatting.h3'),
        $get('formatting.h4'),
        $get('formatting.h5'),
        $get('formatting.h6')
    )));

    //
    // @see https://docs.ckeditor.com/ckeditor5/latest/features/table.html
    //
    config.set('configureTable', (config, {editorOptions}) => Object.assign(config, $get('table', editorOptions) ? {
        table: {
            toolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
        }
    } : {}));

    //
    // @see https://docs.ckeditor.com/ckeditor5/latest/features/headings.html#configuring-heading-levels
    //
    config.set('configureHeadings', config => Object.assign(config, {
        heading: {
            options: [
                {model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph'},
                {model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1'},
                {model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2'},
                {model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3'},
                {model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4'},
                {model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5'},
                {model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6'},
                {model: 'pre', view: 'pre', title: 'Preformated', class: 'ck-heading_pre'}
            ]}
    }));

    return config;
};
